import Link from 'next/link';

const FOOTER_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'Kitusuru' },
    { href: '/project', label: 'Project' },
    { href: '/renders', label: '3D Renders' },
    { href: '/brochure', label: 'Brochure' },
    { href: '/contact', label: 'Contact' },
];

export default function Footer({ brochureUrl, isAdmin }: { brochureUrl?: string | null, isAdmin?: boolean }) {
    return (
        <footer className="bg-black py-20 lg:py-16">
            <div className="container mx-auto px-8 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 xl:gap-8 mb-16">

                    <div className="col-span-1">
                        <div className="font-serif text-3xl font-light tracking-[0.2em] text-warm-white mb-4">
                            CURATED
                        </div>
                        <p className="body-sm max-w-[280px] text-gray-400">
                            Premier residences in Nairobi's most prestigious neighbourhood.
                        </p>
                    </div>

                    <div className="col-span-1">
                        <div className="label-sm text-gold mb-5">Navigate</div>
                        <div className="flex flex-col gap-3">
                            {FOOTER_LINKS.map(l => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className="btn-ghost text-xs text-gray-400/80 justify-start hover:text-warm-white transition-colors"
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-1">
                        <div className="label-sm text-gold mb-5">Contact</div>
                        <div className="flex flex-col gap-2">
                            <p className="body-sm text-gray-400">+254 700 000 000</p>
                            <p className="body-sm text-gray-400">info@curated.co.ke</p>
                            <p className="body-sm text-gray-400">Kitusuru, Nairobi</p>
                        </div>
                        <div className="mt-8">
                            <Link href="/contact" className="link-gold text-warm-white">
                                Enquire Now
                            </Link>
                        </div>
                    </div>

                    <div className="col-span-1">
                        <div className="label-sm text-gold mb-5">Documents</div>
                        {brochureUrl ? (
                            <a
                                href={brochureUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link-gold text-warm-white text-xs"
                            >
                                Download Brochure
                            </a>
                        ) : (
                            <p className="body-sm text-gray-400">Brochure coming soon</p>
                        )}

                        {isAdmin && (
                            <div className="mt-8">
                                <Link href="/admin" className="btn-gold px-4 py-2 text-[0.65rem]">
                                    Admin Panel
                                </Link>
                            </div>
                        )}
                    </div>

                </div>

                <div className="border-t border-smoke pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <p className="body-sm text-gray-500">© {new Date().getFullYear()} Curated Real Estate. All rights reserved.</p>
                    <p className="body-sm text-[0.65rem] text-gray-600">Built for Vercel</p>
                </div>
            </div>
        </footer>
    );
}
