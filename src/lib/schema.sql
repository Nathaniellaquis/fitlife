-- FitLife Database Schema (PostgreSQL / Vercel Postgres)

-- User table (base entity)
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
);

-- Athlete (subtype of user, A_id = U_id)
CREATE TABLE IF NOT EXISTS athlete (
    A_id INTEGER PRIMARY KEY REFERENCES "user"(U_id) ON DELETE CASCADE,
    fitness_level TEXT
);

-- Trainer (subtype of user, T_id = U_id)
CREATE TABLE IF NOT EXISTS trainer (
    T_id INTEGER PRIMARY KEY REFERENCES "user"(U_id) ON DELETE CASCADE,
    specialty TEXT,
    location TEXT,
    bio TEXT
);

-- Trainer connection (composite PK)
CREATE TABLE IF NOT EXISTS trainer_connection (
    A_id INTEGER NOT NULL REFERENCES athlete(A_id) ON DELETE CASCADE,
    T_id INTEGER NOT NULL REFERENCES trainer(T_id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (A_id, T_id)
);

-- Password reset
CREATE TABLE IF NOT EXISTS password_reset (
    PR_id SERIAL PRIMARY KEY,
    U_id INTEGER NOT NULL REFERENCES "user"(U_id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Workout session
CREATE TABLE IF NOT EXISTS workout_session (
    WS_id SERIAL PRIMARY KEY,
    U_id INTEGER NOT NULL REFERENCES "user"(U_id) ON DELETE CASCADE,
    session_date TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Exercise type catalog
CREATE TABLE IF NOT EXISTS exercise_type (
    ET_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    target_muscle_group TEXT
);

-- Workout session exercise (composite PK)
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
);

-- Goal catalog
CREATE TABLE IF NOT EXISTS goal (
    G_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date_earned TEXT
);

-- User goal (composite PK)
CREATE TABLE IF NOT EXISTS user_goal (
    U_id INTEGER NOT NULL REFERENCES "user"(U_id) ON DELETE CASCADE,
    G_id INTEGER NOT NULL REFERENCES goal(G_id) ON DELETE CASCADE,
    target_value REAL,
    current_value REAL DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (U_id, G_id)
);

-- Achievement catalog
CREATE TABLE IF NOT EXISTS achievement (
    Ach_id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT
);

-- User achievement (composite PK)
CREATE TABLE IF NOT EXISTS user_achievement (
    U_id INTEGER NOT NULL REFERENCES "user"(U_id) ON DELETE CASCADE,
    Ach_id INTEGER NOT NULL REFERENCES achievement(Ach_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (U_id, Ach_id)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_workout_session_user ON workout_session(U_id);
CREATE INDEX IF NOT EXISTS idx_workout_session_date ON workout_session(session_date);
CREATE INDEX IF NOT EXISTS idx_workout_exercise_session ON workout_session_exercise(WS_id);
CREATE INDEX IF NOT EXISTS idx_user_goal_user ON user_goal(U_id);
CREATE INDEX IF NOT EXISTS idx_user_achievement_user ON user_achievement(U_id);
CREATE INDEX IF NOT EXISTS idx_trainer_connection_athlete ON trainer_connection(A_id);
CREATE INDEX IF NOT EXISTS idx_trainer_connection_trainer ON trainer_connection(T_id);
