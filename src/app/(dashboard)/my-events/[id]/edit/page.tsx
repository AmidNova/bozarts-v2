import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { eventRepository } from "@/lib/repositories/event";
import { EventForm } from "@/components/events/EventForm";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ARTISAN") redirect("/");

  const { id } = await params;
  const event = await eventRepository.findById(id);

  if (!event || event.creatorId !== session.user.id) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Modifier l&apos;evenement</h1>
      <div className="mt-6">
        <EventForm
          event={{
            id: event.id,
            title: event.title,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate,
            location: event.location,
            imageUrl: event.imageUrl,
          }}
        />
      </div>
    </div>
  );
}
