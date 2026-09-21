import React, { useState } from 'react';
import { Search, Upload, FileText, Sparkles, BookOpen, ArrowRight, CheckCircle2, AlertCircle, Info, Layers, RefreshCw, Cpu, Database, Zap, Award, ShieldCheck } from 'lucide-react';

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

export default function DetectorHome({ onRunAnalysis, onNavigateTab }) {
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('Artificial Intelligence');
  const [keywords, setKeywords] = useState('');
  const [abstract, setAbstract] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfMessage, setPdfMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sample quick load for viva demo
  const handleLoadSample = (sampleType) => {
    if (sampleType === 'duplicate') {
      setTitle('Real-Time Object Detection for Autonomous Vehicles in Adverse Weather Conditions');
      setDomain('Computer Vision');
      setKeywords('Computer Vision, Object Detection, YOLO, Autonomous Vehicles, Fog and Rain');
      setAbstract('This paper proposes an integrated computer vision framework combining image restoration with YOLOv8 for detecting pedestrians and vehicles in self-driving cars during heavy rain and foggy weather conditions.');
    } else if (sampleType === 'similar') {
      setTitle('Intelligent Multi-Robot Swarm Task Allocation and Path Planning');
      setDomain('Artificial Intelligence');
      setKeywords('Robotics, Multi-Agent Systems, Swarm Intelligence, Path Planning');
      setAbstract('We propose a decentralized task allocation framework for autonomous multi-robot swarms operating in unstructured search and rescue environments using deep reinforcement learning.');
    } else {
      setTitle('Quantum-Resistant Lattice-Based Cryptography for Ultra-Low Power Satellite IoT Sensors');
      setDomain('Cybersecurity');
      setKeywords('Quantum Cryptography, Lattice Cryptography, CubeSat IoT, Embedded Security');
      setAbstract('Novel lightweight lattice cryptography protocol tailored specifically for sub-watt CubeSat satellite IoT nodes to withstand post-quantum cryptanalysis while preserving battery constraints.');
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Please select a valid PDF file.');
      return;
    }

    setPdfUploading(true);
    setPdfMessage('Extracting Title and Abstract from PDF...');
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://localhost:8000/api/extract-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to parse uploaded PDF file.');
      }

      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.abstract) setAbstract(data.abstract);
      if (data.keywords) setKeywords(data.keywords);

      setPdfMessage(`Successfully extracted metadata from '${file.name}'`);
    } catch (err) {
      setErrorMsg(err.message || 'Error extracting PDF text.');
    } finally {
      setPdfUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Research Paper Title is required.');
      return;
    }
    if (!abstract.trim()) {
      setErrorMsg('Abstract or Research Proposal is required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:8000/api/check-duplication', {
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
        throw new Error(errData.detail || 'Analysis failed.');
      }

      const resultData = await res.json();
      onRunAnalysis(resultData);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to complete duplication check.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Section with Glowing Neon Gradients */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border border-indigo-500/30 p-8 sm:p-12 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/15 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> College Academic Software Project
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-heading leading-tight">
            Automated Research Topic <br />
            <span className="gradient-text-neon">Duplication Detection</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
            AI-powered semantic duplicate detection for academic research proposals using <strong className="text-indigo-300">Sentence-BERT (SBERT)</strong> transformer embeddings & <strong className="text-purple-300">Cosine Similarity</strong>.
          </p>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4">
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 text-center">
              <span className="text-2xl font-black text-indigo-400 block font-heading">34+</span>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Indexed Papers</span>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 text-center">
              <span className="text-2xl font-black text-purple-400 block font-heading">10</span>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Core Domains</span>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 text-center">
              <span className="text-2xl font-black text-pink-400 block font-heading">384-D</span>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">SBERT Vectors</span>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 text-center">
              <span className="text-2xl font-black text-emerald-400 block font-heading">&lt; 1.2s</span>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Inference Time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Detector Form Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-3 font-heading">
              <span className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Search className="w-5 h-5" />
              </span>
              Topic Duplication Analysis Form
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Enter proposed research details or upload a PDF document for instant vector duplication analysis.
            </p>
          </div>

          {/* Quick Demo Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Viva Presets:</span>
            <button
              type="button"
              onClick={() => handleLoadSample('duplicate')}
              className="px-3 py-1.5 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 text-xs font-black rounded-xl border border-rose-500/30 transition shadow-md flex items-center gap-1.5"
            >
              🔴 High Overlap
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('similar')}
              className="px-3 py-1.5 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 text-xs font-black rounded-xl border border-amber-500/30 transition shadow-md flex items-center gap-1.5"
            >
              🟡 Moderate
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('unique')}
              className="px-3 py-1.5 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 text-xs font-black rounded-xl border border-emerald-500/30 transition shadow-md flex items-center gap-1.5"
            >
              🟢 Unique Topic
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-300 text-xs sm:text-sm font-bold">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <div>{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Research Paper Title */}
          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
              Research Paper Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              className="glass-input font-bold"
              placeholder="Enter proposed research paper title (e.g. Deep Learning for Medical Image Segmentation)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Grid: Domain & Keywords */}
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
                placeholder="Enter keywords separated by commas (e.g. Deep Learning, CNN, MRI)"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
          </div>

          {/* Abstract / Research Proposal */}
          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
              Abstract / Research Proposal <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={6}
              className="glass-input leading-relaxed font-medium"
              placeholder="Enter abstract or detailed research proposal description..."
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              required
            />
          </div>

          {/* Optional PDF Upload Dropzone */}
          <div className="relative p-6 rounded-2xl bg-slate-900/40 border-2 border-dashed border-indigo-500/30 text-center transition hover:border-indigo-500/60">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Upload className="w-5 h-5" />
              </div>

              <div className="text-xs font-black text-white uppercase tracking-wider">
                Optional: Upload Research Paper PDF
              </div>

              <p className="text-xs text-slate-400 font-medium">
                Automatically extract Title, Abstract, and Keywords directly from your PDF paper document.
              </p>
              
              <label className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 rounded-xl text-xs font-black text-indigo-300 cursor-pointer transition shadow-md">
                <FileText className="w-4 h-4 text-purple-400" />
                {pdfUploading ? 'Extracting Text...' : 'Choose PDF File'}
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handlePdfUpload}
                  disabled={pdfUploading}
                />
              </label>

              {pdfMessage && (
                <span className="text-xs font-bold text-emerald-400 mt-2 flex items-center gap-1.5 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {pdfMessage}
                </span>
              )}
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setTitle('');
                setKeywords('');
                setAbstract('');
                setPdfMessage('');
                setErrorMsg('');
              }}
              className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition"
            >
              Reset Form
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-neon"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" /> Computing SBERT Embedding Vector...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-white" /> Check for Duplication
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* "How It Works" 4-Step Cards */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/15 text-indigo-300 text-xs font-black rounded-full mb-2 border border-indigo-500/30">
            <Zap className="w-3.5 h-3.5" /> Systematic Workflow
          </div>
          <h3 className="text-2xl font-black text-white font-heading">
            How It Works
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1">
            End-to-end natural language processing vector comparison workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 space-y-3 border-l-4 border-l-blue-500">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 font-black text-sm flex items-center justify-center font-heading border border-blue-500/30">
              1
            </div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Topic Submission</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              User enters the research paper title, domain, keywords, abstract, or uploads a PDF paper.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3 border-l-4 border-l-purple-500">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 font-black text-sm flex items-center justify-center font-heading border border-purple-500/30">
              2
            </div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Sentence-BERT Embedding</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Converts text into a 384-dimensional dense semantic vector (<code className="text-purple-300 font-mono">all-MiniLM-L6-v2</code>).
            </p>
          </div>

          <div className="glass-card p-6 space-y-3 border-l-4 border-l-pink-500">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/20 text-pink-400 font-black text-sm flex items-center justify-center font-heading border border-pink-500/30">
              3
            </div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Cosine Similarity</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Calculates vector dot-product angles against all indexed papers stored in the SQLite database.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3 border-l-4 border-l-emerald-500">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center font-heading border border-emerald-500/30">
              4
            </div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Classification Report</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Classifies overall risk (<code className="text-emerald-300 font-mono">Unique / Similar / Duplicate</code>) with concept explanation.
            </p>
          </div>
        </div>
      </div>

      {/* About Project Overview Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 border border-slate-800 p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 backdrop-blur-md text-pink-300 text-xs font-black rounded-full uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" /> Academic Overview
          </div>
          
          <h3 className="text-2xl font-black text-white font-heading">
            About the Project
          </h3>
          
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            With the exponential growth of academic literature, manual evaluation of proposed research paper novelty is slow and prone to human oversight. This college software project implements an automated NLP framework using Sentence-BERT transformer embeddings to provide fast, objective duplicate detection across 10 core technology domains.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800 pt-6 mt-6">
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
              <span className="text-xs font-black text-indigo-400 uppercase tracking-wider block mb-1">Core NLP Model</span>
              <span className="text-xs text-white font-bold">Sentence-BERT (SBERT)</span>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
              <span className="text-xs font-black text-purple-400 uppercase tracking-wider block mb-1">Similarity Metric</span>
              <span className="text-xs text-white font-bold">Vector Cosine Similarity</span>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
              <span className="text-xs font-black text-pink-400 uppercase tracking-wider block mb-1">Database Engine</span>
              <span className="text-xs text-white font-bold">SQLite (research_topics.db)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
