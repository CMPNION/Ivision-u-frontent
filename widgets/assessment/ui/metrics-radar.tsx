"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { Assessment } from "@/shared/types/candidate";
import { cn } from "@/shared/lib/cn";

type Props = {
  metrics: Assessment["metrics"];
  className?: string;
  /**
   * Заголовок для тултипа/ARIA.
   */
  title?: string;
};

type ChartPoint = {
  key: keyof Assessment["metrics"];
  label: string;
  value: number;
};

const metricLabels: Record<keyof Assessment["metrics"], string> = {
  leadership: "Лидерство",
  resilience: "Устойчивость",
  techBase: "Техническая база",
  socialImpact: "Социальный эффект",
  growthDelta: "Рост",
};

const buildData = (metrics: Assessment["metrics"]): ChartPoint[] =>
  (Object.keys(metrics) as (keyof Assessment["metrics"])[]).map((key) => ({
    key,
    label: metricLabels[key],
    value: metrics[key],
  }));

function RadarTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: ChartPoint }>;
}): React.JSX.Element | null {
  if (!active || !payload || !payload.length) return null;

  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <div className="text-xs font-medium text-slate-700">{point.label}</div>
      <div className="text-sm font-semibold text-slate-900">
        {point.value} / 100
      </div>
    </div>
  );
}

export function MetricsRadar({
  metrics,
  className,
  title = "AI метрики кандидата",
}: Props): React.JSX.Element {
  const data = buildData(metrics);

  return (
    <div
      className={cn("h-80 w-full rounded-xl bg-white", className)}
      aria-label={title}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={data}
          margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
        >
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fill: "#475569", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickFormatter={(v) => `${v}`}
          />
          <Radar
            name="AI оценка"
            dataKey="value"
            stroke="#c1f11d"
            fill="#c1f11d"
            fillOpacity={0.35}
            dot={{ r: 3, fill: "#c1f11d" }}
            strokeWidth={2}
          />
          <Tooltip content={<RadarTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MetricsRadar;
