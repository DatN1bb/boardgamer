'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from './lib/supabaseClient';

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile(userId: string) {
      console.log('Fetching profile for userId:', userId);

        const { data: profile, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

        console.log('Profile query result:', { profile, error });

        if (profile && profile.username) {
          setUsername(profile.username);
        } else {
        console.warn('Profile found, but username field was missing or empty');
      }
    setLoading(false);
  }

  supabase.auth.getSession().then(({ data: { session }, error }) => {
    console.log('Initial session check:', { session, error });
    if (session?.user) {
      fetchProfile(session.user.id);
    } else {
      setLoading(false);
    }
  });
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log('Auth state changed event:', event, session);
      if (session?.user) {
        setLoading(true);
        await fetchProfile(session.user.id);
      } else {
        setUsername(null);
        setLoading(false)
      }
    }
  );

  return () => {
    subscription.unsubscribe();
  };
}, []);

const handleLogout = async () => {
  await supabase.auth.signOut({ scope: 'local' });
};

  return (
    <div className="min-h-screen bg-purple-500 text-slate-900">
    <main className="p-2">
      <header className="flex items-center justify-between mb-8">
      <h1 className="text-4xl font-bold mb-4 font-mono tracking-wide items-left text-left"> BOARDGAMER </h1>

      <div>
        {loading ? (
          <span className="text-white">Loading...</span>
        ) : username ? (
          <div className="flex items-center gap-4">
            <span className="text-white font-medium"> Hello, {username}!</span>
            <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Sign Out 
              </button>
              </div>
        ) : (
          <Link
          href="/loginpage"
          className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition-colors "
          >
            Login
            </Link>
        )}
            </div>
          </header>
        </main>
      </div>
  );
}