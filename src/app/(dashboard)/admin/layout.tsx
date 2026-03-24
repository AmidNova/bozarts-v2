import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex gap-8">
      <aside className="hidden w-48 shrink-0 md:block">
        <h2 className="mb-4 text-lg font-semibold">Administration</h2>
        <AdminNav />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
