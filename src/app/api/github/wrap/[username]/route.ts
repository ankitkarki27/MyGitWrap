// app/api/github/wrap/[username]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateWrap } from '@/lib/github';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    const year = new URL(request.url).searchParams.get('year') || new Date().getFullYear();
    
    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }
    
    const wrapData = await generateWrap(username, parseInt(year.toString()));
    
    return NextResponse.json(wrapData);
  } catch (error: any) {
    console.error('Wrap API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate wrap' },
      { status: 500 }
    );
  }
}