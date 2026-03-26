import { notFound } from "next/navigation";
import { userRepository } from "@/lib/repositories/user";
import { formatDate, formatFullName } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRoleBadge, UserStatusBadge } from "@/components/ui/StatusBadge";
import { UserActions } from "@/components/admin/UserActions";
import { Separator } from "@/components/ui/separator";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await userRepository.findById(id);

  if (!user) notFound();

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            {formatFullName(user.firstName, user.name) || user.email}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <UserRoleBadge value={user.role} />
            <UserStatusBadge value={user.status} />
          </div>
        </div>
        <UserActions
          userId={user.id}
          currentStatus={user.status}
          currentRole={user.role}
        />
      </div>

      <Separator className="my-6" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Informations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Email :</span>{" "}
              {user.email}
            </p>
            <p>
              <span className="text-muted-foreground">Telephone :</span>{" "}
              {user.phone ?? "-"}
            </p>
            <p>
              <span className="text-muted-foreground">Adresse :</span>{" "}
              {user.address ?? "-"}
            </p>
            <p>
              <span className="text-muted-foreground">Inscription :</span>{" "}
              {formatDate(user.createdAt)}
            </p>
          </CardContent>
        </Card>

        {user.description && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{user.description}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
