import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Car,
  Check,
  Clock3,
  FilePlus2,
  MapPin,
  Radio,
  ShieldAlert,
} from "lucide-react";
import type {
  DashcamSafetyReport as Report,
  RoadSafetyEventType,
  RoadSafetyReportStatus,
  Severity,
} from "@shared/schema";
import PageHeader from "../components/PageHeader";
import { Badge } from "../components/Badge";
import StatCard from "../components/StatCard";
import { api } from "../lib/api";
import { cn, formatDateTime, severityColor, timeAgo } from "../lib/utils";

type ReportForm = {
  unitId: string;
  eventType: RoadSafetyEventType;
  severity: Severity;
  location: string;
  details: string;
};

const initialForm: ReportForm = {
  unitId: "",
  eventType: "road_hazard",
  severity: "medium",
  location: "",
  details: "",
};

const eventLabels: Record<RoadSafetyEventType, string> = {
  road_hazard: "Road hazard",
  collision: "Collision",
  near_miss: "Near miss",
  vehicle_disabled: "Vehicle disabled",
};

const statusStyles: Record<RoadSafetyReportStatus, string> = {
  new: "text-amber-400 bg-amber-950 border-amber-800",
  acknowledged: "text-blue-400 bg-blue-950 border-blue-800",
  closed: "text-emerald-400 bg-emerald-950 border-emerald-800",
};

export default function DashcamSafety() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | RoadSafetyReportStatus>("all");
  const [form, setForm] = useState<ReportForm>(initialForm);

  const { data: reports = [], isLoading, isError } = useQuery<Report[]>({
    queryKey: ["dashcam-safety-reports"],
    queryFn: () => api.get<Report[]>("/dashcam-safety-reports"),
    refetchInterval: 8000,
  });

  const counts = useMemo(() => ({
    new: reports.filter((report) => report.status === "new").length,
    active: reports.filter((report) => report.status !== "closed").length,
    urgent: reports.filter(
      (report) =>
        report.status !== "closed" &&
        (report.severity === "critical" || report.severity === "high"),
    ).length,
  }), [reports]);

  const createReport = useMutation({
    mutationFn: (payload: ReportForm) => api.post<Report>("/dashcam-safety-reports", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashcam-safety-reports"] });
      setForm(initialForm);
      setShowForm(false);
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: RoadSafetyReportStatus }) =>
      api.patch(`/dashcam-safety-reports/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dashcam-safety-reports"] }),
  });

  const visibleReports = filter === "all"
    ? reports
    : reports.filter((report) => report.status === filter);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Dashcam Safety"
        subtitle="Road hazards, collision reports, and field incident logging"
        actions={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <FilePlus2 className="h-4 w-4" />
            New safety report
          </button>
        }
      />

      <div className="space-y-6 p-6">
        <div className="flex gap-3 rounded-xl border border-blue-900 bg-blue-950/40 p-4">
          <Radio className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400" />
          <div>
            <p className="text-sm font-semibold text-blue-200">Operator-entered safety reports</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              This demo does not connect to live dashcam video or perform AI analysis. Reports are
              entered by an operator and cover road conditions and vehicle safety only.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="New Reports" value={counts.new} icon={FilePlus2} color="yellow" />
          <StatCard label="Open Reports" value={counts.active} icon={Radio} color="blue" />
          <StatCard label="High Priority" value={counts.urgent} icon={ShieldAlert} color="red" />
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-white">Field safety reports</h2>
              <p className="mt-0.5 text-xs text-slate-500">Latest reports from patrol units</p>
            </div>
            <div className="flex gap-1 rounded-lg bg-slate-950 p-1">
              {(["all", "new", "acknowledged", "closed"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs capitalize transition-colors",
                    filter === status
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:text-white",
                  )}
                >
                  {status === "all" ? "All" : status}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            {isLoading && <p className="p-6 text-center text-sm text-slate-500">Loading reports…</p>}
            {isError && <p className="p-6 text-center text-sm text-red-400">Couldn’t load safety reports.</p>}
            {!isLoading && !isError && visibleReports.length === 0 && (
              <p className="p-8 text-center text-sm text-slate-500">No reports in this view.</p>
            )}
            {visibleReports.map((report) => (
              <article key={report.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800">
                  {report.eventType === "collision" ? (
                    <Car className="h-5 w-5 text-slate-300" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-slate-300" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">{eventLabels[report.eventType]}</h3>
                    <Badge className={severityColor[report.severity]}>
                      {report.severity.toUpperCase()}
                    </Badge>
                    <Badge className={statusStyles[report.status]}>{report.status}</Badge>
                  </div>
                  <p className="mt-1.5 text-sm text-slate-300">{report.details}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Car className="h-3 w-3" /> {report.unitId}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {report.location}
                    </span>
                    <span className="inline-flex items-center gap-1" title={formatDateTime(report.reportedAt)}>
                      <Clock3 className="h-3 w-3" /> {timeAgo(report.reportedAt)}
                    </span>
                  </div>
                </div>

                {report.status !== "closed" && (
                  <button
                    onClick={() =>
                      updateStatus.mutate({
                        id: report.id,
                        status: report.status === "new" ? "acknowledged" : "closed",
                      })
                    }
                    disabled={updateStatus.isPending}
                    className="inline-flex flex-shrink-0 items-center gap-1.5 self-start rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:bg-slate-700 hover:text-white disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" />
                    {report.status === "new" ? "Acknowledge" : "Close report"}
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              createReport.mutate(form);
            }}
            className="w-full max-w-lg space-y-4 rounded-xl border border-slate-700 bg-slate-900 p-6"
          >
            <div>
              <h2 className="text-lg font-bold text-white">New safety report</h2>
              <p className="mt-1 text-xs text-slate-500">
                Record a road-safety event. Don’t include personal identifying information.
              </p>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-slate-400">Unit ID</span>
              <input
                required
                maxLength={40}
                value={form.unitId}
                onChange={(event) => setForm({ ...form, unitId: event.target.value })}
                placeholder="e.g. UNIT-12"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-slate-400">Event type</span>
                <select
                  value={form.eventType}
                  onChange={(event) => setForm({ ...form, eventType: event.target.value as RoadSafetyEventType })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                >
                  {Object.entries(eventLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-slate-400">Priority</span>
                <select
                  value={form.severity}
                  onChange={(event) => setForm({ ...form, severity: event.target.value as Severity })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                >
                  {(["low", "medium", "high", "critical"] as const).map((severity) => (
                    <option key={severity} value={severity}>{severity}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-slate-400">Location</span>
              <input
                required
                maxLength={160}
                value={form.location}
                onChange={(event) => setForm({ ...form, location: event.target.value })}
                placeholder="Road, direction, or nearest junction"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-slate-400">What happened?</span>
              <textarea
                required
                maxLength={1000}
                rows={4}
                value={form.details}
                onChange={(event) => setForm({ ...form, details: event.target.value })}
                placeholder="Describe the road hazard or vehicle safety event"
                className="w-full resize-y rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </label>

            {createReport.isError && (
              <p className="text-sm text-red-400">
                {createReport.error instanceof Error ? createReport.error.message : "Couldn’t save the report."}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={createReport.isPending}
                className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {createReport.isPending ? "Saving…" : "Save report"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  createReport.reset();
                }}
                className="flex-1 rounded-lg bg-slate-800 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
