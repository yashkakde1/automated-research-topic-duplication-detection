import React, { useState, useEffect } from 'react';
import { Database, Search, Filter, ArrowUpDown, Eye, Trash2, Calendar, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { getTopics, deleteTopic } from '../services/api';

const DOMAIN_OPTIONS = [
  "All Domains",
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

export default function ResearchTopicsPage({ onSelectTopicForModal, onNavigateTab }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [sortBy, setSortBy] = useState('recently');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadTopics = async () => {
    setLoading(true);
    try {
      const data = await getTopics({
        domain: selectedDomain,
        search
      });

      // Local sort
      let sorted = [...data];
      if (sortBy === 'title') {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === 'domain') {
        sorted.sort((a, b) => a.domain.localeCompare(b.domain));
      } else {
        sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
      }

      setTopics(sorted);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, [selectedDomain, search, sortBy]);

  const handleDelete = async (topicId) => {
    if (!window.confirm(`Are you sure you want to delete topic #${topicId}?`)) return;
    await deleteTopic(topicId);
    loadTopics();
  };

  // Pagination logic
  const totalPages = Math.ceil(topics.length / itemsPerPage) || 1;
  const paginatedTopics = topics.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="academic-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Research Topic Database
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Browse the research topics currently available for similarity analysis.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('add-topic')}
          className="btn-primary-indigo text-xs shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Research Topic
        </button>
      </div>

      {/* Top Controls: Search, Domain Filter, Sort */}
      <div className="academic-card p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        
        {/* Search Bar */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            className="academic-input pl-9 text-xs font-medium"
            placeholder="Search research topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Domain Filter */}
        <div className="sm:col-span-3">
          <select
            className="academic-input text-xs font-semibold bg-white dark:bg-slate-800 cursor-pointer"
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
          >
            {DOMAIN_OPTIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="sm:col-span-3">
          <select
            className="academic-input text-xs font-semibold bg-white dark:bg-slate-800 cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recently">Recently Added</option>
            <option value="title">Title (A-Z)</option>
            <option value="domain">Domain Name</option>
          </select>
        </div>
      </div>

      {/* Topics Display Grid */}
      {loading ? (
        <div className="academic-card p-12 text-center text-xs font-semibold text-slate-500">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
          Loading research topics...
        </div>
      ) : paginatedTopics.length === 0 ? (
        /* Empty State */
        <div className="academic-card p-12 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">No Research Topics Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No topics match your current search query or domain filter. Try adjusting your search filters or add a new topic.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedDomain('All Domains');
            }}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-200 transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedTopics.map((topic) => (
            <div
              key={topic.id}
              className="academic-card p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold rounded-md border border-indigo-200 dark:border-indigo-800">
                    {topic.domain}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">ID #{topic.id}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug font-heading">
                  {topic.title}
                </h3>

                {topic.keywords && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <strong className="text-slate-700 dark:text-slate-300">Keywords:</strong> {topic.keywords}
                  </div>
                )}

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800 font-medium">
                  {topic.abstract}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {topic.created_at ? topic.created_at.split(' ')[0] : 'N/A'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectTopicForModal(topic)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-lg transition text-xs flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </button>
                  <button
                    onClick={() => handleDelete(topic.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition"
                    title="Delete Topic"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-500 font-medium">
            Showing Page {currentPage} of {totalPages} ({topics.length} total topics)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 disabled:opacity-40 flex items-center gap-1 font-bold"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 disabled:opacity-40 flex items-center gap-1 font-bold"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
