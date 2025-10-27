"use client";

import Link from 'next/link';
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { BookOpen, Brain, Laptop, Languages, Clock, MessageSquare, Trophy, Users, Award } from 'lucide-react';
import Image from 'next/image';

// --- Custom Hooks ---
function useParallax(ref: React.RefObject<HTMLDivElement>, intensity = 30): void {
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

function useRevealOnScroll(ref: React.RefObject<HTMLDivElement>): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add('animate-slide-up');
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

// --- Component ---
export function LandingPage() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  useParallax(heroRef, 40);
  useRevealOnScroll(featuresRef);
  useRevealOnScroll(statsRef);
  useRevealOnScroll(ctaRef);
  useRevealOnScroll(footerRef);

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-gradient-to-br from-[#0a0b1a] via-[#181a2f] to-[#1a1b3a]">
      
      {/* --- Glowing Background Circles --- */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-700 rounded-full filter blur-3xl opacity-30 animate-float-circle"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-700 rounded-full filter blur-3xl opacity-25 animate-float-circle-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-[30rem] h-[30rem] bg-pink-600 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 animate-float-circle-rev"></div>
      </div>

      {/* --- Study-Themed Floating Elements --- */}
      <div className="absolute -top-20 left-10 w-20 h-20 bg-[url('/assets/book-icon.png')] bg-contain bg-no-repeat opacity-30 animate-float-book" />
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-[url('/assets/pencil-icon.png')] bg-contain bg-no-repeat opacity-30 animate-float-pencil" />
      <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-[url('/assets/paper-icon.png')] bg-contain bg-no-repeat opacity-25 animate-float-paper" />

      {/* --- Navigation --- */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur animate-fade-header">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl md:text-2xl">Kalika</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/features" className="text-sm font-medium transition-colors hover:text-primary">Features</Link>
              <Link href="/syllabus" className="text-sm font-medium transition-colors hover:text-primary">Syllabus</Link>
              <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-primary">Pricing</Link>
              <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">About</Link>
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

      {/* --- Hero Section --- */}
      <section
        ref={heroRef}
        className="w-full py-16 md:py-28 lg:py-36 relative overflow-hidden"
        style={{
          transform: 'translate3d(var(--parallax-x, 0), var(--parallax-y, 0), 0)',
          transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-6 animate-slide-up">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-lg border bg-muted px-3 py-1 text-sm">
                  <Award className="mr-2 h-4 w-4 text-primary" />
                  Trusted by 10,000+ NCERT Students
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-balance">
                  Master NCERT Syllabus with{' '}
                  <span className="text-pink-400 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent animate-gradient-text">Kalika</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl leading-relaxed">
                  Gamified learning platform for SSLC and 2nd PUC students. Prepare for board exams with AI assistance, regional language support, and personalized study plans.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-base px-8 py-3 animate-bounce-slow" asChild>
                  <Link href="/register">Start Learning Free</Link>
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8 py-3 animate-bounce-slow delay-300" asChild>
                  <Link href="/demo">Watch Demo</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto relative animate-tilt-float">
              <div className="relative h-[400px] w-[350px] sm:w-[400px] rounded-2xl overflow-hidden border shadow-2xl glass">
                <Image 
                  src="https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg" 
                  alt="Student studying with digital device" 
                  fill 
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section ref={featuresRef} className="w-full py-16 md:py-24 bg-muted/30 animate-slide-up">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
              Why Choose Kalika?
            </h2>
            <p className="max-w-[600px] text-muted-foreground text-lg">
              Experience the future of education with our innovative features designed for modern learners.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[ 
              { icon: Brain, title: "AI-Powered Learning", desc: "Personalized study plans and intelligent tutoring" },
              { icon: Languages, title: "Regional Languages", desc: "Learn in your preferred language" },
              { icon: Trophy, title: "Gamified Learning", desc: "Earn points, badges, and compete with peers" },
              { icon: Clock, title: "Study Planning", desc: "Smart scheduling and progress tracking" },
              { icon: MessageSquare, title: "24/7 Support", desc: "Get help whenever you need it" },
              { icon: Laptop, title: "Multi-Platform", desc: "Learn on any device, anywhere" },
            ].map((f, i) => (
              <div key={i} className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:shadow-edu transition-all duration-300 hover:-translate-y-1 animate-slide-up">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Stats, CTA, Footer --- */}
      <section ref={statsRef} className="w-full py-12 md:py-24 bg-muted/50 animate-slide-up">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><div className="text-3xl font-bold text-primary">10,000+</div><div className="text-sm text-muted-foreground">Active Students</div></div>
            <div><div className="text-3xl font-bold text-primary">500+</div><div className="text-sm text-muted-foreground">Study Hours</div></div>
            <div><div className="text-3xl font-bold text-primary">4.9★</div><div className="text-sm text-muted-foreground">Student Rating</div></div>
            <div><div className="text-3xl font-bold text-primary">95%</div><div className="text-sm text-muted-foreground">Success Rate</div></div>
          </div>
        </div>
      </section>

      <section ref={ctaRef} className="w-full py-16 md:py-28 lg:py-36 bg-gradient-to-r from-primary/10 to-secondary/10 animate-slide-up">
        <div className="container px-4 md:px-6 text-center space-y-8">
          <h2 className="text-3xl font-bold md:text-5xl">Ready to Excel in Your Board Exams?</h2>
          <p className="text-muted-foreground text-lg md:text-xl">Join thousands of students preparing smarter with Kalika.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="animate-bounce-slow" asChild><Link href="/register">Start Free Trial</Link></Button>
            <Button variant="outline" size="lg" className="animate-bounce-slow delay-300" asChild><Link href="/login">Login</Link></Button>
          </div>
        </div>
      </section>

      <footer ref={footerRef} className="border-t bg-muted/30 animate-slide-up">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <BookOpen className="h-6 w-6" />
            <p className="text-center text-sm leading-loose md:text-left">© 2025 Kalika. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>

      {/* --- Global Animations --- */}
      <style jsx global>{`
        @keyframes float-book {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes float-pencil {
          0%, 100% { transform: translateY(0) rotate(1deg); }
          50% { transform: translateY(-10px) rotate(-3deg); }
        }
        @keyframes float-paper {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
        .animate-float-book { animation: float-book 6s ease-in-out infinite; }
        .animate-float-pencil { animation: float-pencil 5s ease-in-out infinite; }
        .animate-float-paper { animation: float-paper 7s ease-in-out infinite; }

        @keyframes float-circle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-25px) scale(1.05); }
        }
        @keyframes float-circle-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.03); }
        }
        @keyframes float-circle-rev {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(25px) scale(1.04); }
        }
        .animate-float-circle { animation: float-circle 8s ease-in-out infinite; }
        .animate-float-circle-slow { animation: float-circle-slow 10s ease-in-out infinite; }
        .animate-float-circle-rev { animation: float-circle-rev 9s ease-in-out infinite; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slideUp 1s ease forwards; }

        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow { animation: bounceSlow 3s ease-in-out infinite; }

        @keyframes tiltFloat {
          0%, 100% { transform: rotate(-1deg) translateY(0); }
          50% { transform: rotate(1deg) translateY(-5px); }
        }
        .animate-tilt-float { animation: tiltFloat 5s ease-in-out infinite; }

        @keyframes gradientText {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradientText 5s linear infinite alternate;
        }

        .hover\\:shadow-edu:hover {
          box-shadow: 0 8px 20px rgba(255, 0, 204, 0.2);
        }

        .animate-fade-header {
          animation: slideUp 0.8s ease both;
        }
      `}</style>
    </div>
  );
}
