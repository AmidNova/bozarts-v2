import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { userRepository } from "@/lib/repositories/user";
import { orderRepository } from "@/lib/repositories/order";
import { reviewRepository } from "@/lib/repositories/review";

export default async function AdminDashboardPage() {
  const [userCounts, orderStats, pendingReviews] = await Promise.all([
    userRepository.countByRole(),
    orderRepository.stats(),
    reviewRepository.findPendingReviews(),
  ]);

  const stats = [
    { label: "Utilisateurs", value: userCounts.total },
    { label: "Artisans actifs", value: userCounts.artisans },
    { label: "Commandes totales", value: orderStats.totalOrders },
    { label: "Commandes en attente", value: orderStats.pendingOrders },
    {
      label: "Revenus",
      value: new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(orderStats.revenue),
    },
    { label: "Avis en attente", value: pendingReviews.length },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
      <p className="mt-1 text-muted-foreground">
        Vue d&apos;ensemble de la plateforme
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
