import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { userRepository } from "@/lib/repositories/user";
import { Badge } from "@/components/ui/badge";
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

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Mon profil</h1>
        <Badge variant="secondary">{user.role}</Badge>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>

      <div className="mt-8">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
