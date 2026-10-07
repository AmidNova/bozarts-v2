import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { userRepository } from "@/lib/repositories/user";
import { formatFullName } from "@/lib/format";
import { UserRoleBadge } from "@/components/ui/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await userRepository.findById(session.user.id);
  if (!user) {
    redirect("/login");
  }

  const displayName = formatFullName(user.firstName, user.name) || user.email;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Mon profil"
        subtitle={user.email}
        actions={<UserRoleBadge value={user.role} />}
      />

      <div className="mt-8">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
