import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CreateEventForm } from "@/components/events/CreateEventForm";

export default async function CreateEventPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ARTISAN") redirect("/");

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Creer un evenement</h1>
      <div className="mt-6">
        <CreateEventForm />
      </div>
    </div>
  );
}
