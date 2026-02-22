import { NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob';
import { verifyAuth, unauthorized } from '@/lib/auth';

export async function GET() {
    try {
        const { blobs } = await list({ prefix: 'images/' });
        const grouped: Record<string, string> = {};
        const gallery: string[] = [];

        for (const b of blobs) {
            // images/category/filename.ext
            const parts = b.pathname.split('/');
            const cat = parts.length > 2 ? parts[1] : 'gallery';

            if (cat === 'gallery') {
                gallery.push(b.url);
            } else {
                // Keep latest for singular categories (hero, studio, etc)
                grouped[cat] = b.url;
            }
        }
        return NextResponse.json({ success: true, images: grouped, gallery });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const user = await verifyAuth();
    if (!user) return unauthorized();

    try {
        const formData = await request.formData();
        const category = (formData.get('category') as string) || 'gallery';
        const files = formData.getAll('images') as File[];

        if (!files.length) {
            return NextResponse.json({ success: false, error: 'No files uploaded' }, { status: 400 });
        }

        const uploaded = [];
        for (const file of files) {
            const ext = file.name.split('.').pop();
            const filename = `images/${category}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

            const blob = await put(filename, file, {
                access: 'public',
                contentType: file.type,
            });
            uploaded.push({ id: blob.pathname, url: blob.url, filename: file.name, category });
        }

        return NextResponse.json({ success: true, images: uploaded, count: uploaded.length });
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
