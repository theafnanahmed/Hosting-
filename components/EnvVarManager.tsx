
import React, { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, Lock } from 'lucide-react';
import { EnvVar } from '../types';

interface EnvVarManagerProps {
  vars: EnvVar[];
  onUpdate: (vars: EnvVar[]) => void;
}

export const EnvVarManager: React.FC<EnvVarManagerProps> = ({ vars, onUpdate }) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showValues, setShowValues] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey || !newValue) return;
    
    // Basic validation
    const formattedKey = newKey.toUpperCase().replace(/ /g, '_');
    
    const newVar: EnvVar = {
      id: Math.random().toString(36).substr(2, 9),
      key: formattedKey,
      value: newValue
    };
    
    onUpdate([...vars, newVar]);
    setNewKey('');
    setNewValue('');
  };

  const handleDelete = (id: string) => {
    onUpdate(vars.filter(v => v.id !== id));
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lock size={18} className="text-brand-400" /> Environment Variables
        </h3>
        <button 
            onClick={() => setShowValues(!showValues)}
            className="text-gray-400 hover:text-white transition"
        >
            {showValues ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      
      <p className="text-sm text-gray-500 mb-6">
        Secrets and configuration keys for your application. These are encrypted at rest.
      </p>

      <div className="space-y-3 mb-6">
        {vars.map((v) => (
          <div key={v.id} className="flex items-center gap-3 group">
            <div className="flex-1 bg-black/30 border border-dark-border rounded px-3 py-2 font-mono text-sm text-brand-300">
                {v.key}
            </div>
            <div className="flex-1 bg-black/30 border border-dark-border rounded px-3 py-2 font-mono text-sm text-gray-300 relative overflow-hidden">
                {showValues ? v.value : '•'.repeat(v.value.length + 5)}
            </div>
            <button 
                onClick={() => handleDelete(v.id)}
                className="p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash2 size={16} />
            </button>
          </div>
        ))}
        {vars.length === 0 && <div className="text-center text-gray-600 text-sm italic py-2">No variables set</div>}
      </div>

      <form onSubmit={handleAdd} className="flex gap-3 pt-4 border-t border-dark-border">
        <input 
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="KEY (e.g. API_KEY)" 
            className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:border-brand-500 outline-none uppercase"
        />
        <input 
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value" 
            type={showValues ? "text" : "password"}
            className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:border-brand-500 outline-none"
        />
        <button 
            type="submit"
            disabled={!newKey || !newValue}
            className="bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white p-2 rounded-lg transition"
        >
            <Plus size={20} />
        </button>
      </form>
    </div>
  );
};
