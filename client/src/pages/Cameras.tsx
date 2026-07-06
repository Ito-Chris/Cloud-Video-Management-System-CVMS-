import { useQuery } from "@tanstack/react-query";
import { Camera, Wifi, WifiOff, Wrench, Grid, List } from "lucide-react";
import { useState } from "react";
import { api } from "../lib/api";
import { cn, statusColor } from "../lib/utils";
import CameraCard from "../components/CameraCard";
import PageHeader from "../components/PageHeader";
import { Badge } from "../components/Badge";
import type { Camera as CameraType } from "@shared/schema";

type Filter = "all" | "online" | "offline" | "maintenance";

export default function Cameras() {
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const { data: cameras = [] } = useQuery<CameraType[]>({
    queryKey: ["cameras"],
    queryFn: () => api.get<CameraType[]>("/cameras"),
    refetchInterval: 15000,
  });

  const filtered = filter === "all" ? cameras : cameras.filter((c) => c.status === filter);

  const counts = {
    online: cameras.filter((c) => c.status === "online").length,
    offline: cameras.filter((c) => c.status === "offline").length,
    maintenance: cameras.filter((c) => c.status === "maintenance").length,
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Camera Management"
        subtitle={`${cameras.length} cameras registered`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("grid")}
              className={cn("p-2 rounded", view === "grid" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800")}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn("p-2 rounded", view === "list" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        }
      />

      <div className="p-6 space-y-5">
        {/* Filter bar */}
        <div className="flex items-center gap-3 flex-wrap">
          {(["all", "online", "offline", "maintenance"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize",
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              )}
            >
              {f === "all" ? `All (${cameras.length})` : `${f} (${counts[f] ?? 0})`}
            </button>
          ))}
        </div>

        {/* Grid view */}
        {view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((cam) => (
              <CameraCard key={cam.id} camera={cam} />
            ))}
          </div>
        )}

        {/* List view */}
        {view === "list" && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">IP Address</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((cam) => {
                  const StatusIcon = cam.status === "online" ? Wifi : cam.status === "offline" ? WifiOff : Wrench;
                  return (
                    <tr key={cam.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-slate-600" />
                          <span className="text-sm font-medium text-white">{cam.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">{cam.location}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-500 uppercase">{cam.type}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 font-mono">{cam.ipAddress}</td>
                      <td className="px-4 py-3">
                        <div className={cn("flex items-center gap-1.5 text-sm capitalize", statusColor[cam.status])}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {cam.status}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
