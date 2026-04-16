import { fetchClientDetail } from "@/lib/queries/client-detail";
import { ClientDetailShell } from "./_components/client-detail-shell";
import { notFound } from "next/navigation";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await fetchClientDetail(id);

  if (!client) {
    notFound();
  }

  return <ClientDetailShell client={client} orgId={id} />;
}
