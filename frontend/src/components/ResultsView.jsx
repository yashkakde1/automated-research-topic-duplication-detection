import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, HelpCircle, ArrowLeft, Database, Info, Layers, CheckCircle, Sparkles, Award } from 'lucide-react';

export default function ResultsView({ analysisData, onReset, onNavigateTab }) {
  if (!analysisData) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center max-w-xl mx-auto my-12 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30">
          <Info className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-white font-heading">No Analysis Results Available</h3>
        <p className="text-xs text-slate-400 font-medium">Please submit a proposed research paper topic form on the Home page to generate a duplication report.</p>
        <button onClick={onReset} className="btn-neon text-xs">
          Go to Detector Form
        </button>
      </div>
    );
  }

  const { query, similarity_score, status, status_color, status_badge_bg, top_matches, flag_explanation, nlp_method, threshold_notice } = analysisData;

  // Status Styling Configuration
  const getStatusBadge = () => {
    if (status === 'Potential Duplicate') {
      return {
        bg: 'bg-rose-500 text-white shadow-[0_0_25px_rgba(244,63,94,0.5)] border-rose-400',
        textColor: 'text-rose-400',
        barColor: 'bg-gradient-to-r from-rose-500 to-red-600',
        icon: ShieldAlert,
        label: 'Potential Duplicate'
      };
    } else if (status === 'Semantically Similar') {
      return {
        bg: 'bg-amber-500 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.5)] border-amber-400',
        textColor: 'text-amber-400',
        barColor: 'bg-gradient-to-r from-amber-500 to-orange-500',
        icon: AlertTriangle,
        label: 'Semantically Similar'
      };
    } else {
      return {
        bg: 'bg-emerald-500 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.5)] border-emerald-400',
        textColor: 'text-emerald-400',
        barColor: 'bg-gradient-to-r from-emerald-400 to-teal-500',
        icon: ShieldCheck,
        label: 'Likely Unique'
      };
    }
  };

  const statusConfig = getStatusBadge();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel rounded-3xl p-6 sm:p-8">
        <div>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 mb-2 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Test Another Research Topic
          </button>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-heading">
            Research Topic Analysis Report
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            NLP Vector Duplication Assessment • Sentence-BERT Model vs SQLite Database
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('database')}
            className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-black rounded-xl border border-slate-700 transition inline-flex items-center gap-2 shadow-md"
          >
            <Database className="w-4 h-4 text-cyan-400" /> Topic Database
          </button>
        </div>
      </div>

      {/* Main Score & Classification Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Score Gauge & Status */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Max Semantic Cosine Similarity
            </span>

            <div className="flex items-baseline gap-2">
              <span className={`text-6xl font-black tracking-tight font-heading ${statusConfig.textColor}`}>
                {similarity_score}%
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase">Match Score</span>
            </div>

            {/* Score Bar */}
            <div className="w-full bg-slate-900 rounded-full h-4 overflow-hidden p-0.5 border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${statusConfig.barColor}`}
                style={{ width: `${Math.min(100, Math.max(5, similarity_score))}%` }}
              ></div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Detection Status</span>
              <div className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider ${statusConfig.bg}`}>
                <StatusIcon className="w-4 h-4" />
                {statusConfig.label}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-semibold flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>NLP Method: <strong className="text-white">{nlp_method}</strong></span>
          </div>
        </div>

        {/* Right Card: Submitted Topic Details */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-black text-indigo-400 uppercase tracking-wider block mb-1">
              Proposed Research Paper Title
            </span>
            <h2 className="text-lg font-extrabold text-white leading-snug font-heading">
              {query.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Domain / Field</span>
              <span className="inline-block mt-1.5 px-3.5 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-black rounded-lg border border-indigo-500/30">
                {query.domain}
              </span>
            </div>

            {query.keywords && (
              <div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Keywords</span>
                <span className="text-xs text-slate-200 font-semibold mt-1.5 block">
                  {query.keywords}
                </span>
              </div>
            )}
          </div>

          <div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1.5">Abstract / Proposal</span>
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed max-h-36 overflow-y-auto font-medium">
              {query.abstract}
            </div>
          </div>
        </div>
      </div>

      {/* "Why was this topic flagged?" Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-black text-white font-heading">
            Why was this topic flagged?
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-gradient-to-r from-slate-900 to-indigo-950/60 border border-slate-800 p-5 rounded-2xl font-medium">
          {flag_explanation}
        </p>

        {/* Threshold Notice Box */}
        <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-start gap-3 text-xs text-indigo-200 font-medium">
          <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-extrabold text-white block">Demonstration Threshold Notice:</strong>
            <p>{threshold_notice}</p>
            <div className="pt-1.5 flex items-center gap-3 text-[11px] font-black">
              <span className="text-emerald-400">Below 50%: Likely Unique</span>
              <span>•</span>
              <span className="text-amber-400">50–75%: Semantically Similar</span>
              <span>•</span>
              <span className="text-rose-400">Above 75%: Potential Duplicate</span>
            </div>
          </div>
        </div>
      </div>

      {/* "Most Similar Research Topics" Matching List */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-3 font-heading">
            <span className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Database className="w-5 h-5" />
            </span>
            Most Similar Existing Research Topics
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Top candidate matches retrieved from the database ranked by SBERT vector cosine similarity.
          </p>
        </div>

        {top_matches && top_matches.length > 0 ? (
          <div className="space-y-4">
            {top_matches.map((item, idx) => {
              const sim = item.similarity;
              let simBadgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
              let barGradient = 'bg-gradient-to-r from-emerald-500 to-teal-400';
              if (sim > 75) {
                simBadgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
                barGradient = 'bg-gradient-to-r from-rose-500 to-red-500';
              } else if (sim >= 50) {
                simBadgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                barGradient = 'bg-gradient-to-r from-amber-500 to-orange-400';
              }

              return (
                <div
                  key={item.id || idx}
                  className="glass-card p-6 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-slate-500">Match #{idx + 1}</span>
                        <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-[11px] font-black rounded-md border border-indigo-500/30">
                          {item.domain}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white leading-snug font-heading">
                        {item.title}
                      </h4>
                    </div>

                    <div className={`px-3.5 py-1.5 rounded-xl border font-black text-xs whitespace-nowrap self-start ${simBadgeBg}`}>
                      Similarity: {sim}%
                    </div>
                  </div>

                  {/* Similarity Bar */}
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className={`h-full rounded-full ${barGradient}`} style={{ width: `${sim}%` }}></div>
                  </div>

                  {item.keywords && (
                    <div className="text-xs text-slate-400 font-medium">
                      <strong className="text-slate-200 font-bold">Keywords:</strong> {item.keywords}
                    </div>
                  )}

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 font-medium">
                    {item.abstract}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">
            No matching research topics found in the database.
          </div>
        )}
      </div>
    </div>
  );
}
