"use client";

import { cn } from "@/shared/lib/cn";

type HighlightTone = "positive" | "risk" | "neutral";

type Props = {
  text: string;
  className?: string;
  /**
   * Дополнительные подсказки/флаги из AI, чтобы показать над текстом.
   */
  flags?: string[];
};

const positiveMarkers = [
  "lead",
  "scale",
  "initiative",
  "organized",
  "built",
  "grew",
  "mentored",
  "launched",
  "improved",
  "impact",
  "resilience",
  "persist",
  "learned",
  "team",
  "community",
];

const riskMarkers = [
  "synergy",
  "paradigm",
  "vector",
  "optimize",
  "holistic",
  "leverag",
  "transformative",
  "ecosystem",
  "exponential",
  "unprecedented",
  "cutting edge",
  "groundbreaking",
];

const sentenceSplitter = (text: string): string[] => {
  // Разбиваем по точкам/вопросительным/восклицательным знакам, сохраняя знаки.
  return text
    .split(/(?<=[.?!])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
};

const detectTone = (sentence: string): HighlightTone => {
  const s = sentence.toLowerCase();
  const hasRisk = riskMarkers.some((k) => s.includes(k));
  const hasPositive = positiveMarkers.some((k) => s.includes(k));
  if (hasRisk && !hasPositive) return "risk";
  if (hasPositive && !hasRisk) return "positive";
  if (hasRisk && hasPositive) return "risk";
  return "neutral";
};

const toneStyles: Record<HighlightTone, string> = {
  neutral: "bg-white text-slate-800",
  positive: "bg-[#c1f11d]/20 text-[#2f3b00] border border-[#c1f11d]/40",
  risk: "bg-rose-50 text-rose-900 border border-rose-100",
};

const toneDot: Record<HighlightTone, string> = {
  neutral: "bg-slate-300",
  positive: "bg-[#c1f11d]",
  risk: "bg-rose-500",
};

export function EssayViewer({
  text,
  className,
  flags,
}: Props): React.JSX.Element {
  const sentences = sentenceSplitter(text);

  return (
    <div
      className={cn(
        "space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-900">
          Эссе кандидата
        </h3>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <LegendItem tone="positive" label="Сильные сигналы / конкретика" />
          <LegendItem tone="risk" label="Риск генеративности / канцеляризм" />
        </div>
      </div>

      {flags && flags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {flags.map((flag) => (
            <span
              key={flag}
              className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800"
            >
              {flag}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {sentences.map((sentence, idx) => {
          const tone = detectTone(sentence);
          return (
            <div
              key={`${sentence}-${idx}`}
              className={cn(
                "rounded-lg px-3 py-2 text-sm leading-relaxed transition-colors",
                toneStyles[tone],
              )}
            >
              {sentence}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LegendItem({
  tone,
  label,
}: {
  tone: HighlightTone;
  label: string;
}): React.JSX.Element {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cn("h-2.5 w-2.5 rounded-full", toneDot[tone])}
        aria-hidden
      />
      <span>{label}</span>
    </span>
  );
}

export default EssayViewer;
