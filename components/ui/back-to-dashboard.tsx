"use client";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";

export default function BackToDashboardButton({ className = "" }) {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      className={`mb-4 flex items-center gap-2 ${className}`}
      onClick={() => router.push("/dashboard")}
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Dashboard
    </Button>
  );
} 