// Voice Orb / Ship Notes. Local audio analysis, no dependencies.
(() => {
  if (customElements.get('voice-orb')) return;
  const STATES = ['idle', 'listening', 'thinking', 'speaking'];
  const PALETTE = [[.62,.60,.87], [.16,.91,.71], [1,.57,.18], [.96,.27,.62]];
  const mediaSources = new WeakMap();
  const clamp = (v, lo=0, hi=1) => Math.max(lo, Math.min(hi, Number.isFinite(+v) ? +v : lo));
  const weightsFor = state => STATES.map(s => +(s === state));
  const normalize = w => {
    const a = Array.from({length:4}, (_,i) => clamp(w?.[i]));
    const sum = a.reduce((s,v) => s+v, 0);
    return sum ? a.map(v => v/sum) : [1,0,0,0];
  };
  const seeded = i => { const s = Math.sin(i*127.1+311.7)*43758.5453; return s-Math.floor(s); };
  const sphere = count => {
    const data = new Float32Array(count*4);
    const jitter = .55 / Math.sqrt(count);
    for (let i=0; i<count; i++) {
      const y = clamp(1-2*(i+.5)/count+(seeded(i+7)-.5)*jitter, -.99999, .99999);
      const a = i*2.399963229728653+(seeded(i+19)-.5)*jitter*5;
      const r = Math.sqrt(1-y*y);
      data.set([r*Math.cos(a), y, r*Math.sin(a), seeded(i+31)], i*4);
    }
    return data;
  };

  const VS = `
  precision highp float;
  attribute vec4 seed;
  uniform float time, pixels, density, onset, reduced;
  uniform vec4 weights;
  uniform vec3 bands;
  uniform vec3 touch; // xy = normalized touch pos (-1..1), z = touch strength/activity (0..1)
  varying vec3 tint;
  varying float strength, spark;
  float hash(vec3 p) { return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
  float noise(vec3 p) {
    vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
    float a=mix(hash(i),hash(i+vec3(1,0,0)),f.x);
    float b=mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x);
    float c=mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x);
    float d=mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x);
    return mix(mix(a,b,f.y),mix(c,d,f.y),f.z)*2.0-1.0;
  }
  vec3 turn(vec3 p,float a) { float c=cos(a),s=sin(a);return vec3(c*p.x+s*p.z,p.y,c*p.z-s*p.x); }
  void main() {
    float t=time;
    vec3 n=seed.xyz;
    float angle=acos(clamp(n.z,-1.0,1.0));
    float drift=noise(n*2.7+vec3(t*.19,-t*.11,t*.08));
    float bass=noise(n*1.8+vec3(t*.32,0,-t*.2));
    float grain=noise(n*17.0+vec3(-t*1.8,t*.7,t));
    float low=bands.x, mid=bands.y, high=bands.z;
    // Periodic speech-like utterance cadence (talk burst every 5s lasting ~1.6s)
    float cycle = mod(t, 5.0);
    float speechGate = smoothstep(0.0, 0.22, cycle) * (1.0 - smoothstep(1.3, 1.7, cycle));
    // Multisyllabic acoustics (syllable inflection, formant waves, acoustic scatter)
    float syllable = sin(t * 11.5 + angle * 8.0 + drift * 2.5);
    float formant = sin(angle * 14.0 - t * 7.5 + drift * 1.5) * 0.5 + 0.5;
    float jitter = sin(t * 22.0 + seed.w * 37.0) * 0.5 + 0.5;
    float talkDisperse = speechGate * (0.6 * max(0.0, syllable) + 0.25 * formant + 0.15 * jitter);

    float idleR=1.0+.018*drift+.008*sin(t*.85);
    float inward=sin(angle*13.0+t*5.4+drift*1.6);
    float outward=sin(angle*12.0-t*6.2+drift*1.6);
    float listenR=1.0-.045*low+.10*low*bass+(.018+.12*mid)*inward+.032*high*grain;
    float speakR=1.0+.065*low+.16*low*bass+(.018+.16*mid)*outward+.055*high*grain;
    // The transient is supplied separately from sustained bass. No frame history in this shader.
    speakR+=onset*(.08+.18*max(0.0,outward))*(.4+.6*seed.w);
    float twist=t*.55+n.y*1.45+drift*.12;
    vec3 thought=turn(n,twist)*(1.0+.035*drift);
    thought.y*=.92;
    vec3 pos=turn(n,t*.11)*idleR*weights.x;
    pos+=turn(n,t*.16)*listenR*weights.y;
    pos+=thought*weights.z;
    pos+=turn(n,t*.20)*speakR*weights.w;

    // Disperse particles outward & in acoustic ripples during talk beats (idle mode) - subtle & elegant
    if (weights.x > 0.01) {
      vec3 outwardDir = normalize(pos + vec3(0.0001));
      pos += outwardDir * (talkDisperse * (0.09 + 0.06 * seed.w) * weights.x);
    }

    // Interactive Touch & Pointer reaction:
    if (touch.z > 0.001) {
      vec2 diff = pos.xy - touch.xy;
      float d = length(diff);
      float influence = exp(-d * d * 3.5) * touch.z;
      // Soft ripples & interactive push on particles
      float ripple = sin(d * 10.0 - t * 7.0) * 0.08 * influence;
      pos.xy += normalize(diff + vec2(0.0001)) * (influence * 0.16 + ripple);
      pos.z += (influence * 0.20 + ripple);
    }
    float active=weights.y+weights.w;
    float rim=pow(max(0.0,1.0-abs(n.z)),2.2);
    float pop=pow(max(0.0,sin(t*8.0+seed.w*149.0)),18.0)*step(.90,seed.w);
    pos*=1.0+active*high*pop*.17;
    // Three narrow belts stay on the sphere, with bright heads moving along them.
    vec3 q=turn(n,t*.33);
    float b1=exp(-pow((dot(q,normalize(vec3(.24,.83,.50)))-.13)*23.0,2.0));
    float b2=exp(-pow((dot(q,normalize(vec3(-.71,.48,.39)))+.16)*23.0,2.0));
    float b3=exp(-pow((dot(q,normalize(vec3(.69,.58,-.41)))-.06)*23.0,2.0));
    float belts=min(1.5,b1+b2+b3)*(.6+.4*sin(atan(n.y,n.x)*2.0-t*2.3));
    float flow=pow(.5+.5*sin(angle*13.0+(weights.y-weights.w)*t*5.8+drift*2.0),7.0);
    float depth=clamp((pos.z+1.35)/2.7,0.0,1.0);
    float perspective=3.8/(3.8-pos.z*.60);
    gl_Position=vec4(pos.xy*perspective*.72,0,1);
    float point=(3.6+3.2*depth+1.6*rim)*density;
    point+=active*high*pop*2.2 + talkDisperse * 0.55 * weights.x;
    gl_PointSize=max(3.2,point*pixels/680.0);
    float cool=.5+.5*sin(n.y*2.1+n.x*1.6+drift*.65);
    // Playground Card Gradients (Purple -> Orange/Coral -> Forest Green)
    vec3 cPurple = vec3(0.42, 0.35, 0.48);
    vec3 cCoral  = vec3(0.77, 0.41, 0.38);
    vec3 cOrange = vec3(0.89, 0.46, 0.28);
    vec3 cGreen  = vec3(0.18, 0.46, 0.24); // Card 03 forest green
    // Smooth multidimensional gradient across the globe sphere surface
    float gradMix = clamp((n.y * 0.5 + 0.5) + (cool - 0.5) * 0.3, 0.0, 1.0);
    float greenAccent = clamp((sin(n.x * 2.2 + n.z * 1.8 + t * 0.15) * 0.5 + 0.5), 0.0, 1.0);
    vec3 warmGrad = mix(cOrange, mix(cCoral, cPurple, smoothstep(0.45, 1.0, gradMix)), smoothstep(0.0, 0.55, gradMix));
    vec3 cardTint = mix(warmGrad, cGreen, greenAccent * 0.35);
    tint = cardTint;
    strength = (.65 + .40 * depth + .55 * rim) * (.75 + .25 * seed.w);
    strength += active * (mid * flow * .6 + onset * rim * .5) + weights.z * belts * 0.8 + talkDisperse * 0.35 * weights.x;
    spark = active * (high * pop * .6 + onset * rim * .2) + weights.z * belts * .1;
  }`;
  const FS = `
  precision mediump float;
  varying vec3 tint;
  varying float strength, spark;
  void main() {
    float r = length(gl_PointCoord - .5) * 2.0;
    if (r > 1.0) discard;
    float core = 1.0 - smoothstep(.14, .72, r);
    float a = core * strength;
    vec3 sheen = mix(tint, vec3(0.30, 0.32, 0.36), spark);
    gl_FragColor = vec4(sheen * a, a);
  }`;

  class VoiceOrb extends HTMLElement {
    static get observedAttributes() { return ['state','particles','recording']; }
    constructor() {
      super();
      this._weights=[1,0,0,0]; this._bands=[0,0,0]; this._time=0; this._last=0;
      this._onset=0; this._bassHistory=0; this._slow=0; this._frame=0;
      this._touch=[0,0,0]; // target [x, y, active]
      this._curTouch=[0,0,0]; // smoothed [x, y, active]
      this._tick=this._tick.bind(this);
      this._sync=this._sync.bind(this);
      this._onPointerMove=this._onPointerMove.bind(this);
      this._onPointerDown=this._onPointerDown.bind(this);
      this._onPointerUp=this._onPointerUp.bind(this);
    }
    connectedCallback() {
      if (!this.shadowRoot) {
        this.attachShadow({mode:'open'}).innerHTML=`<style>
          :host{display:block;position:relative;width:100%;aspect-ratio:1;contain:layout paint;pointer-events:auto;touch-action:none;cursor:grab}
          :host(:active){cursor:grabbing}
          canvas{display:block;position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
        </style><canvas aria-hidden="true"></canvas><canvas aria-hidden="true"></canvas>`;
        [this._halo,this._canvas]=this.shadowRoot.querySelectorAll('canvas');
        this._hctx=this._halo.getContext('2d');
        this._setupRenderer();
        if(!this.hasAttribute('role'))this.setAttribute('role','img');
      }
      this._motion=matchMedia('(prefers-reduced-motion: reduce)');
      this._weights=weightsFor(this.state);
      this._motion.addEventListener('change',this._sync);
      document.addEventListener('visibilitychange',this._sync);

      this.addEventListener('pointerdown', this._onPointerDown);
      window.addEventListener('pointermove', this._onPointerMove);
      window.addEventListener('pointerup', this._onPointerUp);
      window.addEventListener('pointercancel', this._onPointerUp);

      this._observer=new ResizeObserver(()=>this._resize());
      this._observer.observe(this);
      this._resize();this._sync();this._label();
    }
    _handlePointerPos(e, activeVal=1) {
      const rect = this.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      this._touch = [clamp(x, -1.2, 1.2), clamp(y, -1.2, 1.2), activeVal];
    }
    _onPointerDown(e) {
      this._isPointerActive = true;
      this._handlePointerPos(e, 0.7);
    }
    _onPointerMove(e) {
      if (this._isPointerActive) {
        this._handlePointerPos(e, 0.7);
      } else {
        const rect = this.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          this._handlePointerPos(e, 0.35); // Subtle hover touch reaction
        } else if (this._touch[2] > 0) {
          this._touch[2] = 0;
        }
      }
    }
    _onPointerUp() {
      this._isPointerActive = false;
      this._touch[2] = 0;
    }
    disconnectedCallback() {
      cancelAnimationFrame(this._frame);this._frame=0;this._last=0;
      this._observer?.disconnect();
      this._motion?.removeEventListener('change',this._sync);
      document.removeEventListener('visibilitychange',this._sync);
      this.removeEventListener('pointerdown', this._onPointerDown);
      window.removeEventListener('pointermove', this._onPointerMove);
      window.removeEventListener('pointerup', this._onPointerUp);
      window.removeEventListener('pointercancel', this._onPointerUp);
      this.disconnect();
    }
    get state() { return STATES.includes(this.getAttribute('state'))?this.getAttribute('state'):'idle'; }
    set state(value) { this.setAttribute('state',value); }
    get particles() {
      const fixed=Number(this.getAttribute('particles'));
      const count=this.hasAttribute('particles')&&Number.isFinite(fixed)?Math.round(clamp(fixed,200,20000)):this._auto;
      return this._gl ? (count||6500) : Math.min(count||600,1000);
    }
    get bands() { return this._bands.slice(); }
    get audioContext() { return this._audio?.context || null; }
    get renderer() { return this._gl?'webgl':'canvas2d'; }
    attributeChangedCallback(name) {
      if(!this._hctx)return;
      if(name==='state')this._label();
      if(name==='particles')this._count=0;
      if(name==='recording')this._sync();
      if(this._motion?.matches&&!this.hasAttribute('recording')) {
        this._weights=weightsFor(this.state);this._paint(0,this._weights,[0,0,0],0);
      }
    }
    _label() { this.setAttribute('aria-label',`Voice orb: ${this.state}`); }
    _setupRenderer() {
      const gl=this._canvas.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});
      try {
        if(!gl)throw new Error('WebGL unavailable');
        const shaders=[gl.VERTEX_SHADER,gl.FRAGMENT_SHADER].map((type,i)=>{
          const shader=gl.createShader(type);gl.shaderSource(shader,i?FS:VS);gl.compileShader(shader);
          if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));
          return shader;
        });
        const program=gl.createProgram();shaders.forEach(s=>gl.attachShader(program,s));gl.linkProgram(program);
        if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
        shaders.forEach(s=>gl.deleteShader(s));
        gl.useProgram(program);this._buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this._buffer);
        const attr=gl.getAttribLocation(program,'seed');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,4,gl.FLOAT,false,0,0);
        gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.disable(gl.DEPTH_TEST);
        this._gl=gl;this._program=program;this._uniforms={};
        for(const n of ['time','pixels','density','weights','bands','onset','touch'])this._uniforms[n]=gl.getUniformLocation(program,n);
        this._auto=matchMedia('(pointer: coarse)').matches?3500:6500;
        if(!this._lossHandler) {
          this._lossHandler=e=>{e.preventDefault();this._lost=true;this._sync();};
          this._restoreHandler=()=>{this._lost=false;this._count=0;this._setupRenderer();this._resize();this._sync();};
          this._canvas.addEventListener('webglcontextlost',this._lossHandler);
          this._canvas.addEventListener('webglcontextrestored',this._restoreHandler);
        }
      } catch(error) {
        this._gl=null;this._auto=1000;
        // A canvas cannot switch context types after WebGL initialization.
        const replacement=document.createElement('canvas');replacement.setAttribute('aria-hidden','true');
        this._canvas.replaceWith(replacement);this._canvas=replacement;this._ctx=replacement.getContext('2d');
      }
      this._count=0;
    }
    _resize() {
      const size=Math.max(1,Math.round(this.clientWidth*Math.min(devicePixelRatio||1,2)));
      if(this._canvas.width!==size||this._canvas.height!==size) {
        this._canvas.width=this._canvas.height=this._halo.width=this._halo.height=size;
      }
      if(this.hasAttribute('recording')&&this._snapshot) {
        const f=this._snapshot;this._paint(f.time,f.weights,f.bands,f.onset);
      } else this._paint(this._motion?.matches?0:this._time,this._weights,this._motion?.matches?[0,0,0]:this._bands,this._onset);
    }
    _sync() {
      cancelAnimationFrame(this._frame);this._frame=0;this._last=0;
      if(!this.isConnected||this.hasAttribute('recording')||document.hidden||this._lost)return;
      if(this._motion?.matches) { this._weights=weightsFor(this.state);this._paint(0,this._weights,[0,0,0],0);return; }
      this._frame=requestAnimationFrame(this._tick);
    }
    _tick(now) {
      const elapsed=this._last?(now-this._last)/1000:1/60;
      const dt=Math.min(.08,elapsed);this._last=now;this._time+=dt;
      if(!this.hasAttribute('particles')) {
        this._slow=elapsed>.026?this._slow+1:Math.max(0,this._slow-1);
        if(this._slow>=45&&this._auto>800) {this._auto=Math.max(800,Math.round(this._auto*.7));this._slow=0;}
      }
      const k=1-Math.exp(-dt/.24),target=weightsFor(this.state);
      for(let i=0;i<4;i++)this._weights[i]+=(target[i]-this._weights[i])*k;

      // Smooth touch interaction vector
      const tk = 1 - Math.exp(-dt / 0.12);
      for(let i=0;i<3;i++) this._curTouch[i] += (this._touch[i] - this._curTouch[i]) * tk;

      this._readAudio(dt);
      this._paint(this._time,this._weights,this._bands,this._onset);
      this._frame=requestAnimationFrame(this._tick);
    }
    renderAt(time, {weights=weightsFor(this.state),bands=[0,0,0],onset=0}={}) {
      const frame={time:Number.isFinite(+time)?+time:0,weights:normalize(weights),bands:[0,1,2].map(i=>clamp(bands[i])),onset:clamp(onset)};
      this._snapshot=frame;
      if(this._hctx){this._paint(frame.time,frame.weights,frame.bands,frame.onset);this._gl?.flush();}
    }
    _paint(time,weights,bands,onset) {
      if(this._lost)return;
      const size=this._canvas.width,count=this.particles;
      if(count!==this._count) {
        this._count=count;this._seeds=sphere(count);
        if(this._gl){this._gl.bindBuffer(this._gl.ARRAY_BUFFER,this._buffer);this._gl.bufferData(this._gl.ARRAY_BUFFER,this._seeds,this._gl.STATIC_DRAW);}
      }
      const rgb=[0,1,2].map(c=>Math.round(PALETTE.reduce((sum,p,i)=>sum+p[c]*weights[i],0)*255));
      const h=this._hctx;h.clearRect(0,0,size,size);
      const glow=h.createRadialGradient(size*.5,size*.5,size*.10,size*.5,size*.5,size*.48);
      const energy=(weights[1]+weights[3])*(bands[0]*.025+onset*.035);
      glow.addColorStop(0,`rgba(${rgb},.012)`);glow.addColorStop(.58,`rgba(${rgb},${.028+energy})`);glow.addColorStop(1,`rgba(${rgb},0)`);
      h.fillStyle=glow;h.fillRect(0,0,size,size);
      if(this._gl) {
        const gl=this._gl,u=this._uniforms;gl.viewport(0,0,size,size);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(this._program);gl.uniform1f(u.time,time);gl.uniform1f(u.pixels,size);
        gl.uniform1f(u.density,Math.pow(12000/count,.32));gl.uniform4fv(u.weights,weights);gl.uniform3fv(u.bands,bands);gl.uniform1f(u.onset,onset);
        if (u.touch) gl.uniform3fv(u.touch, this._curTouch);
        gl.drawArrays(gl.POINTS,0,count);
      } else this._paint2D(time,weights,bands,onset,rgb,size);
    }
    _paint2D(t,w,b,onset,rgb,size) {
      const ctx=this._ctx;ctx.clearRect(0,0,size,size);ctx.globalCompositeOperation='lighter';
      ctx.fillStyle=`rgb(${rgb})`;
      for(let i=0;i<this._count;i++) {
        const o=i*4,n=this._seeds,x=n[o],y=n[o+1],z=n[o+2],s=n[o+3];
        const a=t*(.11*w[0]+.16*w[1]+.55*w[2]+.2*w[3])+y*1.45*w[2];
        const c=Math.cos(a),sn=Math.sin(a),angle=Math.acos(z);
        const drift=Math.sin(x*3+t*.3)*Math.cos(y*3-t*.2)*Math.sin(z*3+t*.1);
        const wave=Math.sin(angle*13+(w[1]-w[3])*t*5.8+drift*1.6);
        const active=w[1]+w[3];
        let r=1+.018*drift+active*(b[0]*(.08*drift+.03)+b[1]*wave*.15+b[2]*Math.sin(y*25-t*5)*.035);
        r+=w[3]*onset*(.08+.18*Math.max(0,wave))*(.4+.6*s);
        const px=(x*c+z*sn)*r,pz=(z*c-x*sn)*r,py=y*r*(1-.08*w[2]);
        const perspective=3.8/(3.8-pz*.6),rim=Math.pow(1-Math.abs(z),2);
        const belts=Math.pow(Math.max(0,1-Math.abs(Math.sin(y*8+x*3+t))),14);
        const dot=size/720*(1.1+.4*(z+1)+rim*.8);
        ctx.globalAlpha=clamp(.20+.24*(z+1)+rim*.3+w[2]*belts*.5);
        ctx.beginPath();ctx.arc(size*(.5+px*perspective*.305),size*(.5-py*perspective*.305),dot,0,Math.PI*2);ctx.fill();
      }
      ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    }

    async connect(source) {
      const isStream=typeof MediaStream!=='undefined'&&source instanceof MediaStream;
      const isMedia=typeof HTMLMediaElement!=='undefined'&&source instanceof HTMLMediaElement;
      const isNode=source&&typeof source.connect==='function'&&source.context&&typeof source.context.createAnalyser==='function';
      if(!isStream&&!isMedia&&!isNode)throw new TypeError('connect() needs a MediaStream, HTMLMediaElement or AudioNode.');
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)throw new Error('Web Audio is unavailable in this browser.');
      this.disconnect();
      let context,node,owned=false;
      if(isNode) {context=source.context;node=source;}
      else if(isMedia) {
        let entry=mediaSources.get(source);
        if(!entry) {
          context=new AC();
          try{node=context.createMediaElementSource(source);}catch(e){await context.close();throw e;}
          // Keep normal playback when the analysis tap is detached or the element is removed.
          node.connect(context.destination);entry={context,node};mediaSources.set(source,entry);
        }
        ({context,node}=entry);
      } else {context=new AC();owned=true;node=context.createMediaStreamSource(source);}
      const analyser=context.createAnalyser();analyser.fftSize=2048;analyser.smoothingTimeConstant=0;
      analyser.minDecibels=-85;analyser.maxDecibels=-10;
      // A silent output keeps stream analysis running without monitoring the microphone.
      const mute=context.createGain();mute.gain.value=0;analyser.connect(mute);mute.connect(context.destination);
      node.connect(analyser);
      const audio={context,node,analyser,mute,owned,data:new Float32Array(analyser.frequencyBinCount)};
      this._audio=audio;
      try {if(context.state!=='running')await context.resume();}
      catch(e){if(this._audio===audio)this.disconnect();throw e;}
      return this;
    }
    disconnect() {
      const a=this._audio;this._audio=null;
      if(a) {
        try{a.node.disconnect(a.analyser);}catch(_){}
        a.analyser.disconnect();a.mute.disconnect();
        if(a.owned&&a.context.state!=='closed')a.context.close().catch(()=>{});
      }
      this._bands=[0,0,0];this._onset=0;this._bassHistory=0;
    }
    _readAudio(dt) {
      const raw=[0,0,0],a=this._audio;
      if(a?.context.state==='running') {
        a.analyser.getFloatFrequencyData(a.data);
        const limits=[[45,250],[250,2400],[2400,12000]],step=a.context.sampleRate/a.analyser.fftSize;
        for(let k=0;k<3;k++) {
          const lo=Math.max(1,Math.ceil(limits[k][0]/step)),hi=Math.min(a.data.length-1,Math.floor(limits[k][1]/step));
          let power=0;
          for(let j=lo;j<=hi;j++)power+=Math.pow(10,a.data[j]/10);
          // Sum power so a narrow bass note is not diluted by unused FFT bins.
          const amplitude=Math.sqrt(power);
          raw[k]=clamp((Math.sqrt(amplitude)*[2.0,2.15,2.5][k]-.025)/.975);
        }
      }
      // A fast baseline cancels a rolling 808 line, so the kick on top of it still reads as a hit.
      const flux=Math.max(0,raw[0]-this._bassHistory-.04)*6;
      this._bassHistory+=(raw[0]-this._bassHistory)*(1-Math.exp(-dt/.06));
      this._onset=Math.max(clamp(flux),this._onset*Math.exp(-dt/.18));
      const attack=[.012,.028,.006],release=[.20,.15,.085];
      for(let k=0;k<3;k++)this._bands[k]+=(raw[k]-this._bands[k])*(1-Math.exp(-dt/(raw[k]>this._bands[k]?attack[k]:release[k])));
    }
  }
  customElements.define('voice-orb',VoiceOrb);
})();
