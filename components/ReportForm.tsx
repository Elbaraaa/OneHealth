"use client";

import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bug,
  CloudUpload,
  Droplet,
  FlaskConical,
  MapPin,
  Minus,
  PawPrint,
  Plus,
  Radio,
  Thermometer,
  Tractor,
  Trees,
  UserRound,
  Wind,
} from "lucide-react";
import { AppShell, AppTopBar } from "@/components/AppShell";
import { storageKeys } from "@/lib/mockData";
import type { Domain, FormValue, ReportFormState, SubmittedReport } from "@/lib/types";

interface ReportFormProps {
  domain: Domain;
}

type FormErrors = Record<string, string>;

const today = () => new Date().toISOString().slice(0, 10);

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `report-${Date.now()}`;
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

function toggle(values: string[], option: string): string[] {
  return values.includes(option)
    ? values.filter((value) => value !== option)
    : [...values, option];
}

function getPendingReports(): SubmittedReport[] {
  const raw = localStorage.getItem(storageKeys.pendingReports);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as SubmittedReport[];
  } catch {
    return [];
  }
}

function getReportQueue(): Domain[] {
  const raw = localStorage.getItem(storageKeys.reportQueue);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Domain[];
  } catch {
    return [];
  }
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
      symptomStartDate: asString(state.symptomStartDate) || today(),
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
      multipleAnimalsAffected: Number(asString(state.animalCount) || "1") > 1,
      humanContact: asBoolean(state.humanContact),
      dateObserved: asString(state.dateObserved) || today(),
    };
  }

  return {
    ...base,
    domain,
    concernTypes: asStringArray(state.concernTypes),
    dateObserved: asString(state.dateObserved) || today(),
    ongoingConcern: asBoolean(state.ongoingConcern),
  };
}

function defaultAnswers(domain: Domain): ReportFormState {
  if (domain === "human") {
    return {
      symptoms: [],
      peopleSick: "1",
      zipCode: "",
      symptomStartDate: today(),
      recentAnimalContact: false,
      recentTravel: false,
      notes: "",
      photoAttached: false,
    };
  }

  if (domain === "animal") {
    return {
      animalType: "",
      symptomsBehavior: [],
      animalCount: "1",
      zipCode: "",
      dateObserved: today(),
      humanContact: false,
      notes: "",
      photoAttached: false,
    };
  }

  return {
    concernTypes: [],
    zipCode: "",
    dateObserved: today(),
    ongoingConcern: true,
    notes: "",
    photoAttached: false,
  };
}

function validate(domain: Domain, answers: ReportFormState): FormErrors {
  const errors: FormErrors = {};
  const zipCode = asString(answers.zipCode);

  if (domain === "human" && asStringArray(answers.symptoms).length === 0) {
    errors.symptoms = "Pick at least one symptom.";
  }

  if (domain === "animal") {
    if (!asString(answers.animalType)) errors.animalType = "Pick an animal type.";
    if (asStringArray(answers.symptomsBehavior).length === 0) {
      errors.symptomsBehavior = "Pick at least one concern.";
    }
  }

  if (domain === "environment" && asStringArray(answers.concernTypes).length === 0) {
    errors.concernTypes = "Pick at least one concern.";
  }

  if (!zipCode) {
    errors.zipCode = "Add a zip code.";
  } else if (!/^\d{5}$/.test(zipCode)) {
    errors.zipCode = "Use a 5-digit zip code.";
  }

  return errors;
}

function ProgressHeader({ domain }: { domain: Domain }) {
  const meta = {
    human: { step: "Step 2 of 4", label: "People Illness", width: "55%" },
    animal: { step: "Step 3 of 4", label: "Animal Details", width: "78%" },
    environment: { step: "Step 4 of 4", label: "Final Details", width: "100%" },
  }[domain];

  return (
    <div className="px-4 pb-4 pt-3">
      <div className="flex items-center justify-between text-[11px] font-bold text-ink">
        <span>{meta.step}</span>
        <span className="text-public-teal">{meta.label}</span>
      </div>
      <div className="progress-track mt-2">
        <div className="progress-fill" style={{ width: meta.width }} />
      </div>
    </div>
  );
}

function ErrorText({ children }: { children?: string }) {
  if (!children) return null;

  return <p className="mt-2 text-xs font-semibold text-rose-600">{children}</p>;
}

function OptionRow({
  active,
  danger,
  icon,
  title,
  subtitle,
  onClick,
  type = "checkbox",
}: {
  active: boolean;
  danger?: boolean;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  onClick: () => void;
  type?: "checkbox" | "radio";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`choice-row min-h-[58px] ${
        danger ? "bg-rose-100 text-rose-700 hover:bg-rose-100" : ""
      }`}
    >
      {icon ? (
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-slate-100 text-public-teal">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className={`block text-sm font-bold ${danger ? "text-rose-700" : "text-ink"}`}>
          {title}
        </span>
        {subtitle ? (
          <span className="mt-1 block text-xs font-medium text-slate-500">
            {subtitle}
          </span>
        ) : null}
      </span>
      <span
        className={`grid size-5 shrink-0 place-items-center border ${
          type === "radio" ? "rounded-full" : "rounded-sm"
        } ${active ? "border-public-teal bg-public-teal" : "border-slate-300 bg-white"}`}
        aria-hidden="true"
      />
    </button>
  );
}

function NumberStepper({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const count = Math.max(1, Number(value) || 1);

  return (
    <div className="flex items-center justify-between rounded-md border border-slate-300 bg-white p-2">
      <button
        type="button"
        className="focus-ring grid size-10 place-items-center rounded-md bg-slate-100 text-public-teal"
        onClick={() => onChange(String(Math.max(1, count - 1)))}
        aria-label="Decrease count"
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <span className="text-2xl font-extrabold text-ink">{count}</span>
      <button
        type="button"
        className="focus-ring grid size-10 place-items-center rounded-md bg-slate-100 text-public-teal"
        onClick={() => onChange(String(count + 1))}
        aria-label="Increase count"
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function LocationInput({
  value,
  onChange,
  error,
  label = "Where did this happen?",
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-ink">
        {label}
        <span className="mt-2 flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-3 text-sm font-normal text-slate-500">
          <MapPin className="size-4 text-public-blue" aria-hidden="true" />
          <input
            className="min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-slate-500"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            inputMode="numeric"
            placeholder="Zip code"
          />
        </span>
      </label>
      <ErrorText>{error}</ErrorText>
    </div>
  );
}

function PhotoPlaceholder({
  active,
  onChange,
}: {
  active: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="choice-row cursor-pointer bg-white/70">
      <span className="grid size-9 place-items-center rounded-md bg-slate-100 text-public-teal">
        <CloudUpload className="size-4" aria-hidden="true" />
      </span>
      <span className="flex-1 text-sm font-bold text-ink">
        {active ? "Photo noted" : "Optional photo placeholder"}
      </span>
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => onChange(Boolean(event.target.files?.length))}
      />
    </label>
  );
}

function MapPreview() {
  return (
    <div className="relative mt-3 h-28 overflow-hidden rounded-sm bg-[#d8e5dd]">
      <div className="absolute inset-x-0 bottom-0 h-10 bg-[#ecf1e5]" />
      <div className="absolute bottom-7 left-0 h-px w-full rotate-[-5deg] bg-warm-gold" />
      <div className="absolute bottom-8 left-0 h-px w-full rotate-[4deg] bg-cyan-300" />
      <div className="absolute bottom-0 right-9 h-10 w-14 skew-x-[-18deg] bg-[#b7d4df]" />
      <div className="absolute left-1/2 top-4 size-20 -translate-x-1/2 rounded-full border-[7px] border-teal-500 bg-transparent" />
      <div className="absolute left-1/2 top-[82px] size-8 -translate-x-1/2 rotate-45 rounded-br-full bg-teal-600" />
      <div className="absolute left-1/2 top-[90px] size-2 -translate-x-1/2 rounded-full bg-teal-900" />
    </div>
  );
}

export function ReportForm({ domain }: ReportFormProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<ReportFormState>(() => defaultAnswers(domain));
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
    const nextErrors = validate(domain, answers);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const report = buildReport(domain, answers);
    const pendingReports = [...getPendingReports(), report];
    const [nextDomain, ...remainingDomains] = getReportQueue();

    localStorage.setItem(storageKeys.pendingReports, JSON.stringify(pendingReports));
    localStorage.removeItem(storageKeys.draftReport);

    if (nextDomain) {
      localStorage.setItem(storageKeys.reportQueue, JSON.stringify(remainingDomains));
      router.push(`/report/${nextDomain}`);
      return;
    }

    localStorage.removeItem(storageKeys.reportQueue);
    router.push("/profile");
  }

  const selectedSymptoms = asStringArray(answers.symptoms);
  const selectedAnimalConcerns = asStringArray(answers.symptomsBehavior);
  const selectedEnvironmentConcerns = asStringArray(answers.concernTypes);

  return (
    <AppShell>
      <AppTopBar
        title={domain === "animal" ? "Report Animal" : "Health Monitor"}
        backHref="/report"
        showUser={domain === "environment"}
      />
      <ProgressHeader domain={domain} />

      <form onSubmit={handleSubmit} className="px-4 pb-5">
        {domain === "human" ? (
          <div className="space-y-6">
            <section>
              <h1 className="text-2xl font-extrabold leading-tight text-ink">
                Tell us about the illness
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Please answer a few simple questions.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold text-ink">
                What are the symptoms?
              </h2>
              <div className="space-y-2">
                <OptionRow
                  active={selectedSymptoms.includes("cough")}
                  icon={<Bug className="size-4" aria-hidden="true" />}
                  title="Cough"
                  onClick={() => updateAnswer("symptoms", toggle(selectedSymptoms, "cough"))}
                />
                <OptionRow
                  active={selectedSymptoms.includes("fever")}
                  icon={<Thermometer className="size-4" aria-hidden="true" />}
                  title="Fever"
                  onClick={() => updateAnswer("symptoms", toggle(selectedSymptoms, "fever"))}
                />
                <OptionRow
                  active={selectedSymptoms.includes("fatigue")}
                  icon={<Radio className="size-4" aria-hidden="true" />}
                  title="Very Tired"
                  onClick={() => updateAnswer("symptoms", toggle(selectedSymptoms, "fatigue"))}
                />
                <OptionRow
                  active={selectedSymptoms.includes("other")}
                  icon={<Plus className="size-4" aria-hidden="true" />}
                  title="Other"
                  onClick={() => updateAnswer("symptoms", toggle(selectedSymptoms, "other"))}
                />
              </div>
              <ErrorText>{errors.symptoms}</ErrorText>
            </section>

            <label className="block text-sm font-semibold text-ink">
              How many people are sick?
              <span className="mt-2 flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-3 text-sm font-normal text-slate-500">
                <UserRound className="size-4 text-public-blue" aria-hidden="true" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-slate-500"
                  value={asString(answers.peopleSick)}
                  onChange={(event) => updateAnswer("peopleSick", event.target.value)}
                  inputMode="numeric"
                  placeholder="e.g. 3"
                />
              </span>
            </label>

            <LocationInput
              value={asString(answers.zipCode)}
              onChange={(value) => updateAnswer("zipCode", value)}
              error={errors.zipCode}
            />

            <PhotoPlaceholder
              active={asBoolean(answers.photoAttached)}
              onChange={(value) => updateAnswer("photoAttached", value)}
            />

            <button type="submit" className="app-button">
              Next
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        ) : null}

        {domain === "animal" ? (
          <div className="space-y-7">
            <section>
              <h1 className="mb-3 text-sm font-extrabold text-ink">
                What kind of animal is it?
              </h1>
              <div className="space-y-2">
                <OptionRow
                  type="radio"
                  active={asString(answers.animalType) === "Pets"}
                  icon={<PawPrint className="size-5" aria-hidden="true" />}
                  title="Pets"
                  subtitle="Dogs, cats, etc."
                  onClick={() => updateAnswer("animalType", "Pets")}
                />
                <OptionRow
                  type="radio"
                  active={asString(answers.animalType) === "Farm Animals"}
                  icon={<Tractor className="size-5" aria-hidden="true" />}
                  title="Farm Animals"
                  subtitle="Cows, pigs, chickens"
                  onClick={() => updateAnswer("animalType", "Farm Animals")}
                />
                <OptionRow
                  type="radio"
                  active={asString(answers.animalType) === "Wildlife"}
                  icon={<Trees className="size-5" aria-hidden="true" />}
                  title="Wildlife"
                  subtitle="Birds, deer, raccoons"
                  onClick={() => updateAnswer("animalType", "Wildlife")}
                />
              </div>
              <ErrorText>{errors.animalType}</ErrorText>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-extrabold text-ink">
                What is wrong?
              </h2>
              <div className="space-y-2">
                <OptionRow
                  active={selectedAnimalConcerns.includes("unusual aggression")}
                  title="Acting strange or weird"
                  onClick={() =>
                    updateAnswer(
                      "symptomsBehavior",
                      toggle(selectedAnimalConcerns, "unusual aggression"),
                    )
                  }
                />
                <OptionRow
                  active={selectedAnimalConcerns.includes("lethargy")}
                  title="Getting sick"
                  onClick={() =>
                    updateAnswer("symptomsBehavior", toggle(selectedAnimalConcerns, "lethargy"))
                  }
                />
                <OptionRow
                  active={selectedAnimalConcerns.includes("sudden death")}
                  danger
                  title="Found dead"
                  onClick={() =>
                    updateAnswer(
                      "symptomsBehavior",
                      toggle(selectedAnimalConcerns, "sudden death"),
                    )
                  }
                />
              </div>
              <ErrorText>{errors.symptomsBehavior}</ErrorText>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-extrabold text-ink">
                How many animals?
              </h2>
              <NumberStepper
                value={asString(answers.animalCount)}
                onChange={(value) => updateAnswer("animalCount", value)}
              />
            </section>

            <LocationInput
              value={asString(answers.zipCode)}
              onChange={(value) => updateAnswer("zipCode", value)}
              error={errors.zipCode}
            />

            <PhotoPlaceholder
              active={asBoolean(answers.photoAttached)}
              onChange={(value) => updateAnswer("photoAttached", value)}
            />

            <button type="submit" className="app-button">
              Next
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        ) : null}

        {domain === "environment" ? (
          <div className="space-y-4">
            <section>
              <h1 className="text-2xl font-extrabold leading-tight text-ink">
                Environment Report
              </h1>
              <p className="mt-1 text-sm leading-5 text-slate-600">
                Please tell us what you saw and where it happened.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-medium text-slate-700">
                What did you see?
              </h2>
              <div className="space-y-2">
                <OptionRow
                  active={selectedEnvironmentConcerns.includes("water contamination")}
                  icon={<Droplet className="size-5" aria-hidden="true" />}
                  title="Dirty water"
                  onClick={() =>
                    updateAnswer(
                      "concernTypes",
                      toggle(selectedEnvironmentConcerns, "water contamination"),
                    )
                  }
                />
                <OptionRow
                  active={selectedEnvironmentConcerns.includes("smoke")}
                  icon={<Wind className="size-5" aria-hidden="true" />}
                  title="Bad air or smoke"
                  onClick={() =>
                    updateAnswer("concernTypes", toggle(selectedEnvironmentConcerns, "smoke"))
                  }
                />
                <OptionRow
                  active={selectedEnvironmentConcerns.includes("chemical spill")}
                  icon={<FlaskConical className="size-5" aria-hidden="true" />}
                  title="Chemical spill"
                  onClick={() =>
                    updateAnswer(
                      "concernTypes",
                      toggle(selectedEnvironmentConcerns, "chemical spill"),
                    )
                  }
                />
              </div>
              <ErrorText>{errors.concernTypes}</ErrorText>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <LocationInput
                value={asString(answers.zipCode)}
                onChange={(value) => updateAnswer("zipCode", value)}
                error={errors.zipCode}
                label="Where is the problem?"
              />
              <MapPreview />
            </section>

            <PhotoPlaceholder
              active={asBoolean(answers.photoAttached)}
              onChange={(value) => updateAnswer("photoAttached", value)}
            />

            <button type="submit" className="app-button">
              <CloudUpload className="size-4" aria-hidden="true" />
              Submit Report
            </button>
          </div>
        ) : null}

        <p className="mt-4 text-center text-[10px] leading-4 text-slate-500">
          This is not a diagnosis. Share zip-code-level details only.
        </p>
      </form>
    </AppShell>
  );
}
