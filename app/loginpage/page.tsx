export default function LoginPage() {
  return (
    <div className="min-h-screen bg-purple-500 text-slate-900 p-8 flex flex-col items-center justify-center">
      <div className="bg-slate-800 text-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Login to Boardgamer</h1>

        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
            type="email"
            className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white"
            placeholder="you@example.com"
            />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white"
                placeholder="••••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded font-medium mt-2"
                >
                  Sign in 
                  </button>
          </form>
      </div>
    </div>
  );
}