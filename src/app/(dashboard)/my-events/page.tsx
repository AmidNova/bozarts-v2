import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { eventRepository } from "@/lib/repositories/event";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteEventButton } from "@/components/events/DeleteEventButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

export default async function MyEventsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ARTISAN") redirect("/");

  const events = await eventRepository.findByCreatorId(session.user.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Mes evenements"
        actions={
          <Button render={<Link href="/my-events/create" />}>
            Creer un evenement
          </Button>
        }
      />

      {events.length === 0 ? (
        <EmptyState message="Vous n'avez pas encore cree d'evenement" />
      ) : (
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => {
              const isPast = new Date() > event.endDate;
              const isOngoing = new Date() >= event.startDate && new Date() <= event.endDate;
              return (
                <TableRow key={event.id}>
                  <TableCell>
                    <Link href={`/events/${event.id}`} className="font-medium hover:underline">
                      {event.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(event.startDate)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {event.location}
                  </TableCell>
                  <TableCell className="text-sm">
                    {event._count.participants}
                  </TableCell>
                  <TableCell>
                    {isPast ? (
                      <Badge variant="secondary">Termine</Badge>
                    ) : isOngoing ? (
                      <Badge>En cours</Badge>
                    ) : (
                      <Badge variant="outline">A venir</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!isPast && (
                        <Button variant="outline" size="sm" render={<Link href={`/my-events/${event.id}/edit`} />}>
                          Modifier
                        </Button>
                      )}
                      <DeleteEventButton eventId={event.id} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
