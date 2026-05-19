import { AlertTriangle, Gauge, Info } from "lucide-react";
import type { RiskGroup, RiskResult } from "@/lib/types";
import { MitigationDetails } from "@/components/MitigationDetails";

interface RiskResultCardProps {
  result: RiskResult;
}

const groupStyles: Record<RiskGroup, string> = {
  Low: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Moderate: "bg-amber-50 text-amber-800 border-amber-200",
  Elevated: "bg-orange-50 text-orange-800 border-orange-200",
  High: "bg-rose-50 text-rose-800 border-rose-200",
};

export function RiskResultCard({ result }: RiskResultCardProps) {
  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-soft-mint px-3 py-2 text-xs font-semibold text-public-teal">
              <Gauge className="size-4" aria-hidden="true" />
              Risk awareness result
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Possible Local Risk: {result.group}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              This score is based on the signals selected in the report and uses cautious, rule-based weighting.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Risk score
            </p>
            <p className="mt-1 text-4xl font-black text-ink">{result.score}</p>
            <p className="text-xs text-slate-500">out of 100</p>
          </div>
        </div>

        <div
          className={`mt-6 inline-flex rounded-md border px-3 py-2 text-sm font-bold ${groupStyles[result.group]}`}
        >
          {result.group}
        </div>

        <div className="mt-7 rounded-lg bg-slate-50 p-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <Info className="size-5 text-public-blue" aria-hidden="true" />
            Why this score was assigned
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            {result.explanation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <MitigationDetails steps={result.mitigationSteps} />

      <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <p>
          This is not a medical or veterinary diagnosis. If there are emergency symptoms or immediate danger, contact emergency services or a qualified professional.
        </p>
      </div>
    </section>
  );
}
