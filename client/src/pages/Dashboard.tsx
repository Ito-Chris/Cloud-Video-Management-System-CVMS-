import { useQuery } from "@tanstack/react-query";
import {
  Camera,
  AlertTriangle,
  Activity,
  Users,
  Shield,
  Zap,
  RefreshCw,
} from "lucide-react";
import { api } from "../lib/api";
import { formatDateTime } from "../lib/utils";
import StatCard from "../components/StatCard";
import AlertFeed from "../components/AlertFeed";
import PageHeader from "../components/PageHeader";
import type { DashboardStats, DetectionEvent, Incident } from "@shared/schema";
import { Badge } from "../components/Badge";
import { incidentStatusColor, priorityColor } from "../lib/utils";

export default function Dashboard() {
  const { data: stats, dataUpdatedAt } = useQuery<DashboardStats>({
    queryKey: ["stats"],
    queryFn: () => api.get<DashboardStats>("/stats"),
    refetchInterval: 8000,
  });

  const { data: incidents = [] } = useQuery<Incident[]>({
    queryKey: ["incidents", "active"],
    queryFn: () => api.get<Incident[]>("/incidents"),
    refetchInterval: 10000,
  });

  const { data: events = [] } = useQuery<DetectionEvent[]>({
    queryKey: ["events-critical"],
    queryFn: () => api.get<DetectionEvent[]>("/events?resolved=false"),
    refetchInterval: 5000,
  });

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Operations Dashboard"
        subtitle={`Last updated: ${dataUpdatedAt ? formatDateTime(new Date(dataUpdatedAt).toISOString()) : "—"}`}
        actions={
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: "3s" }} />
            Live
          </div>
        }
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Stats row */}
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          <StatCard
            label="Total Cameras"
            value={stats?.totalCameras ?? "—"}
            icon={Camera}
            color="blue"
            sub={`${stats?.onlineCameras ?? 0} online`}
          />
          <StatCard
            label="Active Incidents"
            value={stats?.activeIncidents ?? "—"}
            icon={AlertTriangle}
            color="red"
          />
          <StatCard
            label="Events Today"
            value={stats?.todayEvents ?? "—"}
            icon={Activity}
            color="purple"
          />
          <StatCard
            label="Critical Alerts"
            value={stats?.criticalAlerts ?? "—"}
            icon={Zap}
            color="yellow"
          />
          <StatCard
            label="Active Officers"
            value={stats?.activeOfficers ?? "—"}
            icon={Users}
            color="green"
          />
          <StatCard
            label="System Status"
            value="SECURE"
            icon={Shield}
            color="green"
            sub="All systems nominal"
          />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Alert Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <h2 className="font-semibold text-white text-sm">Live Alert Feed</h2>
              <span className="text-xs text-slate-500">{events.length} active</span>
            </div>
            <div className="p-4">
              <AlertFeed limit={8} showResolved={false} />
            </div>
          </div>

          {/* Active Incidents */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <h2 className="font-semibold text-white text-sm">Active Incidents</h2>
              <a href="/incidents" className="text-xs text-blue-400 hover:text-blue-300">
                View all →
              </a>
            </div>
            <div className="divide-y divide-slate-800">
              {incidents.length === 0 && (
                <div className="py-8 text-center text-slate-500 text-sm">No active incidents</div>
              )}
              {incidents.slice(0, 5).map((inc) => (
                <div key={inc.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold ${priorityColor[inc.priority]}`}>
                          [{inc.priority.toUpperCase()}]
                        </span>
                        <span className="text-sm text-white font-medium truncate">{inc.title}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{inc.location}</p>
                      {inc.assignedOfficerName && (
                        <p className="text-xs text-slate-600 mt-0.5">→ {inc.assignedOfficerName}</p>
                      )}
                    </div>
                    <Badge className={incidentStatusColor[inc.status]}>
                      {inc.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
