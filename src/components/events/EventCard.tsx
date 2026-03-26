import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
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
    <Link href={`/events/${event.id}`} className="group">
      <Card className="h-full transition-shadow group-hover:shadow-md">
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl bg-muted">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Evenement
            </div>
          )}
          {isOngoing && (
            <Badge className="absolute right-2 top-2">En cours</Badge>
          )}
        </div>
        <CardContent className="flex flex-col gap-1">
          <h3 className="line-clamp-1 font-medium">{event.title}</h3>
          <p className="text-xs text-muted-foreground">
            {formatDate(event.startDate, "long")}
          </p>
          <p className="text-xs text-muted-foreground">{event.location}</p>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">par {creatorName}</p>
            <p className="text-xs text-muted-foreground">
              {pluralize(event._count.participants, "participant")}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
