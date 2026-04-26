"use client";

import { useState, useEffect } from "react";
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
  answers: number[];
  timestamp: Date;
}

export default function QuizTaker({
  subject,
  chapter,
  topic,
  questions,
  onSubmit,
}: QuizTakerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTimeSpent(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
    setShowExplanation(false);
  };

  const handleShowExplanation = () => {
    setShowExplanation(true);
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

    setIsSubmitted(true);

    if (onSubmit) {
      onSubmit({
        score,
        totalQuestions: questions.length,
        answers,
        timestamp: new Date(),
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
          {(showExplanation || isSubmitted) && (
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

            {!isSubmitted && (
              <div className="flex gap-2">
                {!showExplanation && isAnswered && (
                  <Button onClick={handleShowExplanation} variant="secondary">
                    Show Explanation
                  </Button>
                )}
                {currentQuestion === questions.length - 1 && (
                  <Button onClick={handleSubmitQuiz} className="bg-green-600 hover:bg-green-700">
                    Submit Quiz
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
