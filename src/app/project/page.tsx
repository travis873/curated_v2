import Image from 'next/image';
import Link from 'next/link';
import { list } from '@vercel/blob';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { FadeIn, Reveal } from '@/components/Reveal';
import { verifyAuth } from '@/lib/auth';

export const revalidate = 60;

async function getImages() {
    try {
        const { blobs } = await list({ prefix: 'images/' });
        const images: Record<string, string> = { studio: '', oneBed: '' };
        const gallery: string[] = [];

        for (const b of blobs) {
            const parts = b.pathname.split('/');
            const cat = parts.length > 2 ? parts[1] : 'gallery';
            if (cat === 'gallery') gallery.push(b.url);
            if (cat === 'studio') images.studio = b.url;
            if (cat === 'oneBed') images.oneBed = b.url;
        }
        return { ...images, gallery };
    } catch {
        return { studio: '', oneBed: '', gallery: [] };
    }
}

export default async function ProjectPage() {
    const images = await getImages();
    const user = await verifyAuth();

    return (
        <SmoothScroll>
            <Navigation isAdmin={!!user} />

            <main className="min-h-screen pt-[72px] bg-warm-white pb-32">
                <section className="pt-20 pb-12 text-center container px-6 mx-auto">
                    <FadeIn>
                        <span className="label-sm text-gold mb-6 block">The Project</span>
                        <h1 className="display-lg mb-8">
                            Architectural <span className="text-gray-400 italic font-light">Excellence</span>
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.2} className="max-w-2xl mx-auto">
                        <p className="body-md">
                            A limited collection of 32 meticulously crafted units, designed to maximize natural light, spatial flow, and aesthetic grandeur.
                        </p>
                    </FadeIn>
                </section>

                {/* Studio Unit */}
                <section className="py-24 border-t border-smoke/10">
                    <div className="container px-6 mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <Reveal>
                                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                    {images.studio ? (
                                        <Image src={images.studio} alt="Studio Unit" fill className="object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">No image uploaded</div>
                                    )}
                                </div>
                            </Reveal>
                            <Reveal delay={0.2}>
                                <div className="lg:pl-12">
                                    <span className="label-sm text-gold block mb-4">Unit A</span>
                                    <h2 className="display-md mb-6">Premium Studio</h2>
                                    <p className="body-md mb-8">
                                        An intelligently designed open-plan space that redefines modern efficiency. Featuring floor-to-ceiling windows, bespoke cabinetry, and integrated high-end appliances.
                                    </p>
                                    <ul className="space-y-4 mb-10">
                                        {['Generous living area', 'Fully fitted European kitchen', 'Designer bathroom with walk-in shower', 'Private balcony'].map(f => (
                                            <li key={f} className="flex items-center gap-4 border-b border-gray-200 pb-4">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                                                <span className="text-sm tracking-wide">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* 1 Bedroom Unit */}
                <section className="py-24 bg-charcoal text-warm-white">
                    <div className="container px-6 mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <Reveal className="order-2 lg:order-1 lg:pr-12">
                                <span className="label-sm text-gold block mb-4">Unit B</span>
                                <h2 className="display-md mb-6">One Bedroom <span className="italic text-gray-400 font-light">Suite</span></h2>
                                <p className="body-md text-gray-300 mb-8">
                                    A sanctuary of sophistication. The one-bedroom layout offers distinct zones for entertainment and rest, complete with a lavish master suite and expansive entertaining area.
                                </p>
                                <ul className="space-y-4 mb-10">
                                    {['Spacious separate living room', 'Master en-suite with soaking tub', 'Guest powder room', 'Dual aspect views'].map(f => (
                                        <li key={f} className="flex items-center gap-4 border-b border-gold/10 pb-4">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                                            <span className="text-sm tracking-wide text-gray-200">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Reveal>
                            <Reveal delay={0.2} className="order-1 lg:order-2">
                                <div className="aspect-[4/3] bg-black relative overflow-hidden">
                                    {images.oneBed ? (
                                        <Image src={images.oneBed} alt="One Bedroom Unit" fill className="object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">No image uploaded</div>
                                    )}
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* Gallery */}
                <section className="py-24">
                    <div className="container px-6 mx-auto text-center mb-16">
                        <Reveal>
                            <h2 className="display-md mb-4">Curated <span className="italic text-gray-400 font-light">Gallery</span></h2>
                            <div className="w-12 h-px bg-gold mx-auto" />
                        </Reveal>
                    </div>

                    <div className="container px-6 mx-auto max-w-7xl">
                        {images.gallery.length === 0 ? (
                            <p className="text-center text-gray-400 text-sm">Gallery empty. Upload images via the Admin Dashboard.</p>
                        ) : (
                            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                                {images.gallery.map((url, i) => (
                                    <Reveal key={url} delay={(i % 3) * 0.1}>
                                        <div className="relative group overflow-hidden break-inside-avoid shadow-sm hover:shadow-xl transition-all duration-500">
                                            <Image src={url} alt={`Gallery image ${i}`} width={800} height={800} className="w-full h-auto object-cover group-hover:scale-[1.05] transition-transform duration-700" />
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        )}

                        <Reveal className="mt-20 text-center flex justify-center gap-4">
                            <Link href="/renders" className="btn-primary">View Additional 3D Renders</Link>
                        </Reveal>
                    </div>
                </section>

            </main>

            <Footer isAdmin={!!user} />
        </SmoothScroll>
    );
}
