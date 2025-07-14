"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/providers/auth-provider";
import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

export function SyllabusProgressCard() {
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

  // Calculate overall syllabus progress (average of all subjects)
  const avgProgress = progress.length > 0 ? Math.round(progress.reduce((sum, p) => sum + (p.progress_percent || 0), 0) / progress.length) : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Syllabus Progress</CardTitle>
          <CardDescription>Overall completion</CardDescription>
        </div>
        <BookOpen className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold">{loading ? '...' : `${avgProgress}%`}</span>
          <span className="text-xs text-muted-foreground">{progress.length} subjects</span>
        </div>
        <Progress value={loading ? 0 : avgProgress} className="h-3" />
      </CardContent>
    </Card>
  );
}