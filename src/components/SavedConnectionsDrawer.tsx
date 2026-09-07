import React from "react";
import { SavedConnection } from "../types";
import { X, Bookmark, Trash2, ArrowRight, Clock } from "lucide-react";

interface SavedConnectionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedConnections: SavedConnection[];
  onLoadConnection: (conn: SavedConnection) => void;
  onDeleteConnection: (id: string) => void;
}

export const SavedConnectionsDrawer: React.FC<SavedConnectionsDrawerProps> = ({
  isOpen,
  onClose,
  savedConnections,
  onLoadConnection,
  onDeleteConnection,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Saved Connections</h3>
              <p className="text-xs text-slate-500">
                {savedConnections.length} saved{" "}
                {savedConnections.length === 1 ? "synthesis" : "syntheses"}
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
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedConnections.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-800 mb-1">
                No saved connections yet
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Whenever you analyze two medical concepts, click "Save" to bookmark the synthesis for future review.
              </p>
            </div>
          ) : (
            savedConnections.map((conn) => (
              <div
                key={conn.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-300 transition-all shadow-2xs group"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(conn.timestamp).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => onDeleteConnection(conn.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                    title="Delete saved connection"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                  <span>{conn.term1}</span>
                  <span className="text-slate-400">↔</span>
                  <span>{conn.term2}</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-semibold text-teal-700 mb-2">
                  <span>{conn.subject1}</span>
                  <span>•</span>
                  <span>{conn.subject2}</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {conn.coreThesis}
                </p>

                <button
                  onClick={() => {
                    onLoadConnection(conn);
                    onClose();
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Load Connection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
