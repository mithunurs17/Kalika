"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mic, Store as Stop, Play, Pause, Trash2, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface VoiceNote {
  id: string;
  title: string;
  subject: string;
  duration: string;
  date: string;
  audioUrl?: string; // Would be a blob URL in a real app
}

// Mock data for demo
const mockVoiceNotes: VoiceNote[] = [
  {
    id: "note1",
    title: "Wave Optics Explanation",
    subject: "Physics",
    duration: "2:35",
    date: "Today, 11:32 AM",
  },
  {
    id: "note2",
    title: "Integration by Parts",
    subject: "Mathematics",
    duration: "3:12",
    date: "Yesterday, 4:15 PM",
  },
  {
    id: "note3",
    title: "Organic Chemistry Reaction Mechanisms",
    subject: "Chemistry",
    duration: "4:47",
    date: "Aug 10, 2:30 PM",
  },
];

export function VoiceNotes() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>(mockVoiceNotes);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTitle, setRecordingTitle] = useState("");
  const [recordingSubject, setRecordingSubject] = useState("General");
  
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Speech-to-text recognition state - in a real app this would use the Web Speech API
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  // Update timer during recording
  useEffect(() => {
    if (isRecording) {
      recordingTimer.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
    }
    
    return () => {
      if (recordingTimer.current) clearInterval(recordingTimer.current);
    };
  }, [isRecording]);
  
  // Format seconds as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const startRecording = () => {
    // In a real app, we would use the MediaRecorder API here
    setIsRecording(true);
    setRecordingTime(0);
    setTranscript("");
    
    // Simulate speech recognition starting
    setIsListening(true);
    
    // Simulate text recognition during recording
    simulateSpeechRecognition();
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    setIsListening(false);
    
    // Add the new recording to the list
    if (recordingTime > 0) {
      const newNote: VoiceNote = {
        id: `note${Date.now()}`,
        title: recordingTitle || `Recording ${voiceNotes.length + 1}`,
        subject: recordingSubject,
        duration: formatTime(recordingTime),
        date: new Date().toLocaleString("en-US", {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        })
      };
      
      setVoiceNotes([newNote, ...voiceNotes]);
      
      // Reset the form
      setRecordingTitle("");
      setRecordingSubject("General");
    }
  };
  
  const togglePlayback = (noteId: string) => {
    // In a real app, this would control audio playback
    if (selectedNote === noteId && isPlaying) {
      setIsPlaying(false);
    } else {
      setSelectedNote(noteId);
      setIsPlaying(true);
    }
  };
  
  const deleteNote = (noteId: string) => {
    setVoiceNotes(voiceNotes.filter(note => note.id !== noteId));
    if (selectedNote === noteId) {
      setSelectedNote(null);
      setIsPlaying(false);
    }
  };
  
  // Simulate speech recognition with some educational content
  const simulateSpeechRecognition = () => {
    const texts = [
      "The photoelectric effect is a phenomenon where electrons are emitted from a material when it absorbs electromagnetic radiation...",
      "When studying wave optics, we need to understand interference, diffraction, and polarization...",
      "In calculus, integration by parts is a technique for evaluating the integral of a product of functions...",
      "The periodic table organizes elements based on their atomic number and electron configuration..."
    ];
    
    const selectedText = texts[Math.floor(Math.random() * texts.length)];
    
    // Simulate gradual text recognition
    const words = selectedText.split(" ");
    let currentIndex = 0;
    
    const recognitionInterval = setInterval(() => {
      if (currentIndex < words.length && isListening) {
        setTranscript(prev => prev + (prev ? " " : "") + words[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(recognitionInterval);
      }
    }, 300);
    
    return () => clearInterval(recognitionInterval);
  };
  
  return (
    <div className="space-y-6">
      {/* Speech-to-Text Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Speech-to-Text Notes</CardTitle>
          <CardDescription>
            Record voice notes and get them automatically transcribed
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Speak clearly into your microphone to record explanations, concepts, or study notes. 
            The system will automatically convert your speech to text while maintaining a voice 
            recording for future reference.
          </p>
        </CardContent>
      </Card>
      
      {/* Recording Controls */}
      <Card className={isRecording ? "border-red-500 dark:border-red-700" : ""}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            {isRecording ? (
              <>
                <span className="flex h-3 w-3 rounded-full bg-red-500"></span>
                Recording in Progress
              </>
            ) : (
              "New Voice Note"
            )}
          </CardTitle>
          <CardDescription>
            {isRecording 
              ? `Recording time: ${formatTime(recordingTime)}`
              : "Record a new concept explanation or study note"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  value={recordingTitle}
                  onChange={(e) => setRecordingTitle(e.target.value)}
                  placeholder="Give your recording a title"
                  disabled={isRecording}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select 
                  value={recordingSubject} 
                  onValueChange={setRecordingSubject}
                  disabled={isRecording}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isRecording && (
              <div className="space-y-2 rounded-lg border border-dashed bg-muted/50 p-4">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${isListening ? 'animate-pulse bg-green-500' : 'bg-muted-foreground'}`}></div>
                  <span className="text-sm text-muted-foreground">
                    {isListening ? "Listening..." : "Microphone inactive"}
                  </span>
                </div>
                <div className="rounded-lg bg-background p-3 text-sm">
                  {transcript || "Start speaking to see transcription..."}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="justify-between space-x-2">
          {isRecording ? (
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={stopRecording}
            >
              <Stop className="mr-2 h-4 w-4" />
              Stop Recording
            </Button>
          ) : (
            <Button 
              className="w-full" 
              onClick={startRecording}
            >
              <Mic className="mr-2 h-4 w-4" />
              Start Recording
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Saved Voice Notes */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Saved Voice Notes</h3>
        
        {voiceNotes.length > 0 ? (
          <div className="space-y-3">
            {voiceNotes.map((note) => (
              <Card key={note.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{note.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {note.subject}
                        </span>
                        <span>Duration: {note.duration}</span>
                        <span>•</span>
                        <span>{note.date}</span>
                      </div>
                    </div>
                    
                    <div className="flex mt-2 gap-2 sm:mt-0">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => togglePlayback(note.id)}
                      >
                        {selectedNote === note.id && isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => deleteNote(note.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
            <div className="text-center text-muted-foreground">
              <p>No voice notes yet</p>
              <p className="text-sm">Record your first voice note above</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}