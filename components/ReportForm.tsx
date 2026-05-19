"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { domainQuestions } from "@/lib/questions";
import { storageKeys } from "@/lib/mockData";
import type {
  Domain,
  FormValue,
  Question,
  ReportFormState,
  SubmittedReport,
} from "@/lib/types";
import { QuestionRenderer } from "@/components/QuestionRenderer";

interface ReportFormProps {
  domain: Domain;
}

type FormErrors = Record<string, string>;

const domainTitle: Record<Domain, string> = {
  human: "Human Health Report",
  animal: "Animal Health Report",
  environment: "Environmental Health Report",
};

const domainIntro: Record<Domain, string> = {
  human:
    "Share symptoms and recent context. Please avoid full names or exact addresses.",
  animal:
    "Share animal health signals using city-level or zip-code-level location details.",
  environment:
    "Share environmental concerns that may affect people, animals, or local places.",
};

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `report-${Date.now()}`;
}

function defaultValue(question: Question): FormValue {
  if (question.type === "multiselect") return [];
  if (question.type === "yesno") return undefined;
  if (question.type === "photo") return false;
  return "";
}

function createInitialState(questions: Question[]): ReportFormState {
  return questions.reduce<ReportFormState>((state, question) => {
    state[question.id] = defaultValue(question);
    return state;
  }, {});
}

function isEmpty(value: FormValue): boolean {
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "boolean") return false;
  return !value || value.trim().length === 0;
}

function validateState(
  questions: Question[],
  state: ReportFormState,
): FormErrors {
  return questions.reduce<FormErrors>((errors, question) => {
    if (question.required && isEmpty(state[question.id])) {
      errors[question.id] = "Please answer this question to continue.";
    }

    if (
      question.id === "zipCode" &&
      typeof state.zipCode === "string" &&
      state.zipCode.trim().length > 0 &&
      !/^\d{5}$/.test(state.zipCode.trim())
    ) {
      errors[question.id] = "Use a 5-digit zip code.";
    }

    return errors;
  }, {});
}

function asString(value: FormValue): string {
  return typeof value === "string" ? value.trim() : "";
}

function asBoolean(value: FormValue): boolean {
  return value === true;
}

function asStringArray(value: FormValue): string[] {
  return Array.isArray(value) ? value : [];
}

function buildReport(domain: Domain, state: ReportFormState): SubmittedReport {
  const base = {
    id: createId(),
    domain,
    zipCode: asString(state.zipCode),
    notes: asString(state.notes) || undefined,
    photoAttached: asBoolean(state.photoAttached),
    createdAt: new Date().toISOString(),
  };

  if (domain === "human") {
    return {
      ...base,
      domain,
      symptoms: asStringArray(state.symptoms),
      symptomStartDate: asString(state.symptomStartDate),
      recentAnimalContact: asBoolean(state.recentAnimalContact),
      recentTravel: asBoolean(state.recentTravel),
    };
  }

  if (domain === "animal") {
    return {
      ...base,
      domain,
      animalType: asString(state.animalType),
      symptomsBehavior: asStringArray(state.symptomsBehavior),
      multipleAnimalsAffected: asBoolean(state.multipleAnimalsAffected),
      humanContact: asBoolean(state.humanContact),
      dateObserved: asString(state.dateObserved),
    };
  }

  return {
    ...base,
    domain,
    concernTypes: asStringArray(state.concernTypes),
    dateObserved: asString(state.dateObserved),
    ongoingConcern: asBoolean(state.ongoingConcern),
  };
}

export function ReportForm({ domain }: ReportFormProps) {
  const router = useRouter();
  const questions = domainQuestions[domain];
  const initialState = useMemo(() => createInitialState(questions), [questions]);
  const [answers, setAnswers] = useState<ReportFormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});

  function updateAnswer(questionId: string, value: FormValue) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[questionId];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateState(questions, answers);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const report = buildReport(domain, answers);
    localStorage.setItem(storageKeys.draftReport, JSON.stringify(report));
    router.push("/profile");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-8"
    >
      <div className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/report"
            className="focus-ring mb-5 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-public-teal"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Domains
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {domainTitle[domain]}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            {domainIntro[domain]}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-md bg-soft-mint px-3 py-2 text-xs font-semibold text-public-teal">
          <ShieldCheck className="size-4" aria-hidden="true" />
          Anonymous allowed
        </div>
      </div>

      <div className="space-y-7">
        {questions.map((question) => (
          <QuestionRenderer
            key={question.id}
            question={question}
            value={answers[question.id]}
            onChange={(value) => updateAnswer(question.id, value)}
            error={errors[question.id]}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-slate-500">
          Reports use zip-code-level location only and do not require legal names.
        </p>
        <button
          type="submit"
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-public-teal px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800"
        >
          Continue
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
