import Link from "next/link";
import {
  ArrowRight,
  Globe2,
  Heart,
  LockKeyhole,
  Shield,
  Sparkles,
} from "lucide-react";
import { AppShell, AppTopBar } from "@/components/AppShell";

export default function HomePage() {
  return (
    <AppShell flat>
      <AppTopBar brand />

      <section className="flex min-h-[calc(100dvh-84px)] flex-col px-5 pb-8 pt-10 text-center">
        <div className="mx-auto grid size-32 place-items-center rounded-lg border border-teal-900/10 bg-white/70 shadow-[0_16px_42px_rgba(0,121,107,0.10)]">
          <div className="relative grid size-20 place-items-center">
            <div className="absolute inset-2 rotate-45 rounded-[28px] bg-gradient-to-br from-teal-300 via-public-teal to-public-blue shadow-lg" />
            <div className="absolute left-3 top-5 size-4 rounded-full bg-warm-gold" />
            <div className="absolute right-3 top-3 size-3 rounded-full bg-cyan-300" />
            <Shield className="relative z-10 size-7 text-white" aria-hidden="true" />
            <Sparkles
              className="absolute bottom-4 right-5 z-10 size-4 text-white"
              aria-hidden="true"
            />
          </div>
        </div>

        <h1 className="mt-8 text-2xl font-extrabold tracking-tight text-ink">
          Welcome!
        </h1>
        <p className="mx-auto mt-3 max-w-[270px] text-base leading-6 text-slate-600">
          Help keep people, animals, and the earth safe.
        </p>
        <p className="mx-auto mt-3 max-w-[285px] text-sm leading-5 text-slate-600">
          Tell us about any health worries. It is safe and private.
        </p>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold">
          <span className="inline-flex items-center gap-1 rounded-md bg-teal-100 px-2 py-1 text-teal-700">
            <LockKeyhole className="size-3" aria-hidden="true" />
            Private
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-public-teal px-2 py-1 text-white">
            <Heart className="size-3" aria-hidden="true" />
            Caring
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-[#bd6847] px-2 py-1 text-white">
            <Globe2 className="size-3" aria-hidden="true" />
            Global
          </span>
        </div>

        <div className="mt-7">
          <Link
            href="/report"
            className="app-button"
          >
            Start
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <p className="mt-4 text-[10px] font-medium text-slate-500">
          Takes about 2 minutes
        </p>

        <div className="mt-auto pt-8">
          <Link
            href="/dashboard"
            className="focus-ring text-xs font-semibold text-public-teal"
          >
            View local dashboard
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
