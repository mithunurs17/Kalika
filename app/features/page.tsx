import { Brain, Languages, MessageSquare, Laptop, Clock, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FeaturesPage() {
  return (
    <div className="container py-12 md:py-24 lg:py-32">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h1>
          <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Discover how Kalika revolutionizes your learning experience with cutting-edge features
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
        <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md text-center">
          <div className="rounded-full bg-primary/20 p-2">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Gamified Learning</h3>
          <p className="text-muted-foreground">
            Learn through games, quizzes, and challenges. Earn points and badges as you progress.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md text-center">
          <div className="rounded-full bg-primary/20 p-2">
            <Languages className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Regional Languages</h3>
          <p className="text-muted-foreground">
            Study in your preferred language with support for multiple Indian regional languages.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md text-center">
          <div className="rounded-full bg-primary/20 p-2">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold">AI Chatbot</h3>
          <p className="text-muted-foreground">
            Get 24/7 assistance with your questions through our intelligent AI chatbot.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md text-center">
          <div className="rounded-full bg-primary/20 p-2">
            <Laptop className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Speech-to-Text</h3>
          <p className="text-muted-foreground">
            Ask questions verbally and get detailed explanations for complex concepts.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md text-center">
          <div className="rounded-full bg-primary/20 p-2">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Pomodoro Timer</h3>
          <p className="text-muted-foreground">
            Stay focused with integrated Pomodoro technique for optimal study sessions.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md text-center">
          <div className="rounded-full bg-primary/20 p-2">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Progress Tracking</h3>
          <p className="text-muted-foreground">
            Monitor your learning journey with detailed analytics and performance insights.
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <Button size="lg" asChild>
          <Link href="/register">Get Started</Link>
        </Button>
      </div>
    </div>
  );
} 