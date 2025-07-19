"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Clock, Target, CheckCircle, PlayCircle, FileText } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

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

export default function SyllabusPage() {
  const { user } = useAuth();
  const [syllabus, setSyllabus] = useState<SyllabusData>({});
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("10th Grade (SSLC)");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  useEffect(() => {
    fetchSyllabus();
    // eslint-disable-next-line
  }, []);

  const fetchSyllabus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/syllabus');
      if (response.ok) {
        const data = await response.json();
        setSyllabus(data.syllabus);

        // Set default class and subject for user's class
        let classToSelect = selectedClass;
        if (user?.class && data.syllabus[user.class]) {
          classToSelect = user.class;
        } else if (Object.keys(data.syllabus).length > 0) {
          classToSelect = Object.keys(data.syllabus)[0];
        }
        setSelectedClass(classToSelect);

        const subjects = Object.keys(data.syllabus[classToSelect] || {});
        if (subjects.length > 0) {
          setSelectedSubject(subjects[0]);
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
      'Economics': '💰'
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
      'Biology': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    };
    return colors[subject] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading syllabus...</p>
          </div>
        </div>
      </div>
    );
  }

  const availableClasses = Object.keys(syllabus);
  const currentClassSyllabus = syllabus[selectedClass] || {};
  const subjects = Object.keys(currentClassSyllabus);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Syllabus</h1>
      </div>

      {/* Class Selection */}
      {availableClasses.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {availableClasses.map((classKey) => (
                <Button
                  key={classKey}
                  variant={selectedClass === classKey ? "default" : "outline"}
                  onClick={() => setSelectedClass(classKey)}
                >
                  {classKey}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Syllabus Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <p className="text-xs text-muted-foreground">Total subjects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chapters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subjects.reduce((total, subject) => total + currentClassSyllabus[subject].length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total chapters</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subjects.reduce((total, subject) => 
                total + currentClassSyllabus[subject].reduce((subTotal, chapter) => subTotal + chapter.duration_hours, 0), 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Estimated hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Subject Tabs */}
      <Tabs value={selectedSubject} onValueChange={setSelectedSubject} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {subjects.map((subject) => (
            <TabsTrigger key={subject} value={subject} className="flex items-center gap-2">
              <span>{getSubjectIcon(subject)}</span>
              <span className="hidden sm:inline">{subject}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {subjects.map((subject) => (
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
                <Accordion type="single" collapsible className="w-full">
                  {currentClassSyllabus[subject].map((chapter) => (
                    <AccordionItem key={chapter.id} value={`chapter-${chapter.id}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
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
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        {/* Topics */}
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Topics Covered
                          </h4>
                          <div className="grid gap-2 md:grid-cols-2">
                            {chapter.topics.map((topic, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {topic}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Learning Objectives */}
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Learning Objectives
                          </h4>
                          <div className="space-y-2">
                            {chapter.learning_objectives.map((objective, index) => (
                              <div key={index} className="flex items-start gap-2 text-sm">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                <span>{objective}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Study Material
                          </Button>
                          <Button size="sm" variant="outline" className="flex items-center gap-2">
                            <PlayCircle className="h-4 w-4" />
                            Take Quiz
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Empty State */}
      {subjects.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Syllabus Available</h3>
              <p className="text-muted-foreground">
                Syllabus for {selectedClass} has not been uploaded yet.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 