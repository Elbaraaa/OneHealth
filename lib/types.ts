export type Domain = "human" | "animal" | "environment";

export type RiskGroup = "Low" | "Moderate" | "Elevated" | "High";

export type YesNoUnknown = "yes" | "no" | "prefer-not-to-say";

export type QuestionType =
  | "text"
  | "date"
  | "textarea"
  | "multiselect"
  | "yesno"
  | "photo";

export interface QuestionOption {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  required?: boolean;
  options?: QuestionOption[];
  placeholder?: string;
  helperText?: string;
}

export interface DomainInfo {
  domain: Domain;
  title: string;
  description: string;
  href: string;
}

export type FormValue = string | boolean | string[] | undefined;
export type ReportFormState = Record<string, FormValue>;

export interface BaseReport {
  id: string;
  domain: Domain;
  zipCode: string;
  notes?: string;
  photoAttached: boolean;
  createdAt: string;
}

export interface HumanReport extends BaseReport {
  domain: "human";
  symptoms: string[];
  symptomStartDate: string;
  recentAnimalContact: boolean;
  recentTravel: boolean;
}

export interface AnimalReport extends BaseReport {
  domain: "animal";
  animalType: string;
  symptomsBehavior: string[];
  multipleAnimalsAffected: boolean;
  humanContact: boolean;
  dateObserved: string;
}

export interface EnvironmentReport extends BaseReport {
  domain: "environment";
  concernTypes: string[];
  dateObserved: string;
  ongoingConcern: boolean;
}

export type SubmittedReport = HumanReport | AnimalReport | EnvironmentReport;

export interface Profile {
  id: string;
  displayName?: string;
  ageRange: string;
  zipCode: string;
  animalContactFrequency: string;
  outdoorExposureFrequency: string;
  chronicConditionRisk: YesNoUnknown;
  createdAt: string;
}

export interface RiskResult {
  reportId: string;
  domain: Domain;
  score: number;
  group: RiskGroup;
  explanation: string[];
  mitigationSteps: string[];
  createdAt: string;
}

export type DashboardReport = SubmittedReport & {
  riskScore: number;
  riskGroup: RiskGroup;
};
