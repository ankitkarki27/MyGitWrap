import { NextRequest, NextResponse } from 'next/server';
import { generateWrap } from '@/lib/github';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    
    console.log(`=== WRAP API CALLED FOR: ${username} ===`);
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const wrapData = await generateWrap(username);
    
    console.log('Wrap data generated:', {
      username: wrapData.user.login,
      repos: wrapData.stats.repos,
      commits: wrapData.stats.commits,
      prs: wrapData.stats.prs,
    });
    
    return NextResponse.json(wrapData);
    
  } catch (error: any) {
    console.error('API Error:', error.message);
    
    if (error.message.includes('Not Found') || error.message.includes('404')) {
      return NextResponse.json(
        { error: `User not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to generate wrap' },
      { status: 500 }
    );
  }
}