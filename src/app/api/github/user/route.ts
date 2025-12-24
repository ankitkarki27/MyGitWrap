import { NextRequest, NextResponse } from 'next/server';
import { generateWrap  } from '@/lib/github';

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    const user = await generateWrap (username);
    return NextResponse.json(user, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600',
      },
    });
  } catch {
    return NextResponse.json(
      { error: `User "${username}" not found` },
      { status: 404 }
    );
  }
}
