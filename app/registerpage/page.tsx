'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function RegisterPage() {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassowrd] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user: user,
        },
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Registration successful! Check your email for verification')
    }
  };

  return (
    <div className="min-h-screen bg-stone-200 text-slate-900 p-8 flex flex-col items-center justify-center">
      <div className="bg-slate-800 text-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        {message && <p className="text-sm text-yellow-400 mb-4">{message}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white"
            placeholder="something"
            required
            />
            </div>
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
              <div>
              <label className="block text-sm mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white"
                placeholder="••••••••••"
                required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded font-medium mt-2"
                >
                  Register 
                  </button>                  
          </form>
      </div>
    </div>
  );
}