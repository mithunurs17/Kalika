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
import { MessageSquare, Send, Mic, Volume as VolumeUp, VolumeX, Image as ImageIcon, HelpCircle, Sparkles, Languages } from "lucide-react";

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
  
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("english");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Stop speaking when component unmounts
  useEffect(() => {
    return () => {
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, []);
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);
    
    // Simulate AI thinking and response
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage.content, currentLanguage);
      
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: botResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsProcessing(false);

      // Auto-speak the response if text-to-speech is enabled
      if (isSpeaking) {
        speakText(botResponse);
      }
    }, 1500);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const toggleVoiceInput = () => {
    // In a real app, this would use the Web Speech API
    setIsListening(!isListening);
    
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        const phrases = [
          "What is the photoelectric effect?",
          "Explain Newton's laws of motion",
          "How do I solve quadratic equations?",
          "What are the main themes in Shakespeare's works?",
        ];
        
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        setInputValue(randomPhrase);
        setIsListening(false);
      }, 2000);
    }
  };

  const speakText = (text: string) => {
    if (speechSynthesis) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language based on current selection
      switch (currentLanguage) {
        case "hindi":
          utterance.lang = "hi-IN";
          break;
        case "kannada":
          utterance.lang = "kn-IN";
          break;
        case "tamil":
          utterance.lang = "ta-IN";
          break;
        case "telugu":
          utterance.lang = "te-IN";
          break;
        default:
          utterance.lang = "en-IN";
      }

      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1;
      
      speechSynthesis.speak(utterance);
    }
  };

  const toggleTextToSpeech = () => {
    setIsSpeaking(!isSpeaking);
    if (speechSynthesis && isSpeaking) {
      speechSynthesis.cancel(); // Stop any ongoing speech when disabling
    }
  };
  
  // Function to generate mock bot responses based on input
  const generateBotResponse = (input: string, language: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Define response templates for different languages
    const responses: {[key: string]: {[key: string]: string}} = {
      english: {
        default: "I'm not sure I understand that question. Could you rephrase it or ask something about your NCERT syllabus?",
        greeting: "Hello! How can I help you with your studies today?",
        photoelectric: "The photoelectric effect is a phenomenon where electrons are emitted from a material (usually a metal) when light shines on it. This effect demonstrates the particle nature of light, as explained by Einstein. The key points are:\n\n1. Electrons are only emitted if the frequency of light is above a threshold value, regardless of intensity\n2. The kinetic energy of the emitted electrons depends on the frequency of light, not its intensity\n3. The intensity of light only affects how many electrons are emitted\n\nThis is covered in Chapter 11 of Class 12 NCERT Physics.",
        newton: "Newton's three laws of motion form the basis of classical mechanics:\n\n1. First Law (Law of Inertia): An object will remain at rest or in uniform motion in a straight line unless acted upon by an external force.\n\n2. Second Law: The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass (F = ma).\n\n3. Third Law: For every action, there is an equal and opposite reaction.\n\nYou can find this in Chapter 5 of Class 11 NCERT Physics.",
        quadratic: "To solve quadratic equations of the form ax² + bx + c = 0:\n\n1. Using the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a\n\n2. By factoring: If you can write ax² + bx + c = (px + q)(rx + s) = 0, then x = -q/p or x = -s/r\n\n3. By completing the square: Rearrange to isolate x²\n\nExample: For x² - 5x + 6 = 0\nFactors of 6 that add up to -5 are -2 and -3\nSo (x-2)(x-3) = 0\nx = 2 or x = 3\n\nRefer to Chapter 4 of Class 10 NCERT Mathematics for more details.",
        shakespeare: "Shakespeare's major themes include:\n\n1. Power and ambition (Macbeth, Julius Caesar)\n2. Love and romance (Romeo and Juliet, A Midsummer Night's Dream)\n3. Betrayal and revenge (Hamlet, Othello)\n4. Appearance vs. reality (Twelfth Night, The Merchant of Venice)\n5. Fate and free will (Romeo and Juliet, Macbeth)\n\nShakespeare is part of the Class 10 and Class 12 English literature curriculum.",
      },
      hindi: {
        default: "मुझे यह प्रश्न समझ में नहीं आया। क्या आप इसे दोबारा पूछ सकते हैं या NCERT पाठ्यक्रम से संबंधित कुछ पूछ सकते हैं?",
        greeting: "नमस्ते! मैं आपकी पढ़ाई में कैसे मदद कर सकता हूँ?",
        photoelectric: "फोटोइलेक्ट्रिक प्रभाव एक घटना है जहां जब प्रकाश किसी सामग्री (आमतौर पर धातु) पर पड़ता है, तो इलेक्ट्रॉन उत्सर्जित होते हैं। यह प्रभाव प्रकाश के कण प्रकृति को दर्शाता है, जैसा कि आइंस्टाइन ने समझाया है।\n\nमुख्य बिंदु हैं:\n1. इलेक्ट्रॉन केवल तभी उत्सर्जित होते हैं जब प्रकाश की आवृत्ति एक सीमा मूल्य से अधिक होती है\n2. उत्सर्जित इलेक्ट्रॉनों की गतिज ऊर्जा प्रकाश की आवृत्ति पर निर्भर करती है\n3. प्रकाश की तीव्रता केवल इस बात को प्रभावित करती है कि कितने इलेक्ट्रॉन उत्सर्जित होते हैं\n\nयह कक्षा 12 NCERT भौतिकी के अध्याय 11 में शामिल है।",
        newton: "न्यूटन के गति के तीन नियम शास्त्रीय यांत्रिकी का आधार बनाते हैं:\n\n1. पहला नियम (जड़त्व का नियम): कोई वस्तु विराम अवस्था में या एक सीधी रेखा में एकसमान गति में बनी रहेगी जब तक कि उस पर कोई बाहरी बल कार्य न करे।\n\n2. दूसरा नियम: किसी वस्तु का त्वरण उस पर कार्य करने वाले शुद्ध बल के समानुपाती होता है और उसके द्रव्यमान के व्युत्क्रमानुपाती होता है (F = ma)।\n\n3. तीसरा नियम: हर क्रिया के लिए, एक समान और विपरीत प्रतिक्रिया होती है।\n\nआप इसे कक्षा 11 NCERT भौतिकी के अध्याय 5 में पा सकते हैं।",
      },
      kannada: {
        default: "ನನಗೆ ಆ ಪ್ರಶ್ನೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ಅದನ್ನು ಮತ್ತೊಮ್ಮೆ ಕೇಳಿ ಅಥವಾ NCERT ಪಠ್ಯಕ್ರಮಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಯಾವುದಾದರೂ ಕೇಳಿ.",
        greeting: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಅಧ್ಯಯನದಲ್ಲಿ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
      },
      tamil: {
        default: "அந்தக் கேள்வியைப் புரிந்துகொள்ள முடியவில்லை. அதை மீண்டும் கேட்கவும் அல்லது NCERT பாடத்திட்டத்தைப் பற்றி ஏதாவது கேட்கவும்.",
        greeting: "வணக்கம்! நான் உங்கள் படிப்பில் எப்படி உதவலாம்?",
      },
      telugu: {
        default: "ఆ ప్రశ్నను అర్థం చేసుకోలేకపోతున్నాను. దయచేసి దానిని మళ్లీ అడగండి లేదా NCERT సిలబస్‌కు సంబంధించిన ఏదైనా అడగండి.",
        greeting: "హలో! నేను మీ చదువులో ఎలా సహాయపడగలను?",
      },
    };
    
    // Default to English if the specified language isn't available
    const langResponses = responses[language] || responses.english;
    
    // Check for specific keywords in the input and return corresponding responses
    if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
      return langResponses.greeting || responses.english.greeting;
    } else if (lowerInput.includes("photoelectric") || lowerInput.includes("effect")) {
      return langResponses.photoelectric || responses.english.photoelectric;
    } else if (lowerInput.includes("newton") || lowerInput.includes("laws of motion")) {
      return langResponses.newton || responses.english.newton;
    } else if (lowerInput.includes("quadratic") || lowerInput.includes("equation")) {
      return langResponses.quadratic || responses.english.quadratic;
    } else if (lowerInput.includes("shakespeare") || lowerInput.includes("themes")) {
      return langResponses.shakespeare || responses.english.shakespeare;
    }
    
    return langResponses.default || responses.english.default;
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
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTextToSpeech}
              className={isSpeaking ? "bg-primary text-primary-foreground" : ""}
            >
              {isSpeaking ? <VolumeUp className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            
            <Select 
              value={currentLanguage} 
              onValueChange={setCurrentLanguage}
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
                  
                  {isProcessing && (
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
                        onClick={() => setInputValue(question)}
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
                  type="button"
                  onClick={toggleVoiceInput}
                  className={isListening ? "bg-primary text-primary-foreground" : ""}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <div className="relative flex-1">
                  <Input
                    placeholder="Type your message here..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
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
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isProcessing}
                >
                  <Send className="h-4 w-4" />
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