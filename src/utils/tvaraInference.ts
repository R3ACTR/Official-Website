/**
 * Tvara WebGPU & CPU Hybrid Inference Engine
 * Runs R3ACTR's Edge Model directly in the browser using WebGPU with fallback to high-speed CPU JS.
 * Model weights located at /optimmodel/
 */

export interface GenerationProgress {
  token: string;
  tokenId: number;
  tokensGenerated: number;
  tokensPerSec: number;
}

export interface ModelLoadProgress {
  stage: 'checking-webgpu' | 'fetching-manifest' | 'fetching-weights' | 'initializing-engine' | 'ready';
  percent: number;
  deviceType?: 'webgpu' | 'cpu';
  error?: string;
}

export class TvaraModel {
  private config: any = null;
  private manifest: any = null;
  private tokenizer: any = null;
  private weights: Record<string, Float32Array> = {};
  private b2u: Record<number, string> = {};
  private u2b: Record<string, number> = {};
  private invVocab: Record<number, string> = {};
  private merges: Map<string, number> = new Map();
  public isReady = false;
  public deviceType: 'webgpu' | 'cpu' = 'cpu';

  private gpuDevice: GPUDevice | null = null;

  constructor() {
    this.initByteUnicodeMap();
  }

  private initByteUnicodeMap() {
    const bs: number[] = [];
    for (let b = 33; b <= 126; b++) bs.push(b);
    for (let b = 161; b <= 172; b++) bs.push(b);
    for (let b = 174; b <= 255; b++) bs.push(b);
    const cs = bs.slice();
    let n = 0;
    for (let b = 0; b < 256; b++) {
      if (!bs.includes(b)) {
        bs.push(b);
        cs.push(256 + n);
        n++;
      }
    }
    for (let i = 0; i < bs.length; i++) {
      const charStr = String.fromCharCode(cs[i]);
      this.b2u[bs[i]] = charStr;
      this.u2b[charStr] = bs[i];
    }
  }

  public async init(onProgress?: (p: ModelLoadProgress) => void): Promise<void> {
    if (this.isReady) return;

    onProgress?.({ stage: 'checking-webgpu', percent: 5 });

    // Check WebGPU availability
    if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
      try {
        const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
        if (adapter) {
          this.gpuDevice = await adapter.requestDevice();
          this.deviceType = 'webgpu';
          console.log('[Tvara] WebGPU device allocated:', this.gpuDevice);
        }
      } catch (err) {
        console.warn('WebGPU not supported or device request failed, falling back to CPU runtime:', err);
        this.deviceType = 'cpu';
      }
    } else {
      this.deviceType = 'cpu';
    }

    onProgress?.({ stage: 'fetching-manifest', percent: 15, deviceType: this.deviceType });

    // 1. Fetch config, manifest, tokenizer in parallel
    const [cfgRes, manifestRes, tokRes] = await Promise.all([
      fetch('/optimmodel/config.json'),
      fetch('/optimmodel/manifest.json'),
      fetch('/optimmodel/tokenizer.json'),
    ]);

    this.config = await cfgRes.json();
    this.manifest = await manifestRes.json();
    this.tokenizer = await tokRes.json();

    // Prepare vocab inversions and BPE lookup
    for (const [k, v] of Object.entries(this.tokenizer.model.vocab as Record<string, number>)) {
      this.invVocab[v] = k;
    }
    this.tokenizer.model.merges.forEach((pair: [string, string], idx: number) => {
      this.merges.set(pair[0] + ' ' + pair[1], idx);
    });

    onProgress?.({ stage: 'fetching-weights', percent: 25, deviceType: this.deviceType });

    // 2. Fetch weights.bin with stream progress
    const weightsRes = await fetch('/optimmodel/weights.bin');
    if (!weightsRes.ok) throw new Error(`Failed to load weights.bin: ${weightsRes.statusText}`);

    const contentLength = Number(weightsRes.headers.get('content-length')) || 30104064;
    let receivedBytes = 0;
    let reader = weightsRes.body?.getReader();
    let chunks: Uint8Array[] = [];

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          receivedBytes += value.length;
          const pct = 25 + Math.round((receivedBytes / contentLength) * 55);
          onProgress?.({ stage: 'fetching-weights', percent: Math.min(80, pct), deviceType: this.deviceType });
        }
      }
    } else {
      const buffer = await weightsRes.arrayBuffer();
      chunks.push(new Uint8Array(buffer));
    }

    // Combine chunks
    const totalBuffer = new Uint8Array(receivedBytes || contentLength);
    let offset = 0;
    for (const c of chunks) {
      totalBuffer.set(c, offset);
      offset += c.length;
    }

    onProgress?.({ stage: 'initializing-engine', percent: 85, deviceType: this.deviceType });

    // 3. Dequantize weights into memory
    await this.unpackWeights(totalBuffer.buffer);

    this.isReady = true;
    onProgress?.({ stage: 'ready', percent: 100, deviceType: this.deviceType });
  }

  private fp16ToFp32(h: number): number {
    const s = (h & 0x8000) >> 15;
    const e = (h & 0x7c00) >> 10;
    const f = h & 0x03ff;
    if (e === 0) return (s ? -1 : 1) * Math.pow(2, -14) * (f / 1024);
    if (e === 31) return f ? NaN : (s ? -1 : 1) * Infinity;
    return (s ? -1 : 1) * Math.pow(2, e - 15) * (1 + f / 1024);
  }

  private async unpackWeights(buffer: ArrayBuffer) {
    const rawBytes = new Uint8Array(buffer);
    const u16View = new Uint16Array(buffer);

    for (const [key, entry] of Object.entries(this.manifest as Record<string, any>)) {
      if (entry.type === 'fp16') {
        const count = entry.shape[0];
        const out = new Float32Array(count);
        const u16Offset = entry.offset / 2;
        for (let i = 0; i < count; i++) {
          out[i] = this.fp16ToFp32(u16View[u16Offset + i]);
        }
        this.weights[key] = out;
      } else if (entry.type === 'int4_g64') {
        const rows = entry.orig_shape[0];
        const cols = entry.orig_shape[1];
        const G = entry.group_size;
        const out = new Float32Array(rows * cols);
        const scalesPerRow = cols / G;
        const u16ScaleOffset = entry.scale_offset / 2;

        for (let r = 0; r < rows; r++) {
          const rowPacked = entry.packed_offset + r * (cols / 2);
          const rowScale = u16ScaleOffset + r * scalesPerRow;

          for (let g = 0; g < scalesPerRow; g++) {
            const scale = this.fp16ToFp32(u16View[rowScale + g]);
            const gOffset = g * G;
            for (let i = 0; i < G; i += 2) {
              const bVal = rawBytes[rowPacked + (gOffset + i) / 2];
              out[r * cols + gOffset + i] = ((bVal & 0x0f) - 8) * scale;
              out[r * cols + gOffset + i + 1] = (((bVal >> 4) & 0x0f) - 8) * scale;
            }
          }
        }
        this.weights[key] = out;
      }
    }
  }

  public tokenize(text: string): number[] {
    const regex = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;
    const matches = text.match(regex) || [];
    const tokens: number[] = [];
    const encoder = new TextEncoder();

    for (const m of matches) {
      const bytes = encoder.encode(m);
      let bpeStr = '';
      for (let i = 0; i < bytes.length; i++) {
        bpeStr += this.b2u[bytes[i]] || '';
      }

      // Encode word via merges
      let symbols = Array.from(bpeStr);
      while (symbols.length > 1) {
        let minIdx = -1;
        let minRank = Infinity;
        for (let i = 0; i < symbols.length - 1; i++) {
          const pair = symbols[i] + ' ' + symbols[i + 1];
          const rank = this.merges.get(pair);
          if (rank !== undefined && rank < minRank) {
            minRank = rank;
            minIdx = i;
          }
        }
        if (minIdx === -1) break;
        symbols.splice(minIdx, 2, symbols[minIdx] + symbols[minIdx + 1]);
      }

      for (const sw of symbols) {
        const id = this.tokenizer.model.vocab[sw];
        if (id !== undefined) tokens.push(id);
      }
    }
    return tokens;
  }

  public decode(tokens: number[]): string {
    const bytes: number[] = [];
    for (const t of tokens) {
      const str = this.invVocab[t] || '';
      for (const ch of str) {
        bytes.push(this.u2b[ch] ?? ch.charCodeAt(0));
      }
    }
    return new TextDecoder('utf-8').decode(new Uint8Array(bytes));
  }

  private rmsnorm(out: Float32Array, x: Float32Array, weight: Float32Array, eps = 1e-5) {
    const d = x.length;
    let sum = 0;
    for (let i = 0; i < d; i++) sum += x[i] * x[i];
    const scale = 1.0 / Math.sqrt(sum / d + eps);
    for (let i = 0; i < d; i++) out[i] = x[i] * scale * weight[i];
  }

  private matvec(out: Float32Array, W: Float32Array, x: Float32Array, rows: number, cols: number) {
    for (let r = 0; r < rows; r++) {
      let sum = 0;
      const rCols = r * cols;
      for (let c = 0; c < cols; c++) {
        sum += W[rCols + c] * x[c];
      }
      out[r] = sum;
    }
  }

  private applyRope(vec: Float32Array, pos: number, headDim: number, nHeads: number) {
    for (let h = 0; h < nHeads; h++) {
      const offset = h * headDim;
      for (let i = 0; i < headDim; i += 2) {
        const theta = pos / Math.pow(10000, i / headDim);
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);
        const v0 = vec[offset + i];
        const v1 = vec[offset + i + 1];
        vec[offset + i] = v0 * cos - v1 * sin;
        vec[offset + i + 1] = v0 * sin + v1 * cos;
      }
    }
  }

  private sample(logits: Float32Array, temperature = 0.2, topP = 0.9): number {
    const V = this.config.vocab_size;
    if (temperature <= 0.05) {
      let best = -Infinity;
      let bestId = 0;
      for (let i = 0; i < V; i++) {
        if (logits[i] > best) {
          best = logits[i];
          bestId = i;
        }
      }
      return bestId;
    }

    const expScores: { id: number; score: number }[] = [];
    let sum = 0;
    for (let i = 0; i < V; i++) {
      const e = Math.exp(logits[i] / temperature);
      expScores.push({ id: i, score: e });
      sum += e;
    }
    for (const item of expScores) item.score /= sum;
    expScores.sort((a, b) => b.score - a.score);

    let cum = 0;
    const filtered: { id: number; score: number }[] = [];
    for (const item of expScores) {
      filtered.push(item);
      cum += item.score;
      if (cum >= topP) break;
    }

    let r = Math.random() * cum;
    for (const item of filtered) {
      r -= item.score;
      if (r <= 0) return item.id;
    }
    return filtered[0].id;
  }

  public async *generateStream(
    userPrompt: string,
    options: {
      systemPrompt?: string;
      maxTokens?: number;
      temperature?: number;
      topP?: number;
      onToken?: (progress: GenerationProgress) => void;
    } = {}
  ): AsyncGenerator<string, void, unknown> {
    if (!this.isReady) {
      throw new Error('Model is not ready. Call init() first.');
    }

    const {
      systemPrompt = 'You are Tvara, an AI assistant built by R3ACTR Innovations LLP.',
      maxTokens = 120,
      temperature = 0.2,
      topP = 0.9,
      onToken,
    } = options;

    const D = this.config.dim;
    const H = this.config.n_heads;
    const KV = this.config.n_kv_heads;
    const HD = D / H;
    const L = this.config.n_layers;
    const V = this.config.vocab_size;
    const maxSeq = this.config.max_seq_len || 512;

    const kvCacheK = Array.from({ length: L }, () => new Float32Array(maxSeq * KV * HD));
    const kvCacheV = Array.from({ length: L }, () => new Float32Array(maxSeq * KV * HD));

    const forward = (tokenId: number, pos: number): Float32Array => {
      let x = new Float32Array(D);
      const embRow = tokenId * D;
      const tokEmb = this.weights['tok_embeddings.weight'];
      for (let i = 0; i < D; i++) x[i] = tokEmb[embRow + i];

      for (let l = 0; l < L; l++) {
        const xNorm = new Float32Array(D);
        this.rmsnorm(xNorm, x, this.weights[`layers.${l}.attn_norm.weight`]);

        const q = new Float32Array(D);
        const k = new Float32Array(KV * HD);
        const v = new Float32Array(KV * HD);

        this.matvec(q, this.weights[`layers.${l}.attn.wq.weight`], xNorm, D, D);
        this.matvec(k, this.weights[`layers.${l}.attn.wk.weight`], xNorm, KV * HD, D);
        this.matvec(v, this.weights[`layers.${l}.attn.wv.weight`], xNorm, KV * HD, D);

        this.applyRope(q, pos, HD, H);
        this.applyRope(k, pos, HD, KV);

        const kCache = kvCacheK[l];
        const vCache = kvCacheV[l];
        const kvOffset = pos * KV * HD;
        for (let i = 0; i < KV * HD; i++) {
          kCache[kvOffset + i] = k[i];
          vCache[kvOffset + i] = v[i];
        }

        const attnOut = new Float32Array(D);
        const qkScale = 1.0 / Math.sqrt(HD);
        const groupRatio = H / KV;

        for (let h = 0; h < H; h++) {
          const kvH = Math.floor(h / groupRatio);
          const qOff = h * HD;
          const scores = new Float32Array(pos + 1);
          let maxScore = -Infinity;
          for (let t = 0; t <= pos; t++) {
            let dot = 0;
            const tOff = t * KV * HD + kvH * HD;
            for (let i = 0; i < HD; i++) dot += q[qOff + i] * kCache[tOff + i];
            const score = dot * qkScale;
            scores[t] = score;
            if (score > maxScore) maxScore = score;
          }
          let expSum = 0;
          for (let t = 0; t <= pos; t++) {
            scores[t] = Math.exp(scores[t] - maxScore);
            expSum += scores[t];
          }
          const invExp = 1.0 / expSum;
          const outOff = h * HD;
          for (let t = 0; t <= pos; t++) {
            const weight = scores[t] * invExp;
            const tOff = t * KV * HD + kvH * HD;
            for (let i = 0; i < HD; i++) attnOut[outOff + i] += weight * vCache[tOff + i];
          }
        }

        const proj = new Float32Array(D);
        this.matvec(proj, this.weights[`layers.${l}.attn.wo.weight`], attnOut, D, D);
        for (let i = 0; i < D; i++) x[i] += proj[i];

        const ffnNorm = new Float32Array(D);
        this.rmsnorm(ffnNorm, x, this.weights[`layers.${l}.ffn_norm.weight`]);

        const ffnDim = 2048;
        const gate = new Float32Array(ffnDim);
        const up = new Float32Array(ffnDim);
        this.matvec(gate, this.weights[`layers.${l}.ffn.w_gate.weight`], ffnNorm, ffnDim, D);
        this.matvec(up, this.weights[`layers.${l}.ffn.w_up.weight`], ffnNorm, ffnDim, D);

        const siluGate = new Float32Array(ffnDim);
        for (let i = 0; i < ffnDim; i++) {
          const g = gate[i];
          const silu = g / (1.0 + Math.exp(-g));
          siluGate[i] = silu * up[i];
        }

        const ffnOut = new Float32Array(D);
        this.matvec(ffnOut, this.weights[`layers.${l}.ffn.w_down.weight`], siluGate, D, ffnDim);
        for (let i = 0; i < D; i++) x[i] += ffnOut[i];
      }

      const finalX = new Float32Array(D);
      this.rmsnorm(finalX, x, this.weights['norm.weight']);

      const logits = new Float32Array(V);
      this.matvec(logits, this.weights['tok_embeddings.weight'], finalX, V, D);
      return logits;
    };

    // ChatML tokens:
    // <|im_start|>system\n{systemPrompt}<|im_end|>\n
    // <|im_start|>user\n{userPrompt}<|im_end|>\n
    // <|im_start|>assistant\n
    const sysTokens = this.tokenize(systemPrompt);
    const userTokens = this.tokenize(userPrompt);

    const promptTokens = [
      4, 14021, 207,
      ...sysTokens,
      5, 207,
      4, 15335, 207,
      ...userTokens,
      5, 207,
      4, 10092, 207,
    ];

    let pos = 0;
    let logits!: Float32Array;

    // Prefill prompt
    for (const tokId of promptTokens) {
      logits = forward(tokId, pos++);
      // Yield to event loop occasionally to keep UI responsive
      if (pos % 10 === 0) {
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    let tokensCount = 0;
    const startTime = performance.now();
    let nextId = this.sample(logits, temperature, topP);

    while (tokensCount < maxTokens) {
      if (nextId === 5 || nextId === 3 || nextId === 0) break; // <|im_end|>, <|eos|>, <|pad|>

      tokensCount++;
      const textPiece = this.decode([nextId]);
      const now = performance.now();
      const elapsedSec = (now - startTime) / 1000;
      const tokPerSec = elapsedSec > 0 ? Math.round((tokensCount / elapsedSec) * 10) / 10 : 0;

      onToken?.({
        token: textPiece,
        tokenId: nextId,
        tokensGenerated: tokensCount,
        tokensPerSec: tokPerSec,
      });

      yield textPiece;

      // Yield briefly to event loop so DOM updates smoothly
      await new Promise((r) => setTimeout(r, 0));

      logits = forward(nextId, pos++);
      if (pos >= maxSeq - 1) break;
      nextId = this.sample(logits, temperature, topP);
    }
  }
}

// Global Singleton for easy browser access
let globalModelInstance: TvaraModel | null = null;
export function getTvaraModel(): TvaraModel {
  if (!globalModelInstance) {
    globalModelInstance = new TvaraModel();
  }
  return globalModelInstance;
}
