"use client";
import { useState, useEffect } from "react";
import { Users, BookOpen, CheckCircle2, Activity, Trophy, Clock } from "lucide-react";

export default function DashboardTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: "Total Users", value: stats.stats.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Questions", value: stats.stats.totalQuestions, icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Live Questions", value: stats.stats.liveQuestions, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Sessions", value: stats.stats.totalSessions, icon: Activity, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Completed Quizzes", value: stats.stats.completedSessions, icon: Trophy, color: "text-yellow-600", bg: "bg-yellow-50" },
  ] : [];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--accent-green)] border-t-transparent" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">Dashboard</h1>
        <p className="text-[var(--text-muted)]">AuraPrep platform overview at a glance.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((c, i) => (
          <div key={i} className="hd-widget p-5 flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
              <c.icon className={`w-5 h-5 ${c.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{c.value?.toLocaleString()}</p>
              <p className="text-xs text-[var(--text-muted)] font-medium">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Difficulty Breakdown */}
      {stats?.diffBreakdown && (
        <div className="hd-widget p-6 mb-6">
          <h3 className="font-bold text-lg mb-4">Question Difficulty Breakdown</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "🟢 Normal", val: stats.diffBreakdown.normal, color: "bg-green-500" },
              { label: "🟡 Intermediate", val: stats.diffBreakdown.intermediate, color: "bg-yellow-400" },
              { label: "🔴 Hard Mode", val: stats.diffBreakdown.hard, color: "bg-red-500" },
            ].map((d, i) => {
              const total = stats.stats.liveQuestions || 1;
              const pct = Math.round((d.val / total) * 100);
              return (
                <div key={i} className="text-center">
                  <p className="font-bold text-xl mb-1">{d.val}</p>
                  <p className="text-sm text-[var(--text-muted)] mb-2">{d.label}</p>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${d.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{pct}%</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      {stats?.recentSessions?.length > 0 && (
        <div className="hd-widget p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--accent-green)]" /> Recent Quiz Sessions
          </h3>
          <div className="space-y-3">
            {stats.recentSessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="font-semibold text-sm">{s.profiles?.full_name || s.profiles?.username || "Anonymous"}</p>
                  <p className="text-xs text-[var(--text-muted)]">{new Date(s.started_at).toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{s.score}/{s.total_questions} correct</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.status === 'completed' ? 'bg-green-100 text-green-700' : s.status === 'abandoned' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
