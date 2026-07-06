import { useQuery } from "@tanstack/react-query";
import { Users, Mail, Phone, Shield } from "lucide-react";
import { api } from "../lib/api";
import { cn } from "../lib/utils";
import PageHeader from "../components/PageHeader";
import { Badge } from "../components/Badge";
import type { Officer } from "@shared/schema";

const statusColor = {
  active: "text-emerald-400 bg-emerald-950 border-emerald-800",
  "off-duty": "text-slate-400 bg-slate-800 border-slate-700",
  "on-call": "text-yellow-400 bg-yellow-950 border-yellow-800",
};

const rankIcon: Record<string, string> = {
  Detective: "🔍",
  Sergeant: "⭐",
  Constable: "👮",
  Inspector: "🏅",
};

export default function Officers() {
  const { data: officers = [] } = useQuery<Officer[]>({
    queryKey: ["officers"],
    queryFn: () => api.get<Officer[]>("/officers"),
  });

  const active = officers.filter((o) => o.status === "active");
  const onCall = officers.filter((o) => o.status === "on-call");
  const offDuty = officers.filter((o) => o.status === "off-duty");

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Personnel"
        subtitle={`${officers.length} officers registered`}
      />

      <div className="p-6 space-y-6 overflow-auto">
        {/* Status summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-emerald-900 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{active.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Active</p>
          </div>
          <div className="bg-slate-900 border border-yellow-900 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">{onCall.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">On Call</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-slate-400">{offDuty.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Off Duty</p>
          </div>
        </div>

        {/* Officer cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {officers.map((officer) => (
            <div
              key={officer.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    {rankIcon[officer.rank] ?? "👮"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{officer.name}</p>
                    <p className="text-xs text-slate-500">{officer.rank} · {officer.department}</p>
                  </div>
                </div>
                <Badge className={statusColor[officer.status]}>{officer.status}</Badge>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-mono">{officer.badge}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{officer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{officer.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
