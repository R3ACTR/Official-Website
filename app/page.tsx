'use client';

import React, { useRef } from "react";
import Image from "next/image";
import ScrambleText from "@/components/ui/ScrambleText";
import CircularGallery from "@/components/ui/CircularGallery";
import ProfileCard from "@/components/ui/ProfileCard";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll('.gsap-arrive');
    elements.forEach((el) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 50 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="w-full bg-black flex flex-col min-h-screen">
      {/* Hero Section */}
      <section id="home" className="w-full h-screen overflow-hidden relative flex flex-col">
        <style>{`
        @font-face {
          font-family: 'Fellix';
          src: url('/68f0f5e5f2f06b2f0ce509cb_Fellix-Regular.woff2') format('woff2');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }

        @keyframes glitch-anim {
          0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
          10% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
          20% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
          30% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
          40% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
          50% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -1px); }
          60% { clip-path: inset(70% 0 20% 0); transform: translate(-2px, 1px); }
          70% { clip-path: inset(10% 0 80% 0); transform: translate(2px, -1px); }
          80% { clip-path: inset(50% 0 30% 0); transform: translate(-1px, 2px); }
          90% { clip-path: inset(20% 0 60% 0); transform: translate(1px, -2px); }
          100% { clip-path: inset(90% 0 5% 0); transform: translate(-2px, 1px); }
        }

        .glitch-wrapper { position: relative; }
        .glitch-layer {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: #000;
          opacity: 0.8;
          pointer-events: none;
        }
        .glitch-layer-1 {
          animation: glitch-anim 2.5s infinite linear alternate-reverse;
          left: 2px;
          text-shadow: -1px 0 rgba(255,255,255,0.5);
        }
        .glitch-layer-2 {
          animation: glitch-anim 3.2s infinite linear alternate-reverse;
          left: -2px;
          text-shadow: 1px 0 rgba(255,255,255,0.4);
        }
        .barcode {
          display: inline-block;
          height: 0.9em;
          width: 45px;
          margin-left: 12px;
          vertical-align: middle;
          background: repeating-linear-gradient(
            to right,
            currentColor 0,
            currentColor 1px,
            transparent 1px,
            transparent 3px,
            currentColor 3px,
            currentColor 4px,
            transparent 4px,
            transparent 5px,
            currentColor 5px,
            currentColor 8px,
            transparent 8px,
            transparent 10px
          );
          opacity: 0.5;
        }

      `}</style>
      
      {/* Top Navigation */}
      <div className="absolute top-6 md:top-8 w-full z-20 flex flex-row justify-between md:justify-center items-center px-6 md:px-0 pointer-events-none md:gap-16 gsap-arrive">
        
        {/* Left Nav Elements */}
        <div className="flex gap-3 pointer-events-auto">
          <a 
            href="https://www.instagram.com/r3actr/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-11 h-11 bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white/80 hover:text-white transition-all duration-300"
            aria-label="Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
          </a>
          {[
            { name: 'Home', href: '#home' },
            { name: 'Work', href: '#work' }
          ].map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              className="hidden md:flex items-center justify-center px-7 h-11 bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white/80 hover:text-white text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300"
              style={{ fontFamily: "'Fellix', sans-serif" }}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Center Logo */}
        <div className="relative w-28 h-7 md:w-40 md:h-10 invert drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)] pointer-events-auto cursor-pointer">
          <Image src="/Images/r3actr.png" alt="R3ACTR Logo" fill className="object-contain" priority />
        </div>

        {/* Right Nav Elements */}
        <div className="flex gap-3 pointer-events-auto">
          {[
            { name: 'About', href: '#about' },
            { name: 'Contact', href: '#contact' }
          ].map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              className="hidden md:flex items-center justify-center px-7 h-11 bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white/80 hover:text-white text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300"
              style={{ fontFamily: "'Fellix', sans-serif" }}
            >
              {item.name}
            </a>
          ))}
          <a 
            href="https://www.linkedin.com/company/r3actr-innovations/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-11 h-11 bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white/80 hover:text-white transition-all duration-300"
            aria-label="LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect width="4" height="12" x="2" y="9"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
        </div>
      </div>
      
      {/* Background Video */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full bg-black">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="/videos/bg.mp4" type="video/mp4" />
        </video>
        {/* Gradient Blend to Next Section */}
        <div className="absolute bottom-0 left-0 w-full h-32 md:h-56 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Center Text */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none gsap-arrive">
        <p 
          className="text-white text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-[90vw] md:max-w-4xl px-4 leading-tight tracking-tight drop-shadow-lg" 
          style={{ fontFamily: "'Fellix', sans-serif" }}
        >
          Driving software innovation and research, working remotely with a global reach
        </p>
      </div>

      {/* Bottom Footer Text */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center pointer-events-none px-4 gsap-arrive">
        <p 
          className="text-white/70 text-[8px] sm:text-[10px] md:text-xs font-medium tracking-[0.15em] md:tracking-[0.2em] uppercase whitespace-normal md:whitespace-nowrap text-center max-w-[95vw] leading-relaxed"
          style={{ fontFamily: "'Fellix', sans-serif" }}
        >
          Innovating, researching, and building next-gen software solutions.
        </p>
      </div>

      {/* Bottom Dashed Separator */}
      <div className="absolute bottom-0 left-0 w-full border-b border-dashed border-white z-20" />
      </section>

      {/* About Section */}
      <section id="about" className="w-full min-h-screen bg-black text-white/80 flex flex-col justify-center overflow-hidden pt-24 md:pt-32 pb-16">
        
        {/* Top Cyberpunk Glitch Text */}
        <div className="w-full px-8 md:pl-16 lg:pl-24 mb-12 md:mb-20 glitch-wrapper gsap-arrive">
          {/* Base Text */}
          <p className="font-mono text-[9px] md:text-xs tracking-[0.4em] text-white/40 uppercase leading-[2.5]">
            <span className="text-white/60">OTHERS CHASE</span> TRENDS.<span className="barcode text-white/80"></span><br/>
            WE ENGINEER <span className="text-white/80">MOMENTUM.</span>
          </p>
          {/* Glitch Layer 1 */}
          <div className="glitch-layer glitch-layer-1 px-8 md:pl-16 lg:pl-24">
            <p className="font-mono text-[9px] md:text-xs tracking-[0.4em] text-white/40 uppercase leading-[2.5]">
              <span className="text-white/60">OTHERS CHASE</span> TRENDS.<span className="barcode text-white/80"></span><br/>
              WE ENGINEER <span className="text-white/80">MOMENTUM.</span>
            </p>
          </div>
          {/* Glitch Layer 2 */}
          <div className="glitch-layer glitch-layer-2 px-8 md:pl-16 lg:pl-24">
            <p className="font-mono text-[9px] md:text-xs tracking-[0.4em] text-white/40 uppercase leading-[2.5]">
              <span className="text-white/60">OTHERS CHASE</span> TRENDS.<span className="barcode text-white/80"></span><br/>
              WE ENGINEER <span className="text-white/80">MOMENTUM.</span>
            </p>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 items-center">
          
          {/* Left Text */}
          <div 
            className="space-y-8 text-left text-sm sm:text-base md:text-lg lg:text-xl font-light leading-relaxed tracking-wide px-8 md:pl-16 lg:pl-24 md:pr-12 py-16 gsap-arrive" 
            style={{ fontFamily: "'Fellix', sans-serif" }}
          >
            <p>
              At R3ACTR, we specialize in building <ScrambleText text="innovative software" /> solutions, research-driven projects, and cutting-edge web experiences. From AI and Web3 applications to SaaS platforms, our goal is to create products that make a <ScrambleText text="real impact" />.
            </p>
            <p>
              We combine creativity, technology, and research to craft software that is not only functional but also <ScrambleText text="intelligent" />, scalable, and user-friendly. Whether designing sleek interfaces, developing complex applications, or exploring emerging technologies, our team is always pushing the boundaries of <ScrambleText text="what’s possible" />.
            </p>
          </div>

          {/* Right Video */}
          <div 
            className="relative w-full md:w-[85%] mx-auto aspect-square md:aspect-video flex items-center justify-center pointer-events-none scale-95 md:scale-100 gsap-arrive"
            style={{ 
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent), linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
              WebkitMaskComposite: 'source-in',
              maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent), linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
              maskComposite: 'intersect'
            }}
          >
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-90"
            >
              <source src="/videos/process.mp4" type="video/mp4" />
            </video>
          </div>

        </div>
      </section>

      {/* Dashed Separator */}
      <div className="w-full border-b border-dashed border-white relative z-20" />

      {/* Circular Gallery Section */}
      <section id="work" className="w-full min-h-screen bg-black pt-24 pb-16 flex flex-col justify-between items-center relative overflow-hidden">
        {/* Arm Image */}
        <div className="absolute left-0 top-0 w-64 md:w-96 lg:w-[450px] z-10 pointer-events-none transform -translate-x-8 -translate-y-8 md:-translate-x-12 md:-translate-y-12 opacity-85 select-none">
          <Image 
            src="/Images/arm.png" 
            alt="Robotic Arm" 
            width={500} 
            height={500} 
            className="w-full h-auto object-contain scale-x-[-1]"
          />
        </div>

        {/* Heading */}
        <h2 
          className="text-white/80 text-xl md:text-3xl tracking-[0.25em] uppercase font-medium z-20 pointer-events-none mb-8 gsap-arrive"
          style={{ fontFamily: "'Fellix', sans-serif" }}
        >
          Snapshots
        </h2>

        {/* Gallery Container */}
        <div className="w-full relative h-[50vh] md:h-[65vh] block gsap-arrive">
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
            textColor="#ffffff" 
            borderRadius={0.05} 
            scrollEase={0.02} 
          />
        </div>

        {/* Text Below Carousel */}
        <div 
          className="max-w-5xl px-8 mt-12 space-y-8 text-center text-sm sm:text-base md:text-lg lg:text-xl font-light leading-relaxed tracking-wide z-20 gsap-arrive" 
          style={{ fontFamily: "'Fellix', sans-serif" }}
        >
          <p>
            Beyond development, R3ACTR thrives on collaboration and knowledge-sharing. We actively engage with tech communities, contribute to research, and mentor upcoming talent, ensuring our work is informed, innovative, and impactful.
          </p>
        </div>
      </section>

      {/* Dashed Separator */}
      <div className="w-full border-b border-dashed border-white relative z-20 opacity-50" />

      {/* Founders Section */}
      <section className="w-full min-h-screen bg-black py-24 px-8 md:px-16 lg:px-24 flex flex-col justify-center items-center relative overflow-hidden">
        {/* Arm Image */}
        <div className="absolute right-0 top-0 w-64 md:w-96 lg:w-[450px] z-10 pointer-events-none transform translate-x-8 -translate-y-8 md:translate-x-12 md:-translate-y-12 opacity-85 select-none">
          <Image 
            src="/Images/arm.png" 
            alt="Robotic Arm" 
            width={500} 
            height={500} 
            className="w-full h-auto object-contain"
          />
        </div>

        <h2 
          className="text-white/80 text-xl md:text-3xl tracking-[0.25em] uppercase font-medium z-20 pointer-events-none mb-16 gsap-arrive"
          style={{ fontFamily: "'Fellix', sans-serif" }}
        >
          Founders
        </h2>
        
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 justify-items-center">
          
          <div className="flex flex-col items-center gap-6 w-full gsap-arrive">
            <ProfileCard
              name=""
              title=""
              handle="abhinav"
              status="Online"
              contactText="Connect"
              avatarUrl="/founders/abhinav.webp"
              showUserInfo={false}
              iconUrl="/Images/r3actr.png"
              enableTilt={true}
              enableMobileTilt={false}
              innerGradient="linear-gradient(145deg, rgba(96, 73, 110, 0.55) 0%, rgba(113, 196, 255, 0.27) 100%)" behindGlowColor={undefined} behindGlowSize={undefined} miniAvatarUrl={undefined} onContactClick={undefined}            />
            <div className="text-center space-y-1 w-full" style={{ fontFamily: "'Fellix', sans-serif" }}>
              <h3 className="text-white/90 font-medium text-xl tracking-[0.15em] uppercase">ABHINAV R.</h3>
              <p className="text-white/50 text-sm tracking-widest font-light uppercase">Co-Founder @ R3ACTR</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 w-full gsap-arrive">
            <ProfileCard
              name=""
              title=""
              handle="sreehari"
              status="Online"
              contactText="Connect"
              avatarUrl="/founders/sreehari.webp"
              showUserInfo={false}
              iconUrl="/Images/r3actr.png"
              enableTilt={true}
              enableMobileTilt={false}
              innerGradient="linear-gradient(145deg, rgba(96, 73, 110, 0.55) 0%, rgba(113, 196, 255, 0.27) 100%)" behindGlowColor={undefined} behindGlowSize={undefined} miniAvatarUrl={undefined} onContactClick={undefined}            />
            <div className="text-center space-y-1 w-full" style={{ fontFamily: "'Fellix', sans-serif" }}>
              <h3 className="text-white/90 font-medium text-xl tracking-[0.15em] uppercase">SREEHARI R.</h3>
              <p className="text-white/50 text-sm tracking-widest font-light uppercase">Co-Founder @ R3ACTR</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 w-full gsap-arrive">
            <ProfileCard
              name=""
              title=""
              handle="kalidas"
              status="Online"
              contactText="Connect"
              avatarUrl="/founders/kali.webp"
              showUserInfo={false}
              iconUrl="/Images/r3actr.png"
              enableTilt={true}
              enableMobileTilt={false}
              innerGradient="linear-gradient(145deg, rgba(96, 73, 110, 0.55) 0%, rgba(113, 196, 255, 0.27) 100%)" behindGlowColor={undefined} behindGlowSize={undefined} miniAvatarUrl={undefined} onContactClick={undefined}            />
            <div className="text-center space-y-1 w-full" style={{ fontFamily: "'Fellix', sans-serif" }}>
              <h3 className="text-white/90 font-medium text-xl tracking-[0.15em] uppercase">KALIDAS V.</h3>
              <p className="text-white/50 text-sm tracking-widest font-light uppercase">Co-Founder @ R3ACTR</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 w-full gsap-arrive">
            <ProfileCard
              name=""
              title=""
              handle="neeraj"
              status="Online"
              contactText="Connect"
              avatarUrl="/founders/neeraj.webp"
              showUserInfo={false}
              iconUrl="/Images/r3actr.png"
              enableTilt={true}
              enableMobileTilt={false}
              innerGradient="linear-gradient(145deg, rgba(96, 73, 110, 0.55) 0%, rgba(113, 196, 255, 0.27) 100%)" behindGlowColor={undefined} behindGlowSize={undefined} miniAvatarUrl={undefined} onContactClick={undefined}            />
            <div className="text-center space-y-1 w-full" style={{ fontFamily: "'Fellix', sans-serif" }}>
              <h3 className="text-white/90 font-medium text-xl tracking-[0.15em] uppercase">NEERAJ S.</h3>
              <p className="text-white/50 text-sm tracking-widest font-light uppercase">Co-Founder @ R3ACTR</p>
            </div>
          </div>

        </div>
      </section>

      {/* Dashed Separator */}
      <div className="w-full border-b border-dashed border-white relative z-20 opacity-50" />

      {/* Open Source Quest Section */}
      <section className="w-full min-h-screen bg-black py-24 px-8 md:px-16 lg:px-24 flex flex-col justify-center items-center relative overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            preload="auto"
            className="w-full h-full object-cover opacity-85"
          >
            <source src="/videos/19782b13-9fd4bd7a.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
        </div>

        {/* Floating Image coming from right */}
        <div className="absolute right-0 top-0 w-24 md:w-32 lg:w-48 z-10 pointer-events-none transform translate-x-8 -translate-y-2 md:translate-x-12 md:-translate-y-4 opacity-85 select-none">
          <Image 
            src="/Images/ChatGPT Image Feb 20, 2026, 10_38_37 AM-Photoroom.png" 
            alt="Cyberpunk Prop" 
            width={150} 
            height={150} 
            className="w-full h-auto object-contain"
          />
        </div>        <h2 
          className="text-white/80 text-xl md:text-3xl tracking-[0.25em] uppercase font-medium z-20 pointer-events-none mb-20 text-center gsap-arrive"
          style={{ fontFamily: "'Fellix', sans-serif" }}
        >
          Flagship Event
        </h2>

        <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-20">
          
          {/* Left: Image */}
          <div className="w-full lg:w-1/2 flex justify-center gsap-arrive">
            <div className="relative w-[300px] md:w-[400px] lg:w-[500px] aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(113,196,255,0.15)]">
              <Image 
                src="/Images/osq.png" 
                alt="Open Source Quest" 
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left space-y-8 gsap-arrive" style={{ fontFamily: "'Fellix', sans-serif" }}>
            <h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-medium tracking-wide">
              Open Source Quest
            </h3>
            
            <div className="space-y-6 text-white/70 text-base md:text-lg lg:text-xl font-light leading-relaxed tracking-wide">
              <p>
                Open Source Quest is a structured, month-long open-source contribution program designed to help students gain real-world experience with professional software development workflows.
              </p>
              <p>
                Participants work individually on curated, domain-specific GitHub repositories under guided mentorship. The program focuses on understanding how real open-source projects function—through issues, pull requests, reviews, and consistent contributions—rather than competitive coding or short-term hackathons.
              </p>
            </div>

            <a 
              href="https://osq.r3actr.work/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-4 px-8 py-4 border border-white/20 text-white/90 hover:bg-white hover:text-black transition-all duration-300 ease-in-out font-medium tracking-widest uppercase text-sm"
            >
              Explore OSQ
            </a>
          </div>

        </div>
      </section>

      {/* Dashed Separator */}
      <div className="w-full border-b border-dashed border-white relative z-20 opacity-50" />

      {/* Publications Section */}
      <section id="contact" className="w-full min-h-screen bg-black py-24 px-8 md:px-16 lg:px-24 flex flex-col justify-center items-center relative overflow-hidden">
        <h2 
          className="text-white/80 text-xl md:text-3xl tracking-[0.25em] uppercase font-medium z-20 pointer-events-none mb-20 text-center gsap-arrive"
          style={{ fontFamily: "'Fellix', sans-serif" }}
        >
          Publications
        </h2>

        <div className="w-full max-w-5xl flex flex-col gap-6 relative z-20" style={{ fontFamily: "'Fellix', sans-serif" }}>
          
          {/* Publication 1 */}
          <div className="group border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden gsap-arrive">
            <div className="flex-1">
              <h3 className="text-white/80 text-base md:text-lg lg:text-xl font-light leading-relaxed group-hover:text-white transition-colors">
                ADA-XAI: Adaptive Faithfulness-Driven Explainability for Hybrid EVA-02 and Deformable CNNS in Brain Tumor Diagnosis From MRI Images
              </h3>
            </div>
            <a 
              href="https://doi.org/10.1109/ICITIIT68860.2026.11499683" 
              target="_blank" 
              rel="noopener noreferrer"
              className="shrink-0 px-6 py-3 border border-white/20 text-white/90 hover:bg-white hover:text-black transition-all duration-300 font-medium tracking-widest uppercase text-xs"
            >
              View DOI
            </a>
          </div>

          {/* Publication 2 */}
          <div className="group border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden gsap-arrive">
            <div className="flex-1">
              <h3 className="text-white/80 text-base md:text-lg lg:text-xl font-light leading-relaxed group-hover:text-white transition-colors">
                CRDA: Cross-Reasoning Disagreement Analysis for Uncertainty Quantification in Hybrid Voice Classification
              </h3>
            </div>
            <span className="shrink-0 px-6 py-3 border border-white/10 text-white/40 font-medium tracking-widest uppercase text-xs bg-black/50 cursor-not-allowed">
              DOI Coming Soon
            </span>
          </div>

          {/* Publication 3 */}
          <div className="group border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden gsap-arrive">
            <div className="flex-1">
              <h3 className="text-white/80 text-base md:text-lg lg:text-xl font-light leading-relaxed group-hover:text-white transition-colors">
                Pixel-Level Supervision for Medical Imaging: A Custom Masked Autoencoder Framework for Renal Pathology Detection
              </h3>
            </div>
            <span className="shrink-0 px-6 py-3 border border-white/10 text-white/40 font-medium tracking-widest uppercase text-xs bg-black/50 cursor-not-allowed">
              DOI Coming Soon
            </span>
          </div>

        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-black border-t border-dashed border-white/30 py-16 px-8 md:px-16 lg:px-24 flex flex-col items-center relative z-20 overflow-hidden gsap-arrive" style={{ fontFamily: "'Fellix', sans-serif" }}>
        {/* Background Video */}
        <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            preload="auto"
            className="w-full h-full object-cover opacity-85"
          >
            <source src="/videos/288713ad-32b2074f.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none" />
        </div>

        <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-12 pb-12 border-b border-white/10 relative z-10">
          
          {/* Left Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
            <div className="relative w-32 h-8 invert drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
              <Image src="/Images/r3actr.png" alt="R3ACTR Logo" fill className="object-contain" />
            </div>
            <p className="text-white/50 text-xs tracking-widest uppercase font-light max-w-sm">
              Driving software innovation, open-source momentum, and advanced research.
            </p>
          </div>

          {/* Center Links */}
          <div className="flex flex-wrap justify-center gap-8 text-xs font-bold tracking-[0.15em] uppercase text-white/80">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#work" className="hover:text-white transition-colors">Work</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>

          {/* Right Socials */}
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all duration-300" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/r3actr-innovations/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all duration-300" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="https://www.instagram.com/r3actr/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all duration-300" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </a>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-white/40 text-[10px] tracking-widest uppercase font-light relative z-10">
          <p>© 2026 R3ACTR. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
