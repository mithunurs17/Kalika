"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookCheck, Calendar } from "lucide-react";
import Link from "next/link";

interface Quiz {
  id: number;
  subject: string;
  title: string;
  date: string;
  timeLeft: string;
  difficulty: "easy" | "medium" | "hard";
}

// Mock data - in a real app, this would come from the backend
const upcomingQuizzes: Quiz[] = [
  {
    id: 1,
    subject: "Physics",
    title: "Wave Optics",
    date: "Tomorrow, 10:00 AM",
    timeLeft: "23h 45m",
    difficulty: "medium",
  },
  {
    id: 2,
    subject: "Mathematics",
    title: "Calculus Fundamentals",
    date: "Aug 15, 2:00 PM",
    timeLeft: "3d 4h",
    difficulty: "hard",
  },
  {
    id: 3,
    subject: "Chemistry",
    title: "Periodic Table",
    date: "Aug 18, 11:30 AM",
    timeLeft: "6d 2h",
    difficulty: "easy",
  },
];

export function UpcomingQuizzesCard() {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BookCheck className="h-5 w-5 text-primary" />
          Upcoming Quizzes
        </CardTitle>
        <CardDescription>Prepare for your scheduled assessments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingQuizzes.map((quiz) => (
            <div key={quiz.id} className="rounded-lg border p-3">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="mb-1">
                    {quiz.subject}
                  </Badge>
                  <h4 className="font-medium">{quiz.title}</h4>
                </div>
                <Badge className={getDifficultyColor(quiz.difficulty)}>
                  {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                </Badge>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {quiz.date}
                </div>
                <div className="text-xs font-medium text-orange-600 dark:text-orange-400">
                  {quiz.timeLeft} left
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/dashboard/quizzes">View All Quizzes</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}