import {
  ArrowUpRight,
  Users,
  ShieldAlert,
  TrendingUp,
  Clock3,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

type KpiCardProps = {
  title: string;
  value: string;
  delta: string;
  positive?: boolean;
  icon: React.ComponentType<{ className?: string }>;
};

function KpiCard({
  title,
  value,
  delta,
  positive = true,
  icon: Icon,
}: KpiCardProps): React.JSX.Element {
  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <CardDescription className="text-slate-500">{title}</CardDescription>
          <CardTitle className="mt-1 text-2xl font-semibold text-slate-900">
            {value}
          </CardTitle>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          className={[
            "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium",
            positive
              ? "border-[#c1f11d]/50 bg-[#c1f11d]/20 text-[#2f3b00]"
              : "border-rose-200 bg-rose-50 text-rose-700",
          ].join(" ")}
        >
          <ArrowUpRight
            className={["h-3 w-3", positive ? "" : "rotate-90"].join(" ")}
          />
          {delta}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage(): React.JSX.Element {
  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-medium text-[#c1f11d]">Analytics</p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
          Admissions Intelligence Overview
        </h1>
        <p className="max-w-3xl text-sm text-slate-500 md:text-base">
          High-level KPI snapshot for the AI candidate selection pipeline. This
          page is a shell with production-friendly placeholders ready for live
          backend metrics.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Applicants"
          value="1,284"
          delta="+8.2% vs last cycle"
          icon={Users}
        />
        <KpiCard
          title="Approval Rate"
          value="34.7%"
          delta="+2.1% quality-adjusted"
          icon={TrendingUp}
        />
        <KpiCard
          title="High AI Risk Cases"
          value="126"
          delta="+1.4% monitored"
          positive={false}
          icon={ShieldAlert}
        />
        <KpiCard
          title="Avg Review Time"
          value="18m"
          delta="-3m operational gain"
          icon={Clock3}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Pipeline Conversion Trend</CardTitle>
              <Badge variant="outline">Placeholder</Badge>
            </div>
            <CardDescription>
              Weekly movement between Pending → Considering → Approved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
              Chart area placeholder (Recharts line/bar combo)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Audit Snapshot</CardTitle>
            <CardDescription>
              Quality and explainability indicators for this cycle.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Median AI Probability
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">27%</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Flagged for Manual Review
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">9.8%</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Explainability Coverage
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">100%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
