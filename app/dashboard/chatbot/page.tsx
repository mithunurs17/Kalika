import { ChatbotInterface } from "@/components/dashboard/chatbot/interface";

export default function ChatbotPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Chatbot Assistant</h1>
      <ChatbotInterface />
    </div>
  );
}