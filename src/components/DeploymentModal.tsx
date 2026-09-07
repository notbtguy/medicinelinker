import React from "react";
import { X, Server, Globe, Sparkles, CheckCircle2, Terminal, AlertTriangle, ArrowRight } from "lucide-react";

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentModal: React.FC<DeploymentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                GitHub Pages & Deployment Guide
              </h3>
              <p className="text-xs text-slate-500">
                Understanding full-stack vs static hosting for Medical Connection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-600">
          {/* Why did 404 happen */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-xs uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Why did /api/analyze-connection return 404 on GitHub?</span>
            </div>
            <p className="text-xs leading-relaxed">
              <strong>GitHub Pages is a static file host</strong> (serving only HTML, JS, and CSS). It does not have a Node.js runtime to execute the backend Express server (<code className="bg-amber-100/80 px-1 py-0.5 rounded text-[11px] font-mono">server.ts</code>). When the browser called <code className="bg-amber-100/80 px-1 py-0.5 rounded text-[11px] font-mono">/api/analyze-connection</code>, GitHub responded with 404 because that file path does not exist on a static CDN.
            </p>
          </div>

          {/* Solution 1: Vercel Serverless (Recommended) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center">1</span>
              <h4 className="font-bold text-slate-900 text-sm">
                Deploy to Vercel (Configured & Ready)
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-8">
              The project is now fully configured for Vercel Serverless functions via <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">vercel.json</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">/api/index.ts</code>:
            </p>
            <div className="pl-8 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-slate-700 space-y-1.5">
              <p>1. Push your repository to GitHub.</p>
              <p>2. Import repository on <strong>Vercel</strong> (Select <strong>Vite</strong> preset).</p>
              <p>3. Add Environment Variable: <code className="text-teal-700 font-bold">GEMINI_API_KEY</code>.</p>
              <p>4. Hit <strong>Deploy</strong> — live AI endpoints work seamlessly!</p>
            </div>
          </div>

          {/* Solution 2: Full-Stack Container (Cloud Run, Render, Railway) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center">2</span>
              <h4 className="font-bold text-slate-900 text-sm">
                Deploy as a Persistent Node App (Cloud Run, Render, Railway)
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-8">
              For dedicated container hosting running the persistent Express server:
            </p>
            <div className="pl-8 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-slate-700 space-y-1">
              <p>• Build Command: <code className="text-teal-700 font-bold">npm run build</code></p>
              <p>• Start Command: <code className="text-teal-700 font-bold">npm start</code> (runs <code className="text-slate-500">node dist/server.cjs</code>)</p>
              <p>• Environment Variable: <code className="text-teal-700 font-bold">GEMINI_API_KEY</code></p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Got It, Thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
