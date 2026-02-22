import Image from 'next/image';
import Link from 'next/link';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { FadeIn, Reveal } from '@/components/Reveal';
import { verifyAuth } from '@/lib/auth';

export default async function AboutKitusuru() {
    const user = await verifyAuth();

    return (
        <SmoothScroll>
            <Navigation isAdmin={!!user} />

            <main className="min-h-screen pt-[72px] bg-warm-white">
                {/* HERO HEADER */}
                <section className="bg-charcoal text-warm-white py-32 relative overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-10">
                        <div className="w-full h-full bg-[radial-gradient(circle_at_center,var(--color-gold)_0%,transparent_100%)] blur-[100px]" />
                    </div>

                    <div className="container px-6 mx-auto max-w-4xl text-center relative z-10">
                        <FadeIn>
                            <h1 className="display-lg mb-6">
                                The Crown Jewel <span className="italic text-gold font-light">of Nairobi</span>
                            </h1>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <p className="body-lg text-gray-400 mx-auto max-w-2xl">
                                Kitusuru stands as a testament to refined living, where ancient forests meet ambassadorial elegance.
                            </p>
                        </FadeIn>
                    </div>
                </section>

                {/* CONTENT */}
                <section className="py-24">
                    <div className="container px-6 mx-auto max-w-5xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 mb-32 items-center">
                            <Reveal>
                                <h2 className="display-md mb-6">Unrivaled <br /><span className="text-gold italic font-light">Tranquility</span></h2>
                                <div className="w-12 h-px bg-gold mb-8" />
                                <p className="body-md mb-6">
                                    Nestled among rolling hills and mature woodland, Kitusuru offers an escape from the frantic pace of the city without sacrificing connectivity. The air is cooler, the streets are quieter, and the standard of living is completely unparalleled.
                                </p>
                                <p className="body-md">
                                    Home to numerous embassies, high commissions, and international executives, the neighbourhood guarantees absolute security and privacy for its residents.
                                </p>
                            </Reveal>

                            <Reveal delay={0.2}>
                                <div className="aspect-square bg-smoke relative overflow-hidden">
                                    {/* In a real scenario we'd query a specific 'about' image here */}
                                    <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-gray-500">
                                        <p className="body-sm">Lifestyle Visuals pending upload</p>
                                    </div>
                                </div>
                            </Reveal>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: "Diplomatic Hub", desc: "Bordering the United Nations Environment Programme (UNEP) headquarters." },
                                { title: "Elite Education", desc: "Minutes from the International School of Kenya (ISK)." },
                                { title: "Premium Retail", desc: "Immediate access to Village Market and Two Rivers Mall." }
                            ].map((item, i) => (
                                <Reveal key={item.title} delay={i * 0.1}>
                                    <div className="p-8 border border-gray-200 h-full hover:border-gold transition-colors duration-400 bg-white shadow-sm">
                                        <h3 className="font-serif text-xl mb-3">{item.title}</h3>
                                        <p className="body-sm">{item.desc}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>

                        <Reveal delay={0.3} className="mt-20 text-center">
                            <Link href="/project" className="btn-primary">
                                Explore The Project
                            </Link>
                        </Reveal>
                    </div>
                </section>
            </main>

            <Footer isAdmin={!!user} />
        </SmoothScroll>
    );
}
