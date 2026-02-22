'use client';



export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    // Lenis JS scrolling was laggy with Framer Motion + Next.js Server Components.
    // Removed in favor of native CSS scroll-behavior: smooth in globals.css
    return <>{children}</>;
}
