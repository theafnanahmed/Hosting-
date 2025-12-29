
export enum ProjectStatus {
  READY = 'Ready',
  BUILDING = 'Building',
  DEPLOYED = 'Deployed',
  ERROR = 'Build Failed',
  IDLE = 'Stopped'
}

export enum Framework {
  REACT = 'React',
  VITE = 'Vite',
  STATIC = 'Static',
  NODE = 'Node',
  PYTHON = 'Python'
}

export interface FileData {
  name: string;
  path: string;
  size: number;
  type: string;
}

export interface EnvVar {
  id: string;
  key: string;
  value: string;
}

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  url: string;
  deploymentUrl?: string;
  createdAt: string;
  framework: Framework;
  logs: string[];
  metrics: {
    cpu: string;
    ram: string;
    requests: number;
  };
  env: EnvVar[];
  filesCount: number;
}