import { Activity, BarChart3, FileText, Gauge } from "lucide-react";
import type { DashboardReport, Domain } from "@/lib/types";

interface DashboardSummaryProps {
  reports: DashboardReport[];
}

const domainLabels: Record<Domain, string> = {
  human: "Human",
  animal: "Animal",
  environment: "Environment",
};

function averageRisk(reports: DashboardReport[]): number {
  if (reports.length === 0) return 0;
  const total = reports.reduce((sum, report) => sum + report.riskScore, 0);
  return Math.round(total / reports.length);
}

function countDomain(reports: DashboardReport[], domain: Domain): number {
  return reports.filter((report) => report.domain === domain).length;
}

export function DashboardSummary({ reports }: DashboardSummaryProps) {
  const average = averageRisk(reports);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-600">Total reports</h2>
          <FileText className="size-5 text-public-teal" aria-hidden="true" />
        </div>
        <p className="mt-3 text-3xl font-black text-ink">{reports.length}</p>
      </article>
      <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-600">Average risk</h2>
          <Gauge className="size-5 text-warm-gold" aria-hidden="true" />
        </div>
        <p className="mt-3 text-3xl font-black text-ink">{average}</p>
      </article>
      <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-600">Reports by domain</h2>
          <BarChart3 className="size-5 text-public-blue" aria-hidden="true" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {(["human", "animal", "environment"] as Domain[]).map((domain) => (
            <div key={domain} className="rounded-md bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {domainLabels[domain]}
              </p>
              <p className="mt-1 flex items-center gap-2 text-2xl font-black text-ink">
                <Activity className="size-4 text-public-teal" aria-hidden="true" />
                {countDomain(reports, domain)}
              </p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
