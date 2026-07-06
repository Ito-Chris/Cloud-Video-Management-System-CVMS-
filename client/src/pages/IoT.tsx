import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Cpu, Wind, Thermometer, Droplets, Volume2, TrafficCone } from "lucide-react";
import { api } from "../lib/api";
import { cn, timeAgo } from "../lib/utils";
import PageHeader from "../components/PageHeader";
import { Badge } from "../components/Badge";
import type { TrafficLight, EnvironmentalSensor } from "@shared/schema";

const signalColors = {
  green: "bg-emerald-500 shadow-emerald-500/50",
  yellow: "bg-yellow-400 shadow-yellow-400/50",
  red: "bg-red-500 shadow-red-500/50",
  emergency: "bg-blue-400 shadow-blue-400/50",
};

const sensorStatusColor = {
  normal: "text-emerald-400 bg-emerald-950 border-emerald-800",
  warning: "text-yellow-400 bg-yellow-950 border-yellow-800",
  critical: "text-red-400 bg-red-950 border-red-800",
};

const sensorIcons = {
  air_quality: Wind,
  temperature: Thermometer,
  humidity: Droplets,
  noise: Volume2,
};

const sensorLabel = {
  air_quality: "Air Quality",
  temperature: "Temperature",
  humidity: "Humidity",
  noise: "Noise Level",
};

export default function IoT() {
  const qc = useQueryClient();

  const { data: trafficLights = [] } = useQuery<TrafficLight[]>({
    queryKey: ["traffic-lights"],
    queryFn: () => api.get<TrafficLight[]>("/traffic-lights"),
    refetchInterval: 5000,
  });

  const { data: sensors = [] } = useQuery<EnvironmentalSensor[]>({
    queryKey: ["sensors"],
    queryFn: () => api.get<EnvironmentalSensor[]>("/sensors"),
    refetchInterval: 5000,
  });

  const setEmergency = useMutation({
    mutationFn: (id: number) =>
      api.patch(`/traffic-lights/${id}/mode`, { mode: "emergency" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["traffic-lights"] }),
  });

  const setNormal = useMutation({
    mutationFn: (id: number) =>
      api.patch(`/traffic-lights/${id}/mode`, { mode: "adaptive" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["traffic-lights"] }),
  });

  const criticalSensors = sensors.filter((s) => s.status === "critical").length;
  const warningSensors = sensors.filter((s) => s.status === "warning").length;
  const emergencyLights = trafficLights.filter((t) => t.mode === "emergency").length;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="IoT & Traffic Management"
        subtitle="Smart traffic control and environmental monitoring"
      />

      <div className="p-6 space-y-6 overflow-auto">
        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{trafficLights.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Traffic Intersections</p>
          </div>
          <div className={cn("bg-slate-900 border rounded-xl p-4 text-center", emergencyLights > 0 ? "border-blue-700" : "border-slate-800")}>
            <p className={cn("text-2xl font-bold", emergencyLights > 0 ? "text-blue-400" : "text-white")}>{emergencyLights}</p>
            <p className="text-xs text-slate-500 mt-0.5">Emergency Mode Active</p>
          </div>
          <div className={cn("bg-slate-900 border rounded-xl p-4 text-center", criticalSensors > 0 ? "border-red-800" : "border-slate-800")}>
            <p className={cn("text-2xl font-bold", criticalSensors > 0 ? "text-red-400" : "text-white")}>{criticalSensors}</p>
            <p className="text-xs text-slate-500 mt-0.5">Critical Sensor Alerts</p>
          </div>
        </div>

        {/* Traffic Lights */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800">
            <TrafficCone className="w-4 h-4 text-slate-400" />
            <h2 className="font-semibold text-white text-sm">Smart Traffic Signals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-slate-800">
            {trafficLights.map((tl) => (
              <div key={tl.id} className="bg-slate-900 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {/* Signal light */}
                      <div className="flex gap-1 bg-slate-800 p-1 rounded">
                        {(["red", "yellow", "green"] as const).map((c) => (
                          <div
                            key={c}
                            className={cn(
                              "w-3 h-3 rounded-full",
                              (tl.status === c || (tl.status === "emergency" && c === "green"))
                                ? `${signalColors[tl.status === "emergency" ? "emergency" : c]} shadow-lg`
                                : "bg-slate-700"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{tl.intersectionId}</span>
                    </div>
                    <p className="text-sm font-medium text-white truncate">{tl.location}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                      <span>{tl.vehicleCount} vehicles</span>
                      <span>·</span>
                      <span>Cycle: {tl.cycleTime}s</span>
                      <span>·</span>
                      <span className="capitalize">{tl.mode} mode</span>
                    </div>
                  </div>
                  <div>
                    {tl.mode === "emergency" ? (
                      <button
                        onClick={() => setNormal.mutate(tl.id)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 transition-colors"
                      >
                        Restore
                      </button>
                    ) : (
                      <button
                        onClick={() => setEmergency.mutate(tl.id)}
                        className="text-xs bg-blue-950 hover:bg-blue-900 text-blue-400 px-2 py-1 rounded border border-blue-800 transition-colors"
                      >
                        Emergency
                      </button>
                    )}
                  </div>
                </div>
                {tl.mode === "emergency" && (
                  <div className="mt-2 text-xs text-blue-400 bg-blue-950/50 border border-blue-900 rounded px-2 py-1">
                    ⚡ Emergency vehicle priority active
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Sensors */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800">
            <Cpu className="w-4 h-4 text-slate-400" />
            <h2 className="font-semibold text-white text-sm">Environmental Sensors</h2>
            {(criticalSensors > 0 || warningSensors > 0) && (
              <span className="ml-auto text-xs text-yellow-400">
                {criticalSensors} critical · {warningSensors} warning
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px bg-slate-800">
            {sensors.map((s) => {
              const Icon = sensorIcons[s.type];
              const maxVal = s.type === "air_quality" ? 200 : s.type === "temperature" ? 50 : s.type === "humidity" ? 100 : 120;
              const pct = Math.min(100, Math.round((s.value / maxVal) * 100));
              return (
                <div key={s.id} className="bg-slate-900 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-500">{sensorLabel[s.type]}</span>
                    </div>
                    <Badge className={sensorStatusColor[s.status]}>{s.status}</Badge>
                  </div>
                  <p className="text-sm font-medium text-white mb-0.5">{s.name}</p>
                  <p className="text-xs text-slate-500 mb-3">{s.location}</p>

                  {/* Value */}
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-white">{s.value}</span>
                    <span className="text-sm text-slate-500">{s.unit}</span>
                  </div>

                  {/* Bar */}
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        s.status === "critical" ? "bg-red-500" : s.status === "warning" ? "bg-yellow-400" : "bg-emerald-500"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <p className="text-[10px] text-slate-600">Updated {timeAgo(s.lastUpdated)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
