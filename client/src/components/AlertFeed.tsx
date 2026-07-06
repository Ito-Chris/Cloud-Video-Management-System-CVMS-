import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, AlertOctagon, Eye, Car, Brain, Activity } from "lucide-react";
import { api } from "../lib/api";
import { cn, timeAgo, severityColor, severityDot } from "../lib/utils";
import { Badge } from "./Badge";
import type { DetectionEvent } from "@shared/schema";

const eventIcons: Record<string, React.ElementType> = {
  facial_recognition: Brain,
  anpr: Car,
  behavior: Eye,
  intrusion: AlertOctagon,
  environmental: Activity,
  traffic: Car,
};

const eventLabels: Record<string, string> = {
  facial_recognition: "Facial ID",
  anpr: "ANPR",
  behavior: "Behaviour",
  intrusion: "Intrusion",
  environmental: "Environment",
  traffic: "Traffic",
};

interface AlertFeedProps {
  limit?: number;
  showResolved?: boolean;
}

export default function AlertFeed({ limit = 10, showResolved = false }: AlertFeedProps) {
  const qc = useQueryClient();
  const { data: events = [] } = useQuery<DetectionEvent[]>({
    queryKey: ["events", showResolved],
    queryFn: () => api.get<DetectionEvent[]>(`/events?resolved=${showResolved}`),
    refetchInterval: 5000,
  });

  const resolve = useMutation({
    mutationFn: (id: number) => api.patch(`/events/${id}/resolve`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  const displayed = events.slice(0, limit);

  return (
    <div className="space-y-2">
      {displayed.length === 0 && (
        <div className="text-center py-8 text-slate-500 text-sm">No alerts</div>
      )}
      {displayed.map((ev) => {
        const Icon = eventIcons[ev.type] || AlertOctagon;
        return (
          <div
            key={ev.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border bg-slate-900/50 transition-opacity",
              ev.resolved ? "opacity-50" : ""
            )}
          >
            {/* Severity dot */}
            <div className="flex-shrink-0 mt-1">
              <div className={cn("w-2 h-2 rounded-full", severityDot[ev.severity])} />
            </div>

            {/* Icon */}
            <div className="flex-shrink-0">
              <Icon className="w-4 h-4 text-slate-400 mt-0.5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={severityColor[ev.severity]}>{ev.severity.toUpperCase()}</Badge>
                <span className="text-xs text-slate-500">{eventLabels[ev.type]}</span>
                <span className="text-xs text-slate-600">·</span>
                <span className="text-xs text-slate-500">{ev.cameraName}</span>
              </div>
              <p className="text-sm text-slate-300 mt-0.5 truncate">{ev.description}</p>
              <p className="text-xs text-slate-600 mt-0.5">{timeAgo(ev.timestamp)}</p>
            </div>

            {/* Resolve button */}
            {!ev.resolved && (
              <button
                onClick={() => resolve.mutate(ev.id)}
                className="flex-shrink-0 w-7 h-7 rounded flex items-center justify-center text-slate-500 hover:text-emerald-400 hover:bg-emerald-950 transition-colors"
                title="Mark as resolved"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
