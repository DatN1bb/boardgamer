import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-purple-500 text-slate-900">
    <main className="p-2">
      <header className="flex items-center justify-between mb-8">
      <h1 className="text-4xl font-bold mb-4 font-mono tracking-wide items-left text-left"> BOARDGAMER </h1>
      <Link href="/loginpage"
      className="inline-block bg-indogo-600 hover:bg-indigo-500 text-white font-medium px-6 py-6 rounded-lg transition-colors items-right text-right">
        Login 
        </Link>
      </header>
      </main>
      </div>
  );
}