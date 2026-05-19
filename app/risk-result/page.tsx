"use client";

import { useEffect, useState } from "react";
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
    <>{result ? <RiskResultCard result={result} /> : null}</>
  );
}
