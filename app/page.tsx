import Image from "next/image";
import { Orbitron, Space_Grotesk } from "next/font/google";
import { Home as HomeIcon, Layers, Tag, Mail } from "lucide-react";
import CircularGallery from "@/components/ui/CircularGallery";
import Grainient from "@/components/Grainient";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["900"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function Home() {
  return (
    <main className="w-full bg-[#eef2f5] flex flex-col">
      <style>{`
        @keyframes fadeBlurIn {
          0% { opacity: 0; filter: blur(10px); transform: translateY(30px); }
          100% { opacity: 1; filter: blur(0px); transform: translateY(0); }
        }
        .animate-fade-blur {
          opacity: 0;
          animation: fadeBlurIn 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .delay-5 { animation-delay: 0.5s; }
      `}</style>
      
      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Desktop Liquid Glass Navbar */}
        <nav className="animate-fade-blur delay-1 hidden md:flex absolute top-6 left-1/2 -translate-x-1/2 z-[100] items-center justify-between px-6 py-3 w-[90%] max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-full text-slate-800">
          <div className={`${orbitron.className} font-black text-xl tracking-widest mix-blend-color-burn`}>R3ACTR</div>
          <div className="flex gap-8 text-sm font-semibold mix-blend-color-burn">
            <a href="#" className="hover:opacity-60 transition-opacity">Home</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Features</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Pricing</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Contact</a>
          </div>
          <button className="bg-white/40 hover:bg-white/60 backdrop-blur-md px-5 py-2 rounded-full text-sm font-bold transition-all border border-white/30 shadow-sm mix-blend-luminosity">
            Get Started
          </button>
        </nav>

        {/* Mobile Floating Icon Navbar */}
        <nav className="animate-fade-blur delay-1 flex md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] items-center justify-around px-6 py-3.5 w-[85%] max-w-xs bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-full text-slate-800">
          <a href="#" className="hover:opacity-60 transition-opacity mix-blend-color-burn flex flex-col items-center gap-1">
            <HomeIcon size={22} strokeWidth={2.5} />
          </a>
          <a href="#" className="hover:opacity-60 transition-opacity mix-blend-color-burn flex flex-col items-center gap-1">
            <Layers size={22} strokeWidth={2.5} />
          </a>
          <a href="#" className="hover:opacity-60 transition-opacity mix-blend-color-burn flex flex-col items-center gap-1">
            <Tag size={22} strokeWidth={2.5} />
          </a>
          <a href="#" className="hover:opacity-60 transition-opacity mix-blend-color-burn flex flex-col items-center gap-1">
            <Mail size={22} strokeWidth={2.5} />
          </a>
        </nav>

        {/* Center Hero Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-start md:justify-center pt-6 md:pt-0 z-10 pointer-events-none md:-translate-y-28">
          <div className="animate-fade-blur delay-2 relative w-[85vw] sm:w-[70vw] md:w-[60vw] max-w-[800px] h-[80px] sm:h-[100px] md:h-[160px] opacity-90 drop-shadow-md flex justify-center items-center">
            <Image src="/Images/r3actr.png" alt="R3ACTR" fill className="object-contain" priority />
          </div>
          <p className={`animate-fade-blur delay-3 mt-4 md:mt-6 text-black/90 text-[9px] sm:text-[10px] md:text-lg lg:text-xl font-bold tracking-wide md:tracking-wider text-center whitespace-nowrap ${spaceGrotesk.className}`}>
            Innovating, researching, and building next-gen software solutions.
          </p>

          {/* Long Description (Mobile Only) */}
          <div className={`animate-fade-blur delay-4 flex md:hidden flex-col gap-4 mt-8 px-4 w-[90vw] max-w-4xl text-black/90 text-[10px] sm:text-[11px] leading-relaxed font-semibold text-justify ${spaceGrotesk.className}`}>
            <p>
              At R3ACTR, we specialize in building innovative software solutions, research-driven projects, and cutting-edge web experiences. From AI and Web3 applications to SaaS platforms, our goal is to create products that make a real impact.
            </p>
            <p>
              We combine creativity, technology, and research to craft software that is not only functional but also intelligent, scalable, and user-friendly. Whether designing sleek interfaces, developing complex applications, or exploring emerging technologies, our team is always pushing the boundaries of what’s possible.
            </p>
          </div>
        </div>

        {/* Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
          <Grainient
            color1="#88aae0"
            color2="#88aae0"
            color3="#88aae0"
            timeSpeed={0}
            colorBalance={-0.3}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={0}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={2}
            grainAmount={0.1}
            grainScale={2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
          />
        </div>

        {/* Clouds (Above image) */}
        <div className="absolute top-10 left-4 md:left-10 w-[40vw] md:w-[300px] h-[30vw] md:h-[200px] opacity-40 z-20 pointer-events-none mix-blend-overlay">
          <Image src="/CLOUD.png" alt="Cloud" fill className="object-contain" />
        </div>
        <div className="absolute top-40 right-4 md:right-20 w-[50vw] md:w-[400px] h-[35vw] md:h-[250px] opacity-30 z-20 pointer-events-none mix-blend-overlay">
          <Image src="/CLOUD1.png" alt="Cloud" fill className="object-contain" />
        </div>
        <div className="absolute bottom-24 md:bottom-20 left-4 md:left-1/4 w-[45vw] md:w-[350px] h-[30vw] md:h-[220px] opacity-50 z-20 pointer-events-none mix-blend-overlay">
          <Image src="/CLOUD2.png" alt="Cloud" fill className="object-contain" />
        </div>
        <div className="absolute top-1/4 md:top-1/3 left-1/2 -translate-x-1/2 md:-translate-x-0 w-[35vw] md:w-[250px] h-[25vw] md:h-[150px] opacity-25 z-20 pointer-events-none mix-blend-overlay">
          <Image src="/CLOUD1.png" alt="Cloud" fill className="object-contain" />
        </div>
        <div className="absolute bottom-32 md:bottom-40 right-0 md:right-10 w-[60vw] md:w-[450px] h-[40vw] md:h-[300px] opacity-40 z-20 pointer-events-none mix-blend-overlay">
          <Image src="/CLOUD.png" alt="Cloud" fill className="object-contain" />
        </div>
        <div className="absolute top-20 left-1/4 md:left-1/3 w-[45vw] md:w-[320px] h-[30vw] md:h-[180px] opacity-35 z-20 pointer-events-none mix-blend-overlay">
          <Image src="/CLOUD2.png" alt="Cloud" fill className="object-contain" />
        </div>
        <div className="absolute top-1/2 right-10 md:right-1/4 w-[35vw] md:w-[280px] h-[25vw] md:h-[160px] opacity-45 z-20 pointer-events-none mix-blend-overlay">
          <Image src="/CLOUD1.png" alt="Cloud" fill className="object-contain" />
        </div>

        {/* Circular Gallery (Inside Hero on Bottom) */}
        <div className="animate-fade-blur delay-4 absolute bottom-10 md:bottom-0 left-0 w-full h-[30vh] sm:h-[35vh] md:h-[45vh] z-30 flex justify-center">
          <CircularGallery 
            items={[
              { image: '/Images/1.jpeg', text: '' },
              { image: '/Images/2.jpeg', text: '' },
              { image: '/Images/3.jpeg', text: '' },
              { image: '/Images/4.jpeg', text: '' },
              { image: '/Images/5.jpeg', text: '' },
              { image: '/Images/6.jpeg', text: '' },
              { image: '/Images/7.jpeg', text: '' },
              { image: '/Images/8.jpeg', text: '' }
            ]}
            bend={3} 
            textColor="#1a1a1a" 
            borderRadius={0.05} 
            scrollEase={0.02} 
          />
        </div>

        {/* Bottom Center Footer Text */}
        <div className="animate-fade-blur delay-5 hidden md:block absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-40 w-full text-center pointer-events-none">
          <p className={`text-slate-900 text-[9px] sm:text-[11px] md:text-xs font-semibold tracking-wide md:tracking-wider opacity-85 whitespace-nowrap ${spaceGrotesk.className}`}>
            Driving software innovation and research, working remotely with a global reach.
          </p>
        </div>

        {/* Gradient Blend to Next Section */}
        <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-[#eef2f5] to-transparent z-20 pointer-events-none" />
      </section>
    </main>
  );
}
