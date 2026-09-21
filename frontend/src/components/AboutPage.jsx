import React from 'react';
import { BookOpen, AlertCircle, ShieldCheck, Cpu, Target, Clock, Brain, BarChart3, Info } from 'lucide-react';

export default function AboutPage() {
  const techStack = [
    { name: "React", desc: "Frontend Framework" },
    { name: "Tailwind CSS", desc: "Styling & Responsive UI" },
    { name: "FastAPI", desc: "Python Web Framework" },
    { name: "Python", desc: "Backend Language" },
    { name: "Sentence-BERT", desc: "384-D Dense Embeddings" },
    { name: "SQLite", desc: "Topic Database" },
    { name: "Cosine Similarity", desc: "Vector Distance Math" }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="academic-card p-6 sm:p-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-heading">
              About the Project
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              ResearchGuard • Automated Research Topic Duplication Detection System
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Section 1: Problem & Section 2: Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section 1: Problem */}
        <div className="academic-card p-6 sm:p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
            Problem
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Manually checking whether proposed research topics are similar to existing published topics can be extremely time-consuming and subjective for academic review committees. As research publication volumes grow exponentially, human review alone faces challenges identifying subtle semantic topic overlaps across diverse disciplines.
          </p>
        </div>

        {/* Section 2: Solution */}
        <div className="academic-card p-6 sm:p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
            Solution
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            This system uses Natural Language Processing (NLP), Sentence-BERT dense vector embeddings, and cosine similarity to automatically identify potentially similar research topics. By converting textual proposals into numerical vector spaces, the system calculates mathematical concept overlap beyond simple keyword matching.
          </p>
        </div>
      </div>

      {/* Section 3: Technology */}
      <div className="academic-card p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
          <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Technology
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {techStack.map((tech) => (
            <div key={tech.name} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-center space-y-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white block font-heading">{tech.name}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">{tech.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Project Objective */}
      <div className="academic-card p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
          <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Project Objective
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white font-heading">Detect Similar Topics</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Identify semantic concept overlaps between newly proposed topics and published papers.
            </p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white font-heading">Reduce Manual Checking</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Streamline preliminary research evaluation for students, professors, and review committees.
            </p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white font-heading">Use Semantic NLP</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Apply Sentence-BERT transformers to understand contextual meaning beyond exact wording.
            </p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white font-heading">Provide Clear Results</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Deliver objective similarity percentage scores and categorized risk assessments.
            </p>
          </div>

        </div>

        {/* Disclaimer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3 border border-slate-200 dark:border-slate-800 font-medium">
          <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-slate-900 dark:text-white">Academic Decision-Support Tool Disclaimer:</strong>
            <p className="mt-0.5">
              This system is intended as an academic decision-support tool. Similarity results depend on the topics available in the database and should be reviewed by a researcher.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
