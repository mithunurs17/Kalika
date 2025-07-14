"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useEffect, useState } from "react";

function calculateStreak(progress: any[]) {
  // Get unique days with progress
  const days = Array.from(new Set(progress.map(p => p.last_updated && new Date(p.last_updated).toDateString()).filter(Boolean)));
  if (days.length === 0) return 0;
  // Sort descending
  days.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);
    const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function StudyStreakCard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      if (!user?.id) return;
      setLoading(true);
      const res = await fetch(`/api/progress?user_id=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress);
      }
      setLoading(false);
    }
    fetchProgress();
  }, [user?.id]);

  const streak = loading ? 0 : calculateStreak(progress);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
          <CardDescription>Consecutive days studied</CardDescription>
        </div>
        <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold">{loading ? '...' : streak}</span>
          <span className="text-xs text-muted-foreground">days</span>
        </div>
      </CardContent>
    </Card>
  );
}