"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Clock, Target, CheckCircle, PlayCircle, FileText, GraduationCap, Users, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SyllabusData {
  [classKey: string]: {
    [subject: string]: Array<{
      id: number;
      chapter_name: string;
      chapter_number: number;
      topics: string[];
      learning_objectives: string[];
      duration_hours: number;
    }>;
  };
}

// Class configuration with colors and icons
const classConfig = {
  "10th Grade (SSLC)": {
    color: "bg-blue-500",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    icon: "🎓",
    description: "Secondary School Leaving Certificate",
    subjects: ["Mathematics", "Science", "Social Science", "English", "Kannada"],
    available: true
  },
  "11th Grade (1st PUC)": {
    color: "bg-green-500",
    textColor: "text-green-600",
    borderColor: "border-green-200",
    icon: "📚",
    description: "Pre-University Course - First Year",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"],
    available: false
  },
  "12th Grade (2nd PUC)": {
    color: "bg-purple-500",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    icon: "🎯",
    description: "Pre-University Course - Second Year",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"],
    available: false
  },
  "9th Grade": {
    color: "bg-orange-500",
    textColor: "text-orange-600",
    borderColor: "border-orange-200",
    icon: "📖",
    description: "Foundation for Higher Studies",
    subjects: ["Mathematics", "Science", "Social Science", "English", "Kannada"],
    available: false
  }
};

export function SyllabusShowcase() {
  const [syllabus, setSyllabus] = useState<SyllabusData>({});
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("10th Grade (SSLC)");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  useEffect(() => {
    fetchSyllabus();
  }, []);

  const fetchSyllabus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/syllabus');
      if (response.ok) {
        const data = await response.json();
        setSyllabus(data.syllabus);

        // Set default class and subject
        const availableClasses = Object.keys(data.syllabus);
        if (availableClasses.length > 0) {
          setSelectedClass(availableClasses[0]);
          const subjects = Object.keys(data.syllabus[availableClasses[0]] || {});
          if (subjects.length > 0) {
            setSelectedSubject(subjects[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching syllabus:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectIcon = (subject: string) => {
    const icons: { [key: string]: string } = {
      'Mathematics': '📐',
      'Science': '🔬',
      'Social Science': '🌍',
      'Physics': '⚡',
      'Chemistry': '🧪',
      'Biology': '🧬',
      'History': '📜',
      'Geography': '🗺️',
      'Political Science': '🏛️',
      'Economics': '💰',
      'English': '📝',
      'Kannada': 'ಕನ್ನಡ',
      'Computer Science': '💻'
    };
    return icons[subject] || '📚';
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      'Mathematics': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Science': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Social Science': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Physics': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Chemistry': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Biology': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      'English': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'Kannada': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Computer Science': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
    };
    return colors[subject] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  if (loading) {
    return (
      <section className="w-full py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading syllabus...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentClassSyllabus = syllabus[selectedClass] || {};
  const subjects = Object.keys(currentClassSyllabus);
  const currentClassConfig = classConfig[selectedClass as keyof typeof classConfig];

  return (
    <section className="w-full py-16 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
            Explore Our Syllabus
          </h2>
          <p className="max-w-[600px] text-muted-foreground text-lg">
            Discover comprehensive NCERT-aligned curriculum for all classes. Start your learning journey today.
          </p>
        </div>

        {/* Class Selection Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {Object.keys(classConfig).map((classKey) => {
            const config = classConfig[classKey as keyof typeof classConfig];
            const isSelected = selectedClass === classKey;
            const hasData = syllabus[classKey] && Object.keys(syllabus[classKey]).length > 0;
            
            return (
              <Card 
                key={classKey} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  isSelected ? 'ring-2 ring-primary' : ''
                } ${!hasData ? 'opacity-60' : ''}`}
                onClick={() => hasData && setSelectedClass(classKey)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg ${config.color} flex items-center justify-center text-white text-2xl`}>
                      {config.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{classKey}</CardTitle>
                      <p className="text-sm text-muted-foreground">{config.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subjects:</span>
                    <Badge variant="outline" className={config.textColor}>
                      {hasData ? Object.keys(syllabus[classKey] || {}).length : 0}
                    </Badge>
                  </div>
                  {!hasData && (
                    <p className="text-xs text-muted-foreground mt-2">Coming soon</p>
                  )}
                  {hasData && (
                    <div className="mt-3">
                      <Badge className={`${config.color} text-white`}>
                        Available
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selected Class Overview */}
        {currentClassConfig && subjects.length > 0 && (
          <Card className={`border-l-4 ${currentClassConfig.borderColor} mb-8`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl ${currentClassConfig.color} flex items-center justify-center text-white text-3xl`}>
                    {currentClassConfig.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{selectedClass}</CardTitle>
                    <p className="text-muted-foreground">{currentClassConfig.description}</p>
                  </div>
                </div>
                <Button asChild className="hidden md:flex">
                  <Link href="/register">
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{subjects.length}</div>
                    <div className="text-sm text-muted-foreground">Subjects</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">
                      {subjects.reduce((total, subject) => total + currentClassSyllabus[subject].length, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Chapters</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">
                      {subjects.reduce((total, subject) => 
                        total + currentClassSyllabus[subject].reduce((subTotal, chapter) => subTotal + chapter.duration_hours, 0), 0
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Study Hours</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">NCERT</div>
                    <div className="text-sm text-muted-foreground">Aligned</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subject Preview */}
        {subjects.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Subject Overview</h3>
              <p className="text-muted-foreground">Get a glimpse of what you'll learn</p>
            </div>
            
            <Tabs value={selectedSubject} onValueChange={setSelectedSubject} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {subjects.slice(0, 5).map((subject) => (
                  <TabsTrigger key={subject} value={subject} className="flex items-center gap-2">
                    <span>{getSubjectIcon(subject)}</span>
                    <span className="hidden sm:inline">{subject}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {subjects.slice(0, 5).map((subject) => (
                <TabsContent key={subject} value={subject} className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getSubjectIcon(subject)}</span>
                        <div>
                          <CardTitle className="text-xl">{subject}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {currentClassSyllabus[subject].length} chapters • {
                              currentClassSyllabus[subject].reduce((total, chapter) => total + chapter.duration_hours, 0)
                            } hours
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {currentClassSyllabus[subject].slice(0, 3).map((chapter) => (
                          <div key={chapter.id} className="flex items-center gap-3 p-3 rounded-lg border">
                            <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                              {chapter.chapter_number}
                            </Badge>
                            <div className="flex-1">
                              <div className="font-medium">{chapter.chapter_name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                {chapter.duration_hours} hours
                              </div>
                            </div>
                          </div>
                        ))}
                        {currentClassSyllabus[subject].length > 3 && (
                          <div className="text-center pt-2">
                            <p className="text-sm text-muted-foreground">
                              +{currentClassSyllabus[subject].length - 3} more chapters
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button size="lg" asChild className="text-base px-8 py-3">
            <Link href="/register">
              Start Your Learning Journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Join thousands of students already learning with Kalika
          </p>
        </div>
      </div>
    </section>
  );
} 