'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

interface User {
  u_id: number;
  email: string;
  fname: string;
  lname: string;
  phone: string;
  dob: string;
  gender: string;
  athlete?: { a_id: number; fitness_level: string };
  trainer?: { t_id: number; specialty: string; location: string; bio: string };
}

interface Achievement {
  u_id: number;
  ach_id: number;
  code: string;
  title: string;
  description: string;
  created_at: string;
}

const achievementIcons: Record<string, string> = {
  FIRST_WORKOUT: '🎉',
  WEEK_STREAK: '🔥',
  MONTH_STREAK: '💎',
  EARLY_BIRD: '🌅',
  NIGHT_OWL: '🦉',
  GOAL_CRUSHER: '🏆',
  FIVE_GOALS: '⭐',
  SOCIAL_BUTTERFLY: '🦋',
  CALORIE_BURNER: '🔥',
  CONSISTENT: '📅',
};

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('');

  useEffect(() => {
    if (authUser) fetchData();
  }, [authUser]);

  async function fetchData() {
    if (!authUser) return;
    try {
      const [userRes, achievementsRes] = await Promise.all([
        fetch(`/api/users/${authUser.id}`),
        fetch(`/api/user-achievements?user_id=${authUser.id}`)
      ]);
      const userData = await userRes.json();
      const achievementsData = await achievementsRes.json();
      setUser(userData);
      setFname(userData.fname || '');
      setLname(userData.lname || '');
      setPhone(userData.phone || '');
      setDob(userData.dob || '');
      setGender(userData.gender || '');
      setFitnessLevel(userData.athlete?.fitness_level || '');
      setAchievements(Array.isArray(achievementsData) ? achievementsData : []);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!authUser) return;
    await fetch(`/api/users/${authUser.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fname, lname, phone, dob, gender }),
    });

    if (user?.athlete) {
      await fetch(`/api/athletes/${authUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fitness_level: fitnessLevel }),
      });
    }

    toast.success('Profile updated!');
    setIsEditing(false);
    fetchData();
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center py-12">Unable to load profile</div>;
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />
        <CardContent className="relative pt-0 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex items-end gap-4 -mt-12">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl text-white font-bold shadow-xl border-4 border-background">
                {fname?.[0] || 'U'}
              </div>
              <div className="pb-1">
                <h1 className="text-2xl font-bold">{fname} {lname}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user.athlete && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 px-3 py-1">
                  {user.athlete.fitness_level}
                </Badge>
              )}
              <Button
                variant={isEditing ? 'default' : 'outline'}
                onClick={() => {
                  if (isEditing) {
                    handleSave();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className={isEditing ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' : ''}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
              {isEditing && (
                <Button variant="ghost" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Info */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">👤</span>
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wide">First Name</Label>
                {isEditing ? (
                  <Input value={fname} onChange={(e) => setFname(e.target.value)} className="h-10" />
                ) : (
                  <p className="font-medium">{user.fname || '-'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wide">Last Name</Label>
                {isEditing ? (
                  <Input value={lname} onChange={(e) => setLname(e.target.value)} className="h-10" />
                ) : (
                  <p className="font-medium">{user.lname || '-'}</p>
                )}
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wide">Email</Label>
              <p className="font-medium">{user.email}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wide">Phone</Label>
              {isEditing ? (
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-10" />
              ) : (
                <p className="font-medium">{user.phone || '-'}</p>
              )}
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wide">Date of Birth</Label>
                {isEditing ? (
                  <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="h-10" />
                ) : (
                  <p className="font-medium">{user.dob || '-'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wide">Gender</Label>
                {isEditing ? (
                  <Input value={gender} onChange={(e) => setGender(e.target.value)} className="h-10" />
                ) : (
                  <p className="font-medium">{user.gender || '-'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Athlete/Trainer Info */}
        <div className="space-y-6">
          {user.athlete && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">💪</span>
                  Athlete Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wide">Fitness Level</Label>
                  {isEditing ? (
                    <Input
                      value={fitnessLevel}
                      onChange={(e) => setFitnessLevel(e.target.value)}
                      placeholder="e.g., Beginner, Intermediate, Advanced"
                      className="h-10"
                    />
                  ) : (
                    <p className="font-medium">{user.athlete.fitness_level || '-'}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {user.trainer && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">🏋️</span>
                  Trainer Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wide">Specialty</Label>
                  <p className="font-medium">{user.trainer.specialty || '-'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wide">Location</Label>
                  <p className="font-medium">{user.trainer.location || '-'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wide">Bio</Label>
                  <p className="font-medium text-sm">{user.trainer.bio || '-'}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Achievements */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            Achievements
            <Badge variant="secondary" className="ml-2">{achievements.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {achievements.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <div
                  key={`${achievement.u_id}-${achievement.ach_id}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-lg">
                    {achievementIcons[achievement.code] || '🏅'}
                  </div>
                  <div>
                    <p className="font-bold">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🏆</div>
              <p className="text-muted-foreground">Complete workouts to earn achievements!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
