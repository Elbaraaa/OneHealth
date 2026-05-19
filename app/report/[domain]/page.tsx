import { notFound } from "next/navigation";
import { ReportForm } from "@/components/ReportForm";
import { isDomain } from "@/lib/questions";

interface ReportDomainPageProps {
  params: Promise<{
    domain: string;
  }>;
}

export default async function ReportDomainPage({
  params,
}: ReportDomainPageProps) {
  const { domain } = await params;

  if (!isDomain(domain)) {
    notFound();
  }

  return <ReportForm domain={domain} />;
}
