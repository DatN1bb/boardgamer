'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    <div className="min-h-screen bg-stone-200 text-slate-900">
    <main className="p-2">
      <header className="flex items-center justify-between mb-8">
      <Link href="/" className="text-4xl font-bold mb-1 font-mono tracking-wide items-left text-left pl-4 pt-4"> BOARDGAMER </Link>

      <div>
        {loading ? (
          <span className="text-white">Loading...</span>
        ) : username ? (
          <div className="flex items-center gap-4 relative inline-block">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-slate-900 font-medium flex items-center gap-1 cursor-pointer pr-2"> {username}!</button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-4 w-48 bg-white rounded-lg shadow-lg py-2 z-50 text-slate-900 top-full">
                <a href="/profile" className="block px-4 py-2 hover:bg-gray-200"> Profile</a>
              <a href="/library" className="block px-4 py-2 hover:bg-gray-200"> My Library</a>
              <div className="border-t my-1"></div>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-500 font-medium cursor-pointer "> Logout</button>
              </div>
            )}
              </div>
        ) : (
          <Link
          href="/loginpage"
          className="inline-block bg-indigo-600 hover:bg-indigo-400 text-white font-medium px-4 py-2 rounded-lg transition-colors "
          >
            Login
            </Link>
        )}
            </div>
            
          </header>
          <div className="border border-slate-300 w-full mt-2"></div>
        </main>
        <h1 className="text-4xl font-bold mb-4 font-mono tracking-wide items-middle text-middle text-center pt-4"> PROFILE </h1>
      </div>
  );
}