"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/");
    }, 3500);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0b1a] via-[#181a2f] to-[#1a1b3a] overflow-hidden">
      {/* Animated Blobs */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-pink-500 opacity-30 blur-3xl animate-blob1" />
      <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-blue-500 opacity-30 blur-3xl animate-blob2" />
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-purple-500 opacity-20 blur-2xl animate-blob3 -translate-x-1/2 -translate-y-1/2" />
      {/* Glowing Rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="w-[340px] h-[340px] rounded-full border-4 border-pink-400/30 animate-pulse-slow" />
        <div className="w-[420px] h-[420px] rounded-full border-2 border-blue-400/20 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slow" />
      </div>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 drop-shadow-lg text-center">
          Why Choose <span className="text-pink-400">Kalika</span>?
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl px-4">
          <div className="rounded-xl bg-[#181a2f]/80 border border-[#23243a] p-6 text-white shadow-xl backdrop-blur-md card-hover">
            <div className="text-pink-400 text-2xl font-bold mb-2">01</div>
            <div className="font-semibold mb-1">Personalized AI Learning</div>
            <div className="text-sm text-pink-100">Get tailored study plans and instant help from our AI chatbot, designed for NCERT students.</div>
          </div>
          <div className="rounded-xl bg-[#181a2f]/80 border border-[#23243a] p-6 text-white shadow-xl backdrop-blur-md card-hover">
            <div className="text-pink-400 text-2xl font-bold mb-2">02</div>
            <div className="font-semibold mb-1">Gamified Progress</div>
            <div className="text-sm text-pink-100">Earn points, badges, and rewards as you learn and stay motivated for your board exams.</div>
          </div>
          <div className="rounded-xl bg-[#181a2f]/80 border border-[#23243a] p-6 text-white shadow-xl backdrop-blur-md card-hover">
            <div className="text-pink-400 text-2xl font-bold mb-2">03</div>
            <div className="font-semibold mb-1">Regional Language Support</div>
            <div className="text-sm text-pink-100">Study in your preferred language—Kannada, Hindi, English, and more.</div>
          </div>
          <div className="rounded-xl bg-[#181a2f]/80 border border-[#23243a] p-6 text-white shadow-xl backdrop-blur-md card-hover">
            <div className="text-pink-400 text-2xl font-bold mb-2">04</div>
            <div className="font-semibold mb-1">Smart Analytics</div>
            <div className="text-sm text-pink-100">Track your progress with detailed analytics and personalized recommendations.</div>
          </div>
        </div>
      </div>
      {/* Fade overlay for style */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0b1a]/90 pointer-events-none" />
      {/* Keyframes for animation */}
      <style jsx global>{`
        @keyframes blob1 {
          0%, 100% { transform: scale(1) translate(0, 0); }
          33% { transform: scale(1.1) translate(30px, -20px); }
          66% { transform: scale(0.95) translate(-20px, 20px); }
        }
        @keyframes blob2 {
          0%, 100% { transform: scale(1) translate(0, 0); }
          33% { transform: scale(1.05) translate(-30px, 20px); }
          66% { transform: scale(1.1) translate(20px, -20px); }
        }
        @keyframes blob3 {
          0%, 100% { transform: scale(1) translate(-50%, -50%); }
          50% { transform: scale(1.08) translate(-55%, -45%); }
        }
        .animate-blob1 { animation: blob1 7s ease-in-out infinite; }
        .animate-blob2 { animation: blob2 8s ease-in-out infinite; }
        .animate-blob3 { animation: blob3 6s ease-in-out infinite; }
        .animate-spin-slow { animation: spin 18s linear infinite; }
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
} 