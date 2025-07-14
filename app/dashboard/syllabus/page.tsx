"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardSyllabusPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/syllabus");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to syllabus...</p>
      </div>
    </div>
  );
} 