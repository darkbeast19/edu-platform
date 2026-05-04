"use client";
import { useState } from "react";
import { Settings, Save, CheckCircle2 } from "lucide-react";

export default function SettingsTab() {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    siteName: "AuraPrep",
    defaultQCount: "10",
    aiProvider: "groq",
    maintenanceMode: false,
    allowRegistrations: true,
    maxQuestionsPerSession: "50",
  });

  const handleSave = () => {
    // In production, save to a settings table in Supabase
    localStorage.setItem('auraprep_admin_config', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">Settings</h1>
        <p className="text-[var(--text-muted)]">Configure global platform settings.</p>
      </div>

      <div className="hd-widget p-6 space-y-6">
        {/* Site Config */}
        <div>
          <h3 className="font-bold text-base mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[var(--accent-green)]" /> General
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Site Name</label>
              <input type="text" value={config.siteName}
                onChange={e => setConfig({ ...config, siteName: e.target.value })}
                className="w-full p-3 rounded-lg border border-[var(--border-medium)] outline-none focus:border-[var(--accent-green)] bg-white text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Default Questions Per Quiz</label>
                <input type="number" min="5" max="50" value={config.defaultQCount}
                  onChange={e => setConfig({ ...config, defaultQCount: e.target.value })}
                  className="w-full p-3 rounded-lg border border-[var(--border-medium)] outline-none focus:border-[var(--accent-green)] bg-white text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Max Questions (Admin)</label>
                <input type="number" min="10" max="100" value={config.maxQuestionsPerSession}
                  onChange={e => setConfig({ ...config, maxQuestionsPerSession: e.target.value })}
                  className="w-full p-3 rounded-lg border border-[var(--border-medium)] outline-none focus:border-[var(--accent-green)] bg-white text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* AI Config */}
        <div>
          <h3 className="font-bold text-base mb-4 pb-2 border-b border-gray-100">🤖 AI Provider Priority</h3>
          <select value={config.aiProvider}
            onChange={e => setConfig({ ...config, aiProvider: e.target.value })}
            className="w-full p-3 rounded-lg border border-[var(--border-medium)] outline-none focus:border-[var(--accent-green)] bg-white text-sm">
            <option value="groq">Groq (Llama 3.3 70B) — Lightning Fast ⚡</option>
            <option value="gemini">Gemini 2.5 Flash — High Quality ✨</option>
          </select>
          <p className="text-xs text-[var(--text-muted)] mt-2">The other provider will be used as automatic fallback.</p>
        </div>

        {/* Toggles */}
        <div>
          <h3 className="font-bold text-base mb-4 pb-2 border-b border-gray-100">🔧 Platform Controls</h3>
          <div className="space-y-4">
            {[
              { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Disable access for all non-admin users', danger: true },
              { key: 'allowRegistrations', label: 'Allow New Registrations', desc: 'Allow new students to sign up', danger: false },
            ].map(({ key, label, desc, danger }) => (
              <div key={key} className={`flex items-center justify-between p-4 rounded-xl border ${danger && config[key] ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-[var(--text-muted)]">{desc}</p>
                </div>
                <button
                  onClick={() => setConfig({ ...config, [key]: !config[key] })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${config[key] ? (danger ? 'bg-red-500' : 'bg-[var(--accent-green)]') : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${config[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button onClick={handleSave}
          className="w-full btn-green py-3 flex items-center justify-center gap-2 font-semibold">
          {saved ? <><CheckCircle2 className="w-5 h-5" /> Settings Saved!</> : <><Save className="w-5 h-5" /> Save Settings</>}
        </button>
      </div>
    </div>
  );
}
