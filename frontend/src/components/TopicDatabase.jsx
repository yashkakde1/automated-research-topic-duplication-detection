import React, { useState, useEffect } from 'react';
import { Database, Search, Filter, Trash2, Plus, Eye, BookOpen, AlertCircle, RefreshCw, CheckCircle, Sparkles } from 'lucide-react';

const DOMAIN_OPTIONS = [
  "All",
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

// Custom domain tag styling for dark glass theme
const getDomainTagClass = (domain) => {
  switch (domain) {
    case 'Artificial Intelligence': return 'tag-domain-ai';
    case 'Machine Learning': return 'tag-domain-ml';
    case 'NLP': return 'tag-domain-nlp';
    case 'Computer Vision': return 'tag-domain-cv';
    case 'Cybersecurity': return 'tag-domain-cyber';
    case 'IoT': return 'tag-domain-iot';
    case 'Data Science': return 'tag-domain-ds';
    case 'Healthcare Technology': return 'tag-domain-health';
    case 'Agriculture Technology': return 'tag-domain-agri';
    case 'Education Technology': return 'tag-domain-edu';
    default: return 'bg-slate-800 text-slate-300 border-slate-700';
  }
};

export default function TopicDatabase({ onNavigateTab }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedTopicModal, setSelectedTopicModal] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchTopics = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:8000/api/topics?';
      if (selectedDomain && selectedDomain !== 'All') {
        url += `domain=${encodeURIComponent(selectedDomain)}&`;
      }
      if (search) {
        url += `search=${encodeURIComponent(search)}&`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load research topics.');
      const data = await res.json();
      setTopics(data.topics || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [selectedDomain, search]);

  const handleDelete = async (topicId) => {
    if (!window.confirm(`Are you sure you want to delete Research Topic #${topicId}?`)) return;

    try {
      const res = await fetch(`http://localhost:8000/api/topics/${topicId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMsg(`Topic #${topicId} deleted successfully.`);
        fetchTopics();
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white font-heading flex items-center gap-2.5">
                Research Topic Database
                <span className="px-3 py-0.5 bg-cyan-500/15 text-cyan-300 text-xs font-black rounded-full border border-cyan-500/30">
                  {topics.length} Topics Stored
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Indexed paper corpus stored in SQLite database (<code className="text-cyan-300 font-mono">research_topics.db</code>).
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('add-topic')}
          className="btn-neon text-xs shrink-0"
        >
          <Plus className="w-4 h-4 text-white" /> Add New Research Topic
        </button>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs font-black text-emerald-300 flex items-center gap-2 shadow-md">
          <CheckCircle className="w-4 h-4 text-emerald-400" /> {msg}
        </div>
      )}

      {/* Search & Domain Filter Bar */}
      <div className="glass-panel rounded-3xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              className="glass-input pl-11 text-xs font-medium"
              placeholder="Search research paper title, keywords, or abstract text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              className="glass-input text-xs font-bold bg-[#0f172a] text-white w-full sm:w-60 cursor-pointer"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              {DOMAIN_OPTIONS.map((d) => (
                <option key={d} value={d} className="bg-[#0f172a] text-white">{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {DOMAIN_OPTIONS.map((d) => {
            const isSel = selectedDomain === d;
            return (
              <button
                key={d}
                onClick={() => setSelectedDomain(d)}
                className={`px-3.5 py-1.5 rounded-xl text-[11px] font-black whitespace-nowrap transition border ${
                  isSel
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-md scale-[1.02]'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic Card Grid */}
      {loading ? (
        <div className="glass-panel rounded-3xl p-12 text-center text-xs font-bold text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
          Loading indexed research topics from SQLite database...
        </div>
      ) : topics.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center text-xs font-medium text-slate-400">
          <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          No research topics found matching your search query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((t) => {
            const tagStyle = getDomainTagClass(t.domain);
            return (
              <div
                key={t.id}
                className="glass-card p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-black text-slate-500 font-mono">ID #{t.id}</span>
                    <span className={`px-3 py-1 text-[11px] font-black rounded-full ${tagStyle}`}>
                      {t.domain}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug font-heading">
                    {t.title}
                  </h3>

                  {t.keywords && (
                    <div className="text-xs text-slate-400 font-medium">
                      <strong className="text-slate-200 font-bold">Keywords:</strong> {t.keywords}
                    </div>
                  )}

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 font-medium">
                    {t.abstract}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                  <span className="text-[11px] text-slate-500 font-medium font-mono">
                    Added: {t.created_at ? t.created_at.split(' ')[0] : 'N/A'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedTopicModal(t)}
                      className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-xl transition"
                      title="View Full Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-xl transition"
                      title="Delete Topic"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Topic Detail Modal */}
      {selectedTopicModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className={`px-3 py-1 text-xs font-black rounded-full ${getDomainTagClass(selectedTopicModal.domain)}`}>
                  {selectedTopicModal.domain}
                </span>
                <h3 className="text-lg font-black text-white mt-2.5 font-heading">
                  {selectedTopicModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTopicModal(null)}
                className="text-slate-400 hover:text-white font-bold text-xl px-2"
              >
                ✕
              </button>
            </div>

            {selectedTopicModal.keywords && (
              <div className="text-xs">
                <span className="font-black text-slate-400 uppercase tracking-wider block mb-1">Keywords</span>
                <p className="text-slate-200 font-medium">{selectedTopicModal.keywords}</p>
              </div>
            )}

            <div>
              <span className="font-black text-slate-400 uppercase tracking-wider block mb-1 text-xs">Full Abstract</span>
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-medium">
                {selectedTopicModal.abstract}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedTopicModal(null)}
                className="px-5 py-2.5 bg-slate-800 text-white text-xs font-black rounded-xl hover:bg-slate-700 transition"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
