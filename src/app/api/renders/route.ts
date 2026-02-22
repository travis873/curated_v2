import { NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob';
import { verifyAuth, unauthorized } from '@/lib/auth';

export async function GET() {
    try {
        const { blobs } = await list({ prefix: 'renders/' });
        const renders = blobs.map(b => ({
            id: b.pathname,
            url: b.url,
            filename: b.pathname.replace('renders/', ''),
            uploadedAt: b.uploadedAt,
            size: b.size,
        }));
        return NextResponse.json({ success: true, renders });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const user = await verifyAuth();
    if (!user) return unauthorized();

    try {
        const formData = await request.formData();
        const files = formData.getAll('renders') as File[];

        if (!files.length) {
            return NextResponse.json({ success: false, error: 'No files uploaded' }, { status: 400 });
        }

        const uploaded = [];
        for (const file of files) {
            const ext = file.name.split('.').pop();
            const filename = `renders/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

            const blob = await put(filename, file, {
                access: 'public',
                contentType: file.type || 'application/octet-stream',
            });
            uploaded.push({ id: blob.pathname, url: blob.url, filename: file.name, uploadedAt: new Date().toISOString() });
        }

        return NextResponse.json({ success: true, renders: uploaded });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const user = await verifyAuth();
    if (!user) return unauthorized();

    try {
        const { url } = await request.json();
        if (!url) return NextResponse.json({ success: false, error: 'URL required' }, { status: 400 });

        await del(url);
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
