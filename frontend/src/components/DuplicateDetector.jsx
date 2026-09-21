import React, { useState } from 'react';
import { Search, Upload, AlertTriangle, CheckCircle, ShieldAlert, Sparkles, FileText, ChevronRight, Layers, Cpu, ArrowRight } from 'lucide-react';

export default function DuplicateDetector({ onAnalysisComplete }) {
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [domain, setDomain] = useState('Artificial Intelligence & NLP');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Sample pre-fill examples for quick evaluation demo
  const sampleDuplicate = () => {
    setTitle('Automated Research Plagiarism and Topic Overlap Identification System');
    setAbstract('Duplicate research topics lead to redundant academic funding and wasted institutional resources. This paper presents an automated framework for identifying plagiarized research titles and abstracts using BERT embeddings and cosine distance metrics.');
    setDomain('Artificial Intelligence & NLP');
    setKeywords('Plagiarism Detection, Topic Overlap, BERT, Cosine Similarity');
  };

  const sampleUnique = () => {
    setTitle('Thermoelectric Micro-Generators for Biomedical Implant Energy Harvesting');
    setAbstract('Implantable medical devices require reliable long-term micro-power sources. We present a flexible thin-film thermoelectric generator leveraging body heat gradient differences to produce 45 microwatts per square centimeter.');
    setDomain('Healthcare & Medical AI');
    setKeywords('Thermoelectric, Micro-Generator, Bio-implants, Energy Harvesting');
  };

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim() || !abstract.trim()) return;

    setLoading(true);
    setResult(null);
    setSelectedMatch(null);

    try {
      const res = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, abstract, domain, keywords })
      });

      if (!res.ok) throw new Error('Analysis failed');
      const data = await res.json();
      setResult(data);
      if (data.top_matches && data.top_matches.length > 0) {
        setSelectedMatch(data.top_matches[0]);
      }
      if (onAnalysisComplete) onAnalysisComplete(data);
    } catch (err) {
      alert('Error connecting to NLP Engine: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (uploadedFile) => {
    if (!uploadedFile) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const res = await fetch('/api/detect-file', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('File parse failed');
      const data = await res.json();
      setResult(data);
      if (data.query_summary) {
        setTitle(data.query_summary.title);
      }
      if (data.top_matches && data.top_matches.length > 0) {
        setSelectedMatch(data.top_matches[0]);
      }
    } catch (err) {
      alert('Error parsing uploaded document: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (riskLevel) => {
    switch (riskLevel) {
      case 'CRITICAL_DUPLICATE':
        return { bg: 'bg-red-500/20 text-red-400 border-red-500/40', icon: ShieldAlert, label: 'DUPLICATE TOPIC DETECTED' };
      case 'HIGH_OVERLAP':
        return { bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40', icon: AlertTriangle, label: 'HIGH TOPIC OVERLAP' };
      case 'MODERATE_OVERLAP':
        return { bg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', icon: Layers, label: 'MODERATE OVERLAP' };
      default:
        return { bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', icon: CheckCircle, label: 'NOVEL / UNIQUE TOPIC' };
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Demo Quick Fill */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-indigo-500/20">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
            Duplicate Topic Detector Wizard
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Input a proposed paper title & abstract or upload a document to perform instant hybrid semantic duplication analysis.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={sampleDuplicate}
            type="button"
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-red-500/10 text-red-300 border border-red-500/30 hover:bg-red-500/20 transition-all flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Test Duplicate Topic
          </button>
          <button
            onClick={sampleUnique}
            type="button"
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Test Novel Topic
          </button>
        </div>
      </div>

      {/* Main Input Form & File Drag Drop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form onSubmit={handleAnalyze} className="lg:col-span-7 glass-panel p-6 rounded-2xl space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
              Research Paper Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep Residual Learning for Image Recognition..."
              className="w-full bg-slate-900/80 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl px-4 py-3 text-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
                Domain / Field
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 focus:border-indigo-500 text-white rounded-xl px-4 py-2.5 text-sm"
              >
                <option>Artificial Intelligence & NLP</option>
                <option>Computer Vision</option>
                <option>Cybersecurity</option>
                <option>Healthcare & Medical AI</option>
                <option>IoT & Smart Cities</option>
                <option>Blockchain & Cryptography</option>
                <option>Quantum Computing & Physics</option>
                <option>Cloud Computing</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
                Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. Transformer, BERT, NLP..."
                className="w-full bg-slate-900/80 border border-slate-700 focus:border-indigo-500 text-white rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
              Abstract / Paper Proposal Content *
            </label>
            <textarea
              required
              rows={6}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Paste research proposal abstract here..."
              className="w-full bg-slate-900/80 border border-slate-700 focus:border-indigo-500 text-white rounded-xl p-4 text-sm leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Evaluates against 50+ pre-indexed IEEE/arXiv academic publications.
            </span>
            <button
              type="submit"
              disabled={loading}
              className="glow-button px-6 py-3 rounded-xl text-white font-semibold text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin text-indigo-200" /> Analyzing Embeddings...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" /> Run Duplication Check
                </>
              )}
            </button>
          </div>
        </form>

        {/* Drag & Drop File Upload Option */}
        <div className="lg:col-span-5 flex flex-col justify-between glass-panel p-6 rounded-2xl border border-dashed border-indigo-500/30">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2 mb-3">
              <Upload className="w-4 h-4 text-indigo-400" /> Upload PDF Document
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Alternatively, upload a full research draft (.pdf or .txt) to automatically extract paper title, abstract, and section structures.
            </p>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-indigo-500/50 bg-slate-900/50'
              }`}
            >
              <FileText className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-80" />
              <p className="text-sm font-medium text-slate-200">
                Drag & drop paper PDF here
              </p>
              <p className="text-xs text-slate-500 mt-1">Supports PDF up to 15MB</p>

              <label className="mt-4 inline-block">
                <input
                  type="file"
                  accept=".pdf,.txt"
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                />
                <span className="px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-semibold rounded-xl cursor-pointer border border-indigo-500/30 transition-all inline-block">
                  Browse File
                </span>
              </label>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span>NLP Hybrid Architecture:</span>
              <span className="text-indigo-400">SentenceTransformers + TF-IDF</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Lexical Weight:</span>
              <span>35% (Cosine + BM25)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Semantic Vector Weight:</span>
              <span>45% (Dense Embedding)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results View */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Risk Assessment Score Card */}
          {(() => {
            const riskInfo = getRiskBadge(result.risk_assessment.risk_level);
            const RiskIcon = riskInfo.icon;
            const score = result.risk_assessment.risk_score;

            return (
              <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  {/* Circular Radial Meter */}
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={
                          score >= 80 ? 'text-red-500' :
                          score >= 65 ? 'text-amber-500' :
                          score >= 40 ? 'text-yellow-400' : 'text-emerald-400'
                        }
                        strokeDasharray={`${score}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold text-white">{score}%</span>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Similarity</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-1.5 ${riskInfo.bg}`}>
                        <RiskIcon className="w-3.5 h-3.5" />
                        {riskInfo.label}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({result.query_summary.total_corpus_evaluated} papers evaluated)
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {result.query_summary.title}
                    </h3>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      {result.risk_assessment.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex justify-between gap-4">
                    <span className="text-slate-400">Semantic Match:</span>
                    <span className="font-bold text-indigo-400">{result.top_matches[0]?.semantic_similarity}%</span>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex justify-between gap-4">
                    <span className="text-slate-400">Lexical Overlap:</span>
                    <span className="font-bold text-purple-400">{result.top_matches[0]?.lexical_similarity}%</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Top Matches & Sentence-level Comparison Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top Matches List */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" /> Top Matched Published Papers
              </h3>

              {result.top_matches.map((paper, idx) => (
                <div
                  key={paper.paper_id}
                  onClick={() => setSelectedMatch(paper)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    selectedMatch?.paper_id === paper.paper_id
                      ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'glass-card border-slate-800 hover:border-indigo-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                      #{idx + 1} {paper.domain}
                    </span>
                    <span className={`font-bold ${
                      paper.overall_similarity >= 70 ? 'text-red-400' :
                      paper.overall_similarity >= 40 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {paper.overall_similarity}% Overlap
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white line-clamp-2 leading-snug">
                    {paper.title}
                  </h4>

                  <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                    <span>{paper.authors.join(', ')} ({paper.year})</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Side-by-Side Sentence Alignment Heatmap */}
            <div className="lg:col-span-7 glass-panel p-6 rounded-2xl space-y-4">
              {selectedMatch ? (
                <>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
                        Sentence Alignment Heatmap
                      </span>
                      <h4 className="text-base font-bold text-white mt-0.5">
                        {selectedMatch.title}
                      </h4>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                      ID: {selectedMatch.paper_id}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
                    {selectedMatch.matched_sentences && selectedMatch.matched_sentences.length > 0 ? (
                      selectedMatch.matched_sentences.map((align, i) => (
                        <div
                          key={i}
                          className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                            align.is_match
                              ? 'bg-red-950/20 border-red-500/40 text-red-200'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold mb-1">
                            <span className="text-indigo-300">Submitted Abstract Sentence #{i + 1}:</span>
                            <span className={align.is_match ? 'text-red-400 font-bold' : 'text-slate-500'}>
                              {Math.round(align.similarity * 100)}% Similarity
                            </span>
                          </div>
                          <p className="italic text-slate-200">"{align.query_sentence}"</p>

                          {align.matched_candidate_sentence && (
                            <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 text-slate-400">
                              <span className="font-semibold text-amber-300 block mb-0.5">
                                Matching Published Sentence:
                              </span>
                              <p className="text-amber-200/90">"{align.matched_candidate_sentence}"</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 p-4 text-center">
                        No critical sentence-level duplication detected for this paper. Overall similarity is moderate.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-400 p-8 text-center">
                  Select a candidate paper on the left to view side-by-side sentence matching.
                </p>
              )}
            </div>
          </div>

          {/* AI Novelty Recommendations */}
          <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Recommended Research Novelty Adjustments
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.novelty_recommendations.map((rec, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
