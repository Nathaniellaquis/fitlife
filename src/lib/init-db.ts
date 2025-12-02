import { sql } from '@vercel/postgres';

export async function initializeDatabase() {
  console.log('Initializing database...');

  // Create tables
  await sql`
    CREATE TABLE IF NOT EXISTS "user" (
      U_id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      fname TEXT,
      lname TEXT,
      phone TEXT,
      dob TEXT,
      gender TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS athlete (
      A_id INTEGER PRIMARY KEY REFERENCES "user"(U_id) ON DELETE CASCADE,
      fitness_level TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS trainer (
      T_id INTEGER PRIMARY KEY REFERENCES "user"(U_id) ON DELETE CASCADE,
      specialty TEXT,
      location TEXT,
      bio TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS trainer_connection (
      A_id INTEGER NOT NULL REFERENCES athlete(A_id) ON DELETE CASCADE,
      T_id INTEGER NOT NULL REFERENCES trainer(T_id) ON DELETE CASCADE,
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      PRIMARY KEY (A_id, T_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS password_reset (
      PR_id SERIAL PRIMARY KEY,
      U_id INTEGER NOT NULL REFERENCES "user"(U_id) ON DELETE CASCADE,
      token TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS workout_session (
      WS_id SERIAL PRIMARY KEY,
      U_id INTEGER NOT NULL REFERENCES "user"(U_id) ON DELETE CASCADE,
      session_date TEXT NOT NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS exercise_type (
      ET_id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      target_muscle_group TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS workout_session_exercise (
      WS_id INTEGER NOT NULL REFERENCES workout_session(WS_id) ON DELETE CASCADE,
      ET_id INTEGER NOT NULL REFERENCES exercise_type(ET_id),
      exercise_order INTEGER,
      sets INTEGER,
      reps INTEGER,
      duration_min INTEGER,
      weight REAL,
      calories_burned INTEGER,
      created_at TIMESTAMP DEFAULT NOW(),
      completed_at TIMESTAMP,
      PRIMARY KEY (WS_id, ET_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS goal (
      G_id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      date_earned TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS user_goal (
      U_id INTEGER NOT NULL REFERENCES "user"(U_id) ON DELETE CASCADE,
      G_id INTEGER NOT NULL REFERENCES goal(G_id) ON DELETE CASCADE,
      target_value REAL,
      current_value REAL DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      PRIMARY KEY (U_id, G_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS achievement (
      Ach_id SERIAL PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS user_achievement (
      U_id INTEGER NOT NULL REFERENCES "user"(U_id) ON DELETE CASCADE,
      Ach_id INTEGER NOT NULL REFERENCES achievement(Ach_id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      PRIMARY KEY (U_id, Ach_id)
    )
  `;

  // Create indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_workout_session_user ON workout_session(U_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_workout_session_date ON workout_session(session_date)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_workout_exercise_session ON workout_session_exercise(WS_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_user_goal_user ON user_goal(U_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_user_achievement_user ON user_achievement(U_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_trainer_connection_athlete ON trainer_connection(A_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_trainer_connection_trainer ON trainer_connection(T_id)`;

  console.log('Database initialized!');
}

export async function seedDatabase() {
  console.log('Seeding database...');

  // Check if data already exists
  const existingUsers = await sql`SELECT COUNT(*) as count FROM "user"`;
  if (Number(existingUsers.rows[0].count) > 0) {
    console.log('Database already has data, skipping seed.');
    return;
  }

  // Users
  await sql`
    INSERT INTO "user" (email, password, fname, lname, phone, dob, gender) VALUES
    ('jack@example.com', 'hashed_password_123', 'Jack', 'Smith', '555-0101', '1990-05-15', 'Male'),
    ('emma@example.com', 'hashed_password_123', 'Emma', 'Johnson', '555-0102', '1988-08-22', 'Female'),
    ('mike@example.com', 'hashed_password_123', 'Mike', 'Williams', '555-0103', '1985-03-10', 'Male'),
    ('sarah@example.com', 'hashed_password_123', 'Sarah', 'Davis', '555-0104', '1992-11-30', 'Female'),
    ('coach_tom@example.com', 'hashed_password_123', 'Tom', 'Anderson', '555-0105', '1980-01-20', 'Male')
  `;

  // Athletes
  await sql`
    INSERT INTO athlete (A_id, fitness_level) VALUES
    (1, 'Intermediate'),
    (2, 'Advanced'),
    (3, 'Beginner'),
    (4, 'Intermediate')
  `;

  // Trainers
  await sql`
    INSERT INTO trainer (T_id, specialty, location, bio) VALUES
    (5, 'Strength Training', 'Downtown Gym', 'Certified personal trainer with 10+ years experience in strength and conditioning.')
  `;

  // Exercise Types
  await sql`
    INSERT INTO exercise_type (name, target_muscle_group) VALUES
    ('Bench Press', 'Chest'),
    ('Squats', 'Legs'),
    ('Deadlift', 'Back'),
    ('Pull-ups', 'Back'),
    ('Shoulder Press', 'Shoulders'),
    ('Bicep Curls', 'Arms'),
    ('Tricep Dips', 'Arms'),
    ('Lunges', 'Legs'),
    ('Plank', 'Core'),
    ('Running', 'Cardio'),
    ('Cycling', 'Cardio'),
    ('Rowing', 'Full Body'),
    ('Lat Pulldown', 'Back'),
    ('Leg Press', 'Legs'),
    ('Calf Raises', 'Legs')
  `;

  // Goals
  await sql`
    INSERT INTO goal (title, description) VALUES
    ('Lose 10 lbs', 'Achieve a weight loss of 10 pounds'),
    ('Run 5K', 'Complete a 5 kilometer run'),
    ('Bench Press 200 lbs', 'Bench press 200 pounds for one rep'),
    ('100 Push-ups', 'Complete 100 push-ups in one session'),
    ('Workout 30 Days', 'Complete workouts for 30 consecutive days'),
    ('Squat Body Weight', 'Squat your body weight for 10 reps'),
    ('10K Steps Daily', 'Walk 10,000 steps every day for a week'),
    ('Flexibility Goal', 'Touch your toes without bending knees')
  `;

  // Achievements
  await sql`
    INSERT INTO achievement (code, title, description) VALUES
    ('FIRST_WORKOUT', 'First Steps', 'Completed your first workout'),
    ('WEEK_STREAK', 'Week Warrior', 'Worked out 7 days in a row'),
    ('MONTH_STREAK', 'Monthly Master', 'Worked out 30 days in a row'),
    ('EARLY_BIRD', 'Early Bird', 'Completed a workout before 6 AM'),
    ('NIGHT_OWL', 'Night Owl', 'Completed a workout after 10 PM'),
    ('GOAL_CRUSHER', 'Goal Crusher', 'Completed your first goal'),
    ('FIVE_GOALS', 'High Achiever', 'Completed 5 goals'),
    ('SOCIAL_BUTTERFLY', 'Social Butterfly', 'Connected with a trainer'),
    ('CALORIE_BURNER', 'Calorie Burner', 'Burned 1000 calories in a single workout'),
    ('CONSISTENT', 'Mr. Consistent', 'Logged workouts for 3 months')
  `;

  // Workout Sessions for Jack
  await sql`
    INSERT INTO workout_session (U_id, session_date, notes) VALUES
    (1, '2024-01-15', 'Upper body focus - felt strong'),
    (1, '2024-01-17', 'Leg day - increased squat weight'),
    (1, '2024-01-19', 'Cardio and core'),
    (1, '2024-01-22', 'Full body workout'),
    (1, '2024-01-24', 'Back and biceps')
  `;

  // Workout Session Exercises
  await sql`
    INSERT INTO workout_session_exercise (WS_id, ET_id, exercise_order, sets, reps, weight, calories_burned) VALUES
    (1, 1, 1, 4, 10, 135, 120),
    (1, 5, 2, 3, 12, 85, 80),
    (1, 6, 3, 3, 15, 30, 50),
    (2, 2, 1, 4, 8, 185, 150),
    (2, 8, 2, 3, 12, NULL, 80),
    (2, 14, 3, 3, 10, 200, 100),
    (3, 10, 1, 1, 1, NULL, 300),
    (3, 9, 2, 3, 1, NULL, 50),
    (4, 1, 1, 3, 10, 140, 110),
    (4, 2, 2, 3, 10, 175, 140),
    (4, 3, 3, 3, 8, 225, 160),
    (5, 3, 1, 4, 6, 245, 180),
    (5, 4, 2, 4, 8, NULL, 100),
    (5, 13, 3, 3, 12, 120, 90)
  `;

  // User Goals for Jack
  await sql`
    INSERT INTO user_goal (U_id, G_id, target_value, current_value, status) VALUES
    (1, 1, 10, 3, 'active'),
    (1, 3, 200, 140, 'active'),
    (1, 5, 30, 12, 'active')
  `;

  // User Achievements for Jack
  await sql`
    INSERT INTO user_achievement (U_id, Ach_id) VALUES
    (1, 1),
    (1, 8)
  `;

  // Trainer Connection
  await sql`
    INSERT INTO trainer_connection (A_id, T_id, notes) VALUES
    (1, 5, 'Started training January 2024')
  `;

  console.log('Database seeded!');
}
