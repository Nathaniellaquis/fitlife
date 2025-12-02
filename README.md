# FitLife - Fitness Tracking App

A modern fitness tracking application built with Next.js 16 and Vercel Postgres.

## Features

- 📊 Dashboard with fitness overview
- 🏋️ Workout logging and tracking
- 🎯 Goal setting and progress monitoring
- 🏆 Achievement system
- 👨‍🏫 Trainer connections

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Vercel Postgres
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+
- A Vercel account (for Postgres database)

### 1. Clone and Install

```bash
git clone https://github.com/Nathaniellaquis/fitlife.git
cd fitlife
npm install
```

### 2. Set Up Vercel Postgres

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** → **Create Database** → **Postgres**
3. Copy the environment variables to your `.env.local` file:

```env
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NO_SSL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

### 3. Initialize Database

After deploying or running locally, call the setup endpoint to create tables and seed data:

```bash
# Initialize tables only
curl -X POST https://your-app.vercel.app/api/setup

# Initialize tables AND seed sample data
curl -X POST https://your-app.vercel.app/api/setup?seed=true
```

Or visit `/api/setup` in your browser for instructions.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   │   ├── dashboard/
│   │   ├── workouts/
│   │   ├── goals/
│   │   ├── trainers/
│   │   └── setup/     # Database initialization
│   ├── goals/
│   ├── profile/
│   ├── trainers/
│   ├── workouts/
│   └── page.tsx       # Dashboard
├── components/
│   └── ui/            # shadcn/ui components
└── lib/
    ├── db.ts          # Database utilities
    ├── init-db.ts     # Schema & seed functions
    └── types.ts       # TypeScript types
```

## Database Schema

The app uses the following tables:

- `user` - Base user entity
- `athlete` - Athlete profile (extends user)
- `trainer` - Trainer profile (extends user)
- `workout_session` - Workout logs
- `workout_session_exercise` - Exercises in workouts
- `exercise_type` - Exercise catalog
- `goal` - Goal catalog
- `user_goal` - User's goals with progress
- `achievement` - Achievement catalog
- `user_achievement` - Earned achievements
- `trainer_connection` - Athlete-trainer relationships

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repo on [Vercel](https://vercel.com/new)
3. Add a Postgres database in the Storage tab
4. Vercel will automatically configure environment variables
5. Deploy!
6. Call `/api/setup?seed=true` to initialize the database

## License

MIT
