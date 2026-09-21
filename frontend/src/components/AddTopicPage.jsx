import React, { useState } from 'react';
import { PlusCircle, CheckCircle, AlertCircle, RefreshCw, Database } from 'lucide-react';
import { addTopic } from '../services/api';

const DOMAIN_OPTIONS = [
  "Artificial Intelligence",
  "Machine Learning",
  "Natural Language Processing",
  "Computer Vision",
  "Cybersecurity",
  "Data Science",
  "Healthcare Technology",
  "Agriculture Technology",
  "Education Technology",
  "Other"
];

export default function AddTopicPage({ onNavigateTab }) {
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('Natural Language Processing');
  const [keywords, setKeywords] = useState('');
  const [abstract, setAbstract] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
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

    try {
      const newTopic = await addTopic({
        title,
        domain,
        keywords,
        abstract
      });

      setToastMsg('Research topic added successfully.');
      setTitle('');
      setKeywords('');
      setAbstract('');

      setTimeout(() => {
        setToastMsg('');
      }, 4000);

    } catch (err) {
      setErrorMsg('Failed to add research topic. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-4 bg-emerald-500 text-white rounded-xl shadow-lg font-bold text-xs sm:text-sm flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-white" />
            {toastMsg}
          </div>
          <button
            onClick={() => onNavigateTab('topics')}
            className="px-3 py-1 bg-white text-emerald-800 rounded-lg text-xs font-bold hover:bg-emerald-50 transition"
          >
            View in Database
          </button>
        </div>
      )}

      {/* Header */}
      <div className="academic-card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
              Add Research Topic
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Add an existing research topic to the comparison database.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="academic-card p-6 sm:p-10 space-y-6">
        {errorMsg && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 dark:text-red-300 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Research Paper Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="academic-input font-medium"
              placeholder="e.g. Deep Learning for Medical Image Analysis"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Domain / Field <span className="text-red-500">*</span>
              </label>
              <select
                className="academic-input font-medium bg-white dark:bg-slate-800 cursor-pointer"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              >
                {DOMAIN_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Keywords
              </label>
              <input
                type="text"
                className="academic-input font-medium"
                placeholder="e.g. BERT, NLP, Transformer, Classification"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Abstract / Research Proposal <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              className="academic-input leading-relaxed font-medium"
              placeholder="Paste full research abstract or proposal here..."
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setTitle('');
                setKeywords('');
                setAbstract('');
                setErrorMsg('');
              }}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
            >
              Clear Form
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary-indigo text-xs"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Adding Topic...
                </>
              ) : (
                <>
                  + Add Research Topic
                </>
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
