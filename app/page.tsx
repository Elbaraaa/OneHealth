import Link from "next/link";
import { ArrowRight, HeartPulse, Leaf, PawPrint, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
      <section>
        <div className="mb-6 inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-bold text-public-teal shadow-sm ring-1 ring-teal-900/10">
          <ShieldCheck className="size-4" aria-hidden="true" />
          Private by default
        </div>
        <h1 className="max-w-3xl text-4xl font-black tracking-tight text-ink sm:text-5xl">
          Welcome to One Health Reporting
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          Report human, animal, or environmental health concerns using lightweight community signals. The app classifies possible local risk and offers supportive mitigation guidance without claiming a diagnosis.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/report"
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-public-teal px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800"
          >
            Start a Report
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/dashboard"
            className="focus-ring inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-ink transition hover:border-public-blue hover:text-public-blue"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="grid gap-4">
          {[
            {
              title: "Human health",
              text: "Symptoms and recent exposure context.",
              icon: HeartPulse,
              className: "bg-rose-50 text-rose-700",
            },
            {
              title: "Animal health",
              text: "Pet, livestock, and wildlife concerns.",
              icon: PawPrint,
              className: "bg-soft-sky text-public-blue",
            },
            {
              title: "Environmental health",
              text: "Air, water, odor, wildlife, and spill signals.",
              icon: Leaf,
              className: "bg-soft-mint text-public-teal",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <span className={`grid size-12 place-items-center rounded-lg ${item.className}`}>
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-bold text-ink">{item.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
