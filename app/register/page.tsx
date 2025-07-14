"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { RegisterForm } from "@/components/register-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function RegisterPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl md:text-2xl">Kalika</span>
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Create an account</h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Start your learning journey with Kalika
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 md:p-8 shadow-sm">
            <RegisterForm />
          </div>
          
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Login
              </Link>
            </p>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                ← Back to home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}