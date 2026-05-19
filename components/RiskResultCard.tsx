import Link from "next/link";
import {
  Check,
  Droplet,
  Gauge,
  Home,
  Map,
} from "lucide-react";
import { AppShell, AppTopBar } from "@/components/AppShell";
import type { RiskGroup, RiskResult } from "@/lib/types";

interface RiskResultCardProps {
  result: RiskResult;
}

const groupCopy: Record<RiskGroup, string> = {
  Low: "Low risk in your area right now.",
  Moderate: "Some signals may be worth watching in your area.",
  Elevated: "Local signals may indicate elevated awareness is useful.",
  High: "Local signals may need prompt attention and extra caution.",
};

const badgeStyles: Record<RiskGroup, string> = {
  Low: "bg-emerald-50 text-emerald-700",
  Moderate: "bg-amber-50 text-amber-700",
  Elevated: "bg-orange-50 text-orange-700",
  High: "bg-rose-50 text-rose-700",
};

function GaugeIllustration({ group }: { group: RiskGroup }) {
  const needleRotation = {
    Low: "-45deg",
    Moderate: "-15deg",
    Elevated: "20deg",
    High: "48deg",
  }[group];

  return (
    <div className="mx-auto mt-3 h-24 w-32 rounded-md bg-white">
      <div className="relative mx-auto h-20 w-28 overflow-hidden">
        <div className="absolute bottom-0 left-0 h-16 w-5 border-l-[10px] border-t-[10px] border-slate-200" />
        <div className="absolute bottom-0 right-0 h-16 w-5 border-r-[10px] border-t-[10px] border-emerald-600" />
        <div className="absolute bottom-2 left-1/2 h-1 w-16 origin-left rounded-full bg-slate-500" style={{ transform: `rotate(${needleRotation})` }} />
        <div className="absolute bottom-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-slate-600" />
      </div>
    </div>
  );
}

export function RiskResultCard({ result }: RiskResultCardProps) {
  const firstAdvice =
    result.mitigationSteps[0] ??
    "Keep washing your hands with soap and stay aware of local updates.";

  return (
    <AppShell>
      <AppTopBar title="Health Monitor" />
      <section className="px-5 pb-5 pt-8 text-center">
        <div className="mx-auto grid size-28 place-items-center rounded-lg border border-slate-200 bg-white/70">
          <div className="relative grid size-14 place-items-center rounded-full bg-emerald-600 text-white">
            <Check className="size-8" aria-hidden="true" />
            <span className="absolute -right-7 top-7 size-3 rounded-full bg-teal-200" />
            <span className="absolute -left-6 bottom-5 size-1.5 rounded-full bg-rose-200" />
            <span className="absolute -top-7 right-7 size-2 rounded-full bg-teal-300" />
          </div>
        </div>

        <h1 className="mt-8 text-2xl font-extrabold text-ink">
          Thank you for your report!
        </h1>
        <p className="mx-auto mt-2 max-w-[260px] text-base leading-6 text-slate-700">
          Your information helps keep the community healthy.
        </p>

        <article className="mt-6 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink">
            Current Local Status
          </p>
          <GaugeIllustration group={result.group} />
          <span
            className={`inline-flex rounded-md px-3 py-1 text-xs font-extrabold ${badgeStyles[result.group]}`}
          >
            {result.group} Risk
          </span>
          <p className="mt-3 text-sm font-medium text-ink">{groupCopy[result.group]}</p>
        </article>

        <article className="mt-5 flex gap-3 bg-white/40 p-4 text-left">
          <span className="grid size-8 shrink-0 place-items-center text-public-teal">
            <Droplet className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-ink">Friendly Advice</h2>
            <p className="mt-1 text-xs leading-5 text-slate-700">{firstAdvice}</p>
          </div>
        </article>

        <div className="mt-7 space-y-3">
          <Link href="/" className="app-button">
            <Home className="size-4" aria-hidden="true" />
            Go Home
          </Link>
          <Link href="/dashboard" className="app-button-secondary">
            <Map className="size-4" aria-hidden="true" />
            View Map
          </Link>
        </div>

        <p className="mt-4 text-[10px] leading-4 text-slate-500">
          This is not a medical or veterinary diagnosis. If there are emergency symptoms or immediate danger, contact emergency services or a qualified professional.
        </p>
      </section>
    </AppShell>
  );
}
