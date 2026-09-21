import React, { useState, useEffect } from 'react';
import { Database, Search, Filter, Plus, BookOpen, User, Calendar, Tag, ExternalLink, X } from 'lucide-react';

export default function CorpusExplorer() {
  const [papers, setPapers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Paper Form State
  const [newTitle, setNewTitle] = useState('');
  const [newAbstract, setNewAbstract] = useState('');
  const [newDomain, setNewDomain] = useState('Artificial Intelligence & NLP');
  const [newAuthors, setNewAuthors] = useState('');
  const [newKeywords, setNewKeywords] = useState('');

  const fetchPapers = async () => {
    setLoading(true);
    try {
      let url = `/api/papers?`;
      if (domainFilter !== 'All') url += `domain=${encodeURIComponent(domainFilter)}&`;
      if (search) url += `search=${encodeURIComponent(search)}`;

      const res = await fetch(url);
      const data = await res.json();
      setPapers(data.papers || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Error loading paper corpus:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, [domainFilter, search]);

  const handleCreatePaper = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAbstract.trim()) return;

    try {
      const res = await fetch('/api/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          abstract: newAbstract,
          domain: newDomain,
          authors: newAuthors.split(',').map(a => a.trim()).filter(Boolean),
          keywords: newKeywords.split(',').map(k => k.trim()).filter(Boolean)
        })
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewTitle('');
        setNewAbstract('');
        fetchPapers();
      }
    } catch (err) {
      alert('Error ingesting paper: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Ingest Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            Indexed Academic Research Corpus ({total} Publications)
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Browse and search peer-reviewed papers used as baseline for duplication vector comparison.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="glow-button px-4 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Ingest New Paper
        </button>
      </div>

      {/* Search & Domain Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search papers by title, abstract keyword, or author..."
            className="w-full bg-slate-900/80 border border-slate-700 focus:border-indigo-500 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm"
          />
        </div>
        <div className="sm:col-span-4">
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700 focus:border-indigo-500 text-white rounded-xl px-4 py-2.5 text-sm"
          >
            <option value="All">All Research Domains</option>
            <option value="Artificial Intelligence & NLP">Artificial Intelligence & NLP</option>
            <option value="Computer Vision">Computer Vision</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Healthcare & Medical AI">Healthcare & Medical AI</option>
            <option value="IoT & Smart Cities">IoT & Smart Cities</option>
            <option value="Blockchain & Cryptography">Blockchain & Cryptography</option>
            <option value="Quantum Computing & Physics">Quantum Computing & Physics</option>
            <option value="Cloud Computing">Cloud Computing</option>
          </select>
        </div>
      </div>

      {/* Papers Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          Loading indexed research papers...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {papers.map((paper) => (
            <div
              key={paper.id}
              onClick={() => setSelectedPaper(paper)}
              className="glass-card p-5 rounded-2xl flex flex-col justify-between cursor-pointer border border-slate-800 hover:border-indigo-500/40"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                    {paper.domain}
                  </span>
                  <span className="text-slate-400">{paper.year}</span>
                </div>

                <h3 className="font-bold text-white text-sm line-clamp-2 leading-snug mb-2">
                  {paper.title}
                </h3>

                <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed mb-4">
                  {paper.abstract}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {paper.keywords?.slice(0, 3).map((kw, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded">
                      #{kw}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{paper.authors?.join(', ')}</span>
                  <span className="text-indigo-400 font-semibold">{paper.citation_count} Citations</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paper Detail Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-2xl w-full p-6 rounded-2xl space-y-4 max-h-[85vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedPaper(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-xs font-semibold border border-indigo-500/20">
              {selectedPaper.domain}
            </span>

            <h3 className="text-xl font-bold text-white leading-snug">
              {selectedPaper.title}
            </h3>

            <div className="flex flex-wrap gap-4 text-xs text-slate-400 border-y border-slate-800 py-3">
              <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-indigo-400" /> {selectedPaper.authors?.join(', ')}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-indigo-400" /> Published {selectedPaper.year}</span>
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-indigo-400" /> {selectedPaper.citation_count} Citations</span>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">Abstract</h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                {selectedPaper.abstract}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">Keywords</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedPaper.keywords?.map((kw, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Paper Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreatePaper} className="glass-panel max-w-xl w-full p-6 rounded-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white">Ingest New Research Paper</h3>

            <div>
              <label className="block text-xs font-bold uppercase text-indigo-300 mb-1">Paper Title *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-indigo-300 mb-1">Domain</label>
              <select
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2 text-sm"
              >
                <option>Artificial Intelligence & NLP</option>
                <option>Computer Vision</option>
                <option>Cybersecurity</option>
                <option>Healthcare & Medical AI</option>
                <option>IoT & Smart Cities</option>
                <option>Blockchain & Cryptography</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-indigo-300 mb-1">Abstract *</label>
              <textarea
                required
                rows={4}
                value={newAbstract}
                onChange={(e) => setNewAbstract(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 text-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-slate-300 text-xs hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="glow-button px-5 py-2 rounded-xl text-white text-xs font-semibold"
              >
                Ingest Paper
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
