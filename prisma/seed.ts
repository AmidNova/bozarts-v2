import { PrismaClient, UserRole, ProductCategory } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function main() {
  // Use the same bcrypt hash from v1 (password: "password123")
  const password = await bcrypt.hash("password123", 10);

  // ─── Users (migrated from v1 utilisateurs) ────────────────────────

  const clients = await Promise.all([
    prisma.user.create({
      data: {
        name: "Dupont",
        firstName: "Jean",
        email: "jean.dupont@email.com",
        password,
        role: UserRole.CLIENT,
        address: "123 rue de Paris, 75001 Paris",
        phone: "0612345678",
      },
    }),
    prisma.user.create({
      data: {
        name: "Martin",
        firstName: "Sophie",
        email: "sophie.martin@email.com",
        password,
        role: UserRole.CLIENT,
        address: "456 avenue des Champs, 75008 Paris",
        phone: "0623456789",
      },
    }),
    prisma.user.create({
      data: {
        name: "Bernard",
        firstName: "Pierre",
        email: "pierre.bernard@email.com",
        password,
        role: UserRole.CLIENT,
        address: "789 boulevard Saint-Germain, 75006 Paris",
        phone: "0634567890",
      },
    }),
  ]);

  const artisans = await Promise.all([
    prisma.user.create({
      data: {
        name: "Leroy",
        firstName: "Marie",
        email: "marie.leroy@email.com",
        password,
        role: UserRole.ARTISAN,
        description: "Artisan céramiste passionnée depuis 10 ans",
        address: "321 rue de la Poterie, 75011 Paris",
        phone: "0645678901",
      },
    }),
    prisma.user.create({
      data: {
        name: "Petit",
        firstName: "Luc",
        email: "luc.petit@email.com",
        password,
        role: UserRole.ARTISAN,
        description:
          "Sculpteur sur bois spécialisé dans le mobilier artisanal",
        address: "654 avenue du Bois, 75012 Paris",
        phone: "0656789012",
      },
    }),
    prisma.user.create({
      data: {
        name: "Moreau",
        firstName: "Julie",
        email: "julie.moreau@email.com",
        password,
        role: UserRole.ARTISAN,
        description:
          "Créatrice de bijoux en argent et pierres naturelles",
        address: "987 rue des Artisans, 75013 Paris",
        phone: "0667890123",
      },
    }),
  ]);

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      firstName: "Bozarts",
      email: "admin@bozarts.fr",
      password,
      role: UserRole.ADMIN,
    },
  });

  // ─── Products (migrated from v1 produits + images) ─────────────────

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Vase en céramique bleu",
        description:
          "Vase artisanal en céramique émaillée bleue, pièce unique",
        price: 89.99,
        imageUrl: "/images/articles/article1.jpg",
        category: ProductCategory.CERAMIQUE,
        artisanId: artisans[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Service à thé",
        description:
          "Service à thé complet en céramique blanche avec motifs floraux",
        price: 149.99,
        imageUrl: "/images/articles/article2.jpg",
        category: ProductCategory.CERAMIQUE,
        artisanId: artisans[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Table basse en chêne",
        description:
          "Table basse sculptée en chêne massif, design contemporain",
        price: 299.99,
        imageUrl: "/images/articles/article3.jpg",
        category: ProductCategory.MOBILIER,
        artisanId: artisans[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Chaise artisanale",
        description: "Chaise en bois massif avec dossier sculpté",
        price: 199.99,
        imageUrl: "/images/articles/article4.jpg",
        category: ProductCategory.MOBILIER,
        artisanId: artisans[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Collier en argent",
        description: "Collier en argent 925 avec pierre de lune",
        price: 79.99,
        imageUrl: "/images/articles/article5.jpg",
        category: ProductCategory.BIJOUX,
        artisanId: artisans[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Boucles d'oreilles",
        description: "Boucles d'oreilles en argent avec améthyste",
        price: 59.99,
        imageUrl: "/images/articles/article6.jpg",
        category: ProductCategory.BIJOUX,
        artisanId: artisans[2].id,
      },
    }),
    // Additional products uploaded by users in v1
    prisma.product.create({
      data: {
        name: "Peinture forêt",
        description: "Peinture originale représentant une forêt",
        price: 150.0,
        imageUrl: "/images/articles/6832fbc733fc5-peinture_foret.png",
        category: ProductCategory.PEINTURE,
        artisanId: artisans[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Peinture oiseau",
        description: "Peinture originale d'un oiseau",
        price: 120.0,
        imageUrl: "/images/articles/6832fc40bd005-peinture-oiseau.jpg",
        category: ProductCategory.PEINTURE,
        artisanId: artisans[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Nature en octobre",
        description: "Peinture de paysage d'automne",
        price: 180.0,
        imageUrl: "/images/articles/6832fca8080a2-nature_octobre.jpg",
        category: ProductCategory.PEINTURE,
        artisanId: artisans[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Chaise en osier",
        description: "Chaise artisanale en osier tressé",
        price: 95.0,
        imageUrl: "/images/articles/68330d19ab4d6-chaise_osier.jpg",
        category: ProductCategory.MOBILIER,
        artisanId: artisans[2].id,
      },
    }),
  ]);

  // ─── Reviews (all 7 from v1 avis) ─────────────────────────────────

  await Promise.all([
    prisma.review.create({
      data: {
        rating: 5,
        comment:
          "Superbe vase, la qualité est exceptionnelle et les couleurs sont magnifiques !",
        approved: true,
        authorId: clients[0].id,
        targetId: artisans[0].id,
        productId: products[0].id,
        createdAt: new Date("2024-03-15T14:30:00"),
      },
    }),
    prisma.review.create({
      data: {
        rating: 4,
        comment:
          "Très beau vase, un peu plus petit que prévu mais très élégant.",
        approved: true,
        authorId: clients[1].id,
        targetId: artisans[0].id,
        productId: products[0].id,
        createdAt: new Date("2024-03-16T09:15:00"),
      },
    }),
    prisma.review.create({
      data: {
        rating: 5,
        comment:
          "Service à thé magnifique, la finition est parfaite.",
        approved: true,
        authorId: clients[2].id,
        targetId: artisans[0].id,
        productId: products[1].id,
        createdAt: new Date("2024-03-14T16:45:00"),
      },
    }),
    prisma.review.create({
      data: {
        rating: 5,
        comment:
          "Table basse de grande qualité, le bois est magnifique.",
        approved: true,
        authorId: clients[0].id,
        targetId: artisans[1].id,
        productId: products[2].id,
        createdAt: new Date("2024-03-13T11:20:00"),
      },
    }),
    prisma.review.create({
      data: {
        rating: 4,
        comment: "Belle chaise, très confortable et solide.",
        approved: true,
        authorId: clients[1].id,
        targetId: artisans[1].id,
        productId: products[3].id,
        createdAt: new Date("2024-03-12T15:40:00"),
      },
    }),
    prisma.review.create({
      data: {
        rating: 5,
        comment:
          "Collier magnifique, la pierre de lune est superbe.",
        approved: true,
        authorId: clients[2].id,
        targetId: artisans[2].id,
        productId: products[4].id,
        createdAt: new Date("2024-03-11T10:30:00"),
      },
    }),
    prisma.review.create({
      data: {
        rating: 4,
        comment: "Jolies boucles d'oreilles, très élégantes.",
        approved: true,
        authorId: clients[0].id,
        targetId: artisans[2].id,
        productId: products[5].id,
        createdAt: new Date("2024-03-10T13:25:00"),
      },
    }),
  ]);

  // ─── Events (migrated from v1 evenements + images) ─────────────────

  await Promise.all([
    prisma.event.create({
      data: {
        title: "Exposition Artisanale Périgourdine",
        description:
          "Découvrez l'artisanat local du Périgord. Rencontrez les créateurs et admirez leurs œuvres uniques.",
        startDate: new Date("2026-07-15T10:00:00"),
        endDate: new Date("2026-07-20T18:00:00"),
        location: "Place du Marché, Sarlat",
        imageUrl: "/images/evenements/galerie_perigord.jpg",
        creatorId: artisans[1].id,
      },
    }),
    prisma.event.create({
      data: {
        title: "Atelier Sculpture sur Bois",
        description:
          "Participez à un atelier interactif pour apprendre les bases de la sculpture sur bois avec un artisan expert.",
        startDate: new Date("2026-08-10T14:00:00"),
        endDate: new Date("2026-08-10T17:00:00"),
        location: "Atelier de Luc Petit, Paris",
        imageUrl: "/images/evenements/gallerie_sculpture.jpg",
        creatorId: artisans[0].id,
      },
    }),
    prisma.event.create({
      data: {
        title: "Salon des Créateurs Parisiens",
        description:
          "Un événement regroupant les meilleurs artisans et créateurs de Paris. Idéal pour trouver des pièces originales.",
        startDate: new Date("2026-09-20T09:00:00"),
        endDate: new Date("2026-09-22T19:00:00"),
        location: "Porte de Versailles, Paris",
        imageUrl: "/images/evenements/gallerie_paris.jpg",
        creatorId: artisans[0].id,
      },
    }),
  ]);

  // ─── FAQ (all 10 entries from v1) ──────────────────────────────────

  await Promise.all([
    prisma.faqEntry.create({
      data: {
        question: "Comment devenir artisan sur Bozarts ?",
        answerTitle: "Processus d'inscription pour les artisans",
        answerContent:
          "Pour devenir artisan sur Bozarts, il vous suffit de créer un compte en sélectionnant \"Artisan\" comme type de profil lors de l'inscription. Vous devrez ensuite compléter votre profil avec vos informations professionnelles, une description de votre activité et télécharger quelques photos de vos créations. Notre équipe validera votre compte dans un délai de 48h ouvrées.",
        order: 1,
      },
    }),
    prisma.faqEntry.create({
      data: {
        question: "Comment passer commande sur Bozarts ?",
        answerTitle: "Processus de commande",
        answerContent:
          "Pour commander sur Bozarts, parcourez notre galerie de produits et ajoutez les articles souhaités à votre panier. Vous pouvez également contacter directement un artisan pour une commande personnalisée. Une fois vos articles sélectionnés, rendez-vous dans votre panier, vérifiez votre commande et procédez au paiement. Vous recevrez une confirmation par email avec le suivi de votre commande.",
        order: 2,
      },
    }),
    prisma.faqEntry.create({
      data: {
        question: "Quels sont les délais de livraison ?",
        answerTitle: "Délais de livraison",
        answerContent:
          "Les délais de livraison varient selon les artisans et le type de produit. Pour les articles en stock, comptez 3 à 5 jours ouvrés. Pour les créations sur mesure, le délai est indiqué par l'artisan lors de la validation de votre commande. Vous pouvez suivre l'avancement de votre commande dans la section \"Mes transactions\" de votre compte.",
        order: 3,
      },
    }),
    prisma.faqEntry.create({
      data: {
        question: "Quels sont les modes de paiement acceptés ?",
        answerTitle: "Options de paiement",
        answerContent:
          "Bozarts accepte plusieurs modes de paiement sécurisés : carte bancaire (Visa, Mastercard), PayPal, et virement bancaire. Pour les commandes personnalisées importantes, un acompte peut être demandé avant la réalisation. Tous les paiements sont sécurisés et vos informations bancaires ne sont jamais stockées sur notre plateforme.",
        order: 4,
      },
    }),
    prisma.faqEntry.create({
      data: {
        question:
          "Comment contacter un artisan pour une commande personnalisée ?",
        answerTitle: "Commandes personnalisées",
        answerContent:
          "Pour demander une création sur mesure, visitez le profil de l'artisan qui vous intéresse et cliquez sur le bouton \"Contacter l'artisan\" ou \"Commander sur mesure\". Décrivez précisément votre projet, les dimensions souhaitées, matériaux, couleurs, etc. L'artisan vous répondra avec un devis et un délai estimatif. Une fois les détails finalisés, vous pourrez procéder au paiement pour lancer la création.",
        order: 5,
      },
    }),
    prisma.faqEntry.create({
      data: {
        question:
          "Quelle est la politique de retour et remboursement ?",
        answerTitle: "Retours et remboursements",
        answerContent:
          "Si vous n'êtes pas satisfait de votre achat, vous disposez de 14 jours à compter de la réception pour nous signaler votre intention de retour. Les articles doivent être retournés dans leur état d'origine et dans leur emballage. Pour les créations personnalisées, les retours ne sont généralement pas acceptés, sauf en cas de défaut avéré. Contactez notre service client pour plus d'informations sur la procédure de retour.",
        order: 6,
      },
    }),
    prisma.faqEntry.create({
      data: {
        question:
          "Comment devenir vendeur sur Bozarts et quelles sont les commissions ?",
        answerTitle: "Devenir vendeur et commissions",
        answerContent:
          "Pour vendre sur Bozarts, inscrivez-vous comme artisan et complétez votre profil professionnel. Bozarts prélève une commission de 10% sur chaque vente réalisée sur la plateforme. Cette commission comprend les frais de traitement des paiements et l'utilisation de nos services. Les paiements sont versés aux artisans tous les 15 jours, après déduction de la commission. Vous pouvez consulter vos ventes et revenus dans votre espace vendeur.",
        order: 7,
      },
    }),
    prisma.faqEntry.create({
      data: {
        question: "Comment promouvoir mes créations sur Bozarts ?",
        answerTitle: "Promotion de vos créations",
        answerContent:
          "Pour mettre en valeur vos créations, ajoutez des photos de qualité, des descriptions détaillées et utilisez des mots-clés pertinents. Participez activement à la communauté en répondant rapidement aux messages et en publiant régulièrement de nouvelles créations. Bozarts propose également des options de mise en avant payantes comme l'affichage en tête de liste ou la présentation dans notre newsletter mensuelle. Contactez-nous pour plus d'informations sur ces services.",
        order: 8,
      },
    }),
    prisma.faqEntry.create({
      data: {
        question:
          "Comment fonctionne le système d'évaluation des artisans ?",
        answerTitle: "Système d'évaluation",
        answerContent:
          "Après chaque achat, les clients peuvent évaluer l'artisan sur une échelle de 1 à 5 étoiles et laisser un commentaire. Ces évaluations portent sur la qualité du produit, la communication et le respect des délais. La note moyenne est affichée sur le profil de l'artisan. Ce système permet de valoriser les artisans de qualité et d'aider les clients dans leurs choix. Les avis inappropriés peuvent être signalés à notre équipe de modération.",
        order: 9,
      },
    }),
    prisma.faqEntry.create({
      data: {
        question:
          "Comment participer aux événements et salons organisés par Bozarts ?",
        answerTitle: "Événements et salons",
        answerContent:
          "Bozarts organise régulièrement des salons d'artisanat et des expositions physiques pour permettre aux artisans de rencontrer leur public. Les artisans inscrits sur la plateforme sont prioritaires pour participer à ces événements. Pour vous inscrire, rendez-vous dans la section \"Événements\" de votre espace artisan et sélectionnez les événements qui vous intéressent. Les frais de participation et les modalités sont indiqués pour chaque événement.",
        order: 10,
      },
    }),
  ]);

  // ─── CGU (all 10 sections from v1) ────────────────────────────────

  await Promise.all([
    prisma.cguSection.create({
      data: {
        title: "1. Acceptation des conditions",
        content:
          "En accédant et en utilisant le site Bozarts, vous acceptez d'être lié par les présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site...",
        order: 1,
      },
    }),
    prisma.cguSection.create({
      data: {
        title: "2. Description du service",
        content:
          "Bozarts est une plateforme mettant en relation des artisans et des clients pour la vente et l'achat de créations artisanales. Le site permet aux artisans de présenter leurs œuvres et aux clients de les découvrir et de les acquérir.",
        order: 2,
      },
    }),
    prisma.cguSection.create({
      data: {
        title: "3. Inscription et compte utilisateur",
        content:
          "Pour utiliser certaines fonctionnalités du site, vous devez créer un compte. Vous êtes responsable de maintenir la confidentialité de votre compte et de votre mot de passe. Vous acceptez de nous informer immédiatement de toute utilisation non autorisée de votre compte.",
        order: 3,
      },
    }),
    prisma.cguSection.create({
      data: {
        title: "4. Obligations des utilisateurs",
        content:
          "En tant qu'utilisateur, vous vous engagez à :\n- Fournir des informations exactes et complètes lors de l'inscription\n- Ne pas utiliser le site à des fins illégales ou interdites\n- Ne pas perturber le fonctionnement normal du site\n- Respecter les droits de propriété intellectuelle",
        order: 4,
      },
    }),
    prisma.cguSection.create({
      data: {
        title: "5. Propriété intellectuelle",
        content:
          "Tout le contenu présent sur Bozarts (textes, images, logos, etc.) est protégé par les droits de propriété intellectuelle. Toute reproduction ou utilisation non autorisée est strictement interdite.",
        order: 5,
      },
    }),
    prisma.cguSection.create({
      data: {
        title: "6. Transactions et paiements",
        content:
          "Les transactions entre artisans et clients sont gérées par notre plateforme. Les paiements sont sécurisés et traités conformément à notre politique de confidentialité.",
        order: 6,
      },
    }),
    prisma.cguSection.create({
      data: {
        title: "7. Protection des données personnelles",
        content:
          "Nous collectons et traitons vos données personnelles conformément à notre politique de confidentialité. En utilisant notre site, vous acceptez ce traitement.",
        order: 7,
      },
    }),
    prisma.cguSection.create({
      data: {
        title: "8. Limitation de responsabilité",
        content:
          "Bozarts ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation du site ou de l'impossibilité d'y accéder.",
        order: 8,
      },
    }),
    prisma.cguSection.create({
      data: {
        title: "9. Modification des conditions",
        content:
          "Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prennent effet dès leur publication sur le site.",
        order: 9,
      },
    }),
    prisma.cguSection.create({
      data: {
        title: "10. Contact",
        content:
          "Pour toute question concernant ces conditions, veuillez nous contacter via notre formulaire de contact.",
        order: 10,
      },
    }),
  ]);

  console.log("Seed completed successfully!");
  console.log(`Created: ${clients.length} clients, ${artisans.length} artisans, 1 admin`);
  console.log(`Created: ${products.length} products`);
  console.log("Created: 7 reviews, 3 events, 10 FAQ entries, 10 CGU sections");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
