import React, { useState, useEffect } from 'react';
import { Key, X, Eye, EyeOff, ExternalLink, Clipboard, Check, Sparkles } from 'lucide-react';
import { submitUserApiKey, cancelUserApiKeyRequest, isPrivilegedUser } from '../lib/gemini';

export function ApiKeyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [remember, setRemember] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleOpen = () => {
      // If privileged user, never show modal
      if (isPrivilegedUser()) return;
      
      const current = (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('session_gemini_api_key') : '') ||
                      (typeof localStorage !== 'undefined' ? localStorage.getItem('user_gemini_api_key') : '') || '';
      setApiKey(current);
      setError('');
      setIsOpen(true);
    };

    window.addEventListener('open_gemini_api_key_modal', handleOpen);
    return () => {
      window.removeEventListener('open_gemini_api_key_modal', handleOpen);
    };
  }, []);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setApiKey(text.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Ignore clipboard permission errors
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setError('');
    cancelUserApiKeyRequest();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setError('Vui lòng nhập hoặc dán Gemini API Key của bạn!');
      return;
    }
    if (trimmed.length < 20) {
      setError('Khóa API Gemini không đúng định dạng (thường bắt đầu bằng AIzaSy...)!');
      return;
    }

    submitUserApiKey(trimmed, remember);
    setIsOpen(false);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow decoration */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-400/20 dark:bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-violet-400/20 dark:bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              Nhập Gemini API Key
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Dùng cho dịch vụ AI lần này
            </p>
          </div>
        </div>

        {/* Informational Message */}
        <div className="mb-4 p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200 space-y-1.5">
          <p className="font-semibold flex items-center gap-1">
            <span>💡</span> Tính năng này yêu cầu sử dụng khóa Gemini API Key của bạn.
          </p>
          <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
            Google cung cấp khóa API Gemini hoàn toàn <strong>miễn phí 100%</strong>:
          </p>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-cyan-600 dark:text-cyan-400 hover:underline pt-0.5"
          >
            Lấy API Key miễn phí tại Google AI Studio
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-semibold text-center animate-in shake duration-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Khóa API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  if (error) setError('');
                }}
                placeholder="AIzaSy..."
                autoFocus
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-3.5 pr-20 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePaste}
                  className="p-1 rounded-md text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  title="Dán từ Clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Clipboard className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title={showKey ? "Ẩn khóa" : "Hiện khóa"}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-cyan-600 focus:ring-cyan-500"
            />
            <span>Lưu cho các tác vụ tiếp theo trong phiên này</span>
          </label>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all cursor-pointer"
            >
              Xác nhận & Sử dụng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
