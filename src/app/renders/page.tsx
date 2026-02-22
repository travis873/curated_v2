import Link from 'next/link';
import Image from 'next/image';
import { list } from '@vercel/blob';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { FadeIn, Reveal } from '@/components/Reveal';
import { verifyAuth } from '@/lib/auth';

export const revalidate = 60;

async function getRenders() {
    try {
        const { blobs } = await list({
            prefix: 'renders/',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        return blobs.map(b => ({
            url: b.url,
            filename: b.pathname.replace('renders/', ''),
            size: (b.size / (1024 * 1024)).toFixed(2) + ' MB'
        }));
    } catch {
        return [];
    }
}

export default async function RendersPage() {
    const renders = await getRenders();
    const user = await verifyAuth();

    return (
        <SmoothScroll>
            <Navigation isAdmin={!!user} />

            <main className="min-h-screen pt-[72px] bg-charcoal text-warm-white pb-32">
                <section className="pt-20 pb-16 text-center container px-6 mx-auto border-b border-gold/10">
                    <FadeIn>
                        <span className="label-sm text-gold mb-6 block">Visualizations</span>
                        <h1 className="display-lg mb-8">
                            3D <span className="text-gray-400 italic font-light">Renders</span>
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.2} className="max-w-2xl mx-auto">
                        <p className="body-md text-gray-400">
                            Immerse yourself in the future of Kitusuru living. High-resolution visualizations of the exterior architecture, interior layouts, and exclusive amenities.
                        </p>
                    </FadeIn>
                </section>

                <section className="py-24">
                    <div className="container px-6 mx-auto max-w-7xl">
                        {renders.length === 0 ? (
                            <p className="text-center text-gray-500 text-sm py-20">No renders uploaded yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {renders.map((r, i) => {
                                    const isImage = r.filename.match(/\.(jpg|jpeg|png|webp|gif)$/i);
                                    const isVideo = r.filename.match(/\.(mp4|webm|mov)$/i);

                                    return (
                                        <Reveal key={r.url} delay={(i % 3) * 0.1}>
                                            <div className="bg-black/50 border border-gold/10 overflow-hidden group">
                                                <div className="aspect-[4/3] bg-black relative">
                                                    {isImage ? (
                                                        <Image src={r.url} alt={r.filename} fill className="object-cover group-hover:scale-[1.05] transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                                                    ) : isVideo ? (
                                                        <video src={r.url} controls muted loop className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                                            <span className="mb-2">📄 File</span>
                                                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="link-gold text-warm-white text-xs">Download</a>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-4 flex justify-between items-center">
                                                    <p className="text-sm text-gray-300 truncate pr-4">{r.filename}</p>
                                                    <span className="text-xs text-gray-500 whitespace-nowrap">{r.size}</span>
                                                </div>
                                            </div>
                                        </Reveal>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

            </main>

            <Footer isAdmin={!!user} />
        </SmoothScroll>
    );
}
