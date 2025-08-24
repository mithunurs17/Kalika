"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Clock, Target, CheckCircle, PlayCircle, FileText, GraduationCap, Users, Award } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import BackToDashboardButton from "@/components/ui/back-to-dashboard";

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
    subjects: ["Mathematics", "Science", "Social Science", "English", "Kannada"]
  },
  "11th Grade (1st PUC)": {
    color: "bg-green-500",
    textColor: "text-green-600",
    borderColor: "border-green-200",
    icon: "📚",
    description: "Pre-University Course - First Year",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"]
  },
  "12th Grade (2nd PUC)": {
    color: "bg-purple-500",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    icon: "🎯",
    description: "Pre-University Course - Second Year",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"]
  },
  "9th Grade": {
    color: "bg-orange-500",
    textColor: "text-orange-600",
    borderColor: "border-orange-200",
    icon: "📖",
    description: "Foundation for Higher Studies",
    subjects: ["Mathematics", "Science", "Social Science", "English", "Kannada"]
  }
};

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
  const currentClassConfig = classConfig[selectedClass as keyof typeof classConfig];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <BackToDashboardButton />
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Syllabus</h1>
      </div>

      {/* Class Selection Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Class Overview */}
      {currentClassConfig && (
        <Card className={`border-l-4 ${currentClassConfig.borderColor}`}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl ${currentClassConfig.color} flex items-center justify-center text-white text-3xl`}>
                {currentClassConfig.icon}
              </div>
              <div>
                <CardTitle className="text-2xl">{selectedClass}</CardTitle>
                <p className="text-muted-foreground">{currentClassConfig.description}</p>
              </div>
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

      {/* Subject Tabs */}
      {subjects.length > 0 && (
        <Tabs value={selectedSubject} onValueChange={setSelectedSubject} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
      )}

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