import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="container py-12 md:py-24 lg:py-32">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Pricing Plans</h1>
          <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Choose the perfect plan for your learning journey
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-12">
        {/* Free Plan */}
        <div className="rounded-lg border p-6 shadow-sm">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Free</h2>
            <p className="text-3xl font-bold">₹0<span className="text-muted-foreground text-lg">/month</span></p>
            <p className="text-muted-foreground">Perfect for trying out Kalika</p>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Basic NCERT content access</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Limited practice questions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Basic progress tracking</span>
            </div>
          </div>

          <Button className="w-full mt-6" variant="outline" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="rounded-lg border p-6 shadow-sm relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full">Most Popular</span>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Pro</h2>
            <p className="text-3xl font-bold">₹499<span className="text-muted-foreground text-lg">/month</span></p>
            <p className="text-muted-foreground">Best for serious students</p>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Full NCERT content access</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Unlimited practice questions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">AI chatbot assistance</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Speech-to-text support</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Detailed progress analytics</span>
            </div>
          </div>

          <Button className="w-full mt-6" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>

        {/* Premium Plan */}
        <div className="rounded-lg border p-6 shadow-sm">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Premium</h2>
            <p className="text-3xl font-bold">₹999<span className="text-muted-foreground text-lg">/month</span></p>
            <p className="text-muted-foreground">For the most dedicated learners</p>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Everything in Pro plan</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Personalized study plans</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Priority AI support</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Offline content access</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Parent progress reports</span>
            </div>
          </div>

          <Button className="w-full mt-6" variant="outline" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          All plans include a 7-day free trial. No credit card required.
        </p>
      </div>
    </div>
  );
} 