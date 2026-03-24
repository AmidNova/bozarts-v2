import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { messageRepository } from "@/lib/repositories/message";

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { conversations } = await messageRepository.getConversations(session.user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Messages</h1>

      {conversations.length === 0 ? (
        <p className="mt-8 text-center text-muted-foreground">
          Aucun message pour le moment
        </p>
      ) : (
        <div className="mt-6 flex flex-col divide-y">
          {conversations.map((msg) => {
            const correspondent =
              msg.senderId === session.user!.id ? msg.receiver : msg.sender;
            const correspondentName = [correspondent.firstName, correspondent.name]
              .filter(Boolean)
              .join(" ");
            const isUnread = !msg.read && msg.receiverId === session.user!.id;

            return (
              <Link
                key={msg.id}
                href={`/messages/${correspondent.id}`}
                className="flex items-center gap-4 py-4 hover:bg-muted/50 rounded-lg px-2 transition-colors"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {(correspondent.firstName?.[0] ?? correspondent.name?.[0] ?? "?").toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${isUnread ? "font-bold" : "font-medium"}`}>
                      {correspondentName || "Utilisateur"}
                    </p>
                    {isUnread && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {msg.content}
                  </p>
                </div>
                <p className="shrink-0 text-xs text-muted-foreground">
                  {new Date(msg.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
