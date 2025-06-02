"use client"
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#ece9e3] font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between bg-[#ece9e3]">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-lg text-black">
          <span className="inline-block w-6 h-6 bg-black rounded-full mr-2 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#fff"/><path d="M5 10a5 5 0 0 1 10 0v5H5v-5Z" fill="#000"/></svg>
          </span>
          Willy
        </div>
        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[16px] text-black font-medium">
          {/* <div className="relative group">
            <button className="flex items-center gap-1 hover:underline">Product <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block"><path d="M3 5l4 4 4-4"/></svg></button>
            <div className="absolute left-0 mt-2 w-40 bg-white rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-10">
              <a href="#" className="block px-4 py-2 hover:bg-[#f5f5f5]">Overview</a>
              <a href="#" className="block px-4 py-2 hover:bg-[#f5f5f5]">Features</a>
              <a href="#" className="block px-4 py-2 hover:bg-[#f5f5f5]">Integrations</a>
            </div>
          </div> */}
          {/* <a href="#" className="hover:underline">About us</a>
          <a href="#" className="hover:underline">Pricing</a>
          <a href="#" className="hover:underline">FAQ</a>
          <a href="#" className="hover:underline">Contact</a> */}
        </nav>
        {/* Actions */}
        {/* <div className="flex items-center gap-2">
          <button className="hidden md:inline-block px-4 py-1.5 rounded font-semibold text-black hover:bg-[#e2e0db] transition">Sign up</button>
          <button className="px-4 py-1.5 rounded bg-white border border-black/10 font-semibold text-black hover:bg-[#f5f5f5] transition">Login</button>
          <button className="ml-2 p-2 rounded hover:bg-[#e2e0db] transition">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="10" r="8"/><path d="M10 6v4l2 2"/></svg>
          </button>
        </div> */}
      </header>
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl w-full mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-0">
          {/* Left: Text & Features */}
          <div className="flex-1 flex flex-col justify-center items-start">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-black mb-4 leading-tight">
              AI Agents for Your Workflows
            </h1>
            <h2 className="text-2xl sm:text-3xl font-medium text-[#a39e94] mb-8 max-w-xl">
              Automate research, reporting, and communication with powerful AI agents. Save hours every week and supercharge your productivity.
            </h2>
            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 mb-10 w-full max-w-lg">
              <div className="flex items-start gap-3">
                <span className="mt-1"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-black"><circle cx="10" cy="10" r="9" /><path d="M7 10l2 2 4-4" /></svg></span>
                <div>
                  <div className="font-semibold text-black">Calendar & Meeting Research</div>
                  <div className="text-[#7c786f] text-sm">Get daily summaries and background on your meetings.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-black"><rect x="4" y="4" width="12" height="12" rx="2" /><path d="M8 8h4v4H8z" /></svg></span>
                <div>
                  <div className="font-semibold text-black">Automated Company Reports</div>
                  <div className="text-[#7c786f] text-sm">Weekly activity, progress, and highlights—delivered.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-black"><path d="M7 7l6 6M7 13l6-6" /><circle cx="10" cy="10" r="9" /></svg></span>
                <div>
                  <div className="font-semibold text-black">Fundraising & VC Outreach</div>
                  <div className="text-[#7c786f] text-sm">Identify and organize VC firms for targeted outreach.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-black"><path d="M4 12h12M4 8h12" /><circle cx="10" cy="10" r="9" /></svg></span>
                <div>
                  <div className="font-semibold text-black">Curated News Digests</div>
                  <div className="text-[#7c786f] text-sm">Get the latest news and startup updates in your inbox.</div>
                </div>
              </div>
            </div>
            {/* CTA Buttons */}
            <div className="flex gap-3 mb-8">
              <button onClick={() => router.push('/login')} className="bg-black text-white px-6 py-2 rounded font-semibold hover:bg-[#222] transition">Get started</button>
              <button onClick={() => router.push('/login')} className="bg-white border border-black/10 px-6 py-2 rounded font-semibold text-black hover:bg-[#f5f5f5] transition"> Book a demo <span className="ml-1">→</span></button>
            </div>
            <div className="text-[#a39e94] text-sm mt-2">2 of 3 — <span className="font-medium text-black">Issues</span></div>
          </div>
          {/* Right: Product Screenshot Placeholder */}
          <div className="flex-1 flex justify-center items-center w-full mb-10 lg:mb-0">
            <div className="w-full max-w-xl h-[420px] bg-white rounded-2xl shadow-xl border border-[#e2e0db] flex items-center justify-center overflow-hidden">
              {/* Replace this div with <Image ... /> for a real screenshot */}
              <span className="text-[#d6d3cb] text-2xl font-bold">[ Product Screenshot ]</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Add this to your global CSS for the gradient animation:
// @keyframes gradient {
//   0%, 100% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
// }
// .animate-gradient { background-size: 200% 200%; animation: gradient 8s ease-in-out infinite; }
