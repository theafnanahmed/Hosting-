import React, { useState, useEffect } from 'react';
import { X, RefreshCw, ExternalLink, Globe, Shield, ShieldCheck, Lock, RotateCcw, ChevronLeft, ChevronRight, Share2, MoreHorizontal, Terminal, Activity, Database } from 'lucide-react';
import { Project, Framework } from '../types';

interface VirtualBrowserProps {
  project: Project;
  onClose: () => void;
}

export const VirtualBrowser: React.FC<VirtualBrowserProps> = ({ project, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  /* Fix: Correctly identifying dynamic frameworks using the Framework enum */
  const isDynamic = project.framework === Framework.NODE || project.framework === Framework.PYTHON;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-2 md:p-8 animate-in fade-in zoom-in duration-300">
      <div className="bg-[#1e1e1e] border border-dark-border w-full max-w-6xl h-full max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border-white/5">
        
        {/* Browser Header */}
        <div className="bg-[#2d2d2d] border-b border-dark-border px-6 py-4 flex items-center gap-6">
          <div className="flex gap-2.5">
            <button onClick={onClose} className="w-4 h-4 rounded-full bg-red-500/90 hover:bg-red-500 transition-all shadow-inner border border-red-600/30"></button>
            <div className="w-4 h-4 rounded-full bg-yellow-500/90 shadow-inner border border-yellow-600/30"></div>
            <div className="w-4 h-4 rounded-full bg-green-500/90 shadow-inner border border-green-600/30"></div>
          </div>
          
          <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl px-5 py-2.5 flex items-center gap-3 transition-all hover:bg-black/60 shadow-inner">
            <Shield size={16} className="text-emerald-500" />
            {/* Fix: Using project.url instead of deploymentUrl */}
            <span className="text-[13px] text-gray-300 font-mono flex-1 select-all tracking-tight">{project.url}</span>
            <Lock size={14} className="text-gray-600" />
          </div>

          <div className="flex items-center gap-3">
             <button onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 800); }} className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-gray-400">
              <RotateCcw size={18} className={isLoading ? 'animate-spin text-emerald-400' : ''} />
            </button>
            <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-gray-400">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Browser Content */}
        <div className="flex-1 bg-white relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-[#0f172a] flex flex-col items-center justify-center gap-8 z-20">
              <div className="relative">
                 <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Globe size={28} className="text-emerald-500 animate-pulse" />
                 </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-2xl font-black text-white tracking-tight">Initializing Dynamic Runtime</p>
                <p className="text-sm text-gray-500 font-mono animate-pulse uppercase tracking-[0.2em]">{project.framework} Node Ready</p>
              </div>
            </div>
          )}
          
          <div className="h-full w-full overflow-auto bg-slate-50 text-slate-900 selection:bg-brand-500/20 font-sans">
             {isDynamic ? (
                 <div className="p-12 max-w-4xl mx-auto space-y-12">
                     <header className="space-y-4">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-600 text-xs font-black uppercase tracking-widest">
                            <Activity size={14}/> Runtime Live
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight">{project.name} API</h1>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed">Dynamic backend service running on Node-Drive cluster.</p>
                     </header>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="p-8 bg-slate-900 rounded-[2rem] text-slate-300 font-mono text-sm shadow-2xl space-y-6">
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-white font-black uppercase tracking-widest text-[10px]">JSON Output</span>
                                <div className="flex gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-700"></div><div className="w-2 h-2 rounded-full bg-slate-700"></div></div>
                            </div>
                            <pre className="text-emerald-400 leading-relaxed overflow-x-auto">
{`{
  "status": "online",
  "version": "1.0.0",
  "runtime": "${project.framework}",
  "db_sync": "active",
  "uptime": "2h 45m",
  "endpoints": ["/api/v1/user", "/api/v1/data"]
}`}
                            </pre>
                         </div>
                         <div className="space-y-6">
                            <div className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm">
                                <h3 className="font-black text-slate-900 mb-4 flex items-center gap-3 uppercase text-xs tracking-widest"><Database className="text-emerald-500" size={18}/> DB State</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm font-medium"><span className="text-slate-400">Total Records</span><span>14,292</span></div>
                                    <div className="flex justify-between items-center text-sm font-medium"><span className="text-slate-400">Last Query</span><span>12ms ago</span></div>
                                </div>
                            </div>
                            <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2rem] shadow-sm">
                                <h3 className="font-black text-emerald-900 mb-2 uppercase text-xs tracking-widest">Server Alert</h3>
                                <p className="text-emerald-700 text-sm font-medium">Dynamic response generated successfully via Drive-Edge backend logic.</p>
                            </div>
                         </div>
                     </div>
                 </div>
             ) : (
                 <div className="max-w-3xl mx-auto py-20 px-6">
                    <header className="flex items-center gap-5 mb-16 animate-in slide-in-from-top-4 duration-700">
                         <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20">
                             <Globe size={36} />
                         </div>
                         <div>
                            <h1 className="text-6xl font-black tracking-tight text-slate-900">{project.name}</h1>
                            <p className="text-slate-500 font-bold uppercase tracking-widest mt-2 text-xs opacity-80">Frontend Deployment Stable</p>
                         </div>
                    </header>
                    
                    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px]"></div>
                            <h2 className="text-3xl font-black mb-6 flex items-center gap-4 tracking-tight">
                               <ShieldCheck className="text-emerald-500" size={32} /> 
                               Deployment Live
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-xl font-medium">
                                Your React application is now global. This static build is served from your personal Google Drive via our high-speed proxy network.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[2rem] shadow-sm hover:scale-[1.02] transition-transform">
                                <h3 className="font-black text-slate-800 mb-3 flex items-center gap-3 uppercase text-[10px] tracking-widest"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div> Stack Architecture</h3>
                                <p className="text-indigo-700 font-black text-2xl">{project.framework}</p>
                                <p className="text-xs text-indigo-600 mt-2 font-bold opacity-70 uppercase tracking-widest">Optimized Assets</p>
                            </div>
                            <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2rem] shadow-sm hover:scale-[1.02] transition-transform">
                                <h3 className="font-black text-slate-800 mb-3 flex items-center gap-3 uppercase text-[10px] tracking-widest"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Edge Network</h3>
                                <p className="text-emerald-700 font-black text-2xl">Serving Global</p>
                                <p className="text-xs text-emerald-600 mt-2 font-bold opacity-70 uppercase tracking-widest">100% Cache Hit Ratio</p>
                            </div>
                        </div>

                        <div className="p-10 bg-slate-900 text-slate-300 rounded-[2.5rem] font-mono text-xs shadow-2xl relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-6">
                                <span className="text-white font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2"><Terminal size={14} className="text-emerald-500"/> Runtime Logs</span>
                                <div className="flex gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-800 shadow-inner"></div><div className="w-2.5 h-2.5 rounded-full bg-slate-800 shadow-inner"></div></div>
                            </div>
                            <div className="space-y-2.5 opacity-80 font-medium">
                                <p className="text-emerald-400">✓ Production server handshaking successful</p>
                                <p className="text-blue-400">ℹ Optimizing asset loading priorities...</p>
                                <p className="text-indigo-400">ℹ ReactHost AI edge-caching verified.</p>
                                <p className="text-slate-500 mt-6 animate-pulse select-none">_ ready for connections</p>
                            </div>
                        </div>
                    </section>

                    <footer className="mt-24 pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                        <p>© 2024 {project.name} Cloud Platform</p>
                        <div className="flex gap-8">
                            <span className="hover:text-emerald-500 cursor-pointer transition-colors">Documentation</span>
                            <span className="hover:text-emerald-500 cursor-pointer transition-colors">Privacy Cloud</span>
                        </div>
                    </footer>
                 </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};