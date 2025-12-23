// app/api/github/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchUser } from '@/lib/github'; // Changed from fetchGitHubUser

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }

  try {
    const userData = await fetchUser(username); // Changed from fetchGitHubUser
    return NextResponse.json(userData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.error('Error fetching GitHub user:', error);
    
    if (error.message?.includes('not found') || error.message?.includes('404')) {
      return NextResponse.json(
        { error: `User "${username}" not found on GitHub` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch user data. Please try again.' },
      { status: 500 }
    );
  }
}