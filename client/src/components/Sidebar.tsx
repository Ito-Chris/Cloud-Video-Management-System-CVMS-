import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Camera,
  AlertTriangle,
  BarChart3,
  Cpu,
  Archive,
  Users,
  Shield,
  Circle,
  Car,
} from "lucide-react";
import { cn } from "../lib/utils";

const nav = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/cameras", icon: Camera, label: "Cameras" },
  { to: "/incidents", icon: AlertTriangle, label: "Incidents" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/iot", icon: Cpu, label: "IoT / Traffic" },
  { to: "/road-safety", icon: Car, label: "Dashcam Safety" },
  { to: "/evidence", icon: Archive, label: "Evidence" },
  { to: "/officers", icon: Users, label: "Officers" },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-16 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col sm:w-60">
      {/* Logo */}
      <div className="border-b border-slate-800 p-3 sm:p-5">
        <div className="flex items-center justify-center gap-3 sm:justify-start">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-white text-sm leading-tight">CVMS</div>
            <div className="text-slate-500 text-xs">Cloud Video Management</div>
          </div>
        </div>
      </div>

      {/* Live status indicator */}
      <div className="flex justify-center border-b border-slate-800 px-2 py-3 sm:justify-start sm:px-4">
        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <Circle className="w-2 h-2 fill-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">System Live</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 p-2 sm:p-3">
        {nav.map(({ to, icon: Icon, label }) => {
          const active = location === to;
          return (
            <Link key={to} href={to}>
              <a
                aria-label={label}
                title={label}
                className={cn(
                  "flex items-center justify-center gap-3 rounded-lg px-0 py-2.5 text-sm font-medium transition-colors sm:justify-start sm:px-3",
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{label}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="hidden border-t border-slate-800 p-4 sm:block">
        <div className="text-xs text-slate-600">
          <div className="font-medium text-slate-500">CVMS v1.0</div>
          <div>© 2025 Law Enforcement</div>
        </div>
      </div>
    </aside>
  );
}
