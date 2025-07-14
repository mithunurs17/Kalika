"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function StudyHistory() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      if (!user?.id) return;
      setLoading(true);
      const res = await fetch(`/api/progress?user_id=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data.progress || []);
      }
      setLoading(false);
    }
    fetchSessions();
  }, [user?.id]);

  // Sort by last_updated desc
  const sorted = [...sessions].sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime());
  const recent = sorted.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Study History</CardTitle>
        <CardDescription>Recent study sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-muted-foreground">
                <th className="px-2 py-1 text-left">Subject</th>
                <th className="px-2 py-1 text-left">Chapter</th>
                <th className="px-2 py-1 text-left">Progress</th>
                <th className="px-2 py-1 text-left">Points</th>
                <th className="px-2 py-1 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-4 text-center text-muted-foreground">Loading...</td></tr>
              ) : recent.length === 0 ? (
                <tr><td colSpan={5} className="py-4 text-center text-muted-foreground">No study sessions</td></tr>
              ) : (
                recent.map((session, idx) => (
                  <tr key={session.id || idx} className="border-b last:border-b-0">
                    <td className="px-2 py-1 font-medium flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />{session.subject || '-'}</td>
                    <td className="px-2 py-1">{session.chapter || '-'}</td>
                    <td className="px-2 py-1">{session.progress_percent ? `${session.progress_percent}%` : '-'}</td>
                    <td className="px-2 py-1">{session.points || '-'}</td>
                    <td className="px-2 py-1">{session.last_updated ? formatDateTime(session.last_updated) : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}