import { DashboardOverview } from "@/components/dashboard/overview";
import { StudyStreakCard } from "@/components/dashboard/study-streak-card";
import { RecentActivitiesCard } from "@/components/dashboard/recent-activities-card";
import { SyllabusProgressCard } from "@/components/dashboard/syllabus-progress-card";
import { UpcomingQuizzesCard } from "@/components/dashboard/upcoming-quizzes-card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <DashboardOverview />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StudyStreakCard />
        <RecentActivitiesCard />
        <SyllabusProgressCard />
        <UpcomingQuizzesCard />
      </div>
    </div>
  );
}