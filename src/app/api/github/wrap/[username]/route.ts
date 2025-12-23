import { NextRequest, NextResponse } from 'next/server';
import { fetchYearlyStats, fetchQuickYearlyStats } from '@/lib/github';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const username = params.username;
  const searchParams = request.nextUrl.searchParams;
  const year = searchParams.get('year') || new Date().getFullYear().toString();
  const quick = searchParams.get('quick') === 'true';

  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }

  try {
    let stats;
    
    if (quick) {
      // Quick mode for faster response (estimates)
      stats = await fetchQuickYearlyStats(username, parseInt(year));
    } else {
      // Full mode with actual API calls
      stats = await fetchYearlyStats(username, parseInt(year));
    }

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error('Error in /api/github/wrap:', error);
    
    if (error.message?.includes('not found') || error.message?.includes('404')) {
      return NextResponse.json(
        { error: `User "${username}" not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate wrap. Please try again.' },
      { status: 500 }
    );
  }
}