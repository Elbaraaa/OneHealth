import type { Domain, DomainInfo, Question } from "@/lib/types";

export const domainCards: DomainInfo[] = [
  {
    domain: "human",
    title: "Human",
    description:
      "Report symptoms or recent exposures affecting you, family, neighbors, or community members.",
    href: "/report/human",
  },
  {
    domain: "animal",
    title: "Animal",
    description:
      "Report illness, unusual behavior, or concerning events involving pets, livestock, or wildlife.",
    href: "/report/animal",
  },
  {
    domain: "environment",
    title: "Environment",
    description:
      "Report air, water, chemical, odor, wildlife, or other local environmental concerns.",
    href: "/report/environment",
  },
];

export const domainQuestions: Record<Domain, Question[]> = {
  human: [
    {
      id: "symptoms",
      label: "Symptoms",
      type: "multiselect",
      required: true,
      helperText: "Select all that apply.",
      options: [
        { label: "Fever", value: "fever" },
        { label: "Cough", value: "cough" },
        { label: "Fatigue", value: "fatigue" },
        { label: "Nausea", value: "nausea" },
        { label: "Rash", value: "rash" },
        { label: "Difficulty breathing", value: "difficulty breathing" },
        { label: "Headache", value: "headache" },
        { label: "Other", value: "other" },
      ],
    },
    {
      id: "symptomStartDate",
      label: "Symptom start date",
      type: "date",
      required: true,
    },
    {
      id: "zipCode",
      label: "Zip code",
      type: "text",
      required: true,
      placeholder: "e.g. 80202",
    },
    {
      id: "recentAnimalContact",
      label: "Recent animal contact",
      type: "yesno",
      required: true,
    },
    {
      id: "recentTravel",
      label: "Recent travel",
      type: "yesno",
      required: true,
    },
    {
      id: "notes",
      label: "Optional notes",
      type: "textarea",
      placeholder: "Share brief context without names or exact addresses.",
    },
    {
      id: "photoAttached",
      label: "Optional photo",
      type: "photo",
      helperText: "Photo files stay on this device in the MVP.",
    },
  ],
  animal: [
    {
      id: "animalType",
      label: "Animal type/species",
      type: "text",
      required: true,
      placeholder: "e.g. dog, chicken, deer",
    },
    {
      id: "symptomsBehavior",
      label: "Symptoms or behavior",
      type: "multiselect",
      required: true,
      helperText: "Select all that apply.",
      options: [
        { label: "Lethargy", value: "lethargy" },
        { label: "Coughing", value: "coughing" },
        { label: "Unusual aggression", value: "unusual aggression" },
        { label: "Sudden death", value: "sudden death" },
        { label: "Vomiting", value: "vomiting" },
        { label: "Skin lesions", value: "skin lesions" },
        { label: "Other", value: "other" },
      ],
    },
    {
      id: "multipleAnimalsAffected",
      label: "Multiple animals affected",
      type: "yesno",
      required: true,
    },
    {
      id: "humanContact",
      label: "Human contact",
      type: "yesno",
      required: true,
    },
    {
      id: "zipCode",
      label: "Location zip code",
      type: "text",
      required: true,
      placeholder: "e.g. 80202",
    },
    {
      id: "dateObserved",
      label: "Date observed",
      type: "date",
      required: true,
    },
    {
      id: "notes",
      label: "Optional notes",
      type: "textarea",
      placeholder: "Avoid exact addresses or names.",
    },
    {
      id: "photoAttached",
      label: "Optional photo",
      type: "photo",
      helperText: "Photo files stay on this device in the MVP.",
    },
  ],
  environment: [
    {
      id: "concernTypes",
      label: "Concern type",
      type: "multiselect",
      required: true,
      helperText: "Select all that apply.",
      options: [
        { label: "Smoke", value: "smoke" },
        { label: "Unusual odor", value: "unusual odor" },
        { label: "Water contamination", value: "water contamination" },
        { label: "Dead wildlife", value: "dead wildlife" },
        { label: "Poor air quality", value: "poor air quality" },
        { label: "Chemical spill", value: "chemical spill" },
        { label: "Other", value: "other" },
      ],
    },
    {
      id: "zipCode",
      label: "Location zip code",
      type: "text",
      required: true,
      placeholder: "e.g. 80202",
    },
    {
      id: "dateObserved",
      label: "Date observed",
      type: "date",
      required: true,
    },
    {
      id: "ongoingConcern",
      label: "Is this ongoing?",
      type: "yesno",
      required: true,
    },
    {
      id: "notes",
      label: "Optional notes",
      type: "textarea",
      placeholder: "Share city-level or zip-code-level context.",
    },
    {
      id: "photoAttached",
      label: "Optional photo",
      type: "photo",
      helperText: "Photo files stay on this device in the MVP.",
    },
  ],
};

export function isDomain(value: string): value is Domain {
  return value === "human" || value === "animal" || value === "environment";
}
