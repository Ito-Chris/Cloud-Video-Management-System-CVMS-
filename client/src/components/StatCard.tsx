import { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: "blue" | "green" | "red" | "yellow" | "purple";
  sub?: string;
}

const colorMap = {
  blue: { bg: "bg-blue-950", icon: "text-blue-400", border: "border-blue-900" },
  green: { bg: "bg-emerald-950", icon: "text-emerald-400", border: "border-emerald-900" },
  red: { bg: "bg-red-950", icon: "text-red-400", border: "border-red-900" },
  yellow: { bg: "bg-yellow-950", icon: "text-yellow-400", border: "border-yellow-900" },
  purple: { bg: "bg-purple-950", icon: "text-purple-400", border: "border-purple-900" },
};

export default function StatCard({ label, value, icon: Icon, color = "blue", sub }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center border", c.bg, c.border)}>
          <Icon className={cn("w-5 h-5", c.icon)} />
        </div>
      </div>
    </div>
  );
}
