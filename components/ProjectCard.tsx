
import React from 'react';
import { Project, ProjectStatus, Framework } from '../types';
import { ExternalLink, Github, Server, Clock, Square, Code, Terminal, Zap, FileJson } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: (id: string) => void;
  onPreview: (url: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, onPreview }) => {
  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      /* Fix: Replaced invalid ProjectStatus properties with DEPLOYED, ERROR, and IDLE */
      case ProjectStatus.DEPLOYED: return 'bg-green-500/10 text-green-400 border-green-500/20';
      case ProjectStatus.BUILDING: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case ProjectStatus.ERROR: return 'bg-red-500/10 text-red-400 border-red-400/20';
      case ProjectStatus.IDLE: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getFrameworkIcon = (fw: Framework) => {
      switch(fw) {
          case Framework.REACT: return <Code size={14} className="text-blue-400" />;
          case Framework.NODE: return <Server size={14} className="text-green-500" />;
          case Framework.PYTHON: return <Terminal size={14} className="text-yellow-400" />;
          case Framework.VITE: return <Zap size={14} className="text-purple-400" />;
          default: return <FileJson size={14} className="text-orange-400" />;
      }
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card click
      /* Fix: Use DEPLOYED and url instead of LIVE and deploymentUrl */
      if (project.status === ProjectStatus.DEPLOYED && project.url) {
          onPreview(project.url);
      }
  };

  return (
    <div 
      onClick={() => onClick(project.id)}
      className="group bg-dark-card border border-dark-border rounded-xl p-5 hover:border-brand-500/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-brand-500/5"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white group-hover:text-brand-400 transition-colors">
            {project.name}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            {/* Fix: Use DEPLOYED and url */}
            {project.status === ProjectStatus.DEPLOYED && project.url ? (
                 <button 
                    onClick={handlePreviewClick}
                    className="text-xs text-gray-500 hover:text-brand-400 flex items-center gap-1 transition-colors z-10"
                >
                    {project.url.replace('https://', '')}
                    <ExternalLink size={10} />
                </button>
            ) : (
                <span className="text-xs text-gray-600 italic">
                    {/* Fix: Use IDLE for stopped status */}
                    {project.status === ProjectStatus.IDLE ? 'Deployment Stopped' : 'Not deployed'}
                </span>
            )}
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(project.status)}`}>
          {/* Fix: Use DEPLOYED */}
          {project.status === ProjectStatus.DEPLOYED && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>}
          {/* Fix: Use IDLE */}
          {project.status === ProjectStatus.IDLE && <Square size={8} fill="currentColor"/>}
          {project.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs text-gray-400 mt-6 border-t border-dark-border/50 pt-4">
        <div className="flex items-center gap-2">
            <Github size={14} />
            <span>main</span>
        </div>
        <div className="flex items-center gap-2">
            {getFrameworkIcon(project.framework)}
            <span>{project.framework}</span>
        </div>
        <div className="flex items-center gap-2 col-span-2">
            <Clock size={14} />
            <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};