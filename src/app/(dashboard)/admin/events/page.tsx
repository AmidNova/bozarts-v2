import Link from "next/link";
import { Suspense } from "react";
import { eventRepository } from "@/lib/repositories/event";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteEventButton } from "@/components/admin/DeleteEventButton";
import { Pagination } from "@/components/products/Pagination";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminEventsPage({ searchParams }: Props) {
  const raw = await searchParams;
  const page = Number(raw.page) || 1;
  const { events, totalPages, total } =
    await eventRepository.findAllForAdmin(page);

  const now = new Date();

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Evenements</h1>
        <p className="mt-1 text-muted-foreground">{total} evenement{total > 1 ? "s" : ""}</p>
      </div>

      {events.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          Aucun evenement.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Createur</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => {
                const creatorName = [event.creator.firstName, event.creator.name]
                  .filter(Boolean)
                  .join(" ");
                const isPast = new Date(event.endDate) < now;

                return (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Link
                        href={`/events/${event.id}`}
                        className="font-medium hover:underline"
                      >
                        {event.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">
                      <Link
                        href={`/admin/users/${event.creator.id}`}
                        className="hover:underline"
                      >
                        {creatorName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(event.startDate).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {event.location}
                    </TableCell>
                    <TableCell>{event._count.participants}</TableCell>
                    <TableCell>
                      <Badge variant={isPast ? "secondary" : "default"}>
                        {isPast ? "Termine" : "A venir"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DeleteEventButton eventId={event.id} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Suspense>
            <Pagination currentPage={page} totalPages={totalPages} />
          </Suspense>
        </div>
      )}
    </>
  );
}
