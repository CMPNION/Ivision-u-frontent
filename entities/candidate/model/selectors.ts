import type { Candidate } from "@/shared/types/candidate";

type SmartSignal = "highPotential" | "hiddenGem" | "aiRisk";

const SCORE_HIGH_POTENTIAL = 85;
const GROWTH_HIDDEN_GEM = 90;
const AI_PROBABILITY_RISK = 90;
const AI_PROBABILITY_LOW = 20;

/**
 * Возвращает true, если кандидат демонстрирует высокий потенциал.
 */
export const isHighPotential = (candidate: Candidate): boolean =>
  candidate.aiAssessment.totalScore >= SCORE_HIGH_POTENTIAL &&
  candidate.status !== "denied";

/**
 * Возвращает true, если кандидат — "Hidden Gem".
 * Эвристики:
 * - в explainability.flags явно упомянуто "Hidden Gem"
 * - или высокая дельта роста и низкий AI probability.
 */
export const isHiddenGem = (candidate: Candidate): boolean => {
  const { aiAssessment } = candidate;
  const flagged = aiAssessment.explainability.flags.some((flag) =>
    flag.toLowerCase().includes("hidden gem"),
  );

  const growthHeuristic =
    aiAssessment.metrics.growthDelta >= GROWTH_HIDDEN_GEM &&
    aiAssessment.aiProbability <= AI_PROBABILITY_LOW;

  return flagged || growthHeuristic;
};

/**
 * Возвращает true, если AI-оценка указывает на высокий риск "AI-generated".
 */
export const isAiRisk = (candidate: Candidate): boolean =>
  candidate.aiAssessment.aiProbability >= AI_PROBABILITY_RISK;

/**
 * Возвращает массив смарт-сигналов для кандидата.
 */
export const getSmartSignals = (candidate: Candidate): SmartSignal[] => {
  const signals: SmartSignal[] = [];

  if (isHighPotential(candidate)) signals.push("highPotential");
  if (isHiddenGem(candidate)) signals.push("hiddenGem");
  if (isAiRisk(candidate)) signals.push("aiRisk");

  return signals;
};

/**
 * Возвращает читабельный статус для UI.
 */
export const getStatusLabel = (status: Candidate["status"]): string => {
  switch (status) {
    case "pending":
      return "Ожидает";
    case "considering":
      return "Рассматривается";
    case "approved":
      return "Одобрен";
    case "denied":
      return "Отклонён";
    default:
      return "Неизвестно";
  }
};

/**
 * Возвращает вариант бейджа для статуса.
 */
export const getStatusVariant = (
  status: Candidate["status"],
): "default" | "success" | "warning" | "danger" => {
  switch (status) {
    case "approved":
      return "success";
    case "denied":
      return "danger";
    case "considering":
      return "warning";
    case "pending":
    default:
      return "default";
  }
};

/**
 * Подсказка для сортировки: число баллов (totalScore).
 */
export const getSortableScore = (candidate: Candidate): number =>
  candidate.aiAssessment.totalScore;

/**
 * Подсказка для вторичной сортировки: дата подачи (ISO).
 */
export const getSortableAppliedAt = (candidate: Candidate): string =>
  candidate.appliedAt;
