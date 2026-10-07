'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, ArrowRight, Scissors } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login gagal.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        {/* Authentic Circular Official Logo */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#121212] bg-black shadow-lg mx-auto">
          <Image
            src="/logo.jpg"
            alt="Logo Resmi Rumah Jahit Salamah ZAHRIS"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#121212]">
            Selamat Datang Kembali
          </h1>
          <p className="text-xs md:text-sm text-[#6b645c] mt-1">
            Kelola pesanan dan produksi Rumah Jahit ZAHRIS.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-[#e2ded7] shadow-sm space-y-6">
          {error && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#121212] mb-1">
                Email Pengelola
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9c9387]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@zahris.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm bg-[#faf7f2] border border-[#e2ded7] rounded-lg focus:border-[#c29d59] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#121212] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9c9387]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm bg-[#faf7f2] border border-[#e2ded7] rounded-lg focus:border-[#c29d59] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#121212] hover:bg-[#262422] text-white text-xs md:text-sm font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
                <ArrowRight className="w-4 h-4 text-[#c29d59]" />
              </button>
            </div>
          </form>

          {/* Quick Credential Hint for Demo Test Run */}
          <div className="p-3 bg-[#faf7f2] rounded-lg border border-[#e2ded7] text-[11px] text-[#6b645c] space-y-1">
            <span className="font-semibold text-[#121212] block">Kredensial Default:</span>
            <p>Email: <code className="text-[#121212]">admin@zahris.com</code></p>
            <p>Password: <code className="text-[#121212]">adminzahris2026</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
