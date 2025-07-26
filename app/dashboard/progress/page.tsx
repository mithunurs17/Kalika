"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import { BarChart2, TrendingUp, Target, BookOpen } from "lucide-react";
import BackToDashboardButton from "@/components/ui/back-to-dashboard";

export default function ProgressPage() {
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
        setProgress(data.progress || []);
      }
      setLoading(false);
    }
    fetchProgress();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading progress...</p>
        </div>
      </div>
    );
  }

  const totalSubjects = progress.length;
  const avgProgress = progress.length > 0 ? Math.round(progress.reduce((sum, p) => sum + (p.progress_percent || 0), 0) / progress.length) : 0;
  const totalPoints = progress.reduce((sum, p) => sum + (p.points || 0), 0);

  return (
    <div>
      <BackToDashboardButton />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Progress</h1>
        </div>

        {/* Progress Overview */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubjects}</div>
              <p className="text-xs text-muted-foreground">Tracked subjects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgProgress}%</div>
              <p className="text-xs text-muted-foreground">Across all subjects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPoints}</div>
              <p className="text-xs text-muted-foreground">Earned so far</p>
            </CardContent>
          </Card>
        </div>

        {/* Subject Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {progress.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Progress Data</h3>
                <p className="text-muted-foreground">
                  Start studying to see your progress here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {progress.map((subject, idx) => (
                  <div key={subject.id || idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="font-medium">{subject.subject}</span>
                        {subject.chapter && (
                          <Badge variant="outline" className="text-xs">
                            {subject.chapter}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{subject.progress_percent || 0}%</span>
                        <span className="text-xs text-muted-foreground">{subject.points || 0} pts</span>
                      </div>
                    </div>
                    <Progress value={subject.progress_percent || 0} className="h-2" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 