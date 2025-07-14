"use client";

import Link from "next/link";
import { Bell, Search, Menu, User, Settings, LogOut, BookOpen } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
      {/* Mobile Menu Button */}
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>
      {/* Logo and Welcome - Hidden on mobile */}
      <div className="hidden md:flex md:w-64 items-center gap-3">
        <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Kalika</span>
        </Link>
      </div>
      {/* Search Bar */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search lessons, topics..."
          className="w-full rounded-lg bg-muted/50 pl-10 border-0 focus:bg-background transition-colors"
        />
      </div>
      {/* Right Side Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <ThemeToggle />
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                {loading ? (
                  <AvatarFallback className="bg-primary/10 text-primary font-medium animate-pulse">...</AvatarFallback>
                ) : profile?.profile_picture ? (
                  <AvatarImage src={profile.profile_picture} alt={profile.name} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {profile?.name ? getInitials(profile.name) : "U"}
                  </AvatarFallback>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.name || user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {profile?.email || user?.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    Class {profile?.class || user?.class || '10th'}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}