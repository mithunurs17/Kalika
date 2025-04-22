"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/providers/auth-provider";
import { BookOpen, BarChart2, Calendar, MessageSquare, DivideIcon as LucideIcon, LayoutDashboard, BookText, GraduationCap, BookCheck, Medal, Settings, Clock, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarItem {
  title: string;
  icon: LucideIcon;
  href: string;
}

const mainItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Syllabus",
    icon: BookText,
    href: "/dashboard/syllabus",
  },
  {
    title: "Quizzes",
    icon: BookCheck,
    href: "/dashboard/quizzes",
  },
  {
    title: "Study Sessions",
    icon: Clock,
    href: "/dashboard/study-sessions",
  },
  {
    title: "Progress",
    icon: BarChart2,
    href: "/dashboard/progress",
  },
  {
    title: "Study Planner",
    icon: Calendar,
    href: "/dashboard/planner",
  },
  {
    title: "AI Chatbot",
    icon: MessageSquare,
    href: "/dashboard/chatbot",
  },
  {
    title: "Achievements",
    icon: Medal,
    href: "/dashboard/achievements",
  },
];

const secondaryItems: SidebarItem[] = [
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
  {
    title: "Help & Support",
    icon: HelpCircle,
    href: "/dashboard/support",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          {!collapsed && <span className="font-bold text-xl">Kalika</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-3 py-4">
          <div className="mb-4">
            {!collapsed && (
              <div className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
                Main
              </div>
            )}
            <nav className="grid gap-1">
              {mainItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", collapsed && "mx-auto")} />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mb-4">
            {!collapsed && (
              <div className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
                Settings
              </div>
            )}
            <nav className="grid gap-1">
              {secondaryItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", collapsed && "mx-auto")} />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </ScrollArea>
      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="relative h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground">{user?.class}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}