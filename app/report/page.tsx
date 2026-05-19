import { HeartPulse, Leaf, PawPrint } from "lucide-react";
import { DomainCard } from "@/components/DomainCard";
import { domainCards } from "@/lib/questions";
import type { Domain } from "@/lib/types";

const cardIcons: Record<Domain, React.ReactNode> = {
  human: <HeartPulse className="size-6" aria-hidden="true" />,
  animal: <PawPrint className="size-6" aria-hidden="true" />,
  environment: <Leaf className="size-6" aria-hidden="true" />,
};

const cardAccents: Record<Domain, string> = {
  human: "bg-rose-50 text-rose-700",
  animal: "bg-soft-sky text-public-blue",
  environment: "bg-soft-mint text-public-teal",
};

export default function ReportPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-8 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-public-teal">
          Choose a report type
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">
          What would you like to report?
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Pick the domain that best matches the concern. You can submit anonymously and only zip-code-level location is requested.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {domainCards.map((domain) => (
          <DomainCard
            key={domain.domain}
            domain={domain}
            icon={cardIcons[domain.domain]}
            accentClassName={cardAccents[domain.domain]}
          />
        ))}
      </section>
    </main>
  );
}
