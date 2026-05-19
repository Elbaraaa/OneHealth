import type { DashboardReport, Domain } from "@/lib/types";

interface RecentReportsTableProps {
  reports: DashboardReport[];
}

const domainLabels: Record<Domain, string> = {
  human: "Human",
  animal: "Animal",
  environment: "Environment",
};

function primarySignals(report: DashboardReport): string {
  if (report.domain === "human") return report.symptoms.join(", ");
  if (report.domain === "animal") return report.symptomsBehavior.join(", ");
  return report.concernTypes.join(", ");
}

export function RecentReportsTable({ reports }: RecentReportsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-bold text-ink">Recent Reports</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Domain</th>
              <th className="px-5 py-3">Zip code</th>
              <th className="px-5 py-3">Signals</th>
              <th className="px-5 py-3">Risk</th>
              <th className="px-5 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.slice(0, 8).map((report) => (
              <tr key={report.id}>
                <td className="whitespace-nowrap px-5 py-4 font-semibold text-ink">
                  {domainLabels[report.domain]}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                  {report.zipCode}
                </td>
                <td className="min-w-64 px-5 py-4 text-slate-600">
                  {primarySignals(report) || "General concern"}
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <span className="rounded-md bg-soft-mint px-2.5 py-1 text-xs font-bold text-public-teal">
                    {report.riskGroup} ({report.riskScore})
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                  {new Date(report.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
