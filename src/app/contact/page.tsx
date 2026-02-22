import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { FadeIn, Reveal } from '@/components/Reveal';
import { verifyAuth } from '@/lib/auth';

export default async function ContactPage() {
    const user = await verifyAuth();

    return (
        <SmoothScroll>
            <Navigation isAdmin={!!user} />

            <main className="min-h-screen pt-[72px] bg-warm-white pb-32">
                <section className="pt-20 pb-12 text-center container px-6 mx-auto">
                    <FadeIn>
                        <span className="label-sm text-gold mb-6 block">Enquiries</span>
                        <h1 className="display-lg mb-8">
                            Get in <span className="text-gray-400 italic font-light">Touch</span>
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.2} className="max-w-xl mx-auto">
                        <p className="body-md mb-12">
                            Register your interest to receive an invitation to our private display suite, or contact our dedicated sales team directly.
                        </p>
                    </FadeIn>
                </section>

                <section className="py-12">
                    <div className="container px-6 mx-auto max-w-5xl">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-16">

                            <Reveal className="md:col-span-2">
                                <div className="bg-charcoal text-warm-white p-10 h-full">
                                    <h3 className="font-serif text-2xl mb-8 font-light">Sales Gallery</h3>

                                    <div className="space-y-8">
                                        <div>
                                            <span className="label-sm text-gold block mb-2">Address</span>
                                            <p className="body-sm text-gray-300">By Private Appointment Only<br />Kitusuru Road<br />Nairobi, Kenya</p>
                                        </div>

                                        <div>
                                            <span className="label-sm text-gold block mb-2">Direct Contact</span>
                                            <p className="body-sm text-gray-300 mb-1">+254 700 000 000</p>
                                            <p className="body-sm text-gray-300">info@curated.co.ke</p>
                                        </div>

                                        <div>
                                            <span className="label-sm text-gold block mb-2">Hours</span>
                                            <p className="body-sm text-gray-300">Mon - Fri: 9am — 5pm<br />Sat - Sun: 10am — 4pm</p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>

                            <Reveal delay={0.2} className="md:col-span-3">
                                <form className="bg-white p-10 border border-gray-200 h-full shadow-sm" action="#">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                                        <div>
                                            <label className="label-luxury">First Name</label>
                                            <input type="text" className="input-luxury" required />
                                        </div>
                                        <div>
                                            <label className="label-luxury">Last Name</label>
                                            <input type="text" className="input-luxury" required />
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <label className="label-luxury">Email Address</label>
                                        <input type="email" className="input-luxury" required />
                                    </div>

                                    <div className="mb-8">
                                        <label className="label-luxury">Phone Number</label>
                                        <input type="tel" className="input-luxury" />
                                    </div>

                                    <div className="mb-8">
                                        <label className="label-luxury">Interest Level</label>
                                        <select className="input-luxury bg-transparent" required defaultValue="">
                                            <option value="" disabled>Select an option</option>
                                            <option value="studio">Premium Studio</option>
                                            <option value="onebed">One Bedroom Suite</option>
                                            <option value="both">Both</option>
                                        </select>
                                    </div>

                                    {/* Form is visual only for this demo - easily wired to Resend/Email later */}
                                    <button type="button" className="btn-primary w-full justify-center mt-4">
                                        Submit Enquiry
                                    </button>
                                </form>
                            </Reveal>

                        </div>
                    </div>
                </section>

            </main>

            <Footer isAdmin={!!user} />
        </SmoothScroll>
    );
}
