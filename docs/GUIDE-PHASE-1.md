# Phase 1 : Setup du projet — Guide pas a pas

Ce guide t'explique **pourquoi** on a choisi chaque techno et **comment** tout mettre en place de zero. L'objectif : que tu puisses refaire ce setup seul sur un nouveau projet.

---

## Sommaire

1. [La stack et pourquoi ces choix](#1-la-stack-et-pourquoi-ces-choix)
2. [Prerequis a installer](#2-prerequis-a-installer)
3. [Creer le projet Next.js](#3-creer-le-projet-nextjs)
4. [Installer et configurer Prisma](#4-installer-et-configurer-prisma)
5. [Creer le schema de base de donnees](#5-creer-le-schema-de-base-de-donnees)
6. [Configurer PostgreSQL](#6-configurer-postgresql)
7. [Installer et configurer NextAuth](#7-installer-et-configurer-nextauth)
8. [Creer les auth guards](#8-creer-les-auth-guards)
9. [Ajouter shadcn/ui](#9-ajouter-shadcnui)
10. [Seed de la base](#10-seed-de-la-base)
11. [Lancer le projet](#11-lancer-le-projet)

---

## 1. La stack et pourquoi ces choix

### Next.js 15 (App Router)

**C'est quoi ?** Un framework React qui gere le frontend ET le backend dans un seul projet.

**Pourquoi ?**
- **Server Components** : le HTML est genere cote serveur. La page charge plus vite, le SEO est meilleur, et tu n'envoies pas tout ton JS au navigateur.
- **Server Actions** : tu peux ecrire des fonctions serveur (`"use server"`) appelees directement depuis tes formulaires React. Pas besoin de creer des routes API a la main pour chaque action.
- **App Router** : le systeme de routing par fichiers. Tu crees un fichier `app/products/page.tsx` et tu as automatiquement la route `/products`. Les dossiers entre parentheses `(auth)`, `(dashboard)` sont des "route groups" — ils organisent tes fichiers sans affecter l'URL.
- **En entreprise** : Next.js est le framework React le plus utilise en production. Le maitriser c'est un vrai atout.

### TypeScript

**C'est quoi ?** JavaScript avec des types.

**Pourquoi ?**
- Ton editeur te previent des erreurs AVANT d'executer le code. Exemple : tu passes un `string` la ou il faut un `number`, TypeScript te le dit tout de suite.
- L'autocompletion devient tres precise — tu vois les champs disponibles sur chaque objet.
- Sur un gros projet, ca evite des heures de debug.

### Prisma (ORM)

**C'est quoi ?** Un outil qui te permet de manipuler ta base de donnees avec du TypeScript au lieu d'ecrire du SQL brut.

**Pourquoi Prisma plutot que du SQL brut ou un autre ORM ?**
- Tu definis tes tables dans un fichier `schema.prisma` lisible, et Prisma genere les types TypeScript automatiquement. Quand tu ecris `prisma.user.findMany()`, tu as l'autocompletion sur tous les champs de User.
- Les **migrations** : quand tu modifies ton schema, Prisma genere le SQL de migration. Tu ne risques pas d'oublier un `ALTER TABLE`.
- Les **relations** : tu definis `User` qui a des `Product[]` dans le schema, et Prisma te permet de faire `include: { products: true }` pour charger les produits d'un user en une seule requete.
- **Prisma Studio** : une interface web pour voir et editer tes donnees (`npx prisma studio`).

### PostgreSQL

**C'est quoi ?** Une base de donnees relationnelle (comme MySQL, mais en mieux).

**Pourquoi PostgreSQL plutot que MySQL ou MongoDB ?**
- Plus robuste que MySQL sur les types de donnees, les contraintes, et les transactions.
- Supporte le JSON natif si tu en as besoin un jour, donc tu as le meilleur des deux mondes (relationnel + document).
- C'est le standard en entreprise pour les projets serieux. Toutes les plateformes cloud le supportent (AWS RDS, Supabase, Neon, etc.).
- MongoDB (NoSQL) serait un mauvais choix ici : notre marketplace a beaucoup de relations (user → products → orders → items). Le relationnel est fait pour ca.

### NextAuth v5 (Auth.js)

**C'est quoi ?** Une librairie d'authentification pour Next.js.

**Pourquoi ?**
- Gere le login, les sessions, les JWT, les cookies securises — tout ce que tu ne veux PAS coder toi-meme (trop de failles de securite possibles).
- S'integre avec Prisma via un "adapter" : les sessions et comptes sont stockes en base automatiquement.
- Supporte les providers OAuth (Google, GitHub) et les credentials (email/password). On utilise credentials ici, mais tu peux ajouter Google en 5 lignes plus tard.
- **JWT strategy** : le token est stocke dans un cookie, pas en base. C'est plus performant (pas de requete DB a chaque page).

### Tailwind CSS + shadcn/ui

**Pourquoi Tailwind ?**
- Tu ecris le style directement dans le HTML avec des classes utilitaires (`className="flex gap-4 p-2"`). Pas de fichier CSS separe a maintenir, pas de noms de classes a inventer.
- Le build supprime automatiquement les classes non utilisees — ton CSS final est minuscule.

**Pourquoi shadcn/ui ?**
- C'est PAS une librairie npm. C'est un generateur : quand tu fais `npx shadcn@latest add button`, il copie le code du composant Button directement dans ton projet (`src/components/ui/button.tsx`).
- Tu possedes le code. Tu peux le modifier, le styler, le supprimer. Pas de dependance externe, pas de breaking changes quand la lib se met a jour.
- Les composants sont accessibles (ARIA), bien types, et jolis par defaut.

### Zod (validation)

**C'est quoi ?** Une librairie de validation de donnees avec inference de types TypeScript.

**Pourquoi ?**
- Tu definis un schema une seule fois, et tu obtiens a la fois la validation runtime ET le type TypeScript.
- Exemple : `const schema = z.object({ email: z.string().email() })` — Zod valide les donnees a l'execution, et `z.infer<typeof schema>` te donne le type `{ email: string }`.
- Indispensable pour valider les donnees de formulaires cote serveur (ne jamais faire confiance au client).

### bcryptjs (hachage de mots de passe)

**Pourquoi ?**
- Tu ne stockes JAMAIS un mot de passe en clair en base. `bcrypt.hash("password", 10)` produit un hash irreversible.
- Quand l'utilisateur se connecte, `bcrypt.compare(input, hash)` verifie si le mot de passe correspond sans jamais decoder le hash.
- Le `10` c'est le "salt rounds" — plus c'est haut, plus c'est lent a cracker (mais aussi plus lent a generer).

---

## 2. Prerequis a installer

Avant de commencer, tu dois avoir :

```bash
# Node.js (v18+)
node -v

# npm (vient avec Node)
npm -v

# PostgreSQL
psql --version

# Git
git --version
```

Si tu n'as pas Node : [nodejs.org](https://nodejs.org)
Si tu n'as pas PostgreSQL : `sudo dnf install postgresql-server` (Fedora) ou telecharge-le depuis [postgresql.org](https://www.postgresql.org/download/)

---

## 3. Creer le projet Next.js

```bash
npx create-next-app@latest mon-projet
```

Il va te poser des questions. Reponds :
- TypeScript ? **Yes**
- ESLint ? **Yes**
- Tailwind CSS ? **Yes**
- `src/` directory ? **Yes**
- App Router ? **Yes**
- Import alias ? **Yes** (garde `@/*`)

Ca cree un projet Next.js pret a l'emploi.

```bash
cd mon-projet
```

**Structure generee :**
```
mon-projet/
├── src/
│   ├── app/           ← tes pages (routing par fichier)
│   │   ├── layout.tsx ← le layout global (HTML, body)
│   │   └── page.tsx   ← la page d'accueil (/)
│   └── ...
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 4. Installer et configurer Prisma

### Installation

```bash
# Prisma CLI (dev) + Client (runtime) + Adapter PostgreSQL
npm install prisma --save-dev
npm install @prisma/client @prisma/adapter-pg
```

### Initialisation

```bash
npx prisma init
```

Ca cree :
- `prisma/schema.prisma` — ton schema de base de donnees
- `.env` — tes variables d'environnement (dont DATABASE_URL)
- `prisma.config.ts` — la config Prisma (Prisma 7+)

### Configurer le client Prisma

Ouvre `prisma/schema.prisma` et configure le generateur pour que le client soit genere dans ton code source :

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"  // ← le client sera ici
}

datasource db {
  provider = "postgresql"
}
```

**Pourquoi `output` custom ?** Par defaut Prisma genere le client dans `node_modules`. En le mettant dans `src/generated/prisma`, c'est plus explicite et ca evite des problemes avec certains bundlers.

### Creer le singleton Prisma

Cree le fichier `src/lib/prisma.ts` :

```typescript
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Ce pattern "singleton" empeche de creer plusieurs connexions
// a la DB en mode dev (Next.js recharge les modules a chaque modif)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

**Pourquoi le singleton ?** En dev, Next.js fait du "hot reload" — il recharge tes fichiers a chaque modification. Sans le singleton, chaque rechargement creerait une nouvelle connexion a la DB. Au bout de quelques minutes tu aurais des dizaines de connexions ouvertes et PostgreSQL refuserait les nouvelles.

---

## 5. Creer le schema de base de donnees

Dans `prisma/schema.prisma`, tu definis tes modeles. Voici la logique :

```prisma
// Un enum = un ensemble de valeurs fixes
enum UserRole {
  CLIENT
  ARTISAN
  ADMIN
}

// Un model = une table en base
model User {
  id        String   @id @default(cuid())   // cle primaire, generee auto
  name      String?                          // ? = nullable (optionnel)
  email     String   @unique                 // unique = pas de doublon
  password  String?
  role      UserRole @default(CLIENT)        // valeur par defaut
  createdAt DateTime @default(now())         // date auto a la creation
  updatedAt DateTime @updatedAt              // date auto a chaque modif

  products  Product[] @relation("ArtisanProducts")  // relation 1-N
}

model Product {
  id          String  @id @default(cuid())
  name        String
  price       Decimal @db.Decimal(10, 2)     // prix avec 2 decimales

  artisanId   String                          // cle etrangere
  artisan     User @relation("ArtisanProducts",
    fields: [artisanId], references: [id],
    onDelete: Cascade)                        // si le user est supprime,
                                              // ses produits aussi

  @@index([artisanId])                        // index pour les perfs
}
```

**Les concepts cles :**

| Concept | Syntaxe | A quoi ca sert |
|---------|---------|----------------|
| Cle primaire | `@id @default(cuid())` | Identifiant unique, genere auto |
| Nullable | `String?` | Le champ peut etre vide |
| Unique | `@unique` | Pas de doublon possible |
| Relation 1-N | `products Product[]` + `artisan User` | Un artisan a plusieurs produits |
| Cle etrangere | `fields: [artisanId], references: [id]` | Lie Product a User |
| Cascade | `onDelete: Cascade` | Suppression en cascade |
| Index | `@@index([artisanId])` | Accelere les requetes sur ce champ |

**Pour NextAuth**, tu dois aussi ajouter les modeles `Account`, `Session` et `VerificationToken` — NextAuth en a besoin pour gerer les sessions. Copie-les depuis la doc NextAuth Prisma adapter.

---

## 6. Configurer PostgreSQL

### Creer la base et l'utilisateur

```bash
# Se connecter en tant que superuser postgres
sudo -u postgres psql

# Dans le prompt psql :
CREATE USER bozarts WITH PASSWORD 'bozarts_secret';
CREATE DATABASE bozarts OWNER bozarts;
ALTER USER bozarts CREATEDB;  -- necessaire pour les migrations Prisma
\q
```

**Pourquoi `CREATEDB` ?** Prisma utilise une "shadow database" pendant les migrations : il cree une DB temporaire pour verifier que la migration est correcte avant de l'appliquer a ta vraie DB. Sans ce droit, `prisma migrate dev` echoue.

### Configurer le .env

```env
DATABASE_URL="postgresql://bozarts:bozarts_secret@localhost:5432/bozarts?schema=public"
```

Format : `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA`

### Lancer la premiere migration

```bash
npx prisma migrate dev --name init
```

Ca fait 3 choses :
1. Genere le SQL de creation des tables dans `prisma/migrations/`
2. Execute ce SQL sur ta base PostgreSQL
3. Regenere le client Prisma (les types TypeScript)

**Tu peux verifier** en ouvrant Prisma Studio :
```bash
npx prisma studio
```
Ca ouvre une interface web sur `localhost:5555` ou tu vois toutes tes tables.

---

## 7. Installer et configurer NextAuth

### Installation

```bash
npm install next-auth@beta @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs
```

- `next-auth@beta` : la v5 est encore en beta (mars 2026), mais c'est la version recommandee pour Next.js 15.
- `@auth/prisma-adapter` : le pont entre NextAuth et Prisma.
- `bcryptjs` : pour hasher les mots de passe.

### Variables d'environnement

Ajoute dans `.env` :

```env
AUTH_SECRET="genere-avec-openssl-rand-base64-32"
AUTH_URL="http://localhost:3001"
```

Pour generer le secret :
```bash
openssl rand -base64 32
```

**Pourquoi AUTH_SECRET ?** NextAuth l'utilise pour signer et chiffrer les JWT. Sans ca, n'importe qui pourrait forger un faux token de session.

### Creer la config NextAuth

Cree `src/lib/auth.ts` :

```typescript
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // L'adapter dit a NextAuth d'utiliser Prisma pour stocker
  // les comptes et sessions
  adapter: PrismaAdapter(prisma),

  // JWT = le token est dans un cookie, pas en base
  // Plus performant (pas de requete DB a chaque page)
  session: { strategy: "jwt" },

  // Page de login custom (sinon NextAuth utilise une page generique)
  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      // Cette fonction est appelee quand un user tente de se connecter
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null; // null = login refuse
        }

        // Cherche le user en base
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        // Compare le mot de passe saisi avec le hash en base
        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        // Retourne les infos a mettre dans le token JWT
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // Quand le JWT est cree ou rafraichi, on y ajoute le role et l'id
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    // Quand on lit la session cote serveur, on expose le role et l'id
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
```

**Le flux de login explique :**
1. L'user remplit le formulaire (email + mot de passe)
2. NextAuth appelle `authorize()` avec les credentials
3. On cherche le user en base, on compare le hash
4. Si OK, NextAuth cree un JWT avec les infos retournees
5. Le JWT est stocke dans un cookie HttpOnly (le navigateur ne peut pas le lire en JS — securite)
6. A chaque requete, NextAuth decode le cookie et met la session a disposition

### Creer la route API NextAuth

Cree `src/app/api/auth/[...nextauth]/route.ts` :

```typescript
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

**`[...nextauth]`** c'est un "catch-all route" : ca capture `/api/auth/signin`, `/api/auth/signout`, `/api/auth/callback`, etc. NextAuth a besoin de ces routes pour fonctionner.

---

## 8. Creer les auth guards

Les auth guards sont des fonctions utilitaires qui verifient l'authentification et le role dans tes server actions.

Cree `src/lib/auth-guard.ts` :

```typescript
import { auth } from "@/lib/auth";

type AuthUser = { id: string; role: string };

type AuthResult =
  | { authenticated: true; user: AuthUser }
  | { authenticated: false; error: string };

// Verifie que l'utilisateur est connecte
export async function requireAuth(): Promise<AuthResult> {
  const session = await auth();
  const id = session?.user?.id;
  const role = session?.user?.role;

  if (!id || !role) {
    return { authenticated: false, error: "Non authentifie" };
  }

  return { authenticated: true, user: { id, role } };
}

// Verifie que l'utilisateur est admin
export async function requireAdmin(): Promise<AuthResult> {
  const result = await requireAuth();
  if (!result.authenticated) return result;

  if (result.user.role !== "ADMIN") {
    return { authenticated: false, error: "Reserve aux administrateurs" };
  }

  return result;
}

// Verifie que l'utilisateur est artisan
export async function requireArtisan(): Promise<AuthResult> {
  const result = await requireAuth();
  if (!result.authenticated) return result;

  if (result.user.role !== "ARTISAN") {
    return { authenticated: false, error: "Reserve aux artisans" };
  }

  return result;
}
```

**Pourquoi ce pattern ?** Au lieu de repeter `const session = await auth(); if (!session) ...` dans chaque server action, tu fais :

```typescript
export async function deleteProduct(id: string) {
  const auth = await requireAdmin();
  if (!auth.authenticated) return fail(auth.error);
  // ... le reste
}
```

Le type `AuthResult` est un **discriminated union** : TypeScript sait que si `authenticated` est `true`, alors `user` existe. Tu n'as pas besoin de verifier `user` apres le `if`.

---

## 9. Ajouter shadcn/ui

### Initialisation

```bash
npx shadcn@latest init
```

Ca configure shadcn dans ton projet (cree `components.json`, ajuste `tailwind.config`).

### Ajouter des composants

```bash
# Ajoute les composants un par un selon tes besoins
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add badge
npx shadcn@latest add dialog
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add separator
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
npx shadcn@latest add sheet
```

Chaque commande copie le composant dans `src/components/ui/`. Tu peux ensuite l'importer :

```typescript
import { Button } from "@/components/ui/button";
```

---

## 10. Seed de la base

Le seed remplit ta base avec des donnees de test. Cree `prisma/seed.ts` :

```typescript
import { PrismaClient, UserRole } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function main() {
  // Hash un mot de passe commun pour tous les users de test
  const password = await bcrypt.hash("password123", 10);

  // Cree les users
  await prisma.user.create({
    data: {
      name: "Admin",
      firstName: "Bozarts",
      email: "admin@bozarts.fr",
      password,
      role: UserRole.ADMIN,
    },
  });

  // ... autres users, produits, etc.

  console.log("Seed completed!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
```

**Configure le seed dans `prisma.config.ts`** (Prisma 7+) :

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",  // ← ajoute cette ligne
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

Puis lance :

```bash
npx prisma db seed
```

---

## 11. Lancer le projet

```bash
npm run dev -- -p 3001
```

Ouvre `http://localhost:3001`. C'est parti.

---

## Recap : structure du projet apres Phase 1

```
mon-projet/
├── prisma/
│   ├── schema.prisma        ← ton schema de DB
│   ├── seed.ts               ← donnees de test
│   └── migrations/           ← historique des migrations SQL
├── prisma.config.ts           ← config Prisma 7
├── src/
│   ├── generated/prisma/      ← client Prisma genere (ne pas toucher)
│   ├── app/
│   │   ├── layout.tsx         ← layout global
│   │   ├── page.tsx           ← page d'accueil
│   │   └── api/auth/[...nextauth]/route.ts  ← routes NextAuth
│   ├── lib/
│   │   ├── prisma.ts          ← singleton Prisma
│   │   ├── auth.ts            ← config NextAuth
│   │   └── auth-guard.ts      ← guards d'authentification
│   └── components/ui/         ← composants shadcn/ui
├── .env                       ← variables d'environnement (NE PAS COMMIT)
└── package.json
```

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de dev |
| `npx prisma migrate dev --name xxx` | Cree et applique une migration |
| `npx prisma db push` | Push le schema sans migration (prototypage) |
| `npx prisma db seed` | Remplit la base avec les donnees de test |
| `npx prisma studio` | Interface web pour voir/editer les donnees |
| `npx prisma generate` | Regenere le client (apres modif du schema) |
| `npx shadcn@latest add xxx` | Ajoute un composant shadcn/ui |

---

## Erreurs courantes

**"permission denied to create database"** lors de `prisma migrate dev`
→ `ALTER USER ton_user CREATEDB;` dans psql

**"Port 3000 is already in use"**
→ `npm run dev -- -p 3001` (ou un autre port)

**Les types Prisma ne sont pas a jour apres modif du schema**
→ `npx prisma generate` pour regenerer le client

**"NEXTAUTH_SECRET is not set"**
→ Ajoute `AUTH_SECRET` dans ton `.env` (genere avec `openssl rand -base64 32`)
