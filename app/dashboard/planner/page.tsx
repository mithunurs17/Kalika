"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Target, Plus } from "lucide-react";
import BackToDashboardButton from "@/components/ui/back-to-dashboard";

export default function PlannerPage() {
  return (
    <div>
      <BackToDashboardButton />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Study Planner</h1>
        </div>

        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Study Planner Coming Soon</h3>
              <p className="text-muted-foreground">
                Plan your study sessions and track your learning schedule.
              </p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create Study Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 