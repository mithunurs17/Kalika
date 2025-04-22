"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

// Mock data for study session history
const last30Days = [...Array(30)].map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - 29 + i);
  
  // Generate some realistic study data with weekends having slightly more time
  let studyMinutes = 0;
  if (d.getDay() === 0 || d.getDay() === 6) {
    // Weekends
    studyMinutes = Math.floor(Math.random() * 120) + 60; // 1-3 hours
  } else {
    // Weekdays
    studyMinutes = Math.floor(Math.random() * 60) + 30; // 0.5-1.5 hours
  }
  
  return {
    date: d.toLocaleDateString("en-US", { month: 'short', day: 'numeric' }),
    minutes: studyMinutes,
    sessions: Math.floor(studyMinutes / 25) // Roughly one pomodoro per 25 mins
  };
});

// Recent detailed sessions
const recentSessions = [
  {
    id: 1,
    date: "Today",
    time: "10:30 AM - 11:55 AM",
    duration: "1h 25m",
    subject: "Physics",
    topic: "Wave Optics",
    completedPomodoros: 3,
  },
  {
    id: 2,
    date: "Yesterday",
    time: "4:15 PM - 5:45 PM",
    duration: "1h 30m",
    subject: "Mathematics",
    topic: "Integration",
    completedPomodoros: 3,
  },
  {
    id: 3,
    date: "Aug 10, 2023",
    time: "6:00 PM - 7:30 PM",
    duration: "1h 30m",
    subject: "Chemistry",
    topic: "Organic Chemistry Basics",
    completedPomodoros: 3,
  },
  {
    id: 4,
    date: "Aug 9, 2023",
    time: "11:00 AM - 12:15 PM",
    duration: "1h 15m",
    subject: "Biology",
    topic: "Cell Structure",
    completedPomodoros: 3,
  },
];

export function StudyHistory() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Calculate some stats
  const totalHours = Math.round(last30Days.reduce((acc, day) => acc + day.minutes, 0) / 60);
  const totalSessions = last30Days.reduce((acc, day) => acc + day.sessions, 0);
  const averageDaily = Math.round(totalHours * 60 / 30);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Study Time (30 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours} hours</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions} sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Daily Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageDaily} minutes</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Study Time Trend</CardTitle>
          <CardDescription>
            Your study time distribution over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={last30Days}
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
                  dataKey="date"
                  tick={{ fill: isDark ? "#e5e5e5" : "#374151" }}
                  tickFormatter={(value, index) => index % 5 === 0 ? value : ''}
                />
                <YAxis
                  tick={{ fill: isDark ? "#e5e5e5" : "#374151" }}
                  label={{
                    value: "Minutes",
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
                  formatter={(value: number) => [`${value} minutes`, "Study Time"]}
                />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Study Sessions</CardTitle>
          <CardDescription>Your last few study sessions with details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div key={session.id} className="flex border-b pb-4 last:border-0 last:pb-0">
                <div className="mr-4 flex items-center justify-center rounded-full bg-primary/10 p-3">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="font-medium">
                      {session.subject}: {session.topic}
                    </h4>
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        {session.date}
                      </Badge>
                      <Badge>{session.duration}</Badge>
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {session.time} • {session.completedPomodoros} pomodoro sessions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}