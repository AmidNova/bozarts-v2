import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { eventRepository } from "@/lib/repositories/event";
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

export default async function MyEventsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ARTISAN") redirect("/");

  const events = await eventRepository.findByCreatorId(session.user.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Mes evenements</h1>
        <Button render={<Link href="/my-events/create" />}>
          Creer un evenement
        </Button>
      </div>

      {events.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          Vous n&apos;avez pas encore cree d&apos;evenement
        </p>
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
                    {new Date(event.startDate).toLocaleDateString("fr-FR")}
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
