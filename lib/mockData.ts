import type { DashboardReport, RiskResult } from "@/lib/types";

export const storageKeys = {
  draftReport: "oneHealth:draftReport",
  pendingReports: "oneHealth:pendingReports",
  reportQueue: "oneHealth:reportQueue",
  reports: "oneHealth:reports",
  profile: "oneHealth:profile",
  currentRiskResult: "oneHealth:currentRiskResult",
};

export const mockReports: DashboardReport[] = [
  {
    id: "mock-human-1",
    domain: "human",
    symptoms: ["cough", "fatigue"],
    symptomStartDate: "2026-05-16",
    zipCode: "80202",
    recentAnimalContact: false,
    recentTravel: false,
    notes: "Community respiratory signal.",
    photoAttached: false,
    createdAt: "2026-05-16T15:30:00.000Z",
    riskScore: 15,
    riskGroup: "Low",
  },
  {
    id: "mock-animal-1",
    domain: "animal",
    animalType: "Backyard chickens",
    symptomsBehavior: ["lethargy", "skin lesions"],
    multipleAnimalsAffected: true,
    humanContact: false,
    zipCode: "80203",
    dateObserved: "2026-05-17",
    notes: "Several birds affected.",
    photoAttached: false,
    createdAt: "2026-05-17T18:10:00.000Z",
    riskScore: 45,
    riskGroup: "Moderate",
  },
  {
    id: "mock-environment-1",
    domain: "environment",
    concernTypes: ["smoke", "poor air quality"],
    zipCode: "80204",
    dateObserved: "2026-05-18",
    ongoingConcern: true,
    notes: "Hazy afternoon conditions.",
    photoAttached: false,
    createdAt: "2026-05-18T20:20:00.000Z",
    riskScore: 60,
    riskGroup: "Elevated",
  },
];

export const mockCurrentRiskResult: RiskResult = {
  reportId: "mock-environment-1",
  domain: "environment",
  score: 60,
  group: "Elevated",
  explanation: [
    "Smoke and poor air quality may affect respiratory comfort.",
    "An ongoing concern raises the score because exposure may continue.",
  ],
  mitigationSteps: [
    "Consider avoiding the affected area when possible.",
    "Consider checking local public health or environmental updates.",
  ],
  createdAt: "2026-05-18T20:20:00.000Z",
};
