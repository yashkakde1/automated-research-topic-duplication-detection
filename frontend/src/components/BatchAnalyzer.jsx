import React, { useState } from 'react';
import { Layers, Upload, Cpu, CheckCircle, AlertTriangle, ShieldAlert, FileSpreadsheet } from 'lucide-react';

export default function BatchAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [batchResults, setBatchResults] = useState(null);

  const sampleBatchProposals = [
    {
      title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
      abstract: "We introduce BERT model for bidirectional pre-training over unlabeled text for downstream NLP tasks.",
      keywords: "BERT, Transformers, NLP"
    },
    {
      title: "Neuromorphic Computing Chips for Low-Power Edge Vision",
      abstract: "Spiking neural network hardware architectures fabricated on 7nm CMOS for event-driven vision processing.",
      keywords: "Neuromorphic, Spiking Neural Network, Edge Hardware"
    },
    {
      title: "Generative Adversarial Nets for Image Synthesis",
      abstract: "Generative models trained with adversarial minimax games between generator G and discriminator D.",
      keywords: "GAN, Generative Models, Deep Learning"
    },
    {
      title: "Autonomous Swarm Robotics Communication using LoRa Mesh Networks",
      abstract: "Decentralized mesh routing for autonomous drone swarms operating in search and rescue without cellular infrastructure.",
      keywords: "Drone Swarms, LoRa, Mesh Networks, Robotics"
    }
  ];

  const handleRunBatch = async (proposals = sampleBatchProposals) => {
    setLoading(true);
    setBatchResults(null);

    try {
      const res = await fetch('/api/batch-detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: proposals })
      });

      if (!res.ok) throw new Error('Batch processing failed');
      const data = await res.json();
      setBatchResults(data);
    } catch (err) {
      alert('Error running batch detection: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Batch Research Proposal Evaluator
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Process multiple incoming student proposals or research grant applications in batch mode.
          </p>
        </div>
        <button
          onClick={() => handleRunBatch()}
          disabled={loading}
          className="glow-button px-5 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Cpu className="w-4 h-4 animate-spin" /> Batch Processing...
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-4 h-4" /> Run Sample Batch (4 Proposals)
            </>
          )}
        </button>
      </div>

      {batchResults && (
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
              Batch Evaluation Summary ({batchResults.total_evaluated} Proposals Analyzed)
            </span>
          </div>

          <div className="space-y-3">
            {batchResults.results.map((item) => {
              const risk = item.risk_assessment;
              return (
                <div key={item.index} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">#{item.index}</span>
                      <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    </div>
                    {item.top_match_title && (
                      <p className="text-xs text-slate-400">
                        Highest match: <span className="text-slate-200 font-medium">"{item.top_match_title}"</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-white">{item.top_match_score}%</div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Similarity</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      risk.risk_level === 'CRITICAL_DUPLICATE' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                      risk.risk_level === 'HIGH_OVERLAP' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                      risk.risk_level === 'MODERATE_OVERLAP' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
                      'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    }`}>
                      {risk.risk_label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
