import { Lightbulb, Users, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-24 lg:py-32">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Kalika</h1>
          <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Revolutionizing education through technology and innovation
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="mx-auto max-w-3xl mt-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Our Story</h2>
          <p className="text-muted-foreground">
            Kalika was born from a simple yet powerful idea: to make quality education accessible to every student in India. 
            We recognized the challenges faced by students preparing for board exams and set out to create a solution that 
            combines the best of traditional NCERT curriculum with modern technology.
          </p>
          <p className="text-muted-foreground">
            Our journey began with a team of educators, technologists, and innovators who shared a common vision: to 
            transform the way students learn and prepare for their exams. Today, we're proud to serve thousands of 
            students across India, helping them achieve their academic goals through our innovative learning platform.
          </p>
        </div>
      </div>

      {/* Our Mission */}
      <div className="mx-auto max-w-5xl mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground">
              At Kalika, our mission is to empower students with the tools and resources they need to excel in their 
              academic journey. We believe that every student deserves access to quality education, regardless of their 
              background or location.
            </p>
            <p className="text-muted-foreground">
              Through our innovative platform, we're making learning more engaging, interactive, and effective. We're 
              committed to helping students not just pass their exams, but truly understand and master their subjects.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Our Vision</h2>
            <p className="text-muted-foreground">
              We envision a future where every student in India has access to personalized, high-quality education that 
              prepares them for success in their academic and professional lives. We're working towards creating a 
              learning ecosystem that adapts to each student's unique needs and learning style.
            </p>
            <p className="text-muted-foreground">
              By combining cutting-edge technology with proven educational methods, we're building a platform that 
              makes learning more accessible, engaging, and effective for students across the country.
            </p>
          </div>
        </div>
      </div>

      {/* Key Values */}
      <div className="mx-auto max-w-5xl mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="rounded-full bg-primary/20 p-3">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Innovation</h3>
            <p className="text-sm text-muted-foreground">
              Continuously improving our platform with the latest technology and educational methods
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="rounded-full bg-primary/20 p-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Accessibility</h3>
            <p className="text-sm text-muted-foreground">
              Making quality education available to students from all backgrounds
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="rounded-full bg-primary/20 p-3">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Excellence</h3>
            <p className="text-sm text-muted-foreground">
              Maintaining the highest standards in educational content and user experience
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="rounded-full bg-primary/20 p-3">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Impact</h3>
            <p className="text-sm text-muted-foreground">
              Making a real difference in students' academic performance and future success
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="flex justify-center mt-16">
        <Button size="lg" asChild>
          <Link href="/register">Join Our Journey</Link>
        </Button>
      </div>
    </div>
  );
} 