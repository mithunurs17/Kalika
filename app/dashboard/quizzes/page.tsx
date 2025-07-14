"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import { BookCheck, Clock, Target, PlayCircle } from "lucide-react";

export default function QuizzesPage() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <BookCheck className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Quizzes</h1>
      </div>

      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <BookCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Quizzes Available</h3>
              <p className="text-muted-foreground">
                Quizzes will appear here once they are generated for your subjects.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz, idx) => (
            <Card key={quiz.id || idx} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{quiz.subject || 'Quiz'}</CardTitle>
                  <Badge variant={quiz.status === 'completed' ? 'default' : 'secondary'}>
                    {quiz.status || 'Available'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{quiz.topic || ''}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Score:</span>
                    <span className="font-medium">
                      {quiz.score ? `${quiz.score}/${quiz.total_questions}` : 'Not taken'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Date:</span>
                    <span className="text-muted-foreground">
                      {quiz.date ? new Date(quiz.date).toLocaleDateString() : '-'}
                    </span>
                  </div>
                  <Button className="w-full" size="sm">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    {quiz.status === 'completed' ? 'Review Quiz' : 'Take Quiz'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 