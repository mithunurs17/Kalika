"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookCheck, BookOpen, Trophy, Timer } from "lucide-react";

// Mock data - in a real app, this would come from the backend
const activities = [
  {
    id: 1,
    type: "quiz",
    icon: BookCheck,
    title: "Completed Physics Quiz",
    score: "8/10",
    time: "2h ago",
  },
  {
    id: 2,
    type: "lesson",
    icon: BookOpen,
    title: "Studied Chemistry Chapter 3",
    duration: "45 mins",
    time: "4h ago",
  },
  {
    id: 3,
    type: "achievement",
    icon: Trophy,
    title: "Earned 'Chemistry Genius' Badge",
    points: "+50 pts",
    time: "Yesterday",
  },
  {
    id: 4,
    type: "pomodoro",
    icon: Timer,
    title: "Completed Pomodoro Session",
    duration: "25 mins",
    time: "Yesterday",
  },
];

export function RecentActivitiesCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Your latest learning activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`rounded-full p-2 ${getActivityColor(activity.type)}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{activity.title}</h4>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {activity.score && <span>Score: {activity.score}</span>}
                  {activity.duration && <span>Duration: {activity.duration}</span>}
                  {activity.points && <span>{activity.points}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get appropriate background color based on activity type
function getActivityColor(type: string): string {
  switch (type) {
    case "quiz":
      return "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300";
    case "lesson":
      return "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-300";
    case "achievement":
      return "bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-300";
    case "pomodoro":
      return "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300";
  }
}