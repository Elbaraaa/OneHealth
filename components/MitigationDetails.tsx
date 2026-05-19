import { CheckCircle2 } from "lucide-react";

interface MitigationDetailsProps {
  steps: string[];
}

export function MitigationDetails({ steps }: MitigationDetailsProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-bold text-ink">Mitigation Guidance</h2>
      <ul className="mt-4 space-y-3">
        {steps.map((step) => (
          <li key={step} className="flex gap-3 text-sm leading-6 text-slate-700">
            <CheckCircle2
              className="mt-0.5 size-5 shrink-0 text-public-teal"
              aria-hidden="true"
            />
            <span>{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
