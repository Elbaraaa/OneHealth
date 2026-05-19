"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPinned, TrendingUp } from "lucide-react";
import { AppShell, AppTopBar } from "@/components/AppShell";
import { DashboardSummary } from "@/components/DashboardSummary";
import { RecentReportsTable } from "@/components/RecentReportsTable";
import { mockReports, storageKeys } from "@/lib/mockData";
import type { DashboardReport, Domain, RiskGroup } from "@/lib/types";

const domainLabels: Record<Domain, string> = {
  human: "Human",
  animal: "Animal",
  environment: "Environment",
};

const riskOrder: RiskGroup[] = ["Low", "Moderate", "Elevated", "High"];

function getStoredReports(): DashboardReport[] {
  const rawReports = localStorage.getItem(storageKeys.reports);
  if (!rawReports) return [];

  try {
    return JSON.parse(rawReports) as DashboardReport[];
  } catch {
    return [];
  }
}

function reportSignals(report: DashboardReport): string[] {
  if (report.domain === "human") return report.symptoms;
  if (report.domain === "animal") return report.symptomsBehavior;
  return report.concernTypes;
}

function getTopSignals(reports: DashboardReport[]): [string, number][] {
  const counts = new Map<string, number>();

  reports.forEach((report) => {
    reportSignals(report).forEach((signal) => {
      counts.set(signal, (counts.get(signal) ?? 0) + 1);
    });
  });

  return [...counts.entries()]
    .sort((first, second) => second[1] - first[1])
    .slice(0, 6);
}

function getHighestRisk(reports: DashboardReport[]): RiskGroup {
  return reports.reduce<RiskGroup>((highest, report) => {
    return riskOrder.indexOf(report.riskGroup) > riskOrder.indexOf(highest)
      ? report.riskGroup
      : highest;
  }, "Low");
}

function getDomainCounts(reports: DashboardReport[]): [Domain, number][] {
  return (["human", "animal", "environment"] as Domain[]).map((domain) => [
    domain,
    reports.filter((report) => report.domain === domain).length,
  ]);
}

export default function DashboardPage() {
  const [storedReports, setStoredReports] = useState<DashboardReport[]>([]);

  useEffect(() => {
    setStoredReports(getStoredReports());
  }, []);

  const reports = useMemo(
    () => [...storedReports, ...mockReports],
    [storedReports],
  );
  const topSignals = useMemo(() => getTopSignals(reports), [reports]);
  const highestRisk = useMemo(() => getHighestRisk(reports), [reports]);
  const domainCounts = useMemo(() => getDomainCounts(reports), [reports]);
  const busiestDomain = domainCounts.reduce((top, current) =>
    current[1] > top[1] ? current : top,
  );

  return (
    <AppShell>
      <AppTopBar title="Local Map" backHref="/risk-result" />
      <main className="px-4 py-5">
      <section className="mb-5 flex flex-col gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-public-teal">
            Community overview
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-ink">
            One Health Dashboard
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Mock and locally submitted reports are summarized at a lightweight level for local risk awareness.
          </p>
        </div>
        <Link
          href="/report"
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-public-teal px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
        >
          Start a Report
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>

      <DashboardSummary reports={reports} />

      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-5 text-public-blue" aria-hidden="true" />
            <h2 className="text-lg font-bold text-ink">Top Reported Signals</h2>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {topSignals.map(([signal, count]) => (
              <span
                key={signal}
                className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
              >
                {signal} ({count})
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <MapPinned className="size-5 text-public-teal" aria-hidden="true" />
            <h2 className="text-lg font-bold text-ink">Basic Local Risk Summary</h2>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            Current reports suggest a possible {highestRisk.toLowerCase()} local risk pattern, with the most activity in the {domainLabels[busiestDomain[0]].toLowerCase()} domain.
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            These summaries are based on local and mock MVP data and should be interpreted as awareness signals only.
          </p>
        </article>
      </section>

      <section className="mt-6">
        <RecentReportsTable reports={reports} />
      </section>
      </main>
    </AppShell>
  );
}
