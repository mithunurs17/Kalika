"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Clock, Target, CheckCircle, PlayCircle, FileText, Users, Award, Progress } from "lucide-react";
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
    description: "Secondary School Leaving Certificate"
  },
  "11th Grade (1st PUC)": {
    color: "bg-green-500",
    textColor: "text-green-600",
    borderColor: "border-green-200",
    icon: "📚",
    description: "Pre-University Course - First Year"
  },
  "12th Grade (2nd PUC)": {
    color: "bg-purple-500",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    icon: "🎯",
    description: "Pre-University Course - Second Year"
  },
  "9th Grade": {
    color: "bg-orange-500",
    textColor: "text-orange-600",
    borderColor: "border-orange-200",
    icon: "📖",
    description: "Foundation for Higher Studies"
  }
};

export default function DashboardSyllabusPage() {
  const { user } = useAuth();
  const [syllabus, setSyllabus] = useState<SyllabusData>({});
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [userProgress, setUserProgress] = useState<{[key: string]: number}>({});

  useEffect(() => {
    console.log('Dashboard Syllabus - User:', user);
    console.log('Dashboard Syllabus - User class:', user?.class);
    
    if (user?.class) {
      fetchSyllabus();
      fetchUserProgress();
    } else {
      // If no class assigned, fetch all syllabus for browsing
      fetchAllSyllabus();
    }
  }, [user]);

  const fetchSyllabus = async () => {
    try {
      setLoading(true);
      console.log('Fetching syllabus for class:', user?.class);
      
      // Map user class names to syllabus class names
      const classMapping: { [key: string]: string } = {
        '10th': '10th Grade (SSLC)',
        '10th Grade': '10th Grade (SSLC)',
        '11th': '11th Grade (1st PUC)',
        '11th Grade': '11th Grade (1st PUC)',
        '12th': '12th Grade (2nd PUC)',
        '12th Grade': '12th Grade (2nd PUC)',
        '9th': '9th Grade',
        '9th Grade': '9th Grade'
      };
      
      const syllabusClassName = classMapping[user?.class || ''] || user?.class;
      console.log('Mapped class name:', syllabusClassName);
      
      const response = await fetch(`/api/syllabus?class=${encodeURIComponent(syllabusClassName)}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Syllabus API response:', data);
        setSyllabus(data.syllabus);

        // Set default subject
        const userClassSyllabus = data.syllabus[syllabusClassName] || {};
        const subjects = Object.keys(userClassSyllabus);
        console.log('Available subjects:', subjects);
        if (subjects.length > 0) {
          setSelectedSubject(subjects[0]);
        }
      } else {
        console.error('Syllabus API error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching syllabus:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSyllabus = async () => {
    try {
      setLoading(true);
      console.log('Fetching all syllabus...');
      const response = await fetch('/api/syllabus');
      if (response.ok) {
        const data = await response.json();
        console.log('All syllabus API response:', data);
        setSyllabus(data.syllabus);

        // Set default class and subject
        const availableClasses = Object.keys(data.syllabus);
        if (availableClasses.length > 0) {
          const defaultClass = availableClasses[0];
          const userClassSyllabus = data.syllabus[defaultClass] || {};
          const subjects = Object.keys(userClassSyllabus);
          if (subjects.length > 0) {
            setSelectedSubject(subjects[0]);
          }
        }
      } else {
        console.error('All syllabus API error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching all syllabus:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await fetch('/api/progress');
      if (response.ok) {
        const data = await response.json();
        setUserProgress(data.progress || {});
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
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

  const getChapterProgress = (subject: string, chapterId: number) => {
    const key = `${subject}-${chapterId}`;
    return userProgress[key] || 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <BackToDashboardButton />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your syllabus...</p>
          </div>
        </div>
      </div>
    );
  }

  // If user has no class assigned, show available syllabus
  if (!user?.class) {
    const availableClasses = Object.keys(syllabus);
    if (availableClasses.length === 0) {
      return (
        <div className="container mx-auto p-6">
          <BackToDashboardButton />
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Syllabus Available</h3>
              <p className="text-muted-foreground">
                No syllabus has been uploaded yet. Please contact your administrator.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Show first available class syllabus
    const defaultClass = availableClasses[0];
    const userClassSyllabus = syllabus[defaultClass] || {};
    const subjects = Object.keys(userClassSyllabus);
    const currentClassConfig = classConfig[defaultClass as keyof typeof classConfig];

    return (
      <div className="container mx-auto p-6 space-y-6">
        <BackToDashboardButton />
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Available Syllabus</h1>
        </div>

        {/* Class Assignment Notice */}
        <Card className="border-l-4 border-orange-200">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-orange-500 flex items-center justify-center text-white text-3xl">
                ⚠️
              </div>
              <div>
                <CardTitle className="text-2xl">Class Not Assigned</CardTitle>
                <p className="text-muted-foreground">You can browse the available syllabus below</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Welcome, {user?.name || user?.email}! Please contact your administrator to assign a class to your account.
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Show available syllabus */}
        {currentClassConfig && subjects.length > 0 && (
          <>
            <Card className={`border-l-4 ${currentClassConfig.borderColor}`}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl ${currentClassConfig.color} flex items-center justify-center text-white text-3xl`}>
                    {currentClassConfig.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{defaultClass}</CardTitle>
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
                        {subjects.reduce((total, subject) => total + userClassSyllabus[subject].length, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Chapters</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">
                        {subjects.reduce((total, subject) => 
                          total + userClassSyllabus[subject].reduce((subTotal, chapter) => subTotal + chapter.duration_hours, 0), 0
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

            {/* Subject Tabs */}
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
                            {userClassSyllabus[subject].length} chapters • {
                              userClassSyllabus[subject].reduce((total, chapter) => total + chapter.duration_hours, 0)
                            } hours
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {userClassSyllabus[subject].map((chapter) => (
                          <AccordionItem key={chapter.id} value={`chapter-${chapter.id}`}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center gap-3 text-left w-full">
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
          </>
        )}
      </div>
    );
  }

  // User has class assigned - show their specific syllabus
  const classMapping: { [key: string]: string } = {
    '10th': '10th Grade (SSLC)',
    '10th Grade': '10th Grade (SSLC)',
    '11th': '11th Grade (1st PUC)',
    '11th Grade': '11th Grade (1st PUC)',
    '12th': '12th Grade (2nd PUC)',
    '12th Grade': '12th Grade (2nd PUC)',
    '9th': '9th Grade',
    '9th Grade': '9th Grade'
  };
  
  const syllabusClassName = classMapping[user.class] || user.class;
  const userClassSyllabus = syllabus[syllabusClassName] || {};
  const subjects = Object.keys(userClassSyllabus);
  const currentClassConfig = classConfig[syllabusClassName as keyof typeof classConfig];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <BackToDashboardButton />
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">My Syllabus</h1>
      </div>

      {/* User's Class Overview */}
      {currentClassConfig && (
        <Card className={`border-l-4 ${currentClassConfig.borderColor}`}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl ${currentClassConfig.color} flex items-center justify-center text-white text-3xl`}>
                {currentClassConfig.icon}
              </div>
              <div>
                <CardTitle className="text-2xl">{user.class}</CardTitle>
                <p className="text-muted-foreground">{currentClassConfig.description}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Welcome back, {user.name || user.email}!
                </p>
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
                    {subjects.reduce((total, subject) => total + userClassSyllabus[subject].length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Chapters</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-semibold">
                    {subjects.reduce((total, subject) => 
                      total + userClassSyllabus[subject].reduce((subTotal, chapter) => subTotal + chapter.duration_hours, 0), 0
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
                        {userClassSyllabus[subject].length} chapters • {
                          userClassSyllabus[subject].reduce((total, chapter) => total + chapter.duration_hours, 0)
                        } hours
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {userClassSyllabus[subject].map((chapter) => {
                      const progress = getChapterProgress(subject, chapter.id);
                      return (
                        <AccordionItem key={chapter.id} value={`chapter-${chapter.id}`}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3 text-left w-full">
                              <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                                {chapter.chapter_number}
                              </Badge>
                              <div className="flex-1">
                                <div className="font-medium">{chapter.chapter_name}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                  <Clock className="h-3 w-3" />
                                  {chapter.duration_hours} hours
                                  {progress > 0 && (
                                    <>
                                      <span>•</span>
                                      <Progress value={progress} className="w-20 h-2" />
                                      <span className="text-xs">{progress}%</span>
                                    </>
                                  )}
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
                              {progress === 0 && (
                                <Button size="sm" className="flex items-center gap-2">
                                  Start Chapter
                                </Button>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
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
                Syllabus for {user.class} has not been uploaded yet.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 