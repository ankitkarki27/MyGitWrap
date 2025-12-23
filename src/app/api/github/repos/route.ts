import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubRepos } from '@/lib/github';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('per_page') || '100';

  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }

  try {
    // You might need to update your lib function to accept pagination
    const reposData = await fetchGitHubRepos(username);
    return NextResponse.json(reposData, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    
    if (error instanceof Error && error.message.includes('404')) {
      return NextResponse.json(
        { error: `Cannot fetch repositories for "${username}"` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch repositories. Please try again.' },
      { status: 500 }
    );
  }
}