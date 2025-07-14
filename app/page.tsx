"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LandingPage } from "@/components/landing-page";

export default function Home() {
  const router = useRouter();
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const splashShown = sessionStorage.getItem("splashShown");
      if (!splashShown) {
        sessionStorage.setItem("splashShown", "true");
        router.replace("/splash");
      } else {
        setShowLanding(true);
      }
    }
  }, [router]);

  if (!showLanding) return null;
  return <LandingPage />;
}