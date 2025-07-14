"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import { useEffect, useState } from "react";
import { Calendar, Timer, CheckCircle, XCircle } from "lucide-react";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function UpcomingQuizzesCard() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuizzes() {
      if (!user?.id) return;
      setLoading(true);
      const res = await fetch(`/api/quiz?user_id=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data.quizzes || []);
      }
      setLoading(false);
    }
    fetchQuizzes();
  }, [user?.id]);

  // Filter for upcoming quizzes (date > today)
  const now = new Date();
  const upcoming = quizzes.filter(q => q.date && new Date(q.date) > now);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Upcoming Quizzes</CardTitle>
          <CardDescription>Don't miss your next test</CardDescription>
        </div>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {loading ? (
            <div className="text-muted-foreground text-sm">Loading...</div>
          ) : upcoming.length === 0 ? (
            <div className="text-muted-foreground text-sm">No upcoming quizzes</div>
          ) : (
            upcoming.map((quiz, idx) => (
              <div key={quiz.id || idx} className="flex items-center justify-between border-b last:border-b-0 pb-2 last:pb-0">
                <div>
                  <div className="font-medium text-base">{quiz.subject || 'Quiz'}</div>
                  <div className="text-xs text-muted-foreground">{quiz.topic || ''}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{quiz.date ? formatDate(quiz.date) : '-'}</span>
                  {quiz.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : quiz.status === 'missed' ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <Timer className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}