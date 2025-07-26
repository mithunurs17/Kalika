"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Star } from "lucide-react";
import BackToDashboardButton from "@/components/ui/back-to-dashboard";

export default function AchievementsPage() {
  return (
    <div>
      <BackToDashboardButton />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Achievements</h1>
        </div>

        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Achievements Coming Soon</h3>
              <p className="text-muted-foreground">
                Earn badges and achievements as you progress in your studies.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 