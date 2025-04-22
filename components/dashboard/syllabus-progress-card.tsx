"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ArrowRightCircle } from "lucide-react";

interface SubjectProgress {
  id: number;
  name: string;
  progress: number;
  chaptersDone: number;
  totalChapters: number;
}

// Mock data - in a real app, this would come from the backend
const subjectProgress: SubjectProgress[] = [
  {
    id: 1,
    name: "Mathematics",
    progress: 68,
    chaptersDone: 8,
    totalChapters: 12,
  },
  {
    id: 2,
    name: "Physics",
    progress: 42,
    chaptersDone: 5,
    totalChapters: 12,
  },
  {
    id: 3,
    name: "Chemistry",
    progress: 33,
    chaptersDone: 4,
    totalChapters: 12,
  },
  {
    id: 4,
    name: "Biology",
    progress: 25,
    chaptersDone: 3,
    totalChapters: 12,
  },
];

export function SyllabusProgressCard() {
  // Calculate overall progress
  const overallProgress = Math.round(
    subjectProgress.reduce((acc, subject) => acc + subject.progress, 0) / subjectProgress.length
  );

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Syllabus Progress
            </CardTitle>
            <CardDescription>Track your curriculum completion</CardDescription>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold">{overallProgress}%</span>
            <span className="text-xs text-muted-foreground">Overall progress</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subjectProgress.map((subject) => (
            <div key={subject.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium">{subject.name}</h4>
                  <span className="text-xs text-muted-foreground">
                    {subject.chaptersDone}/{subject.totalChapters} chapters
                  </span>
                </div>
                <span className="text-sm font-medium">{subject.progress}%</span>
              </div>
              <Progress value={subject.progress} className="h-2" />
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-100 p-1 dark:bg-green-900">
              <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Continue where you left off</h4>
              <p className="text-xs text-muted-foreground">Physics Chapter 6: Wave Optics</p>
            </div>
          </div>
          <ArrowRightCircle className="h-5 w-5 text-primary cursor-pointer" />
        </div>
      </CardContent>
    </Card>
  );
}