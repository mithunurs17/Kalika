"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Target, Clock, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function DashboardOverview() {
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

  // Aggregate stats
  const totalSubjects = progress.length;
  const totalChapters = progress.reduce((sum, p) => sum + (p.chapter ? 1 : 0), 0);
  const avgProgress = progress.length > 0 ? Math.round(progress.reduce((sum, p) => sum + (p.progress_percent || 0), 0) / progress.length) : 0;
  const totalPoints = progress.reduce((sum, p) => sum + (p.points || 0), 0);

  return (
    <div className="space-y-6">
      {/* Study Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : totalSubjects}</div>
            <p className="text-xs text-muted-foreground">
              Tracked subjects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chapters</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : totalChapters}</div>
            <p className="text-xs text-muted-foreground">
              Chapters tracked
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : `${avgProgress}%`}</div>
            <p className="text-xs text-muted-foreground">
              Across all subjects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : totalPoints}</div>
            <p className="text-xs text-muted-foreground">
              Earned so far
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subject Progress Bars */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(loading ? Array(3).fill(null) : progress).map((subject, idx) => (
          <Card key={subject ? subject.subject : idx} className="animate-fade-in-up">
            <CardHeader>
              <CardTitle>{subject ? subject.subject : '...'}</CardTitle>
              <CardDescription>
                {subject ? (subject.chapter ? `Chapter: ${subject.chapter}` : 'No chapter') : 'Loading...'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <Badge variant="secondary" className="text-xs">
                  {subject ? `${subject.progress_percent || 0}%` : '...'}
                </Badge>
              </div>
              <Progress value={subject ? subject.progress_percent : 0} className="h-2" />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">Points: {subject ? subject.points : '...'}</span>
                <span className="text-xs text-muted-foreground">Last updated: {subject ? (subject.last_updated ? new Date(subject.last_updated).toLocaleDateString() : '-') : '...'}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}