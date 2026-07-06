import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date: string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatTime(date: string) {
  return format(new Date(date), "HH:mm:ss");
}

export function formatDateTime(date: string) {
  return format(new Date(date), "dd MMM yyyy, HH:mm");
}

export const severityColor = {
  critical: "text-red-400 bg-red-950 border-red-800",
  high: "text-orange-400 bg-orange-950 border-orange-800",
  medium: "text-yellow-400 bg-yellow-950 border-yellow-800",
  low: "text-blue-400 bg-blue-950 border-blue-800",
} as const;

export const severityDot = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-blue-400",
} as const;

export const statusColor = {
  online: "text-emerald-400",
  offline: "text-red-400",
  maintenance: "text-yellow-400",
} as const;

export const incidentStatusColor = {
  open: "bg-red-950 text-red-400 border-red-800",
  investigating: "bg-orange-950 text-orange-400 border-orange-800",
  resolved: "bg-emerald-950 text-emerald-400 border-emerald-800",
  closed: "bg-slate-800 text-slate-400 border-slate-700",
} as const;

export const priorityColor = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
  low: "text-slate-400",
} as const;
