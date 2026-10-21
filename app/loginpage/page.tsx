'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage() {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassowrd] = useState('');
  const [message, setMessage] = useState('');

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Logged in successfully!');
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-stone-200 text-slate-900 p-8 flex flex-col items-center justify-center">
      <div className="bg-slate-800 text-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Login to Boardgamer</h1>
        {message && <p className="text-sm text-yellow-400 mb-4">{message}</p>}

        <form onSubmit={handleLogin} className="space-y-4">     
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white"
            placeholder="you@example.com"
            required
            />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassowrd(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white"
                placeholder="••••••••••"
                required 
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded font-medium mt-2"
                >
                  Sign in 
                  </button>
                  <Link href="/registerpage"
      className="  text-white font-medium px-6 py-6 transition-colors text-middle hover:blue-500">
        Don't have an account? make one.
        </Link>
          </form>
      </div>
    </div>
  );
}