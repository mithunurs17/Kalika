"use client";

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { BookOpen, Brain, Laptop, Languages, Clock, MessageSquare, Trophy, Users, Award, Shield } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Custom hook for mouse parallax
function useParallax(ref: React.RefObject<HTMLDivElement>, intensity = 30) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / width;
      const y = (e.clientY - top - height / 2) / height;
      el.style.setProperty('--parallax-x', `${x * intensity}px`);
      el.style.setProperty('--parallax-y', `${y * intensity}px`);
    };
    el.addEventListener('mousemove', handleMouseMove);
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, [ref, intensity]);
}

// Reveal on scroll hook
function useRevealOnScroll(ref: React.RefObject<HTMLDivElement>, delay = 0) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        el.classList.add('animate-fade-in-up');
      }
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref, delay]);
}

export function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useParallax(heroRef, 40);
  useRevealOnScroll(featuresRef);
  useRevealOnScroll(statsRef);
  useRevealOnScroll(ctaRef);
  useRevealOnScroll(footerRef);

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-gradient-to-br from-[#0a0b1a] via-[#181a2f] to-[#1a1b3a]">
      {/* Animated Gradient Blobs */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-pink-500 opacity-20 blur-3xl animate-blob1 z-0" />
      <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-blue-500 opacity-20 blur-3xl animate-blob2 z-0" />
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-purple-500 opacity-10 blur-2xl animate-blob3 -translate-x-1/2 -translate-y-1/2 z-0" />
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fade-in-up">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl md:text-2xl">Kalika</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/features" className="text-sm font-medium transition-colors hover:text-primary">
                Features
              </Link>
              <Link href="/syllabus" className="text-sm font-medium transition-colors hover:text-primary">
                Syllabus
              </Link>
              <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
                Pricing
              </Link>
              <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                About
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="w-full py-16 md:py-28 lg:py-36 relative overflow-hidden animate-fade-in-up" style={{
        transform: 'translate3d(var(--parallax-x, 0), var(--parallax-y, 0), 0)',
        transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1)'
      }}>
        {/* Parallax floating shapes */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
          <div className="w-[340px] h-[340px] rounded-full border-4 border-pink-400/20 animate-pulse-slow" />
          <div className="w-[420px] h-[420px] rounded-full border-2 border-blue-400/10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slow" />
        </div>
        {/* Animated SVG Accent */}
        <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-60" width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="pulse" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff00cc" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#181a2f" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="160" cy="160" r="120" fill="url(#pulse)">
            <animate attributeName="r" values="120;140;120" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-6 animate-fade-in-up">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-lg border bg-muted px-3 py-1 text-sm animate-fade-in-up">
                  <Award className="mr-2 h-4 w-4 text-primary" />
                  Trusted by 10,000+ NCERT Students
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-balance animate-fade-in-up">
                  Master NCERT Syllabus with{' '}
                  <span className="text-pink-400 text-gradient">Kalika</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl leading-relaxed animate-fade-in-up">
                  Gamified learning platform for SSLC and 2nd PUC students. Prepare for board exams with AI assistance, regional language support, and personalized study plans.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
                <Button size="lg" className="text-base px-8 py-3 btn-animate" asChild>
                  <Link href="/register">Start Learning Free</Link>
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8 py-3 btn-animate" asChild>
                  <Link href="/demo">Watch Demo</Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground animate-fade-in-up">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>10,000+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>100% NCERT Aligned</span>
                </div>
              </div>
            </div>
            <div className="mx-auto relative animate-fade-in-up">
              <div className="relative h-[400px] w-[350px] sm:w-[400px] rounded-2xl overflow-hidden border shadow-2xl glass">
                <Image 
                  src="https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg" 
                  alt="Student studying with digital device" 
                  fill 
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      {/* Study Animation Section (replaces Why Kalika/features) */}
      <StudyAnimation />

      {/* Stats Section */}
      <section ref={statsRef} className="w-full py-12 md:py-24 bg-muted/50 animate-fade-in-up">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">10,000+</div>
              <div className="text-sm text-muted-foreground">Active Students</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Study Hours</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">4.9★</div>
              <div className="text-sm text-muted-foreground">Student Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section ref={ctaRef} className="w-full py-16 md:py-28 lg:py-36 bg-gradient-to-r from-primary/10 to-secondary/10 animate-fade-in-up">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <div className="space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl animate-fade-in-up">
                Ready to Excel in Your Board Exams?
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed animate-fade-in-up">
                Join thousands of students who are already preparing smarter with Kalika. Start your free trial today and experience the difference.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
              <Button size="lg" className="text-base px-8 py-3 btn-animate" asChild>
                <Link href="/register">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8 py-3 btn-animate" asChild>
                <Link href="/login">Login to Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer ref={footerRef} className="border-t bg-muted/30 animate-fade-in-up">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <BookOpen className="h-6 w-6" />
            <p className="text-center text-sm leading-loose md:text-left">
              © 2025 Kalika. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
      {/* Keyframes for animation and feature card glow */}
      <style jsx global>{`
        @keyframes blob1 {
          0%, 100% { transform: scale(1) translate(0, 0); }
          33% { transform: scale(1.1) translate(30px, -20px); }
          66% { transform: scale(0.95) translate(-20px, 20px); }
        }
        @keyframes blob2 {
          0%, 100% { transform: scale(1) translate(0, 0); }
          33% { transform: scale(1.05) translate(-30px, 20px); }
          66% { transform: scale(1.1) translate(20px, -20px); }
        }
        @keyframes blob3 {
          0%, 100% { transform: scale(1) translate(-50%, -50%); }
          50% { transform: scale(1.08) translate(-55%, -45%); }
        }
        .animate-blob1 { animation: blob1 7s ease-in-out infinite; }
        .animate-blob2 { animation: blob2 8s ease-in-out infinite; }
        .animate-blob3 { animation: blob3 6s ease-in-out infinite; }
        .animate-spin-slow { animation: spin 18s linear infinite; }
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .feature-glow {
          box-shadow: 0 0 0 0 #ff00cc00;
          transition: box-shadow 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .feature-glow:hover {
          box-shadow: 0 0 24px 4px #ff00cc55, 0 0 0 2px #fff2;
        }
      `}</style>
    </div>
  );
}

function StudyAnimation() {
  const router = useRouter();
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => {
        setAnimate(false);
        router.push('/');
      }, 7000); // Slower animation duration (7s)
      return () => clearTimeout(timeout);
    }
  }, [animate, router]);

  if (!animate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0a0b1a] via-[#181a2f] to-[#1a1b3a] overflow-hidden animate-fade-in-up">
      {/* Expanding 3D Study Animation */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Central 3D Book Icon */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-expand-3d">
          <BookOpen className="w-32 h-32 md:w-48 md:h-48 text-pink-400 drop-shadow-2xl" style={{ filter: 'drop-shadow(0 0 40px #ff00cc88)' }} />
        </div>
        {/* Floating Study Icons */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="floating-icon" style={{ left: '-120px', top: '-80px', animationDelay: '0.2s' }}><Trophy className="w-12 h-12 text-yellow-400" /></div>
          <div className="floating-icon" style={{ left: '100px', top: '-100px', animationDelay: '0.4s' }}><Brain className="w-12 h-12 text-blue-400" /></div>
          <div className="floating-icon" style={{ left: '-100px', top: '100px', animationDelay: '0.6s' }}><Laptop className="w-12 h-12 text-green-400" /></div>
          <div className="floating-icon" style={{ left: '120px', top: '120px', animationDelay: '0.8s' }}><Award className="w-12 h-12 text-pink-400" /></div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes expand3d {
          0% {
            transform: scale(0.2) rotateY(0deg) translate(-50%, -50%);
            opacity: 0.7;
            filter: blur(8px);
          }
          60% {
            transform: scale(1.1) rotateY(30deg) translate(-50%, -50%);
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            transform: scale(8) rotateY(60deg) translate(-50%, -50%);
            opacity: 0;
            filter: blur(16px);
          }
        }
        .animate-expand-3d {
          animation: expand3d 6.5s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .floating-icon {
          position: absolute;
          opacity: 0.8;
          animation: floatIcon 5.5s ease-in-out forwards;
        }
        @keyframes floatIcon {
          0% {
            transform: scale(0.2) translateY(0px);
            opacity: 0;
            filter: blur(8px);
          }
          40% {
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            transform: scale(2.5) translateY(-120px);
            opacity: 0;
            filter: blur(12px);
          }
        }
      `}</style>
    </div>
  );
}