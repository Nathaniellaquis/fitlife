-- FitLife Seed Data

-- User (with dob and gender now)
INSERT INTO user (email, password, fname, lname, phone, dob, gender, created_at, updated_at) VALUES
('jack@fitlife.com',  'hash1', 'Jack',  'Wilczewski', '111-111-1111', '2003-04-01', 'Male',   '2024-11-01', '2025-01-01'),
('sarah@fitlife.com', 'hash2', 'Sarah', 'Lee',        '222-222-2222', '1999-08-15', 'Female', '2024-11-05', '2025-01-02'),
('nate@fitlife.com',  'hash3', 'Nate',  'Trainer',    '333-333-3333', '1990-03-20', 'Male',   '2024-11-10', '2025-01-03'),
('chloe@fitlife.com', 'hash4', 'Chloe', 'Coach',      '444-444-4444', '1988-07-12', 'Female', '2024-11-15', '2025-01-04'),
('mark@fitlife.com',  'hash5', 'Mark',  'Taylor',     '555-555-5555', '1995-03-10', 'Male',   '2024-11-20', '2025-01-05');

-- Athlete (A_id = U_id, Jack=1, Sarah=2, Mark=5 are athletes)
INSERT INTO athlete (A_id, fitness_level) VALUES
(1, 'Intermediate'),
(2, 'Beginner'),
(5, 'Advanced');

-- Trainer (T_id = U_id, Nate=3, Chloe=4 are trainers)
INSERT INTO trainer (T_id, specialty, location, bio) VALUES
(3, 'Strength & Conditioning', 'Boston', 'Certified personal trainer with 10 years experience in strength training.'),
(4, 'Endurance & Cardio', 'Boston', 'Marathon runner and cardio specialist helping clients achieve their endurance goals.');

-- Exercise Type
INSERT INTO exercise_type (name, target_muscle_group) VALUES
('Bench Press',    'Chest'),
('Squat',          'Legs'),
('Deadlift',       'Back'),
('Running',        'Cardio'),
('Cycling',        'Cardio'),
('Push-up',        'Chest'),
('Pull-up',        'Back'),
('Plank',          'Core'),
('Lunges',         'Legs'),
('Shoulder Press', 'Shoulders');

-- Workout Session
INSERT INTO workout_session (U_id, session_date, notes, created_at) VALUES
(1, '2025-01-20', 'Push-ups & Core',     '2025-01-20 09:00:00'),
(1, '2025-01-22', 'Leg Day',             '2025-01-22 10:00:00'),
(1, '2025-01-24', 'Upper Body Strength', '2025-01-24 08:30:00'),
(2, '2024-10-01', '5k Run',              '2024-10-01 06:30:00'),
(2, '2024-10-05', 'Legs & Core',         '2024-10-05 07:00:00'),
(2, '2024-11-01', 'Upper Body',          '2024-11-01 08:00:00'),
(2, '2024-11-15', 'Full Body Cardio',    '2024-11-15 07:30:00'),
(5, '2025-01-10', 'Morning Run',         '2025-01-10 06:00:00'),
(5, '2025-01-12', 'Chest & Triceps',     '2025-01-12 17:00:00');

-- Workout Session Exercise (composite PK: WS_id, ET_id)
INSERT INTO workout_session_exercise (WS_id, ET_id, exercise_order, sets, reps, duration_min, weight, calories_burned, created_at, completed_at) VALUES
-- Jack's Push-ups & Core session (WS_id=1)
(1, 6, 1, 3, 20, NULL, NULL, 50, '2025-01-20 09:00:00', '2025-01-20 09:15:00'),
(1, 8, 2, 3, NULL, 1, NULL, 30, '2025-01-20 09:00:00', '2025-01-20 09:25:00'),
-- Jack's Leg Day (WS_id=2)
(2, 2, 1, 4, 10, NULL, 80.0, 120, '2025-01-22 10:00:00', '2025-01-22 10:30:00'),
(2, 9, 2, 3, 12, NULL, 20.0, 80, '2025-01-22 10:00:00', '2025-01-22 10:50:00'),
-- Jack's Upper Body (WS_id=3)
(3, 1, 1, 4, 8, NULL, 70.0, 100, '2025-01-24 08:30:00', '2025-01-24 09:00:00'),
(3, 10, 2, 3, 10, NULL, 30.0, 60, '2025-01-24 08:30:00', '2025-01-24 09:20:00'),
-- Sarah's 5k Run (WS_id=4)
(4, 4, 1, 1, NULL, 28, NULL, 320, '2024-10-01 06:30:00', '2024-10-01 06:58:00'),
-- Sarah's Legs & Core (WS_id=5)
(5, 2, 1, 3, 12, NULL, 50.0, 90, '2024-10-05 07:00:00', '2024-10-05 07:20:00'),
(5, 8, 2, 4, NULL, 1, NULL, 40, '2024-10-05 07:00:00', '2024-10-05 07:30:00'),
-- Sarah's Upper Body (WS_id=6)
(6, 1, 1, 3, 10, NULL, 40.0, 80, '2024-11-01 08:00:00', '2024-11-01 08:20:00'),
(6, 7, 2, 3, 8, NULL, NULL, 60, '2024-11-01 08:00:00', '2024-11-01 08:35:00'),
-- Sarah's Full Body Cardio (WS_id=7)
(7, 5, 1, 1, NULL, 30, NULL, 250, '2024-11-15 07:30:00', '2024-11-15 08:00:00'),
-- Mark's Morning Run (WS_id=8)
(8, 4, 1, 1, NULL, 35, NULL, 380, '2025-01-10 06:00:00', '2025-01-10 06:35:00'),
-- Mark's Chest & Triceps (WS_id=9)
(9, 1, 1, 4, 10, NULL, 90.0, 130, '2025-01-12 17:00:00', '2025-01-12 17:30:00'),
(9, 6, 2, 3, 25, NULL, NULL, 60, '2025-01-12 17:00:00', '2025-01-12 17:45:00');

-- Goal (catalog of goals)
INSERT INTO goal (title, description, date_earned) VALUES
('Bench Press 185 lbs', 'Reach a bench press of 185 pounds', NULL),
('Run 5k under 25 min', 'Complete a 5k run in under 25 minutes', NULL),
('Complete 50 workouts', 'Log 50 total workout sessions', NULL),
('Squat 135 lbs', 'Reach a squat of 135 pounds', NULL),
('Run 100 miles total', 'Accumulate 100 miles of running', NULL),
('Bench Press 225 lbs', 'Reach a bench press of 225 pounds', NULL);

-- User Goal (composite PK: U_id, G_id)
INSERT INTO user_goal (U_id, G_id, target_value, current_value, status, created_at, updated_at) VALUES
(1, 1, 185, 155, 'active', '2025-01-01', '2025-01-20'),
(1, 2, 25, 28, 'active', '2025-01-01', '2025-01-15'),
(2, 3, 50, 32, 'active', '2024-09-01', '2024-11-15'),
(2, 4, 135, 110, 'active', '2024-10-01', '2024-11-01'),
(5, 5, 100, 45, 'active', '2025-01-01', '2025-01-12'),
(5, 6, 225, 200, 'active', '2025-01-01', '2025-01-12');

-- Achievement
INSERT INTO achievement (code, title, description) VALUES
('FIRST_WORKOUT', 'First Steps', 'Complete your first workout'),
('WORKOUT_10', 'Getting Started', 'Complete 10 workouts'),
('WORKOUT_50', 'Dedicated', 'Complete 50 workouts'),
('WORKOUT_100', 'Century Club', 'Complete 100 workouts'),
('STREAK_7', 'Week Warrior', 'Work out 7 days in a row'),
('STREAK_30', 'Monthly Master', 'Work out 30 days in a row'),
('GOAL_COMPLETE', 'Goal Crusher', 'Complete a fitness goal'),
('EARLY_BIRD', 'Early Bird', 'Complete a workout before 7 AM'),
('HEAVY_LIFTER', 'Heavy Lifter', 'Lift over 100kg in a single exercise'),
('CARDIO_KING', 'Cardio Royalty', 'Burn 500+ calories in a single session');

-- User Achievement (composite PK: U_id, Ach_id)
INSERT INTO user_achievement (U_id, Ach_id, created_at, updated_at) VALUES
(1, 1, '2025-01-20', '2025-01-20'),  -- Jack: First Steps
(1, 8, '2025-01-20', '2025-01-20'),  -- Jack: Early Bird
(2, 1, '2024-10-01', '2024-10-01'),  -- Sarah: First Steps
(2, 2, '2024-11-01', '2024-11-01'),  -- Sarah: Getting Started (10 workouts)
(2, 8, '2024-10-01', '2024-10-01'),  -- Sarah: Early Bird
(5, 1, '2025-01-10', '2025-01-10'),  -- Mark: First Steps
(5, 8, '2025-01-10', '2025-01-10'),  -- Mark: Early Bird
(5, 9, '2025-01-12', '2025-01-12');  -- Mark: Heavy Lifter (90kg bench)

-- Trainer Connection (composite PK: A_id, T_id)
INSERT INTO trainer_connection (A_id, T_id, notes, created_at) VALUES
(1, 3, 'Jack training with Nate for strength building', '2024-12-01'),
(2, 4, 'Sarah working with Chloe on cardio endurance', '2024-10-15'),
(5, 3, 'Mark connected with Nate for powerlifting', '2025-01-05');

-- Password Reset
INSERT INTO password_reset (U_id, token, expires_at, used_at, created_at) VALUES
(1, 'abc123token', '2025-02-01 12:00:00', NULL, '2025-01-25 12:00:00');
