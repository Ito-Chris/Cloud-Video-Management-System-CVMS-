import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AlertTriangle, Plus, ChevronDown } from "lucide-react";
import { api } from "../lib/api";
import { cn, timeAgo, incidentStatusColor, priorityColor } from "../lib/utils";
import PageHeader from "../components/PageHeader";
import { Badge } from "../components/Badge";
import type { Incident, IncidentStatus } from "@shared/schema";

const statusTransitions: Record<IncidentStatus, IncidentStatus[]> = {
  open: ["investigating"],
  investigating: ["resolved"],
  resolved: ["closed"],
  closed: [],
};

export default function Incidents() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "high", location: "" });

  const { data: incidents = [] } = useQuery<Incident[]>({
    queryKey: ["incidents"],
    queryFn: () => api.get<Incident[]>("/incidents"),
    refetchInterval: 10000,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.patch(`/incidents/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["incidents"] }),
  });

  const createIncident = useMutation({
    mutationFn: (data: typeof form) =>
      api.post("/incidents", { ...data, status: "open" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["incidents"] });
      setShowCreate(false);
      setForm({ title: "", description: "", priority: "high", location: "" });
    },
  });

  const filtered =
    statusFilter === "all" ? incidents : incidents.filter((i) => i.status === statusFilter);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Incident Management"
        subtitle={`${incidents.filter((i) => i.status === "open" || i.status === "investigating").length} active incidents`}
        actions={
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Incident
          </button>
        }
      />

      <div className="p-6 space-y-5">
        {/* Create modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-lg">
              <h2 className="text-lg font-bold text-white mb-4">Create Incident</h2>
              <div className="space-y-3">
                <input
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="Incident title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <textarea
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 h-24 resize-none"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <input
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
                <select
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  <option value="low">Priority: Low</option>
                  <option value="medium">Priority: Medium</option>
                  <option value="high">Priority: High</option>
                  <option value="critical">Priority: Critical</option>
                </select>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => createIncident.mutate(form)}
                  disabled={!form.title || createIncident.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {["all", "open", "investigating", "resolved", "closed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors",
                statusFilter === s
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              )}
            >
              {s === "all" ? `All (${incidents.length})` : `${s} (${incidents.filter((i) => i.status === s).length})`}
            </button>
          ))}
        </div>

        {/* Incident list */}
        <div className="space-y-3">
          {filtered.map((inc) => (
            <div key={inc.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <AlertTriangle className={cn("w-4 h-4 flex-shrink-0", priorityColor[inc.priority])} />
                    <span className="font-semibold text-white">{inc.title}</span>
                    <Badge className={incidentStatusColor[inc.status]}>{inc.status}</Badge>
                    <span className={cn("text-xs font-medium capitalize", priorityColor[inc.priority])}>
                      {inc.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1.5">{inc.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
                    <span>📍 {inc.location}</span>
                    {inc.assignedOfficerName && <span>👮 {inc.assignedOfficerName}</span>}
                    <span>🕐 {timeAgo(inc.createdAt)}</span>
                    <span className="text-slate-600">#{inc.id}</span>
                  </div>
                </div>

                {/* Status transition */}
                {statusTransitions[inc.status].length > 0 && (
                  <button
                    onClick={() =>
                      updateStatus.mutate({
                        id: inc.id,
                        status: statusTransitions[inc.status][0],
                      })
                    }
                    className="flex-shrink-0 flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <ChevronDown className="w-3 h-3" />
                    Move to {statusTransitions[inc.status][0]}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
