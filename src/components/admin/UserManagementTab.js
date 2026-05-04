"use client";
import { useState, useEffect, useCallback } from "react";
import { Users, Crown, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

export default function UserManagementTab() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?page=${p}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(page); }, [page, fetchUsers]);

  const togglePremium = async (id, current) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, updates: { is_premium: !current } })
    });
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_premium: !current } : u));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">User Management</h1>
          <p className="text-[var(--text-muted)]">Total registered users: <span className="font-bold text-[var(--accent-green-dark)]">{total}</span></p>
        </div>
        <button onClick={() => fetchUsers(page)} className="p-2 rounded-lg border border-gray-200 hover:border-[var(--accent-green)] transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="hd-widget overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--accent-green)] border-t-transparent" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-[var(--text-muted)]">
            <Users className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-semibold">No users yet</p>
          </div>
        ) : (
          <div>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">
              <div className="col-span-3">User</div>
              <div className="col-span-2">Target Exam</div>
              <div className="col-span-2">XP / Level</div>
              <div className="col-span-1">Streak</div>
              <div className="col-span-2">Joined</div>
              <div className="col-span-2 text-right">Premium</div>
            </div>

            {users.map(u => (
              <div key={u.id} className="grid grid-cols-12 gap-2 px-5 py-4 border-b border-gray-50 hover:bg-gray-50/70 transition-colors items-center">
                <div className="col-span-3">
                  <p className="font-semibold text-sm text-[var(--text-primary)]">{u.full_name || u.username}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{u.email}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                    {u.target_exam || "—"}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-bold">{u.xp_total?.toLocaleString()} XP</p>
                  <p className="text-xs text-[var(--text-muted)]">Level {u.level}</p>
                </div>
                <div className="col-span-1">
                  <span className="text-sm font-bold">{u.streak_days}🔥</span>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-[var(--text-muted)]">{new Date(u.created_at).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="col-span-2 flex justify-end">
                  <button
                    onClick={() => togglePremium(u.id, u.is_premium)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      u.is_premium
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100'
                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-yellow-300'
                    }`}
                  >
                    <Crown className="w-3 h-3" />
                    {u.is_premium ? 'Premium' : 'Free'}
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-4">
              <p className="text-sm text-[var(--text-muted)]">Showing {((page - 1) * 15) + 1}–{Math.min(page * 15, total)} of {total}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:border-[var(--accent-green)] flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <span className="px-3 py-1.5 text-sm font-medium">Page {page}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={page * 15 >= total}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:border-[var(--accent-green)] flex items-center gap-1">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
