"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

interface Question {
  id?: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

interface QuizTakerProps {
  subject: string;
  chapter: string;
  topic?: string;
  questions: Question[];
  onSubmit?: (results: QuizResult) => void;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  answers: (number | null)[];
  timestamp: Date;
  timeTaken: number;
  accuracy: number;
  wrongCount: number;
  analysis: string;
}

export default function QuizTaker({
  subject,
  chapter,
  topic,
  questions,
  onSubmit,
}: QuizTakerProps) {
  const timerRef = useRef<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 20 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCardPosition({ x: Math.max(20, window.innerWidth - 460), y: 20 });
    }
  }, []);

  useEffect(() => {
    if (isSubmitted) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      const timeout = window.setTimeout(() => setResultVisible(true), 100);
      return () => window.clearTimeout(timeout);
    }

    timerRef.current = window.setInterval(() => setTimeSpent(prev => prev + 1), 1000);
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isSubmitted]);

  const handleDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragStart({
      x: event.clientX - cardPosition.x,
      y: event.clientY - cardPosition.y,
    });
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDragMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart) return;

    const nextX = Math.max(0, Math.min(event.clientX - dragStart.x, window.innerWidth - 440));
    const nextY = Math.max(0, event.clientY - dragStart.y);
    setCardPosition({ x: nextX, y: nextY });
  };

  const handleDragEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragStart(null);
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmitQuiz = () => {
    const score = answers.reduce((count, answer, index) => {
      return answer === questions[index].correct_answer ? count + 1 : count;
    }, 0);

    const wrongCount = questions.length - score;
    const accuracy = questions.length > 0 ? (score / questions.length) * 100 : 0;
    const analysis = wrongCount === 0
      ? 'Excellent work! You answered every question correctly. Keep practicing to maintain your mastery.'
      : `You answered ${score} out of ${questions.length} correctly. Review the explanations for the ${wrongCount} incorrect question${wrongCount > 1 ? 's' : ''} and focus on the concepts you found difficult.`;

    setIsSubmitted(true);
    setResultVisible(false);
    setShowExplanation(false);

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (onSubmit) {
      onSubmit({
        score,
        totalQuestions: questions.length,
        answers,
        timestamp: new Date(),
        timeTaken: timeSpent,
        accuracy: parseFloat(accuracy.toFixed(1)),
        wrongCount,
        analysis,
      });
    }
  };

  const calculateScore = () => {
    return answers.reduce((count, answer, index) => {
      return answer === questions[index].correct_answer ? count + 1 : count;
    }, 0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQ = questions[currentQuestion];
  const currentAnswer = answers[currentQuestion];
  const isAnswered = currentAnswer !== null;
  const isCorrect = currentAnswer === currentQ?.correct_answer;
  const wrongCount = questions.length - calculateScore();
  const accuracy = questions.length > 0 ? (calculateScore() / questions.length) * 100 : 0;

  if (!currentQ) {
    return <div>No questions available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{subject}</h2>
              <p className="text-sm text-muted-foreground">{chapter}{topic ? ` - ${topic}` : ""}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <Clock className="h-4 w-4 inline mr-2" />
                <span>{formatTime(timeSpent)}</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{calculateScore()}/{questions.length}</p>
                <p className="text-xs text-muted-foreground">Score</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={(currentQuestion / questions.length) * 100} />
          <p className="text-sm text-muted-foreground mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{currentQ.question}</CardTitle>
            <Badge variant="outline">Question {currentQuestion + 1}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Answer Options */}
          <RadioGroup
            value={currentAnswer?.toString() ?? ""}
            onValueChange={(value) => handleAnswer(parseInt(value))}
            disabled={isSubmitted}
          >
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                    currentAnswer === index
                      ? isSubmitted
                        ? isCorrect
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : "border-primary bg-primary/5"
                      : isSubmitted && index === currentQ.correct_answer
                        ? "border-green-500 bg-green-50"
                        : "border-input hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-base">{String.fromCharCode(65 + index)}.</span>
                      <span>{option}</span>
                      {isSubmitted && currentAnswer === index && !isCorrect && (
                        <XCircle className="h-4 w-4 text-red-500 ml-auto" />
                      )}
                      {isSubmitted && index === currentQ.correct_answer && (
                        <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          {/* Explanation */}
          {isSubmitted && showExplanation && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                <p className="font-semibold mb-2">Explanation:</p>
                <p>{currentQ.explanation}</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                ← Previous
              </Button>
              <Button
                variant="outline"
                onClick={handleNext}
                disabled={currentQuestion === questions.length - 1}
              >
                Next →
              </Button>
            </div>

            {!isSubmitted && currentQuestion === questions.length - 1 && (
              <div className="flex gap-2">
                <Button onClick={handleSubmitQuiz} className="bg-green-600 hover:bg-green-700">
                  Submit Quiz
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isSubmitted && (
        <div
          className={`fixed z-50 transition duration-500 ease-out ${resultVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-6 scale-95'}`}
          style={{
            top: cardPosition.y,
            left: cardPosition.x,
            width: 'min(100%, 420px)',
          }}
        >
          <Card className="border-emerald-200 bg-emerald-50 shadow-2xl">
            <div
              className={`flex items-center justify-between gap-2 rounded-t-2xl border-b border-emerald-200 bg-emerald-100 px-4 py-3 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onPointerDown={handleDragStart}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
            >
              <div>
                <p className="text-sm font-semibold text-slate-700">Drag to move</p>
                <p className="text-xs text-slate-500">Move this card out of the way whenever you need.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setResultVisible(false)}>
                Close
              </Button>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">Quiz Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-emerald-200 bg-white p-4">
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="text-2xl font-semibold">{calculateScore()}/{questions.length}</p>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-white p-4">
                  <p className="text-sm text-muted-foreground">Time Taken</p>
                  <p className="text-2xl font-semibold">{formatTime(timeSpent)}</p>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-white p-4">
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                  <p className="text-2xl font-semibold">{accuracy.toFixed(1)}%</p>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-white p-4">
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                  <p className="text-2xl font-semibold">{wrongCount}</p>
                </div>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-white p-4">
                <p className="font-semibold mb-2">Analysis</p>
                <p>{wrongCount === 0 ? 'Perfect score! Keep reviewing to stay sharp.' : `Review the explanations for the ${wrongCount} question${wrongCount > 1 ? 's' : ''} you missed and revisit the key concepts.`}</p>
              </div>

              {!showExplanation && (
                <div className="rounded-lg border border-emerald-200 bg-white p-4">
                  <p className="font-semibold mb-2">Review explanations</p>
                  <p className="text-sm text-muted-foreground mb-4">Tap the button below to reveal explanations for each question after submitting your quiz.</p>
                  <Button onClick={() => setShowExplanation(true)} className="w-full">
                    View Explanations
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Question Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Question Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-2">
            {questions.map((_, index) => (
              <Button
                key={index}
                variant={
                  currentQuestion === index
                    ? "default"
                    : answers[index] !== null
                      ? "secondary"
                      : "outline"
                }
                size="sm"
                onClick={() => {
                  setCurrentQuestion(index);
                  setShowExplanation(false);
                }}
                className="h-10 w-full"
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
