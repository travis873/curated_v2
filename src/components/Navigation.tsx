'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Settings, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'Kitusuru' },
    { href: '/project', label: 'Project' },
    { href: '/renders', label: '3D Renders' },
    { href: '/brochure', label: 'Brochure' },
    { href: '/contact', label: 'Contact' },
];

export default function Navigation({ isAdmin = false }: { isAdmin?: boolean }) {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => { setOpen(false); }, [pathname]);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex items-center h-[72px] ${scrolled ? 'bg-warm-white/90 backdrop-blur-xl border-b border-gold/20' : 'bg-transparent'}`}>
            <div className="container mx-auto px-8 flex items-center justify-between w-full">
                {/* Logo */}
                <Link
                    href="/"
                    className="font-serif text-[1.4rem] font-light tracking-[0.2em] text-black no-underline transition-opacity hover:opacity-70"
                >
                    CURATED
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10">
                    {links.map(l => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={`nav-link ${pathname === l.href ? 'active' : ''}`}
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>

                {/* Admin + Mobile Toggle */}
                <div className="flex items-center gap-4">
                    {isAdmin ? (
                        <Link href="/admin" className="btn-ghost text-[0.7rem] tracking-[0.12em] uppercase hidden md:flex">
                            <Settings size={14} className="text-gold" />
                            <span>Admin</span>
                        </Link>
                    ) : (
                        <Link href="/admin" className="btn-ghost text-gray-400 hidden md:flex">
                            <Lock size={14} />
                        </Link>
                    )}

                    <button onClick={() => setOpen(!open)} className="btn-ghost md:hidden text-black z-50 relative">
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="absolute top-[72px] left-0 right-0 bg-warm-white border-b border-gray-200 px-8 py-8 flex flex-col gap-6 shadow-2xl md:hidden"
                    >
                        {links.map(l => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className={`nav-link block text-sm ${pathname === l.href ? 'active text-black' : ''}`}
                                onClick={() => setOpen(false)}
                            >
                                {l.label}
                            </Link>
                        ))}
                        <div className="divider-gold my-2" />
                        <Link href="/admin" className="nav-link flex items-center gap-2" onClick={() => setOpen(false)}>
                            {isAdmin ? <><Settings size={14} /> Admin Dashboard</> : <><Lock size={14} /> Admin Login</>}
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
