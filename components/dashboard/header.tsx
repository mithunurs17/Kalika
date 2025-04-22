"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <div className="hidden md:block md:w-64">
        <h1 className="text-lg font-semibold">Welcome, {user?.name}</h1>
        <p className="text-sm text-muted-foreground">
          Points: {user?.points || 0}
        </p>
      </div>
      
      <div className="relative flex-1 md:max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:max-w-sm"
        />
      </div>
      
      <div className="flex items-center gap-2 md:ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[280px]">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-auto">
              <DropdownMenuItem className="cursor-pointer flex flex-col items-start">
                <div className="font-medium">Quiz Reminder</div>
                <div className="text-sm text-muted-foreground">
                  Your Physics quiz is scheduled for tomorrow
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  10 minutes ago
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex flex-col items-start">
                <div className="font-medium">Badge Earned</div>
                <div className="text-sm text-muted-foreground">
                  You earned the "Math Wizard" badge
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  2 hours ago
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex flex-col items-start">
                <div className="font-medium">Study Streak</div>
                <div className="text-sm text-muted-foreground">
                  You've maintained a 3-day study streak!
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  1 day ago
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/notifications" className="w-full cursor-pointer justify-center">
                View all notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-2">
              {user?.name?.split(" ")[0]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}