import { SharedAdmin } from "@/components/SharedAdmin";
import { getSharedData } from "@/lib/shared-data";

export default async function AdminPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const params = await searchParams;
  const data = await getSharedData();
  return <SharedAdmin data={data} saved={params.saved} deleted={params.deleted} />;
}
