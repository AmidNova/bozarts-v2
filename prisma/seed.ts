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
  const password = await bcrypt.hash("password123", 10);

  // ─── Users ──────────────────────────────────────────────────────
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
        description: "Artisan ceramiste passionnee depuis 10 ans",
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
          "Sculpteur sur bois specialise dans le mobilier artisanal",
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
          "Creatrice de bijoux en argent et pierres naturelles",
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

  // ─── Products ───────────────────────────────────────────────────
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Vase en ceramique bleu",
        description:
          "Vase artisanal en ceramique emaillee bleue, piece unique",
        price: 89.99,
        category: ProductCategory.CERAMIQUE,
        artisanId: artisans[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Service a the",
        description:
          "Service a the complet en ceramique blanche avec motifs floraux",
        price: 149.99,
        category: ProductCategory.CERAMIQUE,
        artisanId: artisans[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Table basse en chene",
        description:
          "Table basse sculptee en chene massif, design contemporain",
        price: 299.99,
        category: ProductCategory.MOBILIER,
        artisanId: artisans[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Chaise artisanale",
        description: "Chaise en bois massif avec dossier sculpte",
        price: 199.99,
        category: ProductCategory.MOBILIER,
        artisanId: artisans[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Collier en argent",
        description: "Collier en argent 925 avec pierre de lune",
        price: 79.99,
        category: ProductCategory.BIJOUX,
        artisanId: artisans[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Boucles d'oreilles",
        description: "Boucles d'oreilles en argent avec amethyste",
        price: 59.99,
        category: ProductCategory.BIJOUX,
        artisanId: artisans[2].id,
      },
    }),
  ]);

  // ─── Reviews ────────────────────────────────────────────────────
  await Promise.all([
    prisma.review.create({
      data: {
        rating: 5,
        comment: "Superbe vase, la qualite est exceptionnelle !",
        approved: true,
        authorId: clients[0].id,
        targetId: artisans[0].id,
        productId: products[0].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 4,
        comment: "Tres beau vase, un peu plus petit que prevu.",
        approved: true,
        authorId: clients[1].id,
        targetId: artisans[0].id,
        productId: products[0].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 5,
        comment: "Table basse de grande qualite, le bois est magnifique.",
        approved: true,
        authorId: clients[0].id,
        targetId: artisans[1].id,
        productId: products[2].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 5,
        comment: "Collier magnifique, la pierre de lune est superbe.",
        approved: true,
        authorId: clients[2].id,
        targetId: artisans[2].id,
        productId: products[4].id,
      },
    }),
  ]);

  // ─── Events ─────────────────────────────────────────────────────
  await Promise.all([
    prisma.event.create({
      data: {
        title: "Exposition Artisanale Perigourdine",
        description:
          "Decouvrez l'artisanat local du Perigord. Rencontrez les createurs.",
        startDate: new Date("2026-07-15T10:00:00"),
        endDate: new Date("2026-07-20T18:00:00"),
        location: "Place du Marche, Sarlat",
        creatorId: artisans[1].id,
      },
    }),
    prisma.event.create({
      data: {
        title: "Atelier Sculpture sur Bois",
        description:
          "Participez a un atelier interactif pour apprendre la sculpture sur bois.",
        startDate: new Date("2026-08-10T14:00:00"),
        endDate: new Date("2026-08-10T17:00:00"),
        location: "Atelier de Luc Petit, Paris",
        creatorId: artisans[0].id,
      },
    }),
    prisma.event.create({
      data: {
        title: "Salon des Createurs Parisiens",
        description:
          "Un evenement regroupant les meilleurs artisans et createurs de Paris.",
        startDate: new Date("2026-09-20T09:00:00"),
        endDate: new Date("2026-09-22T19:00:00"),
        location: "Porte de Versailles, Paris",
        creatorId: artisans[0].id,
      },
    }),
  ]);

  // ─── FAQ ────────────────────────────────────────────────────────
  await Promise.all([
    prisma.faqEntry.create({
      data: {
        question: "Comment devenir artisan sur Bozarts ?",
        answerTitle: "Processus d'inscription pour les artisans",
        answerContent:
          "Creez un compte en selectionnant 'Artisan' lors de l'inscription. Completez votre profil avec vos informations professionnelles.",
        order: 1,
      },
    }),
    prisma.faqEntry.create({
      data: {
        question: "Comment passer commande sur Bozarts ?",
        answerTitle: "Processus de commande",
        answerContent:
          "Parcourez notre galerie, ajoutez les articles a votre panier et procedez au paiement.",
        order: 2,
      },
    }),
    prisma.faqEntry.create({
      data: {
        question: "Quels sont les delais de livraison ?",
        answerTitle: "Delais de livraison",
        answerContent:
          "Les delais varient selon les artisans. Articles en stock: 3-5 jours ouvres. Creations sur mesure: delai indique par l'artisan.",
        order: 3,
      },
    }),
  ]);

  // ─── CGU ────────────────────────────────────────────────────────
  await Promise.all([
    prisma.cguSection.create({
      data: {
        title: "1. Acceptation des conditions",
        content:
          "En accedant et en utilisant le site Bozarts, vous acceptez d'etre lie par les presentes conditions generales d'utilisation.",
        order: 1,
      },
    }),
    prisma.cguSection.create({
      data: {
        title: "2. Description du service",
        content:
          "Bozarts est une plateforme mettant en relation des artisans et des clients pour la vente et l'achat de creations artisanales.",
        order: 2,
      },
    }),
    prisma.cguSection.create({
      data: {
        title: "3. Inscription et compte utilisateur",
        content:
          "Pour utiliser certaines fonctionnalites du site, vous devez creer un compte. Vous etes responsable de maintenir la confidentialite de votre compte.",
        order: 3,
      },
    }),
  ]);

  console.log("Seed completed successfully!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
