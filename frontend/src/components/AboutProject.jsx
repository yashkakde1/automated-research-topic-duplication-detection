import React from 'react';
import { BookOpen, Cpu, Database, Award, ArrowRight, Layers, CheckCircle2, ShieldCheck, Target, Zap, Activity } from 'lucide-react';

export default function AboutProject() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Title Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-purple-500/15 text-purple-300 text-xs font-black rounded-full border border-purple-500/30 mb-4">
          <Award className="w-3.5 h-3.5" /> Academic Final Year Software Project
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-heading">
          Automated Research Topic Duplication Detection Using NLP
        </h1>
        <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">
          Comprehensive project documentation, problem statement, natural language processing methodology, system architecture workflow, and academic benefits.
        </p>
      </div>

      {/* Grid: Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem Card */}
        <div className="glass-card p-6 sm:p-8 space-y-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center border border-rose-500/30">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-white font-heading">
            Problem Statement
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            In academic institutions and research grant evaluation committees, students and researchers frequently submit research paper proposals that closely mirror previously published work.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Manual evaluation of research topic novelty is time-consuming, highly subjective, and prone to human oversight—especially as academic publication volume grows across multiple specialized domains.
          </p>
        </div>

        {/* Proposed Solution Card */}
        <div className="glass-card p-6 sm:p-8 space-y-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-white font-heading">
            Proposed Solution
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            This project provides an automated, objective NLP software application to evaluate proposed research paper titles and abstracts against an indexed database of published research topics.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Using Sentence-BERT (SBERT) vector representations and Cosine Similarity, the system measures deep semantic concept overlap rather than simple exact keyword matching.
          </p>
        </div>
      </div>

      {/* SYSTEM WORKFLOW TIMELINE */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/15 text-indigo-300 text-xs font-black rounded-full mb-2 border border-indigo-500/30">
            <Zap className="w-3.5 h-3.5" /> Complete Execution Pipeline
          </div>
          <h2 className="text-2xl font-black text-white font-heading">
            System Architecture Workflow
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">End-to-end data processing flow from topic input to classification result.</p>
        </div>

        {/* Workflow Diagram Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-center text-xs font-bold">
            
            <div className="p-3.5 bg-indigo-500/10 rounded-xl border border-indigo-500/30 space-y-1">
              <span className="text-indigo-400 block text-[10px] font-black uppercase">1. Input</span>
              <span className="text-white block text-xs font-bold">User Input</span>
            </div>

            <div className="hidden sm:flex items-center justify-center text-indigo-400 font-black">→</div>

            <div className="p-3.5 bg-purple-500/10 rounded-xl border border-purple-500/30 space-y-1">
              <span className="text-purple-400 block text-[10px] font-black uppercase">2. Preprocess</span>
              <span className="text-white block text-xs font-bold">Text Cleanup</span>
            </div>

            <div className="hidden sm:flex items-center justify-center text-indigo-400 font-black">→</div>

            <div className="p-3.5 bg-pink-500/10 rounded-xl border border-pink-500/30 space-y-1">
              <span className="text-pink-400 block text-[10px] font-black uppercase">3. SBERT</span>
              <span className="text-white block text-xs font-bold">384-D Vector</span>
            </div>

            <div className="hidden sm:flex items-center justify-center text-indigo-400 font-black">→</div>

            <div className="p-3.5 bg-cyan-500/10 rounded-xl border border-cyan-500/30 space-y-1">
              <span className="text-cyan-400 block text-[10px] font-black uppercase">4. DB</span>
              <span className="text-white block text-xs font-bold">SQLite Corpus</span>
            </div>

            <div className="hidden sm:flex items-center justify-center text-indigo-400 font-black">→</div>

            <div className="p-3.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30 space-y-1">
              <span className="text-emerald-400 block text-[10px] font-black uppercase">5. Math</span>
              <span className="text-white block text-xs font-bold">Cosine Sim</span>
            </div>

            <div className="hidden sm:flex items-center justify-center text-indigo-400 font-black">→</div>

            <div className="p-3.5 bg-amber-500/10 rounded-xl border border-amber-500/30 space-y-1">
              <span className="text-amber-400 block text-[10px] font-black uppercase">6. Rank</span>
              <span className="text-white block text-xs font-bold">Top Matches</span>
            </div>

            <div className="hidden sm:flex items-center justify-center text-indigo-400 font-black">→</div>

            <div className="p-3.5 bg-teal-500/10 rounded-xl border border-teal-500/30 space-y-1">
              <span className="text-teal-400 block text-[10px] font-black uppercase">7. Threshold</span>
              <span className="text-white block text-xs font-bold">Classify</span>
            </div>

            <div className="hidden sm:flex items-center justify-center text-indigo-400 font-black">→</div>

            <div className="p-3.5 bg-rose-500/10 rounded-xl border border-rose-500/30 space-y-1">
              <span className="text-rose-400 block text-[10px] font-black uppercase">8. Output</span>
              <span className="text-white block text-xs font-bold">Results UI</span>
            </div>

          </div>
        </div>
      </div>

      {/* NLP Approach Technical Explanation */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 space-y-4">
        <h2 className="text-2xl font-black text-white flex items-center gap-3 font-heading">
          <Cpu className="w-6 h-6 text-indigo-400" /> Natural Language Processing (NLP) Approach
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-300 font-medium">
          <div className="glass-card p-6 space-y-2">
            <h3 className="font-extrabold text-white text-sm font-heading">Sentence-BERT (SBERT) Embeddings</h3>
            <p>
              Traditional keyword matching fails when two topics express identical research ideas using different phrasing or synonyms. Sentence-BERT uses a fine-tuned Siamese Transformer network (<code className="text-indigo-300 font-mono">all-MiniLM-L6-v2</code>) to map full sentences into 384-dimensional dense vector embeddings.
            </p>
          </div>

          <div className="glass-card p-6 space-y-2">
            <h3 className="font-extrabold text-white text-sm font-heading">Cosine Similarity Metric</h3>
            <p>
              Given vector representations <code className="text-indigo-300 font-mono">u</code> (query topic) and <code className="text-indigo-300 font-mono">v</code> (database topic), Cosine Similarity measures the cosine of the angle between them:
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-center text-purple-300 font-bold">
              Similarity = (u · v) / (||u|| * ||v||)
            </div>
            <p className="text-[11px] text-slate-400">
              Values range from 0.0 (completely distinct) to 1.0 (identical semantic meaning).
            </p>
          </div>
        </div>
      </div>

      {/* Expected Academic Benefits */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 space-y-4">
        <h2 className="text-2xl font-black text-white flex items-center gap-3 font-heading">
          <CheckCircle2 className="w-6 h-6 text-emerald-400" /> Expected Academic Benefits
        </h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-300">
          <li className="glass-card p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong className="text-white font-bold block mb-0.5">Saves Review Committee Time:</strong> Instantly screens proposed topics before formal manual committee review.</span>
          </li>
          <li className="glass-card p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong className="text-white font-bold block mb-0.5">Objective Similarity Metrics:</strong> Provides verifiable percentage similarity metrics instead of subjective guesswork.</span>
          </li>
          <li className="glass-card p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong className="text-white font-bold block mb-0.5">Privacy & Local Database:</strong> Uses local SQLite database (<code className="text-emerald-300 font-mono">research_topics.db</code>) with zero external dependency.</span>
          </li>
          <li className="glass-card p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong className="text-white font-bold block mb-0.5">Viva Presentation Ready:</strong> Built cleanly with fast response times and pre-loaded sample topics for project evaluation.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
