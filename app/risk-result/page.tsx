"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import { RiskResultCard } from "@/components/RiskResultCard";
import { mockCurrentRiskResult, storageKeys } from "@/lib/mockData";
import type { RiskResult } from "@/lib/types";

export default function RiskResultPage() {
  const [result, setResult] = useState<RiskResult | null>(null);

  useEffect(() => {
    const rawResult = localStorage.getItem(storageKeys.currentRiskResult);
    if (!rawResult) {
      setResult(mockCurrentRiskResult);
      return;
    }

    try {
      setResult(JSON.parse(rawResult) as RiskResult);
    } catch {
      setResult(mockCurrentRiskResult);
    }
  }, []);

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      {result ? <RiskResultCard result={result} /> : null}

      <div className="mx-auto mt-8 flex max-w-4xl flex-col gap-3 sm:flex-row">
        <Link
          href="/report"
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-public-teal px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
        >
          <ClipboardList className="size-4" aria-hidden="true" />
          Start Another Report
        </Link>
        <Link
          href="/dashboard"
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-ink transition hover:border-public-blue hover:text-public-blue"
        >
          View Dashboard
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
