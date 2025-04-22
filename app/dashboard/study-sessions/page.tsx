import { StudySessionsContent } from "@/components/dashboard/study-sessions/content";

export default function StudySessionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Study Sessions</h1>
      <StudySessionsContent />
    </div>
  );
}