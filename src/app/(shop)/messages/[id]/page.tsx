import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { messageRepository } from "@/lib/repositories/message";
import { MessageForm } from "@/components/messages/MessageForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ConversationPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id: correspondentId } = await params;
  const userId = session.user.id;

  const [messages, correspondent] = await Promise.all([
    messageRepository.getThread(userId, correspondentId),
    messageRepository.getCorrespondent(correspondentId),
  ]);

  if (!correspondent) notFound();

  const correspondentName = [correspondent.firstName, correspondent.name]
    .filter(Boolean)
    .join(" ") || "Utilisateur";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/messages" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Messages
        </Link>
        <h1 className="text-xl font-bold">{correspondentName}</h1>
      </div>

      <div className="flex flex-col gap-3">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Debut de la conversation
          </p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === userId;
            return (
              <div
                key={msg.id}
                className={`max-w-[75%] rounded-lg p-3 ${
                  isMine
                    ? "self-end bg-primary text-primary-foreground"
                    : "self-start bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className={`mt-1 text-xs ${isMine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {new Date(msg.createdAt).toLocaleString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-6">
        <MessageForm receiverId={correspondentId} />
      </div>
    </div>
  );
}
