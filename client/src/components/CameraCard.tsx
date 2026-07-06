import { Camera as CameraIcon, Wifi, WifiOff, Wrench, MoreVertical } from "lucide-react";
import { cn, statusColor } from "../lib/utils";
import type { Camera } from "@shared/schema";

interface CameraCardProps {
  camera: Camera;
}

const typeLabel: Record<string, string> = {
  fixed: "Fixed",
  ptz: "PTZ",
  thermal: "Thermal",
  anpr: "ANPR",
};

const statusIcon = {
  online: Wifi,
  offline: WifiOff,
  maintenance: Wrench,
};

// Generate a deterministic colour gradient for the fake camera feed based on camera id
const gradients = [
  "from-slate-900 via-slate-800 to-slate-900",
  "from-slate-900 via-blue-950 to-slate-900",
  "from-slate-900 via-slate-800 to-blue-950",
  "from-blue-950 via-slate-900 to-slate-800",
  "from-slate-800 via-slate-900 to-slate-900",
];

export default function CameraCard({ camera }: CameraCardProps) {
  const StatusIcon = statusIcon[camera.status];
  const gradient = gradients[camera.id % gradients.length];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
      {/* Simulated camera feed */}
      <div className={cn("relative bg-gradient-to-br h-36", gradient, "scanline")}>
        {camera.status === "online" ? (
          <>
            {/* Live indicator */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 rounded px-1.5 py-0.5">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full camera-pulse" />
              <span className="text-[10px] font-bold text-white">LIVE</span>
            </div>
            {/* Camera type overlay */}
            <div className="absolute top-2 right-2 bg-black/60 rounded px-1.5 py-0.5">
              <span className="text-[10px] text-slate-300">{typeLabel[camera.type]}</span>
            </div>
            {/* Fake scan overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border border-emerald-500/20 rounded-full" />
              <div className="absolute w-8 h-8 border border-emerald-500/30 rounded-full" />
            </div>
            {/* Timestamp */}
            <div className="absolute bottom-2 left-2 bg-black/60 rounded px-1.5 py-0.5">
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date().toLocaleTimeString("en-GB")}
              </span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <CameraIcon className="w-8 h-8 text-slate-700" />
            <span className="text-xs text-slate-600 capitalize">{camera.status}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">{camera.name}</span>
              <StatusIcon className={cn("w-3.5 h-3.5 flex-shrink-0", statusColor[camera.status])} />
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">{camera.location}</p>
          </div>
          <button className="text-slate-600 hover:text-slate-400 flex-shrink-0">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] text-slate-600 font-mono">{camera.ipAddress}</span>
          <span className="text-slate-700">·</span>
          <span className={cn("text-[10px] capitalize font-medium", statusColor[camera.status])}>
            {camera.status}
          </span>
        </div>
      </div>
    </div>
  );
}
