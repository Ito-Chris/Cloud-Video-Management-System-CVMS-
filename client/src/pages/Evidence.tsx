import { useQuery } from "@tanstack/react-query";
import { Archive, Video, Image, FileText, Music, Lock, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { api } from "../lib/api";
import { timeAgo, formatDateTime } from "../lib/utils";
import PageHeader from "../components/PageHeader";
import { Badge } from "../components/Badge";
import type { Evidence } from "@shared/schema";

const typeIcon = {
  video: Video,
  image: Image,
  document: FileText,
  audio: Music,
};

const typeColor = {
  video: "text-purple-400 bg-purple-950 border-purple-800",
  image: "text-blue-400 bg-blue-950 border-blue-800",
  document: "text-amber-400 bg-amber-950 border-amber-800",
  audio: "text-emerald-400 bg-emerald-950 border-emerald-800",
};

export default function EvidencePage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const { data: allEvidence = [] } = useQuery<Evidence[]>({
    queryKey: ["evidence"],
    queryFn: () => api.get<Evidence[]>("/evidence"),
  });

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Evidence Management"
        subtitle="Tamper-proof chain of custody for all digital evidence"
      />

      <div className="p-6 space-y-5 overflow-auto">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
          {(["video", "image", "document", "audio"] as const).map((t) => {
            const Icon = typeIcon[t];
            const count = allEvidence.filter((e) => e.type === t).length;
            return (
              <div key={t} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
                <Icon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-lg font-bold text-white">{count}</p>
                  <p className="text-xs text-slate-500 capitalize">{t} files</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Evidence list */}
        <div className="space-y-3">
          {allEvidence.map((ev) => {
            const Icon = typeIcon[ev.type];
            const isExpanded = expanded === ev.id;
            return (
              <div key={ev.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                {/* Header */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : ev.id)}
                >
                  <div className="flex-shrink-0">
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white truncate">{ev.filename}</span>
                      <Badge className={typeColor[ev.type]}>{ev.type}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {ev.description} · Incident: <span className="text-slate-400">{ev.incidentTitle}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                      <span>{ev.fileSize}</span>
                      <span>·</span>
                      <span>Uploaded {timeAgo(ev.uploadedAt)}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3" /> {ev.custodyChain.length} custody entries
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-slate-600">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded: hash + custody chain */}
                {isExpanded && (
                  <div className="border-t border-slate-800 bg-slate-950/50 p-4 space-y-4">
                    {/* File hash */}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        SHA-256 Hash (Integrity Verification)
                      </p>
                      <code className="text-xs text-emerald-400 font-mono break-all bg-slate-900 p-2 rounded block">
                        {ev.fileHash}
                      </code>
                    </div>

                    {/* Chain of custody */}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Chain of Custody
                      </p>
                      <div className="space-y-2">
                        {ev.custodyChain.map((entry, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1" />
                              {i < ev.custodyChain.length - 1 && (
                                <div className="w-px h-6 bg-slate-700 mt-1" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-white">
                                <span className="font-medium">{entry.name}</span>{" "}
                                <span className="text-slate-400">— {entry.action}</span>
                              </p>
                              <p className="text-xs text-slate-600">{formatDateTime(entry.timestamp)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
