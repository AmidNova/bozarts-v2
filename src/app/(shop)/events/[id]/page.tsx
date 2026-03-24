import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { eventRepository } from "@/lib/repositories/event";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RegisterButton } from "@/components/events/RegisterButton";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const [event, session] = await Promise.all([
    eventRepository.findById(id),
    auth(),
  ]);

  if (!event) notFound();

  const userId = session?.user?.id;
  const isRegistered = userId
    ? event.participants.some((p) => p.participantId === userId)
    : false;
  const isCreator = userId === event.creatorId;
  const isPast = new Date() > event.endDate;
  const isOngoing = new Date() >= event.startDate && new Date() <= event.endDate;

  const creatorName = [event.creator.firstName, event.creator.name]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; Evenements
      </Link>

      {event.imageUrl && (
        <div className="mt-4 aspect-[21/9] overflow-hidden rounded-xl bg-muted">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
            {isOngoing && <Badge>En cours</Badge>}
            {isPast && <Badge variant="secondary">Termine</Badge>}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Organise par{" "}
            <Link href={`/artisans/${event.creator.id}`} className="font-medium text-foreground hover:underline">
              {creatorName}
            </Link>
          </p>
        </div>

        {userId && !isCreator && !isPast && (
          <RegisterButton eventId={event.id} isRegistered={isRegistered} />
        )}
      </div>

      <Separator className="my-6" />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{event.description}</p>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border p-4">
          <div>
            <p className="text-sm font-medium">Date</p>
            <p className="text-sm text-muted-foreground">
              {new Date(event.startDate).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              au {new Date(event.endDate).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">Lieu</p>
            <p className="text-sm text-muted-foreground">{event.location}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Participants</p>
            <p className="text-sm text-muted-foreground">
              {event.participants.length} inscrit{event.participants.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {event.participants.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Participants</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {event.participants.map((p) => {
              const name = [p.participant.firstName, p.participant.name]
                .filter(Boolean)
                .join(" ");
              return (
                <div key={p.id} className="flex items-center gap-2 rounded-full border px-3 py-1">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {(p.participant.firstName?.[0] ?? p.participant.name?.[0] ?? "?").toUpperCase()}
                  </div>
                  <span className="text-sm">{name || "Utilisateur"}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
