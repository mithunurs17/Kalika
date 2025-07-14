"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/providers/auth-provider";
import { User, Mail, GraduationCap, Edit } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Info */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.profile_picture} />
                  <AvatarFallback>
                    {profile?.name?.charAt(0) || user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{profile?.name || user?.name}</h3>
                  <p className="text-muted-foreground">{profile?.email || user?.email}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={profile?.name || user?.name || ''} readOnly />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={profile?.email || user?.email || ''} readOnly />
                </div>
                <div>
                  <Label htmlFor="class">Class</Label>
                  <Input id="class" value={profile?.class || user?.class || ''} readOnly />
                </div>
              </div>

              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Study Sessions</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Quizzes Taken</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Points Earned</span>
                <span className="font-medium">0</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 