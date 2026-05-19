import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, CircleUserRound, ShieldPlus } from "lucide-react";

interface AppShellProps {
  children: ReactNode;
  className?: string;
  flat?: boolean;
}

interface AppTopBarProps {
  title?: string;
  backHref?: string;
  showUser?: boolean;
  brand?: boolean;
}

export function AppShell({ children, className = "", flat }: AppShellProps) {
  return (
    <main className="phone-page">
      <div
        className={`phone-screen ${flat ? "phone-screen-flat" : ""} ${className}`}
      >
        {children}
      </div>
    </main>
  );
}

export function AppTopBar({
  title = "Health Monitor",
  backHref,
  showUser,
  brand,
}: AppTopBarProps) {
  return (
    <header className="relative flex h-10 items-center justify-center border-b border-slate-200 bg-white/82 px-4 text-public-teal">
      {backHref ? (
        <Link
          href={backHref}
          className="focus-ring absolute left-3 grid size-8 place-items-center rounded-md text-public-teal"
          aria-label="Go back"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
      ) : null}

      {brand ? (
        <Link
          href="/"
          className="focus-ring absolute left-3 inline-flex items-center gap-2 rounded-md text-xs font-extrabold text-public-teal"
        >
          <ShieldPlus className="size-4" aria-hidden="true" />
          One Health
        </Link>
      ) : (
        <p className="text-xs font-medium">{title}</p>
      )}

      {showUser ? (
        <span className="absolute right-3 grid size-8 place-items-center rounded-md text-slate-700">
          <CircleUserRound className="size-4" aria-hidden="true" />
        </span>
      ) : null}
    </header>
  );
}
