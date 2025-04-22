"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PomodoroTimer } from "@/components/dashboard/study-sessions/pomodoro-timer";
import { StudyHistory } from "@/components/dashboard/study-sessions/study-history";
import { VoiceNotes } from "@/components/dashboard/study-sessions/voice-notes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, BarChart, Mic } from "lucide-react";

export function StudySessionsContent() {
  const [activeTab, setActiveTab] = useState("pomodoro");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Focused Study Sessions</CardTitle>
          <CardDescription>
            Use the Pomodoro Technique to maximize your study efficiency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pomodoro" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pomodoro" className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                <span className="hidden sm:inline">Pomodoro Timer</span>
                <span className="sm:hidden">Timer</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span className="hidden sm:inline">Study History</span>
                <span className="sm:hidden">History</span>
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span className="hidden sm:inline">Voice Notes</span>
                <span className="sm:hidden">Voice</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pomodoro" className="mt-6">
              <PomodoroTimer />
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              <StudyHistory />
            </TabsContent>
            
            <TabsContent value="voice" className="mt-6">
              <VoiceNotes />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}