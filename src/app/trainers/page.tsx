'use client';

import { useState, useEffect } from 'react';
import { TrainerCard } from '@/components/trainer-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

interface TrainerWithUser {
  t_id: number;
  specialty: string | null;
  location: string | null;
  bio: string | null;
  fname: string;
  lname: string;
  email: string;
}

interface TrainerConnection {
  a_id: number;
  t_id: number;
  trainer_name: string;
  trainer_specialty: string;
  created_at: string;
}

export default function TrainersPage() {
  const { user } = useAuth();
  const [trainers, setTrainers] = useState<TrainerWithUser[]>([]);
  const [connections, setConnections] = useState<TrainerConnection[]>([]);

  useEffect(() => {
    if (user) {
      fetchTrainers();
      fetchConnections();
    }
  }, [user]);

  async function fetchTrainers() {
    const res = await fetch('/api/trainers');
    const data = await res.json();
    setTrainers(Array.isArray(data) ? data : []);
  }

  async function fetchConnections() {
    if (!user) return;
    const res = await fetch(`/api/trainer-connections?athlete_id=${user.id}`);
    const data = await res.json();
    setConnections(Array.isArray(data) ? data : []);
  }

  async function handleConnect(trainerId: number) {
    if (!user) return;
    const res = await fetch('/api/trainer-connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        A_id: user.id,
        T_id: trainerId,
        notes: '',
      }),
    });

    if (res.ok) {
      toast.success('Connected with trainer!');
      fetchConnections();
    } else {
      const error = await res.json();
      toast.error(error.error || 'Failed to connect');
    }
  }

  async function handleDisconnect(trainerId: number) {
    if (!user) return;
    const res = await fetch(
      `/api/trainer-connections?A_id=${user.id}&T_id=${trainerId}`,
      { method: 'DELETE' }
    );

    if (res.ok) {
      toast.success('Disconnected from trainer');
      fetchConnections();
    }
  }

  const connectedTrainerIds = connections.map((c) => c.t_id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trainers</h1>
        <p className="text-muted-foreground">Connect with fitness trainers</p>
      </div>

      {/* Current Connections */}
      {connections.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Trainers</h2>
          <div className="space-y-3">
            {connections.map((conn) => (
              <Card key={`${conn.a_id}-${conn.t_id}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{conn.trainer_name}</CardTitle>
                    <Badge>{conn.trainer_specialty}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Connected since {new Date(conn.created_at).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleDisconnect(conn.t_id)}
                    className="text-sm text-destructive hover:underline"
                  >
                    Disconnect
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Trainers */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Trainers</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trainers.map((trainer) => (
            <TrainerCard
              key={trainer.t_id}
              trainer={trainer}
              isConnected={connectedTrainerIds.includes(trainer.t_id)}
              onConnect={() => handleConnect(trainer.t_id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
