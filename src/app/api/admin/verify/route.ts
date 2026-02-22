import { NextResponse } from 'next/server';
import { verifyAuth, unauthorized } from '@/lib/auth';

export async function GET() {
    const user = await verifyAuth();
    if (!user) return unauthorized();
    return NextResponse.json({ success: true, user });
}
