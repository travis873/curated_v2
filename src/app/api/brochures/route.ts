import { NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob';
import { verifyAuth, unauthorized } from '@/lib/auth';

export async function GET() {
    try {
        const { blobs } = await list({ prefix: 'brochures/' });
        if (!blobs.length) return NextResponse.json({ success: true, brochure: null });

        // Return latest
        const latest = blobs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0];

        return NextResponse.json({
            success: true,
            brochure: {
                id: latest.pathname,
                url: latest.url,
                filename: latest.pathname.replace('brochures/', ''),
                uploadedAt: latest.uploadedAt,
                size: latest.size,
            }
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const user = await verifyAuth();
    if (!user) return unauthorized();

    try {
        const formData = await request.formData();
        const file = formData.get('brochure') as File;

        if (!file) return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        if (file.type !== 'application/pdf') return NextResponse.json({ success: false, error: 'Only PDF files accepted' }, { status: 400 });

        // Clean up old brochures first
        try {
            const { blobs } = await list({ prefix: 'brochures/' });
            for (const b of blobs) await del(b.url);
        } catch { }

        const filename = `brochures/${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;
        const blob = await put(filename, file, {
            access: 'public',
            contentType: 'application/pdf',
        });

        return NextResponse.json({
            success: true,
            brochure: {
                id: blob.pathname,
                url: blob.url,
                filename: file.name,
                uploadedAt: new Date().toISOString(),
            }
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function DELETE() {
    const user = await verifyAuth();
    if (!user) return unauthorized();

    try {
        const { blobs } = await list({ prefix: 'brochures/' });
        for (const b of blobs) await del(b.url);
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
