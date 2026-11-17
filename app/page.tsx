'use client';

import BoardGameTable from './boardgametable';
import Navbar from './navbar';

export default function Home() {
 
  return (
    <div className="min-h-screen bg-stone-200 text-slate-900">
    <main className="p-2">
      <Navbar />
          <BoardGameTable />
        </main>
      </div>
  );
}