"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { BookOpen, Brain, Laptop, Languages, Clock, MessageSquare, Trophy, MoveUp } from 'lucide-react';
import Image from 'next/image';

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
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
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Master NCERT Syllabus with Kalika
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Gamified learning for SSLC and 2nd PUC students. Prepare for board exams with AI assistance, regional language support, and personalized study plans.
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link href="/register">Get Started Free</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/demo">Watch Demo</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto relative">
              <div className="relative h-[400px] w-[350px] sm:w-[400px] rounded-xl overflow-hidden border shadow-xl">
                <Image 
                  src="https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg" 
                  alt="Student studying with digital device" 
                  fill 
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -left-4 h-24 w-32 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">10k+</div>
                  <div className="text-xs text-white">Students</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Everything You Need to Excel</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Kalika combines modern learning technology with traditional NCERT curriculum to create the perfect study companion.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-primary/20 p-2">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Gamified Learning</h3>
              <p className="text-center text-muted-foreground">
                Learn through games, quizzes, and challenges. Earn points and badges as you progress.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-primary/20 p-2">
                <Languages className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Regional Languages</h3>
              <p className="text-center text-muted-foreground">
                Study in your preferred language with support for multiple Indian regional languages.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-primary/20 p-2">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">AI Chatbot</h3>
              <p className="text-center text-muted-foreground">
                Get 24/7 assistance with your questions through our intelligent AI chatbot.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-primary/20 p-2">
                <Laptop className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Speech-to-Text</h3>
              <p className="text-center text-muted-foreground">
                Ask questions verbally and get detailed explanations for complex concepts.
              </p>
            </div>
            {/* Feature 5 */}
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-primary/20 p-2">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Pomodoro Timer</h3>
              <p className="text-center text-muted-foreground">
                Stay focused with integrated Pomodoro technique for optimal study sessions.
              </p>
            </div>
            {/* Feature 6 */}
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-primary/20 p-2">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Progress Tracking</h3>
              <p className="text-center text-muted-foreground">
                Monitor your learning journey with detailed analytics and performance insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Excel in Your Exams?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of students who are already preparing smarter with Kalika.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/register">Sign Up Now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <BookOpen className="h-6 w-6" />
            <p className="text-center text-sm leading-loose md:text-left">
              © 2025 Kalika. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm underline underline-offset-4">Terms</Link>
            <Link href="/privacy" className="text-sm underline underline-offset-4">Privacy</Link>
            <Link href="/contact" className="text-sm underline underline-offset-4">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}