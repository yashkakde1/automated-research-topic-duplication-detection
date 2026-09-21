import React, { useState, useEffect } from 'react';
import { BarChart2, PieChart, TrendingUp, Award, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart as RePieChart, Pie } from 'recharts';

export default function AnalyticsHub() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics');
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400">Total Pre-Indexed Papers</span>
            <div className="text-2xl font-extrabold text-white mt-1">{analytics?.total_papers || 15}</div>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400">Research Domains</span>
            <div className="text-2xl font-extrabold text-white mt-1">{analytics?.total_domains || 8}</div>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
            <PieChart className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-pink-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400">Total Paper Citations</span>
            <div className="text-2xl font-extrabold text-white mt-1">{analytics?.total_citations?.toLocaleString() || '365,000+'}</div>
          </div>
          <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400">Avg Citations / Paper</span>
            <div className="text-2xl font-extrabold text-white mt-1">{analytics?.avg_citations_per_paper || 243}</div>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Domain Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-indigo-400" /> Research Domain Publication Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.domain_breakdown || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="domain" tick={{ fill: '#94a3b8', fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {analytics?.domain_breakdown?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-400" /> Topic Category Breakdown
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={analytics?.domain_breakdown || []}
                  dataKey="count"
                  nameKey="domain"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={4}
                >
                  {analytics?.domain_breakdown?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
