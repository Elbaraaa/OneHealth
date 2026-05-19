"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Shield, UserRound } from "lucide-react";
import { storageKeys } from "@/lib/mockData";
import {
  calculateRiskScore,
  classifyRisk,
  generateMitigationSteps,
  generateRiskExplanation,
} from "@/lib/riskScoring";
import type {
  DashboardReport,
  Profile,
  RiskResult,
  SubmittedReport,
  YesNoUnknown,
} from "@/lib/types";

type ProfileChoice = "undecided" | "yes" | "no";

interface ProfileFormState {
  displayName: string;
  ageRange: string;
  zipCode: string;
  animalContactFrequency: string;
  outdoorExposureFrequency: string;
  chronicConditionRisk: YesNoUnknown;
}

const initialProfile: ProfileFormState = {
  displayName: "",
  ageRange: "",
  zipCode: "",
  animalContactFrequency: "",
  outdoorExposureFrequency: "",
  chronicConditionRisk: "prefer-not-to-say",
};

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `profile-${Date.now()}`;
}

function getStoredReports(): DashboardReport[] {
  const raw = localStorage.getItem(storageKeys.reports);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as DashboardReport[];
  } catch {
    return [];
  }
}

function buildProfile(state: ProfileFormState): Profile {
  return {
    id: createId(),
    displayName: state.displayName.trim() || undefined,
    ageRange: state.ageRange,
    zipCode: state.zipCode.trim(),
    animalContactFrequency: state.animalContactFrequency,
    outdoorExposureFrequency: state.outdoorExposureFrequency,
    chronicConditionRisk: state.chronicConditionRisk,
    createdAt: new Date().toISOString(),
  };
}

export function ProfileForm() {
  const router = useRouter();
  const [choice, setChoice] = useState<ProfileChoice>("undecided");
  const [draftReports, setDraftReports] = useState<SubmittedReport[]>([]);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
  const [profile, setProfile] = useState<ProfileFormState>(initialProfile);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const rawPendingReports = localStorage.getItem(storageKeys.pendingReports);
    if (rawPendingReports) {
      try {
        const parsedPendingReports = JSON.parse(rawPendingReports) as SubmittedReport[];
        setDraftReports(parsedPendingReports);
      } catch {
        setDraftReports([]);
      } finally {
        setHasLoadedDraft(true);
      }

      return;
    }

    const rawDraft = localStorage.getItem(storageKeys.draftReport);
    if (!rawDraft) {
      setHasLoadedDraft(true);
      return;
    }

    try {
      setDraftReports([JSON.parse(rawDraft) as SubmittedReport]);
    } catch {
      setDraftReports([]);
    } finally {
      setHasLoadedDraft(true);
    }
  }, []);

  function completeSubmission(profileToUse?: Profile) {
    if (draftReports.length === 0) {
      setError("No report draft was found. Please start a new report.");
      return;
    }

    const results = draftReports.map((report) => {
      const score = calculateRiskScore(report, profileToUse);
      const group = classifyRisk(score);

      return {
        report,
        riskResult: {
          reportId: report.id,
          domain: report.domain,
          score,
          group,
          explanation: generateRiskExplanation(report, profileToUse),
          mitigationSteps: generateMitigationSteps(report, group),
          createdAt: new Date().toISOString(),
        } satisfies RiskResult,
      };
    });
    const dashboardReports: DashboardReport[] = results.map(({ report, riskResult }) => ({
      ...report,
      riskScore: riskResult.score,
      riskGroup: riskResult.group,
    }));
    const result = results.reduce((highest, current) =>
      current.riskResult.score > highest.riskResult.score ? current : highest,
    ).riskResult;
    const reports = getStoredReports();

    if (draftReports.length > 1) {
      result.explanation = [
        `You submitted ${draftReports.length} report areas. This result shows the highest current awareness score.`,
        ...result.explanation,
      ];
    }

    if (profileToUse) {
      localStorage.setItem(storageKeys.profile, JSON.stringify(profileToUse));
    }

    localStorage.setItem(
      storageKeys.reports,
      JSON.stringify([...dashboardReports, ...reports]),
    );
    localStorage.setItem(storageKeys.currentRiskResult, JSON.stringify(result));
    localStorage.removeItem(storageKeys.draftReport);
    localStorage.removeItem(storageKeys.pendingReports);
    localStorage.removeItem(storageKeys.reportQueue);
    router.push("/risk-result");
  }

  function continueAnonymously() {
    setChoice("no");
    completeSubmission();
  }

  function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !profile.ageRange ||
      !profile.zipCode ||
      !profile.animalContactFrequency ||
      !profile.outdoorExposureFrequency
    ) {
      setError("Please complete the required profile fields or continue anonymously.");
      return;
    }

    if (!/^\d{5}$/.test(profile.zipCode.trim())) {
      setError("Use a 5-digit zip code.");
      return;
    }

    setError("");
    completeSubmission(buildProfile(profile));
  }

  if (!hasLoadedDraft) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-5 text-center shadow-sm">
        <h1 className="text-xl font-bold text-ink">Preparing profile step</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Checking the report saved on this device.
        </p>
      </div>
    );
  }

  if (draftReports.length === 0) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-5 text-center shadow-sm">
        <h1 className="text-xl font-bold text-ink">No report in progress</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Start a report first, then return to the optional profile step.
        </p>
        <Link
          href="/report"
          className="focus-ring mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-public-teal px-5 py-3 text-sm font-bold text-white"
        >
          Start a Report
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="border-b border-slate-200 pb-6">
        <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-soft-sky px-3 py-2 text-xs font-semibold text-public-blue">
          <Shield className="size-4" aria-hidden="true" />
          Optional profile
        </div>
        <h1 className="text-xl font-extrabold tracking-tight text-ink">
          Would you like to create a profile to personalize your risk awareness?
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          You can continue anonymously. Profiles do not require a legal name or exact address.
          {draftReports.length > 1
            ? ` You have ${draftReports.length} report areas ready to submit.`
            : ""}
        </p>
      </div>

      <div className="mt-6 grid gap-3">
        <button
          type="button"
          onClick={() => {
            setChoice("yes");
            setError("");
          }}
          className={`focus-ring rounded-md border px-4 py-4 text-left transition ${
            choice === "yes"
              ? "border-public-teal bg-soft-mint"
              : "border-slate-200 bg-white hover:border-teal-200"
          }`}
        >
          <span className="flex items-center gap-3 font-bold text-ink">
            <UserRound className="size-5 text-public-teal" aria-hidden="true" />
            Yes, personalize
          </span>
          <span className="mt-2 block text-sm leading-6 text-slate-600">
            Save a separate optional profile on this device.
          </span>
        </button>
        <button
          type="button"
          onClick={continueAnonymously}
          className="focus-ring rounded-md border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-teal-200"
        >
          <span className="font-bold text-ink">No, continue anonymously</span>
          <span className="mt-2 block text-sm leading-6 text-slate-600">
            Submit the report without profile details.
          </span>
        </button>
      </div>

      {choice === "yes" ? (
        <form onSubmit={handleProfileSubmit} className="mt-7 space-y-5">
          <div className="grid gap-4">
            <label className="space-y-2 text-sm font-semibold text-ink">
              Display name optional
              <input
                className="focus-ring w-full rounded-md border border-slate-300 px-4 py-3 text-sm font-normal"
                value={profile.displayName}
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    displayName: event.target.value,
                  }))
                }
                placeholder="Optional"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-ink">
              Age range
              <select
                className="focus-ring w-full rounded-md border border-slate-300 px-4 py-3 text-sm font-normal"
                value={profile.ageRange}
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    ageRange: event.target.value,
                  }))
                }
              >
                <option value="">Select age range</option>
                <option value="under-18">Under 18</option>
                <option value="18-34">18-34</option>
                <option value="35-49">35-49</option>
                <option value="50-64">50-64</option>
                <option value="65-plus">65+</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-semibold text-ink">
              Zip code
              <input
                className="focus-ring w-full rounded-md border border-slate-300 px-4 py-3 text-sm font-normal"
                value={profile.zipCode}
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    zipCode: event.target.value,
                  }))
                }
                placeholder="e.g. 80202"
                inputMode="numeric"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-ink">
              Animal contact frequency
              <select
                className="focus-ring w-full rounded-md border border-slate-300 px-4 py-3 text-sm font-normal"
                value={profile.animalContactFrequency}
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    animalContactFrequency: event.target.value,
                  }))
                }
              >
                <option value="">Select frequency</option>
                <option value="rare">Rarely</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-semibold text-ink">
              Outdoor exposure frequency
              <select
                className="focus-ring w-full rounded-md border border-slate-300 px-4 py-3 text-sm font-normal"
                value={profile.outdoorExposureFrequency}
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    outdoorExposureFrequency: event.target.value,
                  }))
                }
              >
                <option value="">Select frequency</option>
                <option value="rare">Rarely</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-semibold text-ink">
              Chronic condition risk
              <select
                className="focus-ring w-full rounded-md border border-slate-300 px-4 py-3 text-sm font-normal"
                value={profile.chronicConditionRisk}
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    chronicConditionRisk: event.target.value as YesNoUnknown,
                  }))
                }
              >
                <option value="prefer-not-to-say">Prefer not to say</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-md bg-public-teal px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 sm:w-auto"
          >
            Submit Report
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </form>
      ) : null}

      {error ? (
        <p className="mt-5 rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
    </section>
  );
}
