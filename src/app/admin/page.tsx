'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, LogOut, Upload, X } from 'lucide-react';

export default function AdminPage() {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);

    useEffect(() => {
        fetch('/api/admin/verify').then(r => setIsAuth(r.ok));
    }, []);

    if (isAuth === null) return <div className="min-h-screen bg-warm-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-warm-white">
            {!isAuth ? (
                <LoginScreen onLogin={() => setIsAuth(true)} />
            ) : (
                <Dashboard onLogout={() => setIsAuth(false)} />
            )}
        </div>
    );
}

// ======================== LOGIN ========================
function LoginScreen({ onLogin }: { onLogin: () => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault(); setBusy(true); setError('');
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (res.ok) onLogin();
            else setError('Invalid credentials');
        } catch {
            setError('Network error');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-md bg-white border border-gray-200 p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                    <Lock size={20} className="text-gold" />
                    <h1 className="font-serif text-2xl font-light">Admin Access</h1>
                </div>

                <form onSubmit={submit}>
                    <div className="mb-6">
                        <label className="label-luxury">Email</label>
                        <input className="input-luxury" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@curated.co.ke" required autoFocus />
                    </div>
                    <div className="mb-8">
                        <label className="label-luxury">Password</label>
                        <input className="input-luxury" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                    </div>
                    {error && <div className="mb-6 py-3 px-4 bg-red-50 text-red-600 text-sm">{error}</div>}
                    <button type="submit" disabled={busy} className="btn-primary w-full justify-center">
                        {busy ? 'Verifying...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}

// ======================== DASHBOARD ========================
function Dashboard({ onLogout }: { onLogout: () => void }) {
    const router = useRouter();
    const [tab, setTab] = useState<'images' | 'renders' | 'brochure'>('images');

    const logout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        onLogout();
        router.refresh();
    };

    return (
        <div>
            <header className="bg-black text-warm-white h-[72px] flex items-center justify-between px-8 border-b border-gold/20 sticky top-0 z-50">
                <div className="font-serif text-xl tracking-[0.2em] font-light">CURATED <span className="text-gold italic">Admin</span></div>
                <div className="flex items-center gap-6">
                    <button onClick={() => router.push('/')} className="btn-ghost text-xs text-gray-400">View Site</button>
                    <button onClick={logout} className="btn-ghost text-xs text-gold flex items-center gap-2">
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </header>

            <div className="container mx-auto px-8 py-12 flex flex-col md:flex-row gap-12 max-w-7xl">
                {/* Sidebar */}
                <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
                    <span className="label-sm text-gray-400 mb-4 px-4">Content Management</span>
                    {[
                        { id: 'images', label: 'Images & Gallery' },
                        { id: 'renders', label: '3D Renders' },
                        { id: 'brochure', label: 'Brochure PDF' }
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id as any)}
                            className={`text-left px-4 py-3 text-sm font-medium tracking-wide border-l-2 transition-all ${tab === t.id ? 'border-gold bg-charcoal text-white' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Main Area */}
                <div className="flex-1 bg-white border border-gray-200 p-8 shadow-sm min-h-[500px]">
                    {tab === 'images' && <ImageManager />}
                    {tab === 'renders' && <RenderManager />}
                    {tab === 'brochure' && <BrochureManager />}
                </div>
            </div>
        </div>
    );
}

// ======================== TAB CONTENT ========================
function ImageManager() {
    const [files, setFiles] = useState<File[]>([]);
    const [category, setCategory] = useState('gallery');
    const [busy, setBusy] = useState(false);
    const [images, setImages] = useState<{ id: string, url: string, filename: string }[]>([]);

    const load = async () => {
        const r = await fetch('/api/images');
        const d = await r.json();
        if (d.success) setImages([...Object.entries(d.images).map(([cat, url]: any) => ({ id: cat, url, filename: cat, category: cat })), ...d.gallery.map((url: string, i: number) => ({ id: 'gal' + i, url, filename: 'Gallery Image', category: 'gallery' }))]);
    };

    useEffect(() => { load(); }, []);

    const upload = async () => {
        if (!files.length) return; setBusy(true);
        const fd = new FormData();
        files.forEach(f => fd.append('images', f));
        fd.append('category', category);
        await fetch('/api/images', { method: 'POST', body: fd });
        setFiles([]); setBusy(false); load();
    };

    const remove = async (url: string) => {
        if (!confirm('Delete image?')) return;
        await fetch('/api/images', { method: 'DELETE', body: JSON.stringify({ url }) });
        load();
    };

    return (
        <div>
            <h2 className="font-serif text-2xl mb-8">Manage Images</h2>

            <div className="flex flex-wrap gap-4 items-end bg-gray-50 p-6 border border-gray-200 mb-10">
                <label className="flex-1 flex flex-col gap-2 min-w-[200px]">
                    <span className="label-luxury !mb-0">Placement Category</span>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="input-luxury bg-white">
                        <option value="gallery">General Gallery</option>
                        <option value="hero">Homepage Hero</option>
                        <option value="neighborhood">Kitusuru About Image</option>
                        <option value="studio">Studio Unit Image</option>
                        <option value="oneBed">One Bed Unit Image</option>
                    </select>
                </label>
                <label className="flex-1 flex flex-col gap-2 min-w-[200px]">
                    <span className="label-luxury !mb-0">Select Files</span>
                    <input type="file" multiple accept="image/*" onChange={e => setFiles(Array.from(e.target.files || []))} className="input-luxury bg-white py-2" />
                </label>
                <button onClick={upload} disabled={busy || !files.length} className="btn-gold flex items-center gap-2">
                    <Upload size={14} /> {busy ? 'Uploading...' : 'Upload'}
                </button>
            </div>

            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {images.map(img => (
                    <div key={img.url} className="relative group break-inside-avoid shadow-sm border border-gray-200">
                        <img src={img.url} className="w-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                            <span className="text-white text-xs mb-3 text-center truncate w-full">{img.filename}</span>
                            <button onClick={() => remove(img.url)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"><X size={14} /></button>
                        </div>
                        <div className="absolute top-2 left-2 bg-white px-2 py-1 text-[0.65rem] uppercase tracking-wider font-medium shadow-sm">{img.category || 'gallery'}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function RenderManager() {
    const [files, setFiles] = useState<File[]>([]);
    const [busy, setBusy] = useState(false);
    const [renders, setRenders] = useState<any[]>([]);

    const load = async () => {
        const r = await fetch('/api/renders');
        const d = await r.json();
        if (d.success) setRenders(d.renders);
    };
    useEffect(() => { load(); }, []);

    const upload = async () => {
        if (!files.length) return; setBusy(true);
        const fd = new FormData();
        files.forEach(f => fd.append('renders', f));
        await fetch('/api/renders', { method: 'POST', body: fd });
        setFiles([]); setBusy(false); load();
    };

    const remove = async (url: string) => {
        if (!confirm('Delete render?')) return;
        await fetch('/api/renders', { method: 'DELETE', body: JSON.stringify({ url }) });
        load();
    };

    return (
        <div>
            <h2 className="font-serif text-2xl mb-8">3D Renders</h2>

            <div className="flex flex-wrap gap-4 items-end bg-gray-50 p-6 border border-gray-200 mb-10">
                <label className="flex-1 flex flex-col gap-2 min-w-[200px]">
                    <span className="label-luxury !mb-0">Select Files (Images/Videos)</span>
                    <input type="file" multiple onChange={e => setFiles(Array.from(e.target.files || []))} className="input-luxury bg-white py-2" />
                </label>
                <button onClick={upload} disabled={busy || !files.length} className="btn-gold flex items-center gap-2">
                    <Upload size={14} /> {busy ? 'Uploading...' : 'Upload'}
                </button>
            </div>

            {renders.length === 0 ? <p className="text-sm text-gray-500">No renders uploaded.</p> : (
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="text-xs uppercase bg-gray-50 tracking-wider">
                        <tr><th className="px-4 py-3 font-medium">Filename</th><th className="px-4 py-3 font-medium">Size</th><th className="px-4 py-3 font-medium">Actions</th></tr>
                    </thead>
                    <tbody>
                        {renders.map(r => (
                            <tr key={r.url} className="border-b border-gray-100 hover:bg-gray-50/50">
                                <td className="px-4 py-3 truncate max-w-[200px]">{r.filename}</td>
                                <td className="px-4 py-3">{(r.size / 1024 / 1024).toFixed(2)} MB</td>
                                <td className="px-4 py-3 flex gap-4">
                                    <a href={r.url} target="_blank" className="text-gold hover:underline">View</a>
                                    <button onClick={() => remove(r.url)} className="text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

function BrochureManager() {
    const [file, setFile] = useState<File | null>(null);
    const [busy, setBusy] = useState(false);
    const [brochure, setBrochure] = useState<any>(null);

    const load = async () => {
        const r = await fetch('/api/brochures');
        const d = await r.json();
        if (d.success) setBrochure(d.brochure);
    };
    useEffect(() => { load(); }, []);

    const upload = async () => {
        if (!file) return; setBusy(true);
        const fd = new FormData();
        fd.append('brochure', file);
        await fetch('/api/brochures', { method: 'POST', body: fd });
        setFile(null); setBusy(false); load();
    };

    const remove = async () => {
        if (!confirm('Remove current brochure?')) return;
        await fetch('/api/brochures', { method: 'DELETE' });
        load();
    };

    return (
        <div>
            <h2 className="font-serif text-2xl mb-8">Project Brochure</h2>

            {brochure && (
                <div className="bg-charcoal text-white p-6 mb-10 shadow-lg border-l-4 border-gold">
                    <span className="text-[0.65rem] tracking-wider uppercase text-gold block mb-2">Current Active Document</span>
                    <p className="font-medium text-lg mb-1">{brochure.filename}</p>
                    <p className="text-sm text-gray-400 mb-6">{(brochure.size / 1024 / 1024).toFixed(2)} MB — Uploaded {new Date(brochure.uploadedAt).toLocaleString()}</p>
                    <div className="flex gap-4">
                        <a href={brochure.url} target="_blank" className="btn-gold !py-2 !px-4 !text-[0.65rem]">Preview</a>
                        <button onClick={remove} className="btn-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 !py-2 !px-4 !text-[0.65rem]">Delete File</button>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap gap-4 items-end bg-gray-50 p-6 border border-gray-200">
                <label className="flex-1 flex flex-col gap-2 min-w-[200px]">
                    <span className="label-luxury !mb-0">Upload New PDF (Replaces current)</span>
                    <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="input-luxury bg-white py-2" />
                </label>
                <button onClick={upload} disabled={busy || !file} className="btn-primary flex items-center gap-2">
                    <Upload size={14} /> {busy ? 'Uploading...' : 'Upload PDF'}
                </button>
            </div>
        </div>
    );
}
