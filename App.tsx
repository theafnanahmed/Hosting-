
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Rocket, Server, Layout, Shield, Terminal as TerminalIcon, Settings, 
  Plus, Search, Globe, ChevronRight, Activity, Database, Key, 
  Trash2, ExternalLink, Bot, Send, X, RefreshCw, Cpu, Gauge
} from 'lucide-react';
import { Project, ProjectStatus, EnvVar, Framework } from './types';
import { getArchitectAdvice } from './services/geminiService';

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'ecommerce-store-v2',
    status: ProjectStatus.DEPLOYED,
    url: 'https://store-v2.reacthost.ai',
    createdAt: new Date().toISOString(),
    framework: Framework.REACT,
    logs: ['[Build] Optimized chunks...', '[CDN] Propagation 100%'],
    metrics: { cpu: '0.2%', ram: '124MB', requests: 1250 },
    env: [],
    filesCount: 42
  }
];

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('rh_projects');
    return saved ? JSON.parse(saved) : MOCK_PROJECTS;
  });
  
  const [activeTab, setActiveTab] = useState<'projects' | 'settings'>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  
  // Deployment Form State
  const [newProjectName, setNewProjectName] = useState('');
  const [deployStep, setDeployStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    localStorage.setItem('rh_projects', JSON.stringify(projects));
  }, [projects]);

  const selectedProject = useMemo(() => 
    projects.find(p => p.id === selectedProjectId), 
    [projects, selectedProjectId]
  );

  const startDeployment = async () => {
    setIsDeploying(true);
    setDeployStep(3);
    // Simulate Build Process
    await new Promise(r => setTimeout(r, 2000));
    
    const newProj: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      status: ProjectStatus.DEPLOYED,
      url: `https://${newProjectName.toLowerCase()}.reacthost.ai`,
      createdAt: new Date().toISOString(),
      framework: Framework.REACT,
      logs: ['[System] Booting node...', '[Build] Running npm run build', '[Success] Deployed to Global Edge'],
      metrics: { cpu: '0.1%', ram: '48MB', requests: 0 },
      env: [],
      filesCount: 15
    };
    
    setProjects([newProj, ...projects]);
    setIsDeploying(false);
    setTimeout(() => {
      setIsDeployModalOpen(false);
      setNewProjectName('');
      setDeployStep(1);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-brand-bg font-sans selection:bg-brand-primary/30">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 border-r border-brand-border flex flex-col items-center lg:items-stretch bg-brand-bg z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
            <Rocket size={24} />
          </div>
          <span className="hidden lg:block text-xl font-black tracking-tighter text-white">REACTHOST<span className="text-brand-primary">AI</span></span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarLink active={activeTab === 'projects'} onClick={() => {setActiveTab('projects'); setSelectedProjectId(null);}} icon={<Layout size={20}/>} label="Deployments" />
          <SidebarLink active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20}/>} label="Settings" />
        </nav>

        <div className="p-4 border-t border-brand-border">
          <div className="hidden lg:flex items-center gap-3 p-3 rounded-xl bg-brand-card border border-brand-border">
            <div className="w-8 h-8 rounded-full bg-brand-secondary/20 flex items-center justify-center text-brand-secondary font-bold text-xs">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Developer Pro</p>
              <p className="text-[10px] text-gray-500 font-medium">Free Tier</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-bg/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">
            {selectedProject ? `Project / ${selectedProject.name}` : activeTab}
          </h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAiOpen(!isAiOpen)}
              className="px-4 py-2 rounded-full border border-brand-border bg-brand-card hover:border-brand-primary transition-all text-xs font-bold flex items-center gap-2"
            >
              <Bot size={14} className="text-brand-primary" /> Architect
            </button>
            {!selectedProject && activeTab === 'projects' && (
              <button 
                onClick={() => setIsDeployModalOpen(true)}
                className="px-4 py-2 bg-brand-primary hover:bg-emerald-400 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/20 transition-all flex items-center gap-2"
              >
                <Plus size={18}/> New Project
              </button>
            )}
          </div>
        </header>

        {/* Dynamic View */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          {activeTab === 'settings' ? (
            <SettingsView />
          ) : selectedProject ? (
            <ProjectDetailView project={selectedProject} onBack={() => setSelectedProjectId(null)} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {projects.map(p => (
                <ProjectCard key={p.id} project={p} onClick={() => setSelectedProjectId(p.id)} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* AI Assistant Drawer */}
      {isAiOpen && (
        <AiAssistant 
          onClose={() => setIsAiOpen(false)} 
          currentProject={selectedProject || undefined} 
        />
      )}

      {/* Deploy Modal */}
      {isDeployModalOpen && (
        <DeployModal 
          isOpen={isDeployModalOpen} 
          onClose={() => setIsDeployModalOpen(false)}
          name={newProjectName}
          setName={setNewProjectName}
          step={deployStep}
          setStep={setDeployStep}
          isDeploying={isDeploying}
          onStart={startDeployment}
        />
      )}
    </div>
  );
}

// Sub-components
function SidebarLink({ icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${active ? 'bg-brand-primary/10 text-brand-primary font-bold' : 'text-gray-500 hover:bg-brand-card hover:text-white'}`}
    >
      {icon}
      <span className="hidden lg:block text-sm">{label}</span>
    </button>
  );
}

/* Fix: Explicitly defining ProjectCard as React.FC to fix the 'key' prop accessibility issue in TS map calls */
const ProjectCard: React.FC<{ project: Project; onClick: () => void }> = ({ project, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-brand-card border border-brand-border rounded-2xl p-6 hover:border-brand-primary/50 transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 blur-3xl group-hover:bg-brand-primary/10 transition-all"></div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-black text-white group-hover:text-brand-primary transition-colors">{project.name}</h3>
          <p className="text-xs text-gray-500 font-medium mt-1">{project.url.replace('https://', '')}</p>
        </div>
        <div className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter border ${project.status === ProjectStatus.DEPLOYED ? 'bg-emerald-500/10 text-brand-primary border-brand-primary/20' : 'bg-red-500/10 text-red-400 border-red-400/20'}`}>
          {project.status}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-8 border-t border-brand-border pt-6">
        <div className="flex items-center gap-2 text-gray-400">
          <Activity size={14}/> <span className="text-[10px] font-bold uppercase tracking-widest">{project.metrics.cpu} CPU</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Database size={14}/> <span className="text-[10px] font-bold uppercase tracking-widest">{project.metrics.ram} RAM</span>
        </div>
      </div>
    </div>
  );
}

function ProjectDetailView({ project, onBack }: { project: Project, onBack: () => void }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-gray-500 hover:text-white flex items-center gap-2 text-sm font-bold">
          <ChevronRight size={18} className="rotate-180" /> Back to Dashboard
        </button>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 bg-brand-card border border-brand-border hover:border-brand-primary rounded-xl text-sm font-bold text-white transition-all flex items-center gap-2">
            <RefreshCw size={16}/> Redeploy
          </button>
          <a href={project.url} target="_blank" className="px-6 py-2.5 bg-brand-primary hover:bg-emerald-400 rounded-xl text-sm font-bold text-white transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/20">
            <Globe size={16}/> Visit Site <ExternalLink size={14}/>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-brand-card border border-brand-border rounded-3xl p-8 relative overflow-hidden">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-white flex items-center gap-3">
                   <Activity className="text-brand-primary" /> Live Performance
                </h3>
             </div>
             <div className="grid grid-cols-3 gap-6">
                <MetricBox label="CPU Usage" value={project.metrics.cpu} sub="Optimal" />
                <MetricBox label="RAM Memory" value={project.metrics.ram} sub="Edge Hosted" />
                <MetricBox label="Global Req" value={project.metrics.requests.toString()} sub="Total Hits" />
             </div>
          </div>

          <div className="bg-brand-card border border-brand-border rounded-3xl p-8">
             <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <TerminalIcon className="text-brand-secondary" /> Production Logs
             </h3>
             <div className="bg-brand-bg rounded-2xl p-6 font-mono text-[11px] text-gray-300 min-h-[300px] border border-brand-border">
                {project.logs.map((log, i) => (
                  <p key={i} className="mb-2"><span className="text-gray-600 mr-3">[{new Date().toLocaleTimeString()}]</span> {log}</p>
                ))}
                <div className="animate-pulse text-brand-primary">_ server is listening</div>
             </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-brand-card border border-brand-border rounded-3xl p-8 space-y-6">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Project Details</h3>
              <DetailRow label="Framework" value={project.framework} icon={<Layout size={14}/>} />
              <DetailRow label="Region" value="Global Edge" icon={<Globe size={14}/>} />
              <DetailRow label="Build Files" value={project.filesCount.toString()} icon={<Database size={14}/>} />
           </div>

           <div className="bg-brand-card border border-brand-border rounded-3xl p-8">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Environment Variables</h3>
              <div className="p-4 bg-brand-bg rounded-xl border border-brand-border border-dashed text-center">
                 <p className="text-xs text-gray-600 font-bold">No secrets configured yet.</p>
                 <button className="mt-3 text-brand-primary text-xs font-black uppercase hover:underline">+ Add Variable</button>
              </div>
           </div>

           <button className="w-full py-4 rounded-2xl border border-brand-accent/30 text-brand-accent hover:bg-brand-accent/10 font-bold transition-all flex items-center justify-center gap-2">
             <Trash2 size={18}/> Delete Deployment
           </button>
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, value, sub }: any) {
  return (
    <div className="p-6 bg-brand-bg border border-brand-border rounded-2xl">
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="text-[10px] font-bold text-brand-primary mt-1">{sub}</p>
    </div>
  );
}

function DetailRow({ label, value, icon }: any) {
  return (
    <div className="flex justify-between items-center text-sm">
      <div className="flex items-center gap-2 text-gray-400 font-medium">
        {icon} <span>{label}</span>
      </div>
      <span className="text-white font-bold">{value}</span>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="max-w-3xl animate-in slide-in-from-bottom-4 duration-500">
       <h1 className="text-4xl font-black text-white mb-8 tracking-tighter">Account <span className="text-brand-primary">Settings</span></h1>
       <div className="bg-brand-card border border-brand-border rounded-3xl p-10 space-y-10">
          <section>
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Cloud Provider Auth</h3>
            <div className="space-y-4">
              <label className="block text-xs font-bold text-gray-500 mb-2">Google Drive Access Token (OAuth 2.0)</label>
              <div className="relative">
                <input type="password" placeholder="ya29.a0AfH6S..." className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-4 text-sm focus:border-brand-primary outline-none text-white" />
                <Key className="absolute right-4 top-4 text-gray-700" size={18} />
              </div>
              <p className="text-[10px] text-gray-600">Need a token? Generate one from the Google OAuth Playground.</p>
            </div>
          </section>

          <section className="pt-10 border-t border-brand-border">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">API Configuration</h3>
            <div className="p-6 bg-brand-bg border border-brand-border rounded-2xl flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-brand-primary"><Shield size={24}/></div>
                  <div>
                    <p className="text-sm font-bold text-white">Gemini Pro 2.5</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Connected & Online</p>
                  </div>
               </div>
               <button className="px-4 py-2 bg-brand-card border border-brand-border rounded-lg text-xs font-bold hover:text-white transition-colors">Test Connection</button>
            </div>
          </section>
       </div>
    </div>
  );
}

function AiAssistant({ onClose, currentProject }: any) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Namaste! Main ReactHost Architect hoon. Deployment mein koi help chahiye?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const userQ = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userQ }]);
    setIsLoading(true);
    
    const response = await getArchitectAdvice(userQ, currentProject);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-brand-card border-l border-brand-border shadow-2xl z-30 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-bg/20">
        <div className="flex items-center gap-3">
          <Bot className="text-brand-primary" size={24}/>
          <h3 className="font-black text-white text-sm uppercase tracking-widest">Architect AI</h3>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20}/></button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed ${m.role === 'user' ? 'bg-brand-primary text-white rounded-tr-none' : 'bg-brand-bg text-gray-200 border border-brand-border rounded-tl-none'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && <div className="animate-pulse flex items-center gap-2 text-brand-primary text-xs font-bold uppercase"><div className="w-2 h-2 rounded-full bg-brand-primary animate-ping"></div> Analyzing...</div>}
      </div>
      <form onSubmit={handleSend} className="p-6 border-t border-brand-border bg-brand-bg/50">
        <div className="flex gap-2">
          <input 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Architect..." 
            className="flex-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-sm text-white focus:border-brand-primary outline-none" 
          />
          <button type="submit" className="p-3 bg-brand-primary text-white rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-brand-primary/20">
            <Send size={18}/>
          </button>
        </div>
      </form>
    </div>
  );
}

function DeployModal({ isOpen, onClose, name, setName, step, setStep, isDeploying, onStart }: any) {
  return (
    <div className="fixed inset-0 bg-brand-bg/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-brand-card border border-brand-border rounded-[2.5rem] w-full max-w-xl p-10 shadow-2xl animate-in zoom-in duration-300">
         <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter">Deploy <span className="text-brand-primary">React</span></h2>
              <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">New Project Pipeline</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors"><X size={24}/></button>
         </div>

         {step === 1 && (
           <div className="space-y-8 animate-in fade-in duration-500">
             <div>
               <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Project Unique Name</label>
               <input 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="my-cool-webapp" 
                className="w-full bg-brand-bg border-2 border-brand-border rounded-2xl px-6 py-5 text-xl font-bold text-white focus:border-brand-primary outline-none transition-all" 
               />
             </div>
             <button 
              disabled={!name.trim()}
              onClick={() => setStep(2)}
              className="w-full py-5 bg-brand-primary hover:bg-emerald-400 disabled:opacity-50 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3"
             >
               Next Phase <ChevronRight size={20}/>
             </button>
           </div>
         )}

         {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
               <div className="border-2 border-dashed border-brand-border rounded-3xl p-12 text-center group hover:border-brand-primary/50 transition-all cursor-pointer">
                  <div className="w-20 h-20 bg-brand-bg rounded-3xl flex items-center justify-center mx-auto mb-6 text-brand-primary shadow-inner">
                    <Plus size={40}/>
                  </div>
                  <h4 className="text-xl font-black text-white">Select "dist" or "build" folder</h4>
                  <p className="text-sm text-gray-500 mt-2">Only built static files will be hosted.</p>
               </div>
               <button 
                onClick={onStart}
                className="w-full py-5 bg-brand-primary hover:bg-emerald-400 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3"
               >
                 Start Deployment <Rocket size={20}/>
               </button>
            </div>
         )}

         {step === 3 && (
            <div className="py-20 flex flex-col items-center justify-center space-y-8 text-center animate-in zoom-in duration-500">
               <div className="relative">
                 <div className="w-24 h-24 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center text-brand-primary">
                    <Rocket size={32} />
                 </div>
               </div>
               <div>
                 <h4 className="text-2xl font-black text-white mb-2">{isDeploying ? 'Provisioning Infrastructure...' : 'Launch Successful!'}</h4>
                 <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{isDeploying ? 'Syncing to global edge' : 'Redirection active'}</p>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}