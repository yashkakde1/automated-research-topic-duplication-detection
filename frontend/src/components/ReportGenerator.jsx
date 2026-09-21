import React from 'react';
import { Printer, Download, FileCheck, ShieldAlert, Sparkles } from 'lucide-react';

export default function ReportGenerator({ analysisData }) {
  const handlePrint = () => {
    window.print();
  };

  if (!analysisData) {
    return (
      <div className="glass-panel p-12 text-center rounded-2xl space-y-4">
        <FileCheck className="w-12 h-12 text-indigo-400 mx-auto opacity-70" />
        <h3 className="text-lg font-bold text-white">No Analysis Data Available for Report</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Please run a duplication check in the "Detector Wizard" tab first to generate a detailed printable report.
        </p>
      </div>
    );
  }

  const { query_summary, risk_assessment, top_matches, novelty_recommendations } = analysisData;

  return (
    <div className="space-y-6">
      {/* Printable Action Bar */}
      <div className="flex items-center justify-between glass-panel p-4 rounded-2xl border border-indigo-500/20 print:hidden">
        <div>
          <h2 className="text-base font-bold text-white">Official Research Topic Duplication Assessment Report</h2>
          <p className="text-slate-400 text-xs">Ready for university review board or funding agency evaluation.</p>
        </div>
        <button
          onClick={handlePrint}
          className="glow-button px-5 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2"
        >
          <Printer className="w-4 h-4" /> Print / Export PDF Report
        </button>
      </div>

      {/* Formal Printable Document Layout */}
      <div className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-2xl text-slate-200 space-y-8 print:bg-white print:text-black print:p-0 print:border-none">
        {/* Document Header */}
        <div className="border-b border-slate-800 print:border-black pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white print:text-black uppercase tracking-tight">
              Research Topic Originality & Duplication Assessment
            </h1>
            <p className="text-xs text-indigo-400 print:text-indigo-700 font-semibold mt-1">
              Automated NLP Duplication Detection System • Academic Integrity Portal
            </p>
          </div>
          <div className="text-right text-xs text-slate-400 print:text-gray-600">
            <div>Date: {new Date().toLocaleDateString()}</div>
            <div>Report ID: REP-{Math.floor(100000 + Math.random() * 900000)}</div>
          </div>
        </div>

        {/* Section 1: Submitted Proposal Overview */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 print:text-indigo-800">
            1. Submitted Proposal Details
          </h3>
          <div className="p-4 rounded-xl bg-slate-950/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 space-y-2 text-xs">
            <div>
              <span className="font-bold text-slate-400 print:text-gray-700">Title: </span>
              <span className="font-bold text-white print:text-black text-sm">{query_summary?.title}</span>
            </div>
            <div>
              <span className="font-bold text-slate-400 print:text-gray-700">Keywords: </span>
              <span>{query_summary?.extracted_keywords?.join(', ')}</span>
            </div>
            <div>
              <span className="font-bold text-slate-400 print:text-gray-700">Corpus Baseline Evaluated: </span>
              <span>{query_summary?.total_corpus_evaluated} Peer-Reviewed IEEE/arXiv Publications</span>
            </div>
          </div>
        </div>

        {/* Section 2: Duplication Risk Score */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 print:text-indigo-800">
            2. Originality Risk Assessment
          </h3>
          <div className="p-5 rounded-xl bg-slate-950/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 flex items-center justify-between">
            <div>
              <div className="text-xl font-extrabold text-white print:text-black">
                {risk_assessment?.risk_label}
              </div>
              <p className="text-xs text-slate-400 print:text-gray-700 mt-1 max-w-xl">
                {risk_assessment?.description}
              </p>
            </div>
            <div className="text-center bg-slate-900 print:bg-white p-4 rounded-xl border border-slate-800 print:border-gray-300">
              <div className="text-3xl font-black text-indigo-400 print:text-indigo-700">
                {risk_assessment?.risk_score}%
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400 print:text-gray-600">Similarity Index</div>
            </div>
          </div>
        </div>

        {/* Section 3: Top Matched Publications */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 print:text-indigo-800">
            3. Highest Overlapping Publications
          </h3>
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 print:border-gray-300 text-slate-400 print:text-gray-700 font-bold">
                <th className="py-2">Paper ID</th>
                <th className="py-2">Publication Title</th>
                <th className="py-2">Authors & Year</th>
                <th className="py-2 text-right">Overlap Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 print:divide-gray-200">
              {top_matches?.map((p, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 font-mono text-indigo-400 print:text-indigo-700">{p.paper_id}</td>
                  <td className="py-2.5 font-semibold text-white print:text-black">{p.title}</td>
                  <td className="py-2.5 text-slate-400 print:text-gray-600">{p.authors?.join(', ')} ({p.year})</td>
                  <td className="py-2.5 text-right font-bold text-indigo-300 print:text-indigo-800">{p.overall_similarity}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 4: Recommended Novelty Adjustments */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 print:text-indigo-800">
            4. Recommendations to Ensure Research Novelty
          </h3>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300 print:text-gray-800">
            {novelty_recommendations?.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
