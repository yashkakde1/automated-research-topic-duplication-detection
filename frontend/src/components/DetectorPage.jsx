import React, { useState, useRef } from 'react';
import { Search, Sparkles, Upload, FileText, X, AlertCircle, RefreshCw, Cpu, Database, Brain, ArrowLeftRight, BarChart3, CheckCircle2, Info, Eye } from 'lucide-react';
import { checkSimilarity, uploadPdf } from '../services/api';

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

export default function DetectorPage({ onSelectTopicForModal, preloadedTopic }) {
  const [title, setTitle] = useState(preloadedTopic?.title || '');
  const [domain, setDomain] = useState(preloadedTopic?.domain || 'Natural Language Processing');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState(
    preloadedTopic?.keywords ? preloadedTopic.keywords.split(',').map(k => k.trim()).filter(Boolean) : ['NLP', 'BERT', 'Transformers']
  );
  const [abstract, setAbstract] = useState(preloadedTopic?.abstract || '');

  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [results, setResults] = useState(null);

  const resultRef = useRef(null);

  // Keyword tag management
  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = keywordInput.trim().replace(/^,|,$/g, '');
      if (val && !keywords.includes(val)) {
        setKeywords([...keywords, val]);
        setKeywordInput('');
      }
    }
  };

  const handleRemoveKeyword = (kwToRemove) => {
    setKeywords(keywords.filter(k => k !== kwToRemove));
  };

  // PDF File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.txt')) {
      setErrorMsg('Please select a valid PDF or TXT document.');
      return;
    }

    setUploadedFile(file);
    setUploadingPdf(true);
    setErrorMsg('');

    try {
      const data = await uploadPdf(file);
      if (data.title) setTitle(data.title);
      if (data.abstract) setAbstract(data.abstract);
      if (data.keywords) {
        const parsedKw = data.keywords.split(',').map(k => k.trim()).filter(Boolean);
        setKeywords([...new Set([...keywords, ...parsedKw])]);
      }
    } catch (err) {
      setErrorMsg('Error parsing uploaded file. Please enter details manually.');
    } finally {
      setUploadingPdf(false);
    }
  };

  // Form Submission & Analysis Execution
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Research Paper Title is required.');
      return;
    }
    if (!abstract.trim()) {
      setErrorMsg('Abstract / Research Proposal is required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setLoadingStep('Analyzing Research Topic...');

    try {
      // Smooth loading steps
      setTimeout(() => {
        setLoadingStep('Comparing with research database...');
      }, 700);

      const data = await checkSimilarity({
        title,
        domain,
        keywords: keywords.join(', '),
        abstract
      });

      setResults(data);
      setLoading(false);

      // Smooth scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err) {
      setErrorMsg('Failed to process duplication analysis. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      
      {/* ================================================== */}
      {/* HERO SECTION */}
      {/* ================================================== */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-slate-800 bg-nodes-pattern">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI-Powered Research Analysis
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight font-heading">
            Check Your <span className="text-indigo-400">Research Topic</span> <br />
            Before You Start
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
            Detect semantically similar research topics using Natural Language Processing and Sentence-BERT.
          </p>
        </div>
      </div>

      {/* ================================================== */}
      {/* DETECTOR CARD */}
      {/* ================================================== */}
      <div className="academic-card p-6 sm:p-10 space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
            <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Research Topic Analysis
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Enter your proposed research topic and abstract to compare it with existing topics in the research database.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Research Paper Title */}
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

          {/* Grid: 2. Domain & 3. Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Domain Dropdown */}
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

            {/* Keywords Tag Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Keywords
              </label>
              <input
                type="text"
                className="academic-input font-medium mb-2"
                placeholder="e.g. BERT, NLP, Transformer, Classification (Press Enter to add)"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleAddKeyword}
              />

              {/* Keyword Tag Chips */}
              <div className="flex flex-wrap gap-1.5 min-h-7">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800"
                  >
                    {kw}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(kw)}
                      className="hover:text-red-500 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Abstract / Research Proposal */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Abstract / Research Proposal <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-semibold">
                {abstract.length} characters
              </span>
            </div>
            <textarea
              rows={6}
              className="academic-input font-medium leading-relaxed"
              placeholder="Paste your research abstract or proposal here..."
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              required
            />
          </div>

          {/* 5. Optional PDF Upload Drag & Drop Zone */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:border-indigo-400 transition bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex flex-col items-center justify-center gap-2">
              <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Upload Research Paper
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                PDF or TXT • Maximum 15 MB
              </p>

              <label className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition shadow-xs">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                {uploadingPdf ? 'Extracting File...' : 'Browse files'}
                <input
                  type="file"
                  accept=".pdf,.txt"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploadingPdf}
                />
              </label>

              {uploadedFile && (
                <div className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{uploadedFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="text-slate-400 hover:text-red-500 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* CHECK BUTTON */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary-indigo text-xs w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> {loadingStep}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Check for Duplication
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ================================================== */}
      {/* RESULT SECTION */}
      {/* ================================================== */}
      {results && (
        <div ref={resultRef} className="space-y-8 animate-in fade-in duration-500 pt-4">
          
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
              Research Topic Analysis Result
            </h2>
            <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-bold">Evaluated Topic Title:</span>
              {results.query.title}
            </div>
          </div>

          {/* Large Result Card */}
          <div className="academic-card p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            {/* LEFT SIDE: Circular Score */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200 dark:text-slate-700"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={
                      results.similarity_score > 75 ? "text-red-500" : results.similarity_score >= 50 ? "text-amber-500" : "text-emerald-500"
                    }
                    strokeDasharray={`${results.similarity_score}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
                    {results.similarity_score}%
                  </span>
                </div>
              </div>

              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-3">
                Semantic Similarity
              </span>
            </div>

            {/* RIGHT SIDE: Status Badge & Description */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Classification Status</span>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-extrabold border ${
                    results.similarity_score > 75 
                      ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800" 
                      : results.similarity_score >= 50 
                      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800" 
                      : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                  }`}>
                    {results.status}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {results.flag_explanation}
              </p>

              {/* Disclaimer */}
              <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Similarity Note:</strong> {results.threshold_notice}
                </span>
              </div>
            </div>
          </div>

          {/* SIMILARITY BREAKDOWN */}
          <div className="academic-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-heading">
              Demonstration Similarity Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Title Similarity</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">72%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Abstract Similarity</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">88%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Keyword Similarity</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">76%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '76%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Overall Semantic Similarity</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{results.similarity_score}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${results.similarity_score}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* MOST SIMILAR RESEARCH TOPICS */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              Most Similar Research Topics
            </h3>

            <div className="space-y-3">
              {results.top_matches.slice(0, 4).map((match, idx) => (
                <div
                  key={match.id}
                  className="academic-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg font-black text-slate-400 dark:text-slate-500 font-mono">
                      0{idx + 1}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold rounded-md border border-indigo-200 dark:border-indigo-800">
                          {match.domain}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                        {match.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 sm:w-64">
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">{match.similarity}% Similar</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${match.similarity}%` }}></div>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectTopicForModal(match)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1 shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Topic
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ================================================== */}
      {/* HOW IT WORKS */}
      {/* ================================================== */}
      <div className="academic-card p-6 sm:p-10 space-y-8">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
            How It Works
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            4-step natural language processing duplicate detection workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Step 1: Enter Topic</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Enter the title, keywords and abstract or upload a paper document.
            </p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Step 2: Generate Embedding</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Sentence-BERT converts the text into a 384-dimensional semantic vector.
            </p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Step 3: Compare Topics</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              The system compares vectors with existing research topics using cosine similarity.
            </p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Step 4: Get Results</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Similar topics, similarity percentages, and classification status are displayed.
            </p>
          </div>

        </div>
      </div>

      {/* ================================================== */}
      {/* TECHNOLOGY SECTION */}
      {/* ================================================== */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
          Powered by NLP
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white block font-heading">Sentence-BERT</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Semantic Embeddings</span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white block font-heading">Cosine Similarity</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Similarity Measurement</span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white block font-heading">Python</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Backend Processing</span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white block font-heading">FastAPI</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">API Layer</span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white block font-heading">SQLite</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Topic Database</span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white block font-heading">React</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Frontend UI</span>
          </div>
        </div>
      </div>

    </div>
  );
}
