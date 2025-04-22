"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

const TIMER_TYPES = {
  POMODORO: {
    name: "Focus",
    default: 25 * 60, // 25 minutes in seconds
    color: "bg-red-600 dark:bg-red-500",
  },
  SHORT_BREAK: {
    name: "Short Break",
    default: 5 * 60, // 5 minutes in seconds
    color: "bg-green-600 dark:bg-green-500",
  },
  LONG_BREAK: {
    name: "Long Break",
    default: 15 * 60, // 15 minutes in seconds
    color: "bg-blue-600 dark:bg-blue-500",
  },
};

export function PomodoroTimer() {
  const [timerType, setTimerType] = useState("POMODORO");
  const [timeLeft, setTimeLeft] = useState(TIMER_TYPES.POMODORO.default);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer completed
      if (!isMuted && audioRef.current) {
        audioRef.current.play().catch((e) => console.error("Audio play failed:", e));
      }
      
      setIsActive(false);
      
      // If a pomodoro session was completed, increment the counter
      if (timerType === "POMODORO") {
        setCompletedPomodoros((prev) => prev + 1);
        
        // Auto switch to break timer after pomodoro completes
        if (completedPomodoros % 4 === 3) {
          // After every 4 pomodoros, take a long break
          switchTimer("LONG_BREAK");
        } else {
          switchTimer("SHORT_BREAK");
        }
      } else {
        // After break, switch back to pomodoro
        switchTimer("POMODORO");
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, timerType, isMuted, completedPomodoros]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage for the circular timer
  const calculateProgress = () => {
    const totalTime = TIMER_TYPES[timerType as keyof typeof TIMER_TYPES].default;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(TIMER_TYPES[timerType as keyof typeof TIMER_TYPES].default);
  };

  const switchTimer = (type: string) => {
    setIsActive(false);
    setTimerType(type);
    setTimeLeft(TIMER_TYPES[type as keyof typeof TIMER_TYPES].default);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Get current timer type config
  const currentTimer = TIMER_TYPES[timerType as keyof typeof TIMER_TYPES];

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex gap-2">
        {Object.entries(TIMER_TYPES).map(([key, value]) => (
          <Button
            key={key}
            variant={timerType === key ? "default" : "outline"}
            onClick={() => switchTimer(key)}
            className={cn(
              "transition-all",
              timerType === key && "font-bold"
            )}
          >
            {value.name}
          </Button>
        ))}
      </div>
      
      {/* Circular Timer */}
      <div className="relative mb-6 flex h-64 w-64 items-center justify-center rounded-full border-4 border-muted bg-card">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(${currentTimer.color} ${calculateProgress()}%, transparent 0)`,
            mask: 'radial-gradient(transparent 55%, black 56%)',
            WebkitMask: 'radial-gradient(transparent 55%, black 56%)'
          }}
        />
        <div className="z-10 text-center">
          <div className="text-5xl font-bold">{formatTime(timeLeft)}</div>
          <div className="mt-2 text-xl font-medium">{currentTimer.name}</div>
        </div>
      </div>
      
      <div className="mt-2 flex gap-2">
        <Button
          size="lg"
          variant="outline"
          onClick={resetTimer}
          disabled={isActive && timeLeft > 0}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button 
          size="lg"
          onClick={toggleTimer}
          className={isActive ? "bg-red-600 hover:bg-red-700" : ""}
        >
          {isActive ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start
            </>
          )}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleMute}
          className="text-muted-foreground"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="mt-8 w-full max-w-md">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Session Stats</CardTitle>
            <CardDescription>Your current study session progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Completed Sessions</div>
                <div className="text-2xl font-bold">{completedPomodoros}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Focus Time</div>
                <div className="text-2xl font-bold">{Math.floor(completedPomodoros * 25)} min</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Current Cycle</div>
                <div className="text-2xl font-bold">{Math.floor(completedPomodoros / 4) + 1}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}