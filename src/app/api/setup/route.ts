import { NextResponse } from 'next/server';
import { initializeDatabase, seedDatabase } from '@/lib/init-db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const seed = searchParams.get('seed') === 'true';

    await initializeDatabase();

    if (seed) {
      await seedDatabase();
    }

    return NextResponse.json({ 
      success: true, 
      message: seed ? 'Database initialized and seeded!' : 'Database initialized!' 
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup database', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to initialize the database. Add ?seed=true to also seed with sample data.',
  });
}

