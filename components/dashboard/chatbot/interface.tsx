"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Send, Mic, Volume as VolumeUp, VolumeX, Image as ImageIcon, HelpCircle, Sparkles, Languages, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hello! I'm your AI study assistant. I can help you understand NCERT concepts, solve problems, or answer any questions about your syllabus. What would you like to learn today?",
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("english");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log('Sending chat request:', { message: input, language });
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          language,
        }),
      });

      console.log('Chat response status:', response.status);

      if (!response.ok) {
        let errorMessage = `Failed to get response (Status: ${response.status})`;
        try {
          const errorText = await response.text();
          console.error('Chat API error response:', errorText);
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            errorMessage = errorText || errorMessage;
          }
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Chat response data:', data);
      
      if (!data.response) {
        throw new Error('Invalid response format from chatbot');
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response from the chatbot. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Speech recognition is not supported in your browser.",
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === "english" ? "en-US" : 
                      language === "hindi" ? "hi-IN" :
                      language === "kannada" ? "kn-IN" :
                      language === "tamil" ? "ta-IN" :
                      language === "telugu" ? "te-IN" : "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to recognize speech. Please try again.",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };
  
  // Suggested questions for quick access
  const suggestedQuestions = [
    "What is the photoelectric effect?",
    "Explain Newton's laws of motion",
    "How do I solve quadratic equations?",
    "What are the main themes in Shakespeare's works?",
  ];
  
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <Tabs defaultValue="chat" className="h-full flex flex-col">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Help
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Select 
              value={language} 
              onValueChange={setLanguage}
            >
              <SelectTrigger className="w-[180px] h-9">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  <SelectValue placeholder="Select language" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">Hindi</SelectItem>
                <SelectItem value="kannada">Kannada</SelectItem>
                <SelectItem value="tamil">Tamil</SelectItem>
                <SelectItem value="telugu">Telugu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="chat" className="flex-1 flex flex-col mt-0 border-none p-0">
          <Card className="flex-1 flex flex-col">
            <CardContent className="flex-1 p-4 overflow-hidden">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4 pt-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "assistant" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === "assistant"
                            ? "bg-muted text-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div
                          className={`mt-1 text-right text-xs ${
                            message.role === "assistant"
                              ? "text-muted-foreground"
                              : "text-primary-foreground/70"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg bg-muted px-4 py-2">
                        <div className="flex space-x-2">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            
            <div className="p-4 border-t">
              {messages.length === 1 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Suggested questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => setInput(question)}
                      >
                        {question}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={startListening}
                  disabled={isListening}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <div className="relative flex-1">
                  <Input
                    placeholder="Type your message here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isLoading}
                  />
                  {isListening && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-sm">Listening...</span>
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  size="icon"
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                  <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="help" className="h-full flex-1 mt-0 p-0">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                How to Use the Chatbot
              </CardTitle>
              <CardDescription>Get the most out of your AI study assistant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Ask about NCERT topics</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Ask specific questions about your textbook chapters</li>
                  <li>Request explanations for difficult concepts</li>
                  <li>Get help solving problems step-by-step</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Use voice input</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Click the microphone icon to start voice recognition</li>
                  <li>Speak clearly for better results</li>
                  <li>Review the transcribed text before sending</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Text-to-Speech</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Toggle the speaker icon to enable/disable text-to-speech</li>
                  <li>Bot responses will be read aloud when enabled</li>
                  <li>Available in multiple languages</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Change language</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Select your preferred language from the dropdown</li>
                  <li>Get explanations in your regional language</li>
                  <li>Switch between languages anytime</li>
                </ul>
              </div>
              
              <div className="rounded-lg border p-4 bg-primary/5">
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Example queries
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="rounded-md bg-background p-2 border">"Explain the concept of photosynthesis"</li>
                  <li className="rounded-md bg-background p-2 border">"How do I solve this equation: 2x² + 5x - 3 = 0?"</li>
                  <li className="rounded-md bg-background p-2 border">"What are the key features of Romanticism in literature?"</li>
                  <li className="rounded-md bg-background p-2 border">"Explain the periodic table structure"</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}