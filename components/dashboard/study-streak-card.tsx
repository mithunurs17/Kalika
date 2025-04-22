"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Flame } from "lucide-react";

export function StudyStreakCard() {
  // Mock data - in a real app, these would come from the backend
  const streakDays = 7;
  const totalStudyTime = "32h 15m";
  
  // Generate array of days for the last week
  const lastWeek = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return {
      date: d.getDate(),
      day: d.toLocaleString("default", { weekday: "short" }),
      didStudy: Math.random() > 0.3, // Randomly determine if studied that day for demo
    };
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Study Streak
        </CardTitle>
        <CardDescription>Your consistent learning record</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-3xl font-bold">{streakDays}</div>
            <div className="text-xs text-muted-foreground">Days streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{totalStudyTime}</div>
            <div className="text-xs text-muted-foreground">Total study time</div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">This week</span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {lastWeek.map((day) => (
              <div key={day.day} className="flex flex-col items-center">
                <div className="text-xs text-muted-foreground">{day.day}</div>
                <div className="text-xs">{day.date}</div>
                <div 
                  className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center ${
                    day.didStudy 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {day.didStudy && <Flame className="h-4 w-4" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}