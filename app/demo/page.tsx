"use client";

import { Play, BookOpen, Brain, MessageSquare, Clock, Trophy, Users, Target, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="container py-12 md:py-24 lg:py-32">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4 max-w-4xl mx-auto">
            <Badge variant="secondary" className="text-sm">
              Interactive Demo
            </Badge>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              See <span className="text-gradient">Kalika</span> in Action
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              Experience how our AI-powered learning platform transforms NCERT education for SSLC and 2nd PUC students
            </p>
          </div>
        </div>

        {/* Video Demo Section */}
        <div className="mx-auto max-w-5xl mt-16">
          <div className="aspect-video relative rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 border shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/90 text-primary-foreground shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer">
                  <Play className="h-10 w-10 ml-1" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-semibold">Watch Platform Demo</p>
                  <p className="text-muted-foreground">3:45 min • See all features in action</p>
                </div>
              </div>
            </div>
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>

        {/* Key Features Showcase */}
        <div className="mx-auto max-w-6xl mt-20">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Platform Features Demonstrated
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              See how each feature works together to create the ultimate learning experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="card-hover">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle>AI Study Assistant</CardTitle>
                <CardDescription>
                  Watch our intelligent chatbot help with complex questions
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>24/7 availability</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Multi-language support</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Step-by-step explanations</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle>Gamified Learning</CardTitle>
                <CardDescription>
                  Experience points, badges, and achievement system
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Progress tracking</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Leaderboards</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Reward system</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle>Smart Study Timer</CardTitle>
                <CardDescription>
                  Pomodoro technique with productivity insights
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Customizable sessions</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Focus tracking</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Break reminders</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-orange-500" />
                </div>
                <CardTitle>NCERT Syllabus</CardTitle>
                <CardDescription>
                  Complete coverage of board exam curriculum
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>SSLC & 2nd PUC</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>All subjects covered</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Exam-focused content</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-red-500" />
                </div>
                <CardTitle>Voice Learning</CardTitle>
                <CardDescription>
                  Ask questions verbally and get instant answers
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Speech-to-text</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Multi-language voice</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Natural conversation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-indigo-500" />
                </div>
                <CardTitle>Study Groups</CardTitle>
                <CardDescription>
                  Collaborate with peers and share knowledge
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Group discussions</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Shared resources</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Peer learning</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Testimonials Preview */}
        <div className="mx-auto max-w-4xl mt-20">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              What Students Say
            </h2>
            <p className="text-muted-foreground text-lg">
              Real feedback from students using Kalika
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">A</span>
                  </div>
                  <div>
                    <p className="font-semibold">Ananya, 10th Standard</p>
                    <p className="text-sm text-muted-foreground">Mathematics improved by 85%</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "The AI chatbot helped me understand complex algebra concepts that I was struggling with. My confidence has improved so much!"
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">R</span>
                  </div>
                  <div>
                    <p className="font-semibold">Rahul, 2nd PUC</p>
                    <p className="text-sm text-muted-foreground">Physics score: 92/100</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "The gamified learning approach made studying physics fun. I actually look forward to my study sessions now!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col items-center justify-center space-y-6 mt-20">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Join thousands of students who are already achieving better results with Kalika
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-base px-8 py-3" asChild>
              <Link href="/register">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 py-3" asChild>
              <Link href="/login">Login to Account</Link>
            </Button>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              No credit card required • 7-day free trial • Cancel anytime
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>10,000+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span>95% Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 