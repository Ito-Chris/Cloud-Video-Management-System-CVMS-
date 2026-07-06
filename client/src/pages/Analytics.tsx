import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { api } from "../lib/api";
import PageHeader from "../components/PageHeader";
import { timeAgo } from "../lib/utils";
import type { AnalyticsData } from "@shared/schema";

const SEVERITY_COLORS = ["#ef4444", "#f97316", "#eab308", "#3b82f6"];
const EVENT_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];
const GENDER_COLORS = ["#3b82f6", "#ec4899", "#6b7280"];

export default function Analytics() {
  const { data } = useQuery<AnalyticsData>({
    queryKey: ["analytics"],
    queryFn: () => api.get<AnalyticsData>("/analytics"),
    refetchInterval: 30000,
  });

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Loading analytics…
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Analytics"
        subtitle="Real-time detection and demographic analysis"
      />

      <div className="p-6 space-y-6 overflow-auto">
        {/* Events over time */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Events Over Time (Today)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.eventsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
                labelStyle={{ color: "#94a3b8" }}
                itemStyle={{ color: "#60a5fa" }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Row: Events by type + Severity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Events by Type</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.eventsByType} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="type" stroke="#475569" tick={{ fontSize: 11 }} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
                  itemStyle={{ color: "#60a5fa" }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {data.eventsByType.map((_, i) => (
                    <Cell key={i} fill={EVENT_COLORS[i % EVENT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Events by Severity</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data.eventsBySeverity}
                    dataKey="count"
                    nameKey="severity"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {data.eventsBySeverity.map((_, i) => (
                      <Cell key={i} fill={SEVERITY_COLORS[i % SEVERITY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
                    itemStyle={{ color: "#94a3b8" }}
                  />
                  <Legend
                    formatter={(val) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Gender demographics + Top locations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-1">Gender Demographics</h3>
            <p className="text-xs text-slate-500 mb-4">Facial recognition detections — today</p>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={data.genderDemographics}
                    dataKey="count"
                    nameKey="gender"
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    paddingAngle={3}
                  >
                    {data.genderDemographics.map((_, i) => (
                      <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
                    itemStyle={{ color: "#94a3b8" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-shrink-0">
                {data.genderDemographics.map((d, i) => (
                  <div key={d.gender} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: GENDER_COLORS[i] }} />
                    <span className="text-sm text-slate-300">{d.gender}</span>
                    <span className="text-sm font-bold text-white ml-1">{d.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Top Locations by Events</h3>
            <div className="space-y-3">
              {data.topLocations.map((loc, i) => {
                const maxEvents = data.topLocations[0].events;
                const pct = Math.round((loc.events / maxEvents) * 100);
                return (
                  <div key={loc.location}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{loc.location}</span>
                      <span className="text-slate-500">{loc.events} events</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${pct}%`, opacity: 1 - i * 0.15 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ANPR Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">ANPR Log — Recent Plates</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Plate</th>
                  <th className="text-left pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                  <th className="text-left pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="text-left pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.anprData.map((entry, i) => (
                  <tr key={i} className={entry.flagged ? "bg-red-950/20" : ""}>
                    <td className="py-2.5">
                      <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded text-sm">
                        {entry.plate}
                      </span>
                    </td>
                    <td className="py-2.5 text-sm text-slate-400">{timeAgo(entry.time)}</td>
                    <td className="py-2.5 text-sm text-slate-400">{entry.location}</td>
                    <td className="py-2.5">
                      {entry.flagged ? (
                        <span className="text-xs font-semibold text-red-400 bg-red-950 border border-red-800 px-2 py-0.5 rounded">
                          ⚠ FLAGGED
                        </span>
                      ) : (
                        <span className="text-xs text-emerald-400">✓ Clear</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
