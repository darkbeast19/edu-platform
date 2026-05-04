"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BrainCircuit,
  Database,
  Users,
  Settings,
  Sparkles,
  Search,
  Plus,
  Save,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import DashboardTab from "@/components/admin/DashboardTab";
import UserManagementTab from "@/components/admin/UserManagementTab";
import SettingsTab from "@/components/admin/SettingsTab";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("ai-generator");

  // State for AI Generator
  const [aiForm, setAiForm] = useState({
    exam: "SSC CGL",
    topic: "",
    count: 5
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  // State for Content Manager
  const [cmQuestions, setCmQuestions] = useState([]);
  const [cmTotal, setCmTotal] = useState(0);
  const [cmPage, setCmPage] = useState(1);
  const [cmLoading, setCmLoading] = useState(false);
  const [cmFilter, setCmFilter] = useState('all'); // all, active, inactive
  const [cmSearch, setCmSearch] = useState('');

  const fetchCmQuestions = useCallback(async (page = 1, status = 'all') => {
    setCmLoading(true);
    try {
      const res = await fetch(`/api/admin/questions?page=${page}&status=${status}`);
      const data = await res.json();
      if (data.questions) {
        setCmQuestions(data.questions);
        setCmTotal(data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
    }
    setCmLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === 'content') {
      fetchCmQuestions(cmPage, cmFilter);
    }
  }, [activeTab, cmPage, cmFilter, fetchCmQuestions]);

  const handleToggleStatus = async (id, currentStatus) => {
    const res = await fetch('/api/admin/questions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !currentStatus })
    });
    if (res.ok) {
      setCmQuestions(prev => prev.map(q => q.id === id ? { ...q, is_active: !currentStatus } : q));
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this question?')) return;
    const res = await fetch('/api/admin/questions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (res.ok) {
      setCmQuestions(prev => prev.filter(q => q.id !== id));
      setCmTotal(prev => prev - 1);
    }
  };

  const diffBadge = (level) => {
    if (level === 5) return { label: '🔴 Hard Mode', cls: 'bg-red-100 text-red-700 border-red-300' };
    if (level === 3) return { label: '🟡 Intermediate', cls: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
    return { label: '🟢 Normal', cls: 'bg-green-100 text-green-700 border-green-300' };
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!aiForm.topic) return alert("Please enter a topic");
    
    setIsGenerating(true);
    try {
      // We will call the existing generate-quiz API
      // In a real app, you might want a dedicated admin bulk-generate API
      const res = await fetch(`/api/generate-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiForm)
      });
      const data = await res.json();
      if (data.questions) {
        setGeneratedQuestions(data.questions);
      }
    } catch (err) {
      console.error(err);
      alert("Error generating questions.");
    }
    setIsGenerating(false);
  };

  const handleSaveToDB = async () => {
    try {
      const res = await fetch('/api/admin/save-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: generatedQuestions,
          exam: aiForm.exam,
          topic: aiForm.topic
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        alert(`Success! ${data.message}`);
        setGeneratedQuestions([]);
        setAiForm({ ...aiForm, topic: "" });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save to database. Check console.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <Navbar />

      <div className="flex flex-1 pt-16 h-[calc(100vh-64px)] overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-[var(--border-subtle)] flex flex-col shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--accent-green)]" />
              Admin Hub
            </h2>
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'ai-generator', label: 'AI Bulk Generator', icon: BrainCircuit },
              { id: 'content', label: 'Content Manager', icon: Database },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id 
                  ? 'bg-[var(--accent-green-light)] text-[var(--accent-green-dark)]' 
                  : 'text-[var(--text-secondary)] hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          
          {/* AI Generator Tab */}
          {activeTab === 'ai-generator' && (
            <div className="max-w-5xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">AI Question Bulk Generator</h1>
                <p className="text-[var(--text-muted)]">Generate high-quality questions with explanations and tricks instantly.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Panel */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="hd-widget p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-[var(--accent-green)]" />
                      Generation Settings
                    </h3>
                    
                    <form onSubmit={handleGenerate} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Target Exam</label>
                        <select 
                          className="w-full p-3 rounded-lg border border-[var(--border-medium)] outline-none focus:border-[var(--accent-green)] bg-gray-50"
                          value={aiForm.exam}
                          onChange={(e) => setAiForm({...aiForm, exam: e.target.value})}
                        >
                          <option>SSC CGL</option>
                          <option>Railway NTPC</option>
                          <option>Banking PO</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Topic / Subject</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Ratio and Proportion"
                          className="w-full p-3 rounded-lg border border-[var(--border-medium)] outline-none focus:border-[var(--accent-green)] bg-white"
                          value={aiForm.topic}
                          onChange={(e) => setAiForm({...aiForm, topic: e.target.value})}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Count</label>
                          <input 
                            type="number" 
                            min="1" max="50"
                            className="w-full p-3 rounded-lg border border-[var(--border-medium)] outline-none focus:border-[var(--accent-green)] bg-white"
                            value={aiForm.count}
                            onChange={(e) => setAiForm({...aiForm, count: parseInt(e.target.value) || ''})}
                          />
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isGenerating}
                        className="w-full btn-green py-3 mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isGenerating ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        ) : (
                          <BrainCircuit className="w-5 h-5" />
                        )}
                        {isGenerating ? 'Generating Magic...' : 'Generate Questions'}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Results Area */}
                <div className="lg:col-span-2">
                  <div className="hd-widget p-6 min-h-[500px] flex flex-col">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-subtle)]">
                      <h3 className="font-bold text-lg">
                        Generated Preview {generatedQuestions.length > 0 && `(${generatedQuestions.length})`}
                      </h3>
                      
                      {generatedQuestions.length > 0 && (
                        <button 
                          onClick={handleSaveToDB}
                          className="btn-green px-4 py-2 text-sm flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" /> Save to Database
                        </button>
                      )}
                    </div>

                    {generatedQuestions.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)]">
                        <Database className="w-16 h-16 mb-4 opacity-20" />
                        <p>No questions generated yet.</p>
                        <p className="text-sm">Configure settings and click generate to see AI magic.</p>
                      </div>
                    ) : (
                      <div className="space-y-6 overflow-y-auto pr-2 max-h-[600px] custom-scrollbar">
                        {generatedQuestions.map((q, idx) => (
                          <div key={idx} className="p-5 border border-[var(--border-medium)] rounded-xl bg-gray-50/50 hover:border-[var(--accent-green)] transition-colors">
                            <div className="flex gap-3 mb-3">
                              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent-green-light)] text-[var(--accent-green-dark)] flex items-center justify-center font-bold text-sm">
                                Q{idx + 1}
                              </span>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                    q.difficulty_level?.toLowerCase().includes('hard') 
                                      ? 'bg-red-100 text-red-700 border border-red-300' 
                                      : q.difficulty_level?.toLowerCase().includes('intermediate')
                                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                                      : 'bg-green-100 text-green-700 border border-green-300'
                                  }`}>
                                    {q.difficulty_level?.toLowerCase().includes('hard') ? '🔴 Hard Mode'
                                      : q.difficulty_level?.toLowerCase().includes('intermediate') ? '🟡 Intermediate'
                                      : '🟢 Normal'}
                                  </span>
                                </div>
                                <p className="font-semibold text-[var(--text-primary)] mb-4">{q.text}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                  {q.options.map((opt, oIdx) => (
                                    <div key={oIdx} className={`p-3 rounded-lg border text-sm ${oIdx === q.correct ? 'bg-[#dcfce7] border-green-500 font-medium' : 'bg-white border-gray-200'}`}>
                                      <span className="mr-2 font-bold opacity-50">{['A', 'B', 'C', 'D'][oIdx]}.</span> {opt}
                                    </div>
                                  ))}
                                </div>
                                
                                <div className="space-y-2 mt-4 text-sm bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                  {q.step_by_step && (
                                    <div className="flex items-start gap-2">
                                      <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5" />
                                      <p><span className="font-semibold">Explanation:</span> {q.step_by_step}</p>
                                    </div>
                                  )}
                                  {q.shortcut && (
                                    <div className="flex items-start gap-2">
                                      <Sparkles className="w-4 h-4 text-yellow-500 mt-0.5" />
                                      <p><span className="font-semibold">Trick:</span> {q.shortcut}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <button className="flex-shrink-0 text-red-400 hover:text-red-600 self-start p-2">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Manager Tab */}
          {activeTab === 'content' && (
            <div className="max-w-5xl mx-auto">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">Content Manager</h1>
                  <p className="text-[var(--text-muted)]">Total questions in database: <span className="font-bold text-[var(--accent-green-dark)]">{cmTotal}</span></p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Filter Buttons */}
                  {['all', 'active', 'inactive'].map(f => (
                    <button
                      key={f}
                      onClick={() => { setCmFilter(f); setCmPage(1); }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        cmFilter === f 
                          ? 'bg-[var(--accent-green)] text-white border-transparent' 
                          : 'bg-white border-gray-200 text-[var(--text-secondary)] hover:border-[var(--accent-green)]'
                      }`}
                    >
                      {f === 'all' ? 'All' : f === 'active' ? '✅ Live' : '❌ Inactive'}
                    </button>
                  ))}
                  <button
                    onClick={() => fetchCmQuestions(cmPage, cmFilter)}
                    className="p-2 rounded-lg border border-gray-200 hover:border-[var(--accent-green)] transition-all"
                    title="Refresh"
                  >
                    <RefreshCw className={`w-4 h-4 ${cmLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="hd-widget overflow-hidden">
                {cmLoading ? (
                  <div className="flex items-center justify-center p-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--accent-green)] border-t-transparent" />
                  </div>
                ) : cmQuestions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-16 text-[var(--text-muted)]">
                    <Database className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-semibold">No questions found</p>
                    <p className="text-sm">Generate and save questions from the AI Generator tab.</p>
                  </div>
                ) : (
                  <div>
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">
                      <div className="col-span-5">Question</div>
                      <div className="col-span-2">Topic</div>
                      <div className="col-span-2">Difficulty</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {/* Rows */}
                    {cmQuestions.map((q) => {
                      const badge = diffBadge(q.difficulty);
                      return (
                        <div key={q.id} className="grid grid-cols-12 gap-2 px-5 py-4 border-b border-gray-50 hover:bg-gray-50/70 transition-colors items-center">
                          {/* Question Text */}
                          <div className="col-span-5">
                            <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-2">{q.question_text}</p>
                          </div>

                          {/* Topic */}
                          <div className="col-span-2">
                            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full font-medium">
                              {q.topics?.name || 'Unknown'}
                            </span>
                          </div>

                          {/* Difficulty */}
                          <div className="col-span-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${badge.cls}`}>
                              {badge.label}
                            </span>
                          </div>

                          {/* Status */}
                          <div className="col-span-1">
                            {q.is_active 
                              ? <span className="text-xs font-bold text-green-600">● Live</span>
                              : <span className="text-xs font-bold text-gray-400">● Off</span>
                            }
                          </div>

                          {/* Actions */}
                          <div className="col-span-2 flex justify-end gap-2">
                            <button
                              onClick={() => handleToggleStatus(q.id, q.is_active)}
                              title={q.is_active ? 'Deactivate' : 'Activate'}
                              className={`p-1.5 rounded-lg border transition-all ${
                                q.is_active 
                                  ? 'text-green-600 border-green-200 hover:bg-green-50'
                                  : 'text-gray-400 border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {q.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(q.id)}
                              title="Delete permanently"
                              className="p-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-5 py-4">
                      <p className="text-sm text-[var(--text-muted)]">
                        Showing {((cmPage - 1) * 20) + 1}–{Math.min(cmPage * 20, cmTotal)} of {cmTotal}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCmPage(p => Math.max(1, p - 1))}
                          disabled={cmPage === 1}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:border-[var(--accent-green)] transition-all flex items-center gap-1"
                        >
                          <ChevronLeft className="w-4 h-4" /> Prev
                        </button>
                        <span className="px-3 py-1.5 text-sm font-medium">Page {cmPage}</span>
                        <button
                          onClick={() => setCmPage(p => p + 1)}
                          disabled={cmPage * 20 >= cmTotal}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:border-[var(--accent-green)] transition-all flex items-center gap-1"
                        >
                          Next <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && <DashboardTab />}

          {/* User Management Tab */}
          {activeTab === 'users' && <UserManagementTab />}

          {/* Settings Tab */}
          {activeTab === 'settings' && <SettingsTab />}

        </main>
      </div>
    </div>
  );
}
