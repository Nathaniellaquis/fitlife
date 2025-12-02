// Database types matching our schema

export interface User {
  U_id: number;
  email: string;
  password: string;
  fname: string | null;
  lname: string | null;
  phone: string | null;
  dob: string | null;
  gender: string | null;
  created_at: string;
  updated_at: string;
}

export interface Athlete {
  A_id: number;
  fitness_level: string | null;
}

export interface Trainer {
  T_id: number;
  specialty: string | null;
  location: string | null;
  bio: string | null;
}

export interface TrainerConnection {
  A_id: number;
  T_id: number;
  notes: string | null;
  created_at: string;
}

export interface PasswordReset {
  PR_id: number;
  U_id: number;
  token: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

export interface WorkoutSession {
  WS_id: number;
  U_id: number;
  session_date: string;
  notes: string | null;
  created_at: string;
}

export interface ExerciseType {
  ET_id: number;
  name: string;
  target_muscle_group: string | null;
}

export interface WorkoutSessionExercise {
  WS_id: number;
  ET_id: number;
  exercise_order: number | null;
  sets: number | null;
  reps: number | null;
  duration_min: number | null;
  weight: number | null;
  calories_burned: number | null;
  created_at: string;
  completed_at: string | null;
}

export interface Goal {
  G_id: number;
  title: string;
  description: string | null;
  date_earned: string | null;
}

export interface UserGoal {
  U_id: number;
  G_id: number;
  target_value: number | null;
  current_value: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  Ach_id: number;
  code: string;
  title: string;
  description: string | null;
}

export interface UserAchievement {
  U_id: number;
  Ach_id: number;
  created_at: string;
  updated_at: string;
}

// Extended types for API responses
export interface UserWithDetails extends User {
  athlete?: Athlete;
  trainer?: Trainer;
}

export interface TrainerWithUser extends Trainer {
  fname: string;
  lname: string;
  email: string;
}

export interface WorkoutWithExercises extends WorkoutSession {
  exercises: (WorkoutSessionExercise & { name: string; target_muscle_group: string })[];
}

export interface UserGoalWithDetails extends UserGoal {
  title: string;
  description: string | null;
}

export interface UserAchievementWithDetails extends UserAchievement {
  code: string;
  title: string;
  description: string | null;
}

export interface TrainerConnectionWithDetails extends TrainerConnection {
  trainer_name: string;
  trainer_specialty: string;
  athlete_name: string;
}
