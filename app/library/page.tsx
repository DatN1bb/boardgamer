'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../navbar';

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
      <Navbar />
          <div className="border border-slate-300 w-full mt-2"></div>
        </main>
      </div>
  );
}