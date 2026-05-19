"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  HeartPulse,
  Leaf,
  PawPrint,
  Smile,
  ThermometerSun,
  UserRound,
} from "lucide-react";
import { AppShell, AppTopBar } from "@/components/AppShell";
import type { Domain } from "@/lib/types";

const domains: Array<{
  value: Domain;
  label: string;
  detail: string;
  icon: typeof UserRound;
}> = [
  {
    value: "human",
    label: "People",
    detail: "Yourself, family, or friends.",
    icon: UserRound,
  },
  {
    value: "animal",
    label: "Animals",
    detail: "Pets, farm animals, or wildlife.",
    icon: PawPrint,
  },
  {
    value: "environment",
    label: "Environment",
    detail: "Water, air, plants, or places.",
    icon: Leaf,
  },
];

export function DomainSelection() {
  const [selected, setSelected] = useState<Domain>("human");

  return (
    <AppShell>
      <AppTopBar title="Health Monitor" backHref="/" />
      <div className="px-4 pb-5 pt-4">
        <div className="mb-5 text-center text-xs font-bold text-slate-600">
          Step 1 of 3
        </div>

        <section>
          <h1 className="text-2xl font-extrabold leading-tight text-ink">
            How are you feeling today?
          </h1>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="focus-ring grid min-h-28 place-items-center rounded-md border border-slate-300 bg-white/60 p-3 text-center text-sm font-bold text-slate-600"
            >
              <Smile className="mb-2 size-8 text-teal-400" aria-hidden="true" />
              Feeling Good
            </button>
            <button
              type="button"
              className="focus-ring grid min-h-28 place-items-center rounded-md border border-slate-300 bg-white/60 p-3 text-center text-sm font-bold text-slate-600"
            >
              <ThermometerSun
                className="mb-2 size-8 text-teal-400"
                aria-hidden="true"
              />
              Feeling Sick
            </button>
          </div>
        </section>

        <section className="mt-9 border-t border-slate-200 pt-6">
          <h2 className="text-2xl font-extrabold leading-tight text-ink">
            What do you want to tell us about?
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            You can pick more than one option.
          </p>

          <div className="mt-4 space-y-2">
            {domains.map((domain) => {
              const Icon = domain.icon;
              const isSelected = selected === domain.value;

              return (
                <button
                  key={domain.value}
                  type="button"
                  onClick={() => setSelected(domain.value)}
                  className="choice-row"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-700">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-extrabold text-ink">
                      {domain.label}
                    </span>
                    <span className="mt-1 block text-xs font-medium text-slate-500">
                      {domain.detail}
                    </span>
                  </span>
                  <span
                    className={`grid size-5 rounded-full border ${
                      isSelected
                        ? "border-public-teal bg-public-teal"
                        : "border-slate-300 bg-white"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-10">
          <Link href={`/report/${selected}`} className="app-button">
            Continue to Report
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <Link
          href="/"
          className="focus-ring mt-4 inline-flex items-center gap-2 rounded-md text-xs font-bold text-public-teal"
        >
          <ArrowLeft className="size-3" aria-hidden="true" />
          Back home
        </Link>
      </div>
    </AppShell>
  );
}
