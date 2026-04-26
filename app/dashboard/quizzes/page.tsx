"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/providers/auth-provider";
import { BookCheck, Clock, Target, PlayCircle, Loader2, AlertCircle } from "lucide-react";
import BackToDashboardButton from "@/components/ui/back-to-dashboard";
import QuizTaker from "@/components/dashboard/quiz/quiz-taker";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Question {
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  pointsAwarded: number;
  timeTaken?: number;
  wrongCount?: number;
  analysis?: string;
}

export default function QuizzesPage() {
  const { user } = useAuth();
  const [mode, setMode] = useState<"select" | "taking" | "results">("select");
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [error, setError] = useState("");
  
  // Quiz generation state
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState("5");
  
  // Current quiz state
  const [currentQuestion, setCurrentQuestions] = useState<Question[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // Sample subjects and chapters for demonstration
  const subjects = [
    { name: "Mathematics", chapters: ["Real Numbers", "Polynomials", "Linear Equations", "Quadratic Equations"] },
    { name: "Physics", chapters: ["Motion", "Forces", "Energy", "Waves"] },
    { name: "Chemistry", chapters: ["Atomic Structure", "Chemical Bonding", "Reactions", "States of Matter"] },
    { name: "Biology", chapters: ["Cell Biology", "Genetics", "Evolution", "Ecology"] },
  ];

  useEffect(() => {
    fetchQuizzes();
  }, [user?.id]);

  async function fetchQuizzes() {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/quiz?user_id=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data.quizzes || []);
      }
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    }
    setLoading(false);
  }

  async function handleGenerateQuiz() {
    if (!selectedSubject || !selectedChapter) {
      setError("Please select subject and chapter");
      return;
    }

    setGeneratingQuiz(true);
    setError("");
    
    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject,
          chapter: selectedChapter,
          topic: selectedTopic,
          difficulty,
          count: parseInt(questionCount),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate quiz");
      }

      const data = await res.json();
      setCurrentQuestions(data.questions);
      setMode("taking");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate quiz");
    } finally {
      setGeneratingQuiz(false);
    }
  }

  async function handleQuizSubmit(result: any) {
    if (!user?.id) return;

    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          subject: selectedSubject,
          topic: selectedTopic || selectedChapter,
          answers: result.answers,
          correct_answers: currentQuestion.map((q) => q.correct_answer),
          difficulty,
          timeTaken: result.timeTaken,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuizResult(data);
        setMode("results");
        fetchQuizzes();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit quiz");
    }
  }

  function resetQuiz() {
    setMode("select");
    setSelectedSubject("");
    setSelectedChapter("");
    setSelectedTopic("");
    setQuizResult(null);
    setCurrentQuestions([]);
  }

  return (
    <div>
      <BackToDashboardButton />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <BookCheck className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Quizzes</h1>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Mode: Select Quiz */}
        {mode === "select" && (
          <div className="space-y-6">
            {/* Generate New Quiz Section */}
            <Card>
              <CardHeader>
                <CardTitle>Create New Quiz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((s) => (
                          <SelectItem key={s.name} value={s.name}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="chapter">Chapter</Label>
                    <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select chapter" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects
                          .find((s) => s.name === selectedSubject)
                          ?.chapters.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="topic">Topic (Optional)</Label>
                    <Input
                      id="topic"
                      placeholder="Specific topic"
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="count">Number of Questions</Label>
                    <Select value={questionCount} onValueChange={setQuestionCount}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleGenerateQuiz}
                  disabled={generatingQuiz || !selectedSubject || !selectedChapter}
                  className="w-full"
                >
                  {generatingQuiz ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Quiz...
                    </>
                  ) : (
                    "Generate Quiz"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Quizzes */}
            {quizzes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Quizzes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz) => (
                      <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{quiz.subject}</CardTitle>
                            <Badge>
                              {quiz.score}/{quiz.total_questions}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{quiz.topic}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <span>{new Date(quiz.date).toLocaleDateString()}</span>
                            {quiz.duration_seconds !== undefined && (
                              <span>Time: {Math.floor(quiz.duration_seconds / 60)}m {quiz.duration_seconds % 60}s</span>
                            )}
                            {quiz.difficulty && <span>Difficulty: {quiz.difficulty}</span>}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Mode: Taking Quiz */}
        {mode === "taking" && currentQuestion.length > 0 && (
          <QuizTaker
            subject={selectedSubject}
            chapter={selectedChapter}
            topic={selectedTopic}
            questions={currentQuestion}
            onSubmit={handleQuizSubmit}
          />
        )}

        {/* Mode: Results */}
        {mode === "results" && quizResult && (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl font-bold text-green-600">
                      {quizResult.percentage.toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Accuracy</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl font-bold text-blue-600">
                      {quizResult.score}/{quizResult.totalQuestions}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Correct Answers</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl font-bold text-purple-600">
                      +{quizResult.pointsAwarded}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Points Earned</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-slate-700">
                      {quizResult.timeTaken ? `${Math.floor(quizResult.timeTaken / 60)}m ${quizResult.timeTaken % 60}s` : "--"}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Time Taken</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-slate-700">
                      {quizResult.wrongCount ?? 0}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Incorrect Answers</p>
                  </CardContent>
                </Card>
              </div>

              {quizResult.analysis && (
                <Card className="border border-slate-200 bg-white">
                  <CardContent>
                    <p className="font-semibold">Analysis</p>
                    <p className="text-sm text-muted-foreground mt-2">{quizResult.analysis}</p>
                  </CardContent>
                </Card>
              )}

              <Button onClick={resetQuiz} className="w-full" size="lg">
                Take Another Quiz
              </Button>
            </CardContent>
          </Card>
        )}

        {loading && mode === "select" && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading quizzes...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 