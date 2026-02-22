import Link from 'next/link';
import { list } from '@vercel/blob';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { FadeIn, Reveal } from '@/components/Reveal';
import { verifyAuth } from '@/lib/auth';

export const revalidate = 60;

async function getBrochure() {
    try {
        const { blobs } = await list({
            prefix: 'brochures/',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        if (!blobs.length) return null;
        const latest = blobs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0];
        return {
            url: latest.url,
            filename: latest.pathname.replace('brochures/', ''),
            size: (latest.size / (1024 * 1024)).toFixed(2) + ' MB',
            date: new Date(latest.uploadedAt).toLocaleDateString()
        };
    } catch {
        return null;
    }
}

export default async function BrochurePage() {
    const brochure = await getBrochure();
    const user = await verifyAuth();

    return (
        <SmoothScroll>
            <Navigation isAdmin={!!user} />

            <main className="min-h-screen pt-[72px] bg-warm-white flex flex-col">
                <section className="flex-1 py-32 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-charcoal/5 z-0" />

                    <div className="container px-6 mx-auto max-w-2xl text-center relative z-10">
                        <FadeIn>
                            <span className="label-sm text-gold mb-6 block">Documentation</span>
                            <h1 className="display-md mb-8">
                                Project <span className="text-gray-400 italic font-light">Brochure</span>
                            </h1>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <p className="body-md text-gray-500 mb-12">
                                Download the complete Curated Kitusuru brochure for detailed floor plans, specification sheets, and pricing availability.
                            </p>

                            {brochure ? (
                                <div className="bg-white border border-gray-200 p-8 shadow-sm flex flex-col items-center">
                                    <div className="w-16 h-20 bg-charcoal text-warm-white flex items-center justify-center mb-6 opacity-90 shadow-lg">
                                        <span className="text-sm font-serif">PDF</span>
                                    </div>
                                    <h3 className="font-serif text-xl mb-2">{brochure.filename}</h3>
                                    <p className="text-sm text-gray-400 mb-8">{brochure.size} • Updated {brochure.date}</p>

                                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                                        <a href={brochure.url} target="_blank" rel="noopener noreferrer" className="btn-outline text-center flex-1 sm:flex-none justify-center">
                                            Preview Document
                                        </a>
                                        <a href={brochure.url} download className="btn-primary text-center flex-1 sm:flex-none justify-center">
                                            Download PDF
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 border border-gray-200 border-dashed text-gray-400">
                                    <p className="text-sm">Brochure coming soon. Please contact us directly for project details.</p>
                                </div>
                            )}
                        </FadeIn>
                    </div>
                </section>
            </main>

            <Footer brochureUrl={brochure?.url} isAdmin={!!user} />
        </SmoothScroll>
    );
}
