import Link from "next/link";
import { eventRepository } from "@/lib/repositories/event";
import { EventFilterSchema } from "@/lib/schemas/event";
import { EventCard } from "@/components/events/EventCard";
import { Button } from "@/components/ui/button";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function EventsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { page, pageSize } = EventFilterSchema.parse(sp);
  const { events, totalPages } = await eventRepository.findAll(page, pageSize);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Evenements</h1>
      </div>

      {events.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          Aucun evenement a venir
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {page > 1 && (
            <Button variant="outline" render={<Link href={`/events?page=${page - 1}`} />}>
              Precedent
            </Button>
          )}
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Button variant="outline" render={<Link href={`/events?page=${page + 1}`} />}>
              Suivant
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
