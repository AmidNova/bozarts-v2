import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatFullName, pluralize } from "@/lib/format";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    imageUrl: string | null;
    creator: {
      id: string;
      name: string | null;
      firstName: string | null;
    };
    _count: { participants: number };
  };
}

export function EventCard({ event }: EventCardProps) {
  const creatorName = formatFullName(event.creator.firstName, event.creator.name);
  const isOngoing = new Date() >= event.startDate && new Date() <= event.endDate;

  return (
    <Link
      href={`/events/${event.id}`}
      className="group overflow-hidden rounded-xl bg-white shadow-md transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-[200px] w-full object-cover"
          />
        ) : (
          <div className="flex h-[200px] items-center justify-center bg-muted text-muted-foreground">
            Evenement
          </div>
        )}
        {isOngoing && (
          <Badge className="absolute right-2 top-2">En cours</Badge>
        )}
      </div>

      {/* Contenu */}
      <div className="p-5">
        <h3 className="mb-2 text-lg font-semibold text-primary">
          {event.title}
        </h3>
        <p className="mb-1 text-sm text-muted-foreground">
          {formatDate(event.startDate, "long")}
        </p>
        <p className="mb-1 text-sm text-muted-foreground">{event.location}</p>
        <p className="text-sm italic text-muted-foreground">par {creatorName}</p>
        <p className="mt-2 text-sm font-bold text-primary">
          {pluralize(event._count.participants, "participant")}
        </p>
      </div>
    </Link>
  );
}
