-- FitLife Seed Data (PostgreSQL)

-- Users (password is 'password123' - would be hashed in production)
INSERT INTO "user" (email, password, fname, lname, phone, dob, gender) VALUES
('jack@example.com', 'hashed_password_123', 'Jack', 'Smith', '555-0101', '1990-05-15', 'Male'),
('emma@example.com', 'hashed_password_123', 'Emma', 'Johnson', '555-0102', '1988-08-22', 'Female'),
('mike@example.com', 'hashed_password_123', 'Mike', 'Williams', '555-0103', '1985-03-10', 'Male'),
('sarah@example.com', 'hashed_password_123', 'Sarah', 'Davis', '555-0104', '1992-11-30', 'Female'),
('coach_tom@example.com', 'hashed_password_123', 'Tom', 'Anderson', '555-0105', '1980-01-20', 'Male')
ON CONFLICT (email) DO NOTHING;

-- Athletes (Jack, Emma, Mike, Sarah are athletes)
INSERT INTO athlete (A_id, fitness_level) VALUES
(1, 'Intermediate'),
(2, 'Advanced'),
(3, 'Beginner'),
(4, 'Intermediate')
ON CONFLICT (A_id) DO NOTHING;

-- Trainers (Coach Tom is a trainer)
INSERT INTO trainer (T_id, specialty, location, bio) VALUES
(5, 'Strength Training', 'Downtown Gym', 'Certified personal trainer with 10+ years experience in strength and conditioning.')
ON CONFLICT (T_id) DO NOTHING;

-- Exercise Types
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
ON CONFLICT DO NOTHING;

-- Goals
INSERT INTO goal (title, description) VALUES
('Lose 10 lbs', 'Achieve a weight loss of 10 pounds'),
('Run 5K', 'Complete a 5 kilometer run'),
('Bench Press 200 lbs', 'Bench press 200 pounds for one rep'),
('100 Push-ups', 'Complete 100 push-ups in one session'),
('Workout 30 Days', 'Complete workouts for 30 consecutive days'),
('Squat Body Weight', 'Squat your body weight for 10 reps'),
('10K Steps Daily', 'Walk 10,000 steps every day for a week'),
('Flexibility Goal', 'Touch your toes without bending knees')
ON CONFLICT DO NOTHING;

-- Achievements
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
ON CONFLICT (code) DO NOTHING;

-- Workout Sessions for Jack (user 1)
INSERT INTO workout_session (U_id, session_date, notes) VALUES
(1, '2024-01-15', 'Upper body focus - felt strong'),
(1, '2024-01-17', 'Leg day - increased squat weight'),
(1, '2024-01-19', 'Cardio and core'),
(1, '2024-01-22', 'Full body workout'),
(1, '2024-01-24', 'Back and biceps');

-- Workout Session Exercises
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
(5, 13, 3, 3, 12, 120, 90);

-- User Goals for Jack
INSERT INTO user_goal (U_id, G_id, target_value, current_value, status) VALUES
(1, 1, 10, 3, 'active'),
(1, 3, 200, 140, 'active'),
(1, 5, 30, 12, 'active')
ON CONFLICT (U_id, G_id) DO NOTHING;

-- User Achievements for Jack
INSERT INTO user_achievement (U_id, Ach_id) VALUES
(1, 1),
(1, 8)
ON CONFLICT (U_id, Ach_id) DO NOTHING;

-- Trainer Connection (Jack connected with Coach Tom)
INSERT INTO trainer_connection (A_id, T_id, notes) VALUES
(1, 5, 'Started training January 2024')
ON CONFLICT (A_id, T_id) DO NOTHING;
