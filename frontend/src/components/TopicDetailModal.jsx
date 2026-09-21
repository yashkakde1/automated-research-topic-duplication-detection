import React from 'react';
import { X, Database, Tag, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export default function TopicDetailModal({ topic, onClose, onUseForComparison }) {
  if (!topic) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full border border-indigo-200 dark:border-indigo-800">
              {topic.domain}
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug font-heading">
              {topic.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {topic.keywords && (
            <div>
              <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Keywords</span>
              <p className="text-slate-800 dark:text-slate-200 font-semibold">{topic.keywords}</p>
            </div>
          )}

          <div>
            <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Date Added</span>
            <p className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {topic.created_at ? topic.created_at.split(' ')[0] : 'N/A'}
            </p>
          </div>
        </div>

        {/* Abstract */}
        <div>
          <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1 text-xs">Abstract / Proposal</span>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {topic.abstract}
          </div>
        </div>

        {/* Embedding Status Badge */}
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Semantic Embedding Status: <span className="font-extrabold text-emerald-700 dark:text-emerald-300">Embedding Available</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">384-D Vector</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Close Window
          </button>

          <button
            onClick={() => {
              onUseForComparison(topic);
              onClose();
            }}
            className="btn-primary-indigo text-xs"
          >
            Use for Comparison <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
