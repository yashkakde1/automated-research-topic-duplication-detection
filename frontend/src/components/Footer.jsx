import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-white py-8 px-4 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white font-heading">
              ResearchGuard
            </h3>
            <p className="text-xs text-slate-400">
              Automated Research Topic Duplication Detection • College Academic Project
            </p>
          </div>
        </div>

        {/* Center Quick Navigation Links */}
        <div className="flex items-center gap-6 text-xs font-semibold text-slate-300">
          <button 
            onClick={() => setActiveTab('detector')}
            className="hover:text-white transition"
          >
            Detector
          </button>
          <button 
            onClick={() => setActiveTab('topics')}
            className="hover:text-white transition"
          >
            Research Topics
          </button>
          <button 
            onClick={() => setActiveTab('add-topic')}
            className="hover:text-white transition"
          >
            Add Topic
          </button>
          <button 
            onClick={() => setActiveTab('about')}
            className="hover:text-white transition"
          >
            About
          </button>
        </div>

        {/* Bottom Tagline */}
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Built using NLP and Semantic Similarity</span>
        </div>
      </div>
    </footer>
  );
}
