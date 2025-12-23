// app/api/github/stats/[username]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateWrap } from '@/lib/github'; // Changed from fetchYearlyStats

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
    const wrapData = await generateWrap(username, parseInt(year));
    return NextResponse.json(wrapData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error('Error generating wrap:', error);
    
    if (error.message?.includes('not found')) {
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