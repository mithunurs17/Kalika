"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import { useEffect, useState } from "react";
import { Clock, BookOpen, CheckCircle } from "lucide-react";

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function RecentActivitiesCard() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      if (!user?.id) return;
      setLoading(true);
      const res = await fetch(`/api/progress?user_id=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data.progress || []);
      }
      setLoading(false);
    }
    fetchActivities();
  }, [user?.id]);

  // Sort by last_updated desc
  const sorted = [...activities].sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime());
  const recent = sorted.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Recent Activities</CardTitle>
          <CardDescription>Latest study sessions & progress</CardDescription>
        </div>
        <Clock className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {loading ? (
            <div className="text-muted-foreground text-sm">Loading...</div>
          ) : recent.length === 0 ? (
            <div className="text-muted-foreground text-sm">No recent activities</div>
          ) : (
            recent.map((activity, idx) => (
              <div key={activity.id || idx} className="flex items-center gap-3 border-b last:border-b-0 pb-2 last:pb-0">
                <BookOpen className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <div className="font-medium text-base">{activity.subject || 'Subject'}</div>
                  <div className="text-xs text-muted-foreground">{activity.chapter ? `Chapter: ${activity.chapter}` : ''}</div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted-foreground">{activity.last_updated ? formatDateTime(activity.last_updated) : '-'}</span>
                  <span className="text-xs text-green-600 flex items-center gap-1">{activity.progress_percent ? `${activity.progress_percent}%` : ''} <CheckCircle className="h-3 w-3" /></span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}