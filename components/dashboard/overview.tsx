"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";

// Sample data - in a real app, this would come from an API
const studyData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 1.8 },
  { day: "Wed", hours: 3.2 },
  { day: "Thu", hours: 2.1 },
  { day: "Fri", hours: 2.8 },
  { day: "Sat", hours: 4.5 },
  { day: "Sun", hours: 3.6 },
];

// Sample subjects progress
const subjects = [
  { name: "Mathematics", progress: 75, color: "bg-chart-1" },
  { name: "Physics", progress: 62, color: "bg-chart-2" },
  { name: "Chemistry", progress: 48, color: "bg-chart-3" },
  { name: "Biology", progress: 55, color: "bg-chart-4" },
  { name: "English", progress: 87, color: "bg-chart-5" },
];

export function DashboardOverview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Weekly Study Hours</CardTitle>
          <CardDescription>
            Your study time distribution for the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={studyData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "#2d2d2d" : "#e5e5e5"}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fill: isDark ? "#e5e5e5" : "#374151" }}
                />
                <YAxis
                  tick={{ fill: isDark ? "#e5e5e5" : "#374151" }}
                  label={{
                    value: "Hours",
                    angle: -90,
                    position: "insideLeft",
                    fill: isDark ? "#e5e5e5" : "#374151",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1a1a1a" : "#fff",
                    border: `1px solid ${isDark ? "#2d2d2d" : "#e5e5e5"}`,
                    color: isDark ? "#e5e5e5" : "#374151",
                  }}
                />
                <Bar dataKey="hours" fill="hsl(var(--chart-1))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Subject Progress</CardTitle>
          <CardDescription>
            Your mastery level in each subject
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {subjects.map((subject) => (
              <div key={subject.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{subject.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {subject.progress}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className={`h-2 rounded-full ${subject.color}`}
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}