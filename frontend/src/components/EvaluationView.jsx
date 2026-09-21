import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, XCircle, Sliders, ShieldCheck, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function EvaluationView() {
  const [threshold, setThreshold] = useState(0.35);
  const [evalData, setEvalData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEvaluation = async (tVal) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/evaluate?threshold=${tVal}`);
      const data = await res.json();
      setEvalData(data);
    } catch (err) {
      console.error('Evaluation fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluation(threshold);
  }, [threshold]);

  const metrics = evalData?.evaluation_metrics;
  const cm = evalData?.confusion_matrix;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400 animate-pulse" />
            Model Evaluation & Benchmark Performance (10-Mark Rubric Module)
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Empirical validation of the Hybrid Lexical-Semantic NLP Engine against ground-truth duplicate paper pairs.
          </p>
        </div>

        {/* Classification Threshold Slider */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
            <Sliders className="w-4 h-4 text-indigo-400" /> Threshold Cutoff:
          </div>
          <input
            type="range"
            min="0.15"
            max="0.75"
            step="0.05"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-32 accent-indigo-500 cursor-pointer"
          />
          <span className="text-sm font-extrabold text-white bg-indigo-500/20 px-2.5 py-0.5 rounded-lg border border-indigo-500/30">
            {Math.round(threshold * 100)}%
          </span>
        </div>
      </div>

      {/* 4 Core Classification Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20">
          <span className="text-xs font-bold uppercase text-slate-400">Accuracy</span>
          <div className="text-3xl font-black text-indigo-400 mt-1">{metrics?.accuracy || 0}%</div>
          <p className="text-[11px] text-slate-500 mt-1">Overall correct predictions ratio</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-purple-500/20">
          <span className="text-xs font-bold uppercase text-slate-400">Precision</span>
          <div className="text-3xl font-black text-purple-400 mt-1">{metrics?.precision || 0}%</div>
          <p className="text-[11px] text-slate-500 mt-1">True duplicates among flagged items</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-pink-500/20">
          <span className="text-xs font-bold uppercase text-slate-400">Recall (Sensitivity)</span>
          <div className="text-3xl font-black text-pink-400 mt-1">{metrics?.recall || 0}%</div>
          <p className="text-[11px] text-slate-500 mt-1">Ratio of true duplicates detected</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20">
          <span className="text-xs font-bold uppercase text-slate-400">F1-Score (Harmonic Mean)</span>
          <div className="text-3xl font-black text-emerald-400 mt-1">{metrics?.f1_score || 0}%</div>
          <p className="text-[11px] text-slate-500 mt-1">Balanced precision-recall score</p>
        </div>
      </div>

      {/* Confusion Matrix & Threshold Analysis Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Confusion Matrix Visual Box */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" /> Benchmark Confusion Matrix
          </h3>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center">
              <span className="text-xs text-emerald-300 font-semibold block">True Positives (TP)</span>
              <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">{cm?.true_positives}</span>
              <span className="text-[10px] text-emerald-400/70">Duplicates correctly flagged</span>
            </div>

            <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-center">
              <span className="text-xs text-red-300 font-semibold block">False Positives (FP)</span>
              <span className="text-2xl font-extrabold text-red-400 mt-1 block">{cm?.false_positives}</span>
              <span className="text-[10px] text-red-400/70">Novel topics misflagged</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-center">
              <span className="text-xs text-amber-300 font-semibold block">False Negatives (FN)</span>
              <span className="text-2xl font-extrabold text-amber-400 mt-1 block">{cm?.false_negatives}</span>
              <span className="text-[10px] text-amber-400/70">Duplicates missed</span>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-center">
              <span className="text-xs text-indigo-300 font-semibold block">True Negatives (TN)</span>
              <span className="text-2xl font-extrabold text-indigo-400 mt-1 block">{cm?.true_negatives}</span>
              <span className="text-[10px] text-indigo-400/70">Novel topics correctly cleared</span>
            </div>
          </div>
        </div>

        {/* Threshold vs F1-Score Curve */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" /> Threshold vs Precision / Recall / F1 Curve
          </h3>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evalData?.threshold_analysis || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="threshold" tick={{ fill: '#94a3b8', fontSize: 11 }} label={{ value: 'Similarity Threshold (%)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="f1_score" stroke="#10b981" strokeWidth={3} name="F1 Score (%)" />
                <Line type="monotone" dataKey="precision" stroke="#c084fc" strokeWidth={2} name="Precision (%)" />
                <Line type="monotone" dataKey="recall" stroke="#f43f5e" strokeWidth={2} name="Recall (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
