import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@curated.co.ke';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'curated-dev-secret';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const email = (body.email || '').trim().toLowerCase();
        const password = (body.password || '').trim();

        if (!email || !password || email !== ADMIN_EMAIL.trim().toLowerCase()) {
            return NextResponse.json({ success: false, error: `Invalid email. Expected: ${ADMIN_EMAIL}` }, { status: 401 });
        }

        const ADMIN_HASH = process.env.ADMIN_PASSWORD_HASH;
        let valid = false;
        if (ADMIN_HASH) {
            valid = await bcrypt.compare(password, ADMIN_HASH);
        } else {
            valid = password === ADMIN_PASS;
        }

        if (!valid) {
            return NextResponse.json({ success: false, error: 'Invalid password. Check your ADMIN_PASSWORD environment variable.' }, { status: 401 });
        }

        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });

        // Set HTTP-only cookie
        const cookieStore = await cookies();
        cookieStore.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
