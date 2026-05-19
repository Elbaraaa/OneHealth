import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import type { DomainInfo } from "@/lib/types";

interface DomainCardProps {
  domain: DomainInfo;
  icon: ReactNode;
  accentClassName: string;
}

export function DomainCard({
  domain,
  icon,
  accentClassName,
}: DomainCardProps) {
  return (
    <Link
      href={domain.href}
      className="focus-ring group flex h-full flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
    >
      <div>
        <div
          className={`mb-5 grid size-12 place-items-center rounded-lg ${accentClassName}`}
        >
          {icon}
        </div>
        <h2 className="text-xl font-bold text-ink">{domain.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {domain.description}
        </p>
      </div>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-public-teal">
        Open report
        <ArrowRight
          className="size-4 transition group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
