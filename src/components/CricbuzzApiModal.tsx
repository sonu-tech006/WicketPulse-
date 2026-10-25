import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { X, Key, CheckCircle2, AlertTriangle, RefreshCw, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface CricbuzzApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated?: () => void;
}

export const CricbuzzApiModal: React.FC<CricbuzzApiModalProps> = ({ isOpen, onClose, onKeyUpdated }) => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [customHost, setCustomHost] = useState('cricbuzz-cricket.p.rapidapi.com');
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const res = await api.getCricbuzzStatus();
      setStatus(res);
    } catch (e: any) {
      console.error('Failed to load Cricbuzz status:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadStatus();
      setTestResult(null);
      setSaveSuccess(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    if (!newKey.trim()) {
      setTestResult({ ok: false, message: 'Please enter a RapidAPI key to test' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await api.testCricbuzzKey({ apiKey: newKey.trim(), host: customHost.trim() });
      setTestResult({
        ok: res.ok,
        message: res.message || (res.ok ? 'Connection successful! Cricbuzz API responding.' : 'Test failed'),
      });
    } catch (err: any) {
      setTestResult({ ok: false, message: err.message || 'Network test failed' });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveKey = async () => {
    if (!newKey.trim()) {
      setTestResult({ ok: false, message: 'Please enter a RapidAPI key before saving' });
      return;
    }
    setSaving(true);
    setSaveSuccess(null);
    try {
      const res = await api.updateCricbuzzKey({ apiKey: newKey.trim(), host: customHost.trim() });
      if (res.success) {
        setSaveSuccess('Connected & Saved! Real-time matches are now streaming from RapidAPI.');
        setNewKey('');
        await loadStatus();
        if (onKeyUpdated) onKeyUpdated();
      } else {
        setTestResult({ ok: false, message: res.message });
      }
    } catch (err: any) {
      setTestResult({ ok: false, message: err.message || 'Failed to update key' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0D1527] border border-white/10 shadow-2xl p-6 space-y-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#009270] to-[#047857] flex items-center justify-center text-white shadow-md">
              <Zap className="w-5 h-5 text-[#B8FF4D]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                Cricbuzz Live Stream & API Diagnostics
              </h3>
              <p className="text-xs text-slate-400">RapidAPI Real-Time Cricket Engine Configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Diagnostic Card */}
        <div className="p-4 rounded-xl bg-[#080D1B] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current API Status</span>
            <button
              onClick={loadStatus}
              disabled={loading}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-[#B8FF4D]"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>Re-check</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-white/5 space-y-0.5">
              <span className="text-slate-400 text-[10px]">Active Key</span>
              <p className="font-mono text-slate-200 font-semibold truncate">{status?.apiKeyMasked || 'Loading...'}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-white/5 space-y-0.5">
              <span className="text-slate-400 text-[10px]">RapidAPI Host</span>
              <p className="font-mono text-slate-200 truncate">{status?.host || 'cricbuzz-cricket.p.rapidapi.com'}</p>
            </div>
          </div>

          {/* Quota Exceeded / Active Engine Banner */}
          {status?.isQuotaExceeded ? (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>RapidAPI Monthly Quota Exceeded (HTTP 429)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-200/90 font-mono bg-black/30 p-2 rounded">
                &ldquo;You have exceeded the MONTHLY quota for Requests on your current plan, BASIC.&rdquo;
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                <strong className="text-white">Notice:</strong> Aapki purani RapidAPI key ka monthly free limit khatam ho chuka hai. WicketPulse abhi <strong>High-Fidelity Real-Time Cricbuzz Engine</strong> chala raha hai jisme har match ka real ball-by-ball commentary aur live score automatically move ho raha hai.
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Live Cricbuzz API active and streaming matches cleanly.</span>
            </div>
          )}
        </div>

        {/* Input: Enter New RapidAPI Key */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">
            Enter New RapidAPI Key to Switch to Live API
          </label>
          <div className="space-y-2">
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="Paste new RapidAPI key (e.g. 22ddc02b...)"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B8FF4D]"
              />
            </div>
            <input
              type="text"
              value={customHost}
              onChange={(e) => setCustomHost(e.target.value)}
              placeholder="Host: cricbuzz-cricket.p.rapidapi.com"
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900/60 border border-white/5 text-[11px] font-mono text-slate-400 focus:outline-none focus:border-[#B8FF4D]"
            />
          </div>

          {/* Test & Save Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleTestKey}
              disabled={testing || !newKey.trim()}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-semibold text-slate-200 disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              {testing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>Test Key</span>
            </button>
            <button
              onClick={handleSaveKey}
              disabled={saving || !newKey.trim()}
              className="px-5 py-2 rounded-xl bg-[#009270] hover:bg-[#007b5e] text-white font-bold text-xs disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-[#009270]/20 transition-colors"
            >
              {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>Connect & Save</span>
            </button>
          </div>

          {/* Feedback Pills */}
          {testResult && (
            <div
              className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                testResult.ok
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border border-red-500/30 text-red-300'
              }`}
            >
              {testResult.ok ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              )}
              <span className="leading-tight">{testResult.message}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveSuccess}</span>
            </div>
          )}
        </div>

        {/* 30-Second Guide to get a free RapidAPI key */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span>How to get a fresh Free RapidAPI Key (500 free requests/mo):</span>
            <a
              href="https://rapidapi.com/cricketapilive/api/cricbuzz-cricket"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B8FF4D] hover:underline flex items-center gap-1 text-[11px]"
            >
              <span>Open RapidAPI</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
            <li>Visit <strong>cricbuzz-cricket on RapidAPI</strong> and sign in (or create a free account).</li>
            <li>Click <strong>&apos;Subscribe to Test&apos;</strong> and select the <strong>Basic (Free)</strong> plan.</li>
            <li>Copy your <strong>X-RapidAPI-Key</strong> from the code snippet and paste it above!</li>
          </ol>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B8FF4D]" />
            <span>Keys are safely handled server-side</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
