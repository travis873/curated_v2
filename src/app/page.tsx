// Regenerate the page in the background every 60 seconds (ISR)
// This makes the page load instantly from the CDN edge cache
export const revalidate = 60;

import Image from 'next/image';
import Link from 'next/link';
import { list } from '@vercel/blob';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { Reveal, FadeIn } from '@/components/Reveal';
import { verifyAuth } from '@/lib/auth';

// Server-side data fetching directly in the component!
async function getImages() {
  try {
    const { blobs } = await list({
      prefix: 'images/',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    const images: Record<string, string> = {
      hero: '',
      neighborhood: '',
      studio: '',
      oneBed: ''
    };
    for (const b of blobs) {
      const parts = b.pathname.split('/');
      const cat = parts.length > 2 ? parts[1] : 'gallery';
      if (cat !== 'gallery') images[cat] = b.url; // keeps latest
    }
    return images;
  } catch (e) {
    return { hero: '', neighborhood: '', studio: '', oneBed: '' };
  }
}

async function getBrochureUrl() {
  try {
    const { blobs } = await list({ prefix: 'brochures/' });
    if (!blobs.length) return null;
    return blobs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0].url;
  } catch {
    return null;
  }
}

export default async function Home() {
  const images = await getImages();
  const brochureUrl = await getBrochureUrl();
  const user = await verifyAuth();
  const isAdmin = !!user;

  return (
    <SmoothScroll>
      <Navigation isAdmin={isAdmin} />

      <main className="min-h-screen">
        {/* HERO SECTION */}
        <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-black">
          {images.hero ? (
            <div className="absolute inset-0 z-0">
              <Image
                src={images.hero}
                alt="Curated Kitusuru Exterior"
                fill
                priority
                className="object-cover opacity-70 scale-[1.05] transition-transform duration-[20s] ease-out -translate-y-4"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-charcoal z-0" />
          )}

          <div className="container relative z-10 px-6 mx-auto flex flex-col items-center text-center pt-20">
            <FadeIn>
              <h1 className="display-xl text-warm-white mb-6 tracking-wide drop-shadow-xl text-shadow">
                A NEW STANDARD <br />
                <span className="text-gold italic font-light drop-shadow-sm">of Living</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="body-md text-gray-200 max-w-xl mx-auto mb-10 drop-shadow-md shadow-black">
                Discover Nairobi's most exclusive studio and one-bedroom residences. Masterfully designed for the modern elite in the heart of Kitusuru.
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/project" className="btn-gold">
                  Explore Residences
                </Link>
                {brochureUrl && (
                  <a href={brochureUrl} target="_blank" rel="noopener noreferrer" className="btn-outline border-warm-white text-warm-white hover:bg-warm-white hover:text-black hover:border-warm-white">
                    Download Brochure
                  </a>
                )}
              </div>
            </FadeIn>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="label-sm text-gold">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
          </div>
        </section>

        {/* NEIGHBOURHOOD REVEAL */}
        <section className="py-32 bg-warm-white relative">
          <div className="container px-6 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <Reveal>
                  <span className="label-sm text-gold block mb-6">The Location</span>
                </Reveal>
                <Reveal delay={0.1}>
                  <h2 className="display-md text-black mb-8">
                    Kitusuru's Most <br /><span className="italic text-gray-400">Coveted Address</span>
                  </h2>
                </Reveal>
                <Reveal delay={0.2}>
                  <p className="body-lg mb-8">
                    Set against the lush canopy of one of Nairobi's most prestigious neighbourhoods, Curated offers unprecedented access to diplomatic hubs, premier dining, and absolute tranquility.
                  </p>
                </Reveal>
                <Reveal delay={0.3}>
                  <Link href="/about" className="link-gold">Discover the Neighbourhood</Link>
                </Reveal>
              </div>

              <Reveal delay={0.2}>
                <div className="relative aspect-[4/5] img-reveal w-full max-w-md ml-auto">
                  {images.neighborhood ? (
                    <Image src={images.neighborhood} alt="Kitusuru Lifestyle" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-smoke flex items-center justify-center p-8 text-center text-warm-white">
                      <p className="body-sm text-gray-400">Neighborhood Image Pending</p>
                    </div>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* STATS BANNER */}
        <section className="py-24 bg-charcoal text-warm-white border-y border-gold/10">
          <div className="container px-6 mx-auto max-w-6xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center items-end">
              <Reveal delay={0.1} className="flex flex-col items-center">
                <div className="stat-number text-gold mb-2">32</div>
                <div className="label-sm text-gray-400">Exclusive Units</div>
              </Reveal>
              <Reveal delay={0.2} className="flex flex-col items-center lg:border-l border-gold/10">
                <div className="stat-number text-gold mb-2">24h</div>
                <div className="label-sm text-gray-400">Concierge Service</div>
              </Reveal>
              <Reveal delay={0.3} className="flex flex-col items-center lg:border-l border-gold/10">
                <div className="stat-number text-gold mb-2">10m</div>
                <div className="label-sm text-gray-400">To UN Headquarters</div>
              </Reveal>
              <Reveal delay={0.4} className="flex flex-col items-center lg:border-l border-gold/10">
                <div className="stat-number text-gold mb-2">100%</div>
                <div className="label-sm text-gray-400">Backup Power</div>
              </Reveal>
            </div>
          </div>
        </section>

      </main>

      <Footer brochureUrl={brochureUrl} isAdmin={isAdmin} />
    </SmoothScroll>
  );
}
