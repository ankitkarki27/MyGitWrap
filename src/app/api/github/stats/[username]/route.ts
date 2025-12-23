import { NextRequest, NextResponse } from 'next/server';
import { fetchYearlyStats } from '@/lib/github';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const username = params.username;
  const searchParams = request.nextUrl.searchParams;
  const year = searchParams.get('year') || new Date().getFullYear().toString();

  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }

  try {
    const stats = await fetchYearlyStats(username, parseInt(year));
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching yearly stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch yearly statistics' },
      { status: 500 }
    );
  }
}