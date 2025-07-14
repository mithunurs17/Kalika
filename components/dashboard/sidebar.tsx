"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/providers/auth-provider";
import { BookOpen, BarChart2, Calendar, LayoutDashboard, BookText, GraduationCap, BookCheck, Medal, Settings, Clock, HelpCircle, ChevronLeft, ChevronRight, Trophy, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarItem {
  title: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
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
    badge: "New",
  },
  {
    title: "Study Sessions",
    icon: Clock,
    href: "/dashboard/study-sessions",
  },
  {
    title: "Quizzes",
    icon: BookCheck,
    href: "/dashboard/quizzes",
    badge: "3",
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
    title: "Achievements",
    icon: Trophy,
    href: "/dashboard/achievements",
  },
  {
    title: "Study Groups",
    icon: Users,
    href: "/dashboard/groups",
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
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.email) return;
      setLoading(true);
      const res = await fetch(`/api/user/profile?email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [user?.email]);

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <BookOpen className="h-6 w-6 text-primary" />
          {!collapsed && <span className="font-bold text-xl">Kalika</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="px-3 py-4">
          {/* Main Navigation */}
          <div className="mb-6">
            {!collapsed && (
              <div className="mb-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Main Menu
              </div>
            )}
            <nav className="grid gap-1">
              {mainItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors",
                    collapsed && "mx-auto",
                    pathname === item.href ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  {!collapsed && (
                    <div className="flex items-center justify-between w-full">
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge 
                          variant={pathname === item.href ? "secondary" : "default"} 
                          className="text-xs px-1.5 py-0.5"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  )}
                  {collapsed && item.badge && (
                    <Badge 
                      variant="default" 
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Secondary Navigation */}
          <div className="mb-4">
            {!collapsed && (
              <div className="mb-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Account
              </div>
            )}
            <nav className="grid gap-1">
              {secondaryItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors",
                    collapsed && "mx-auto",
                    pathname === item.href ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 bg-muted/50">
          <Avatar className="h-10 w-10">
            {loading ? (
              <AvatarFallback className="bg-primary/10 text-primary font-medium animate-pulse">...</AvatarFallback>
            ) : profile?.profile_picture ? (
              <AvatarImage src={profile.profile_picture} alt={profile.name} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {profile?.name ? profile.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "U"}
              </AvatarFallback>
            )}
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium truncate">{profile?.name || user?.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Class {profile?.class || user?.class}</span>
                <Badge variant="outline" className="text-xs">
                  {/* You can add points or other info here if needed */}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}