'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AchievementBadge } from '@/components/achievement-badge';
import { UserWithDetails, UserAchievementWithDetails } from '@/lib/types';
import { toast } from 'sonner';

const CURRENT_USER_ID = 1;

export default function ProfilePage() {
  const [user, setUser] = useState<UserWithDetails | null>(null);
  const [achievements, setAchievements] = useState<UserAchievementWithDetails[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('');

  useEffect(() => {
    fetchUser();
    fetchAchievements();
  }, []);

  async function fetchUser() {
    const res = await fetch(`/api/users/${CURRENT_USER_ID}`);
    const data = await res.json();
    setUser(data);
    setFname(data.fname || '');
    setLname(data.lname || '');
    setPhone(data.phone || '');
    setDob(data.dob || '');
    setGender(data.gender || '');
    setFitnessLevel(data.athlete?.fitness_level || '');
  }

  async function fetchAchievements() {
    const res = await fetch(`/api/user-achievements?user_id=${CURRENT_USER_ID}`);
    const data = await res.json();
    setAchievements(data);
  }

  async function handleSave() {
    // Update user info
    await fetch(`/api/users/${CURRENT_USER_ID}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fname, lname, phone, dob, gender }),
    });

    // Update athlete info if applicable
    if (user?.athlete) {
      await fetch(`/api/athletes/${CURRENT_USER_ID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fitness_level: fitnessLevel }),
      });
    }

    toast.success('Profile updated!');
    setIsEditing(false);
    fetchUser();
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account</p>
        </div>
        <Button
          variant={isEditing ? 'outline' : 'default'}
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                {isEditing ? (
                  <Input value={fname} onChange={(e) => setFname(e.target.value)} />
                ) : (
                  <p className="text-sm">{user.fname || '-'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                {isEditing ? (
                  <Input value={lname} onChange={(e) => setLname(e.target.value)} />
                ) : (
                  <p className="text-sm">{user.lname || '-'}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <p className="text-sm">{user.email}</p>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              {isEditing ? (
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              ) : (
                <p className="text-sm">{user.phone || '-'}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                {isEditing ? (
                  <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                ) : (
                  <p className="text-sm">{user.dob || '-'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                {isEditing ? (
                  <Input value={gender} onChange={(e) => setGender(e.target.value)} />
                ) : (
                  <p className="text-sm">{user.gender || '-'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Athlete Info */}
        {user.athlete && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Athlete Profile</CardTitle>
                <Badge>Athlete</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Fitness Level</Label>
                {isEditing ? (
                  <Input
                    value={fitnessLevel}
                    onChange={(e) => setFitnessLevel(e.target.value)}
                    placeholder="e.g., Beginner, Intermediate, Advanced"
                  />
                ) : (
                  <p className="text-sm">{user.athlete.fitness_level || '-'}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trainer Info */}
        {user.trainer && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Trainer Profile</CardTitle>
                <Badge variant="secondary">Trainer</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Specialty</Label>
                <p className="text-sm">{user.trainer.specialty || '-'}</p>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <p className="text-sm">{user.trainer.location || '-'}</p>
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <p className="text-sm">{user.trainer.bio || '-'}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Achievements ({achievements.length})</h2>
        {achievements.length > 0 ? (
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <AchievementBadge
                key={`${achievement.U_id}-${achievement.Ach_id}`}
                achievement={achievement}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No achievements yet. Keep working out!</p>
        )}
      </div>
    </div>
  );
}
