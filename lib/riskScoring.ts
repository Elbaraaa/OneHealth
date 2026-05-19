import type {
  AnimalReport,
  EnvironmentReport,
  HumanReport,
  Profile,
  RiskGroup,
  SubmittedReport,
} from "@/lib/types";

const scoreCaps = {
  min: 0,
  max: 100,
};

function includesSignal(signals: string[], signal: string): boolean {
  return signals.includes(signal);
}

function clampScore(score: number): number {
  return Math.min(scoreCaps.max, Math.max(scoreCaps.min, score));
}

function scoreHumanReport(report: HumanReport, profile?: Profile): number {
  let score = 0;

  if (includesSignal(report.symptoms, "fever")) score += 20;
  if (includesSignal(report.symptoms, "cough")) score += 15;
  if (includesSignal(report.symptoms, "difficulty breathing")) score += 40;
  if (includesSignal(report.symptoms, "rash")) score += 15;
  if (report.recentAnimalContact) score += 15;
  if (report.recentTravel) score += 10;
  if (profile?.chronicConditionRisk === "yes") score += 15;

  return score;
}

function scoreAnimalReport(report: AnimalReport): number {
  let score = 0;

  if (includesSignal(report.symptomsBehavior, "sudden death")) score += 40;
  if (report.multipleAnimalsAffected) score += 30;
  if (report.humanContact) score += 20;
  if (includesSignal(report.symptomsBehavior, "skin lesions")) score += 15;
  if (includesSignal(report.symptomsBehavior, "unusual aggression")) score += 20;

  return score;
}

function scoreEnvironmentReport(report: EnvironmentReport): number {
  let score = 0;

  if (includesSignal(report.concernTypes, "smoke")) score += 25;
  if (includesSignal(report.concernTypes, "water contamination")) score += 30;
  if (includesSignal(report.concernTypes, "chemical spill")) score += 40;
  if (includesSignal(report.concernTypes, "dead wildlife")) score += 30;
  if (includesSignal(report.concernTypes, "poor air quality")) score += 20;
  if (report.ongoingConcern) score += 15;

  return score;
}

export function calculateRiskScore(
  report: SubmittedReport,
  profile?: Profile,
): number {
  const score =
    report.domain === "human"
      ? scoreHumanReport(report, profile)
      : report.domain === "animal"
        ? scoreAnimalReport(report)
        : scoreEnvironmentReport(report);

  return clampScore(score);
}

export function classifyRisk(score: number): RiskGroup {
  if (score <= 25) return "Low";
  if (score <= 50) return "Moderate";
  if (score <= 75) return "Elevated";
  return "High";
}

export function generateRiskExplanation(
  report: SubmittedReport,
  profile?: Profile,
): string[] {
  const explanation: string[] = [];

  if (report.domain === "human") {
    if (includesSignal(report.symptoms, "difficulty breathing")) {
      explanation.push("Difficulty breathing may indicate a need for prompt attention.");
    }
    if (includesSignal(report.symptoms, "fever")) {
      explanation.push("Fever can raise the score because it may indicate an active illness signal.");
    }
    if (includesSignal(report.symptoms, "cough")) {
      explanation.push("Cough adds to local respiratory signal awareness.");
    }
    if (includesSignal(report.symptoms, "rash")) {
      explanation.push("Rash adds a cautious signal because some conditions may appear on the skin.");
    }
    if (report.recentAnimalContact) {
      explanation.push("Recent animal contact adds context across human and animal health.");
    }
    if (report.recentTravel) {
      explanation.push("Recent travel can affect local risk awareness.");
    }
    if (profile?.chronicConditionRisk === "yes") {
      explanation.push("The optional profile indicates a chronic condition risk factor.");
    }
  }

  if (report.domain === "animal") {
    if (includesSignal(report.symptomsBehavior, "sudden death")) {
      explanation.push("Sudden death in animals is treated as a higher-priority community signal.");
    }
    if (report.multipleAnimalsAffected) {
      explanation.push("Multiple affected animals may indicate a broader local concern.");
    }
    if (report.humanContact) {
      explanation.push("Human contact adds One Health context for follow-up awareness.");
    }
    if (includesSignal(report.symptomsBehavior, "skin lesions")) {
      explanation.push("Skin lesions add a cautious animal health signal.");
    }
    if (includesSignal(report.symptomsBehavior, "unusual aggression")) {
      explanation.push("Unusual aggression adds concern because it may affect safety.");
    }
  }

  if (report.domain === "environment") {
    if (includesSignal(report.concernTypes, "chemical spill")) {
      explanation.push("A possible chemical spill is weighted strongly because immediate avoidance may be needed.");
    }
    if (includesSignal(report.concernTypes, "water contamination")) {
      explanation.push("Water contamination can affect people, animals, and local ecosystems.");
    }
    if (includesSignal(report.concernTypes, "dead wildlife")) {
      explanation.push("Dead wildlife may indicate a local environmental or animal health signal.");
    }
    if (includesSignal(report.concernTypes, "smoke")) {
      explanation.push("Smoke may affect air quality and respiratory comfort.");
    }
    if (includesSignal(report.concernTypes, "poor air quality")) {
      explanation.push("Poor air quality adds a local exposure signal.");
    }
    if (report.ongoingConcern) {
      explanation.push("An ongoing concern raises the score because exposure may continue.");
    }
  }

  return explanation.length > 0
    ? explanation
    : ["The score is based on the selected signals and currently available report context."];
}

export function generateMitigationSteps(
  report: SubmittedReport,
  riskGroup: RiskGroup,
): string[] {
  const steps: string[] = [];

  if (report.domain === "human") {
    steps.push("Consider monitoring symptoms, resting, and limiting close contact while symptoms are active.");
    steps.push("Consider contacting a qualified health professional if symptoms worsen or persist.");

    if (report.symptoms.includes("difficulty breathing") || riskGroup === "High") {
      steps.push("If breathing trouble is severe or there is immediate danger, contact emergency services.");
    }
  }

  if (report.domain === "animal") {
    steps.push("Consider reducing direct contact with affected animals until a professional can advise.");
    steps.push("Consider contacting a veterinarian or local animal health resource for guidance.");

    if (report.symptomsBehavior.includes("sudden death")) {
      steps.push("Avoid handling deceased animals directly and consider reporting the event to local animal or wildlife officials.");
    }
  }

  if (report.domain === "environment") {
    steps.push("Consider avoiding the affected area when possible and keeping people and animals away from visible hazards.");
    steps.push("Consider checking local public health, environmental, or emergency management updates.");

    if (report.concernTypes.includes("chemical spill") || riskGroup === "High") {
      steps.push("If there is immediate danger from fumes, spills, or fire, contact emergency services.");
    }
  }

  if (riskGroup === "Moderate" || riskGroup === "Elevated") {
    steps.push("Consider sharing city-level or zip-code-level observations with local public health or community resources.");
  }

  if (riskGroup === "Low") {
    steps.push("Continue normal precautions and update the report if new or worsening signals appear.");
  }

  // Privacy note: any future LLM integration should receive only sanitized,
  // non-identifying summaries, never raw profile details, names, exact addresses,
  // uploaded files, or other personal data.
  return steps;
}
