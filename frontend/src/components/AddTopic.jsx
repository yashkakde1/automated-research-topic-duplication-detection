import React, { useState } from 'react';
import { PlusCircle, CheckCircle, AlertCircle, RefreshCw, Database, Sparkles } from 'lucide-react';

const DOMAIN_OPTIONS = [
  "Artificial Intelligence",
  "Machine Learning",
  "NLP",
  "Computer Vision",
  "Cybersecurity",
  "IoT",
  "Data Science",
  "Healthcare Technology",
  "Agriculture Technology",
  "Education Technology"
];

export default function AddTopic({ onNavigateTab }) {
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('Artificial Intelligence');
  const [keywords, setKeywords] = useState('');
  const [abstract, setAbstract] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Research Paper Title is required.');
      return;
    }
    if (!abstract.trim()) {
      setErrorMsg('Abstract / Proposal is required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('http://localhost:8000/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          domain,
          keywords,
          abstract
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to add research topic.');
      }

      const data = await res.json();
      setSuccessMsg(`Research topic #${data.topic.id} successfully saved to SQLite database!`);
      setTitle('');
      setKeywords('');
      setAbstract('');
    } catch (err) {
      setErrorMsg(err.message || 'Error saving topic.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white font-heading">
              Add New Research Topic
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Ingest a new research paper title and abstract into the SQLite database corpus (<code className="text-emerald-400 font-mono">research_topics.db</code>).
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10">
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-emerald-300 text-xs sm:text-sm font-black shadow-md">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              {successMsg}
            </div>
            <button
              onClick={() => onNavigateTab('database')}
              className="px-4 py-1.5 bg-emerald-500 text-slate-950 rounded-xl text-xs font-black hover:bg-emerald-400 transition shadow-md"
            >
              View in Database
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-center gap-2 text-rose-300 text-xs sm:text-sm font-black">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
              Research Paper Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              className="glass-input font-bold"
              placeholder="Enter research paper title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                Domain / Field <span className="text-rose-400">*</span>
              </label>
              <select
                className="glass-input font-bold bg-[#0f172a] text-white cursor-pointer"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              >
                {DOMAIN_OPTIONS.map((d) => (
                  <option key={d} value={d} className="bg-[#0f172a] text-white">{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                Keywords
              </label>
              <input
                type="text"
                className="glass-input font-medium"
                placeholder="Enter keywords separated by commas"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
              Abstract / Proposal <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={6}
              className="glass-input leading-relaxed font-medium"
              placeholder="Enter full abstract text..."
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setTitle('');
                setKeywords('');
                setAbstract('');
                setSuccessMsg('');
                setErrorMsg('');
              }}
              className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition"
            >
              Clear Form
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-neon"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" /> Ingesting Topic into SQLite...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 text-white" /> Save Research Topic
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
