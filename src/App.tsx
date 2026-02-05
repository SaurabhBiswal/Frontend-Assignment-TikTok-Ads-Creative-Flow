import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginForm } from './components/LoginForm';
import { AdForm } from './components/AdForm';
import { AdPreview } from './components/AdPreview';
import { Volume2 } from 'lucide-react';
import { cn } from './utils/cn';
import type { AdPayload } from './types';

function App() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  const [previewData, setPreviewData] = useState<AdPayload>({
    campaignName: '',
    objective: 'TRAFFIC',
    adText: '',
    cta: 'Learn More',
    music: { type: 'NONE' }
  });

  const handleFormChange = (data: AdPayload) => {
    setPreviewData(data);
  };

  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-tiktok-pink border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-tiktok-black text-white selection:bg-tiktok-cyan/30">
      <nav className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
            <span className="text-black font-black text-xl italic">T</span>
          </div>
          <span className="font-bold tracking-tight text-lg">TikTok Ads <span className="text-zinc-500 font-normal">Creative Flow</span></span>
        </div>

        {isAuthenticated && user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-[10px] text-zinc-500">Connected Advertiser</p>
              </div>
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-tiktok-pink" />
            </div>
            <button
              onClick={logout}
              className="text-xs text-zinc-500 hover:text-white transition-colors underline decoration-zinc-700"
            >
              Sign Out
            </button>
          </div>
        )}
      </nav>

      <main className="container mx-auto max-w-6xl px-4 py-12 flex flex-col items-center">
        {!isAuthenticated ? (
          <div className="mt-12 w-full flex justify-center">
            <LoginForm />
          </div>
        ) : (
          <div className="w-full">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Create New Creative</h2>
                <p className="text-zinc-500 text-sm">Simulate your TikTok Ads creative workflow with real-time validation.</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                TikTok Ads API Connected
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7 xl:col-span-8">
                <AdForm onUpdatePreview={handleFormChange} />
              </div>

              <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 h-fit">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2 text-zinc-300">
                      <Volume2 className="w-4 h-4 text-tiktok-pink" />
                      Mobile Preview
                    </h3>
                    <span className="text-[10px] text-zinc-600 bg-zinc-900/50 px-2 py-0.5 rounded border border-zinc-800">9:16 Aspect</span>
                  </div>

                  <AdPreview data={previewData} />

                  <div className="p-4 bg-zinc-950/50 border border-zinc-900 rounded-xl space-y-3">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Logic Breakdown</h4>
                    <ul className="space-y-2">
                      <li className="text-[10px] flex gap-2">
                        <div className={cn("w-1 h-1 rounded-full mt-1.5 shrink-0", previewData.objective === 'TRAFFIC' ? "bg-tiktok-cyan" : "bg-zinc-700")}></div>
                        <span className={previewData.objective === 'TRAFFIC' ? "text-zinc-300" : "text-zinc-600"}>Traffic allows NO MUSIC selection</span>
                      </li>
                      <li className="text-[10px] flex gap-2">
                        <div className={cn("w-1 h-1 rounded-full mt-1.5 shrink-0", previewData.objective === 'CONVERSIONS' ? "bg-tiktok-pink" : "bg-zinc-700")}></div>
                        <span className={previewData.objective === 'CONVERSIONS' ? "text-zinc-300" : "text-zinc-600"}>Conversions REQUIRES a validated Music ID</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
