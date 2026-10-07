# Bozarts v2 — Documentation Technique

## Vue d'ensemble

Bozarts v2 est une marketplace artisanale permettant aux artisans de vendre leurs creations et aux clients de les acheter. L'application inclut un systeme de commandes, un panier, des avis, une messagerie, et des evenements.

---

## Stack technique

| Technologie | Version | Role |
|---|---|---|
| Next.js | 16.2.1 | Framework full-stack (App Router, Server Components, Server Actions) |
| React | 19 | UI library |
| TypeScript | 5.x | Typage statique |
| Prisma | 7.5 | ORM (PostgreSQL, adapter `@prisma/adapter-pg`) |
| NextAuth.js | 5.x | Authentification (Credentials provider, JWT) |
| Zod | 4.x | Validation de schemas |
| Base UI | 1.3 | Composants UI (anciennement MUI Base) |
| CVA | 0.7 | Class Variance Authority pour les variants de composants |
| Tailwind CSS | 4.x | Styling utilitaire |
| bcryptjs | 3.x | Hachage de mots de passe |
| Stripe | 20.x | Paiement (Checkout + webhook) |
| Vitest | 4.x | Tests unitaires et d'integration |
| Playwright | 1.58 | Tests end-to-end |

---

## Architecture

### Structure du projet

```
src/
├── app/                        # App Router (pages et routes)
│   ├── (auth)/                 # Route group: authentification
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (shop)/                 # Route group: pages publiques/client
│   │   ├── products/           # Catalogue produits
│   │   ├── artisans/           # Annuaire artisans
│   │   ├── cart/               # Panier
│   │   ├── orders/             # Commandes client
│   │   ├── profile/            # Profil utilisateur
│   │   ├── messages/           # Messagerie
│   │   └── events/             # Evenements
│   ├── (dashboard)/            # Route group: espace artisan et admin (auth required)
│   │   ├── admin/              # Panel admin (users, products, orders, events, reviews, cgu, faq)
│   │   ├── my-products/        # CRUD produits artisan
│   │   ├── my-orders/          # Commandes recues
│   │   └── my-events/          # CRUD evenements
│   ├── actions/                # Server Actions
│   ├── api/                    # API REST routes
│   ├── layout.tsx              # Layout racine
│   └── page.tsx                # Page d'accueil
├── components/
│   ├── ui/                     # Composants Base UI wrappés (Button, Card, etc.)
│   ├── products/               # Composants produits
│   ├── orders/                 # Composants commandes
│   ├── cart/                   # Composants panier
│   ├── reviews/                # Composants avis
│   ├── messages/               # Composants messagerie
│   ├── events/                 # Composants evenements
│   ├── profile/                # Composants profil
│   ├── admin/                  # Composants du panel admin
│   ├── Header.tsx              # En-tete (Server Component)
│   ├── Footer.tsx
│   ├── MobileNav.tsx           # Navigation mobile (Client Component)
│   ├── PageHeader.tsx          # Titre de page + actions
│   ├── EmptyState.tsx          # Etat vide des listes
│   └── SearchBar.tsx           # Barre de recherche generique
├── lib/
│   ├── repositories/           # Couche d'acces aux donnees
│   ├── schemas/                # Schemas Zod de validation
│   ├── auth.ts                 # Configuration NextAuth
│   ├── auth-guard.ts           # Guards d'authentification
│   ├── action-result.ts        # Type ActionResult<T>
│   ├── constants.ts            # Constantes metier
│   ├── format.ts               # Formatage (monnaie, dates, noms, pluriels, etoiles)
│   ├── prisma.ts               # Instance Prisma singleton
│   ├── stripe.ts               # Client Stripe paresseux (getStripe)
│   └── utils.ts                # Utilitaires (cn)
├── generated/prisma/           # Client Prisma genere
└── types/
    └── next-auth.d.ts          # Extension des types NextAuth

tests/integration/              # Tests d'integration (PostgreSQL reel)
e2e/                            # Tests end-to-end Playwright
```

### Patterns architecturaux

#### 1. Repository Pattern

Chaque entite a un repository dans `src/lib/repositories/` qui encapsule les requetes Prisma :

- `cart.ts` — Gestion du panier (findByUserId, addItem, updateQuantity, removeItem, clear, countItems)
- `event.ts` — CRUD evenements, inscription/desinscription
- `message.ts` — Envoi, conversations, threads, messages non lus
- `order.ts` — Creation depuis panier (transactionnelle), suivi de statut
- `product.ts` — CRUD produits avec filtres, recherche, pagination
- `review.ts` — Creation, approbation, verification de doublon
- `user.ts` — Profil, annuaire artisans, profil public

#### 2. Server Actions + ActionResult

Toutes les mutations passent par des Server Actions dans `src/app/actions/`. Chaque action retourne un `ActionResult<T>` :

```ts
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
```

Actions disponibles :
- `auth.ts` — register (inscription + hash bcrypt 12 rounds)
- `cart.ts` — addToCart, updateCartQuantity, removeFromCart, clearCart
- `event.ts` — createEvent, registerForEvent, unregisterFromEvent
- `message.ts` — sendMessage
- `order.ts` — createOrder, updateOrderStatus, cancelOrder
- `product.ts` — createProduct, updateProduct, deleteProduct
- `profile.ts` — updateProfile
- `review.ts` — createReview

#### 3. Schema Validation (Zod)

Chaque entite a ses schemas dans `src/lib/schemas/` :
- `auth.ts` — LoginSchema, RegisterSchema (avec refine pour confirmation mot de passe)
- `cart.ts` — AddToCartSchema, UpdateCartQuantitySchema
- `event.ts` — CreateEventSchema (avec refine endDate > startDate), EventFilterSchema
- `message.ts` — SendMessageSchema
- `order.ts` — CreateOrderSchema, UpdateOrderStatusSchema, OrderFilterSchema
- `product.ts` — CreateProductSchema, UpdateProductSchema, ProductFilterSchema
- `profile.ts` — UpdateProfileSchema
- `review.ts` — CreateReviewSchema

#### 4. Formulaires (useActionState)

Les formulaires client utilisent le hook React 19 `useActionState` pour gerer l'etat des soumissions avec feedback utilisateur (erreurs, loading, succes).

---

## Modele de donnees

### Entites principales

| Modele | Description |
|---|---|
| **User** | Utilisateur (CLIENT, ARTISAN, ADMIN). Champs: name, firstName, email, password, role, status, description, address, phone, image |
| **Product** | Produit artisanal. Categories: CERAMIQUE, MOBILIER, BIJOUX, TEXTILE, PEINTURE, SCULPTURE, AUTRE. Prix Decimal(10,2) |
| **Order** | Commande. Statuts: PENDING → CONFIRMED → SHIPPED → DELIVERED ou CANCELLED |
| **OrderItem** | Ligne de commande (quantity, unitPrice) |
| **CartItem** | Article dans le panier (userId + productId unique) |
| **Review** | Avis sur un produit (rating 1-5, comment, approved). Lie a un auteur, un artisan cible, et un produit |
| **Message** | Message entre utilisateurs (subject, content, read) |
| **Event** | Evenement organise par un artisan (title, description, dates, location) |
| **EventParticipant** | Inscription a un evenement (eventId + participantId unique) |
| **CguSection** | Sections CGU (admin) |
| **FaqEntry** | Entrees FAQ (admin) |

### Relations cles

- User 1→N Product (artisan)
- User 1→N Order (client)
- User 1→N Review (auteur et cible)
- User 1→N Message (envoyeur et destinataire)
- User 1→N Event (createur)
- User N→N Event (via EventParticipant)
- Product 1→N Review
- Product 1→N CartItem
- Order 1→N OrderItem → Product

---

## Authentification et autorisations

### Configuration NextAuth

- **Provider** : Credentials (email + mot de passe)
- **Strategie** : JWT (pas de session en BDD)
- **Callbacks JWT** : Injection de `role` et `id` dans le token
- **Callbacks Session** : Exposition de `role` et `id` dans `session.user`
- **Hash** : bcryptjs avec 12 rounds

### Guards

- `requireAuth()` — Verifie l'authentification, retourne `{ authenticated, user: { id, role } }`
- `requireArtisan()` — Verifie authentification + role ARTISAN
- `requireAdmin()` — Verifie authentification + role ADMIN

### Protections par route

| Route Group | Protection |
|---|---|
| `(auth)/*` | Pages publiques (login, register) |
| `(shop)/*` | Mixte (certaines pages redirigent vers `/login` si non authentifie) |
| `(dashboard)/*` | Layout protege — redirect vers `/login` si non authentifie |
| `(dashboard)/admin/*` | Layout admin — redirect vers `/login` si non authentifie, vers `/` si role different d'ADMIN |
| `my-events/create` | Verification role ARTISAN dans la page |

---

## Routes de l'application (29 routes)

### Pages publiques

| Route | Type | Description |
|---|---|---|
| `/` | Server | Page d'accueil |
| `/products` | Server | Catalogue avec recherche, filtres categorie, pagination |
| `/products/[id]` | Server | Detail produit, avis, formulaire d'avis, bouton contact artisan |
| `/artisans` | Server | Annuaire des artisans avec pagination |
| `/artisans/[id]` | Server | Profil public artisan avec produits et note moyenne |
| `/events` | Server | Liste des evenements a venir |
| `/events/[id]` | Server | Detail evenement avec inscription/desinscription |
| `/login` | Client | Formulaire de connexion |
| `/register` | Client | Formulaire d'inscription (choix role CLIENT/ARTISAN) |

### Pages client authentifie

| Route | Type | Description |
|---|---|---|
| `/cart` | Server | Panier avec modification quantites et checkout |
| `/orders` | Server | Historique commandes avec filtre statut et pagination |
| `/orders/[id]` | Server | Detail commande avec bouton annulation |
| `/profile` | Server | Edition du profil utilisateur |
| `/messages` | Server | Boite de reception (conversations groupees par correspondant) |
| `/messages/[id]` | Server | Fil de discussion avec un correspondant |

### Pages artisan (dashboard)

| Route | Type | Description |
|---|---|---|
| `/my-products` | Server | Liste des produits de l'artisan |
| `/my-products/new` | Server | Creation de produit |
| `/my-products/[id]/edit` | Server | Edition de produit |
| `/my-orders` | Server | Commandes recues avec mise a jour de statut |
| `/my-orders/[id]` | Server | Detail d'une commande recue |
| `/my-events` | Server | Evenements crees par l'artisan |
| `/my-events/create` | Server | Creation d'evenement |

### API REST

| Route | Methodes | Description |
|---|---|---|
| `/api/auth/[...nextauth]` | GET, POST | Endpoints NextAuth |
| `/api/products` | GET | Liste produits (filtrable) |
| `/api/products/[id]` | GET | Detail produit |
| `/api/orders` | GET | Commandes de l'utilisateur |
| `/api/cart` | GET | Contenu du panier |
| `/api/users/[id]` | GET | Profil utilisateur |

---

## Composants UI

### Composants Base UI wrappés (`src/components/ui/`)

Tous basés sur `@base-ui/react` avec le pattern `render` prop (pas `asChild`) :

- `badge.tsx` — Badge avec variants (default, secondary, destructive, outline)
- `button.tsx` — Bouton avec variants et tailles (CVA)
- `card.tsx` — Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- `input.tsx` — Champ de saisie
- `label.tsx` — Label de formulaire
- `separator.tsx` — Separateur horizontal
- `sheet.tsx` — Sheet (drawer lateral)
- `StatusBadge.tsx` — Badges de statut (commande, role, statut utilisateur, stock)
- `table.tsx` — Table, TableHeader, TableBody, TableRow, TableHead, TableCell
- `textarea.tsx` — Zone de texte

### Composants metier

| Composant | Props | Description |
|---|---|---|
| `ProductCard` | product | Carte produit avec image, categorie, artisan, prix |
| `ProductGrid` | products[] | Grille responsive de ProductCards |
| `ProductForm` | initialData? | Formulaire creation/edition produit |
| `AddToCartButton` | productId, inStock | Bouton ajout au panier |
| `SearchBar` | — | Barre de recherche produits |
| `CategoryFilter` | — | Filtre par categorie |
| `Pagination` | page, totalPages | Navigation paginee |
| `CartItemRow` | item | Ligne panier avec +/- quantite |
| `CheckoutForm` | subtotal, shipping, total | Resume et validation commande |
| `OrderStatusBadge` | status | Badge colore selon statut |
| `OrderStatusFilter` | — | Filtre par statut de commande |
| `UpdateStatusForm` | orderId, currentStatus | Transitions de statut artisan |
| `CancelOrderButton` | orderId | Bouton annulation commande |
| `ProfileForm` | user | Formulaire edition profil |
| `ReviewForm` | productId | Formulaire de creation d'avis |
| `MessageForm` | receiverId | Formulaire d'envoi de message |
| `EventCard` | event | Carte evenement |
| `CreateEventForm` | — | Formulaire creation evenement |
| `RegisterButton` | eventId, isRegistered | Inscription/desinscription evenement |

---

## Constantes metier

```ts
SHIPPING_FEE = 10          // Frais de livraison (EUR)
COMMISSION_RATE = 0.1      // Commission plateforme (10%)
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100
REVIEW_RATING_MIN = 1
REVIEW_RATING_MAX = 5
CART_QUANTITY_MIN = 1
CART_QUANTITY_MAX = 99
```

---

## Regles metier

1. **Avis** : Un utilisateur ne peut laisser qu'un seul avis par produit. Les avis ne sont visibles qu'apres approbation (`approved: true`). L'artisan ne peut pas noter ses propres produits.

2. **Commandes** : Creees de maniere transactionnelle a partir du panier. Le panier est vide apres creation. Transitions de statut : PENDING → CONFIRMED → SHIPPED → DELIVERED. Annulation possible tant que la commande n'est pas DELIVERED ou CANCELLED.

3. **Panier** : Upsert sur ajout (incremente la quantite si le produit existe deja). La quantite cumulee est plafonnee a `CART_QUANTITY_MAX` (99). Contrainte unique (userId, productId).

4. **Messagerie** : Un utilisateur ne peut pas s'envoyer un message a lui-meme. Les messages non lus sont marques comme lus a l'ouverture du thread. Les conversations sont groupees par correspondant.

5. **Evenements** : Seuls les artisans peuvent creer des evenements. Tous les utilisateurs connectes peuvent s'inscrire. Inscription impossible apres la date de fin. Contrainte unique (eventId, participantId).

---

## Paiement (Stripe)

Flux actuel :

1. `CheckoutForm` appelle `POST /api/stripe/checkout-session` avec l'adresse de livraison.
2. La route verifie le panier (non vide, produits en stock) et cree une session Stripe Checkout
   (lignes produits + ligne "Frais de livraison"). Metadata : `userId`, `shippingAddress`.
3. Apres paiement, Stripe redirige vers `/checkout/success` et envoie `checkout.session.completed`
   a `POST /api/stripe/webhook`.
4. Le webhook verifie la signature (`STRIPE_WEBHOOK_SECRET`), cree la commande `CONFIRMED`
   depuis le panier et vide le panier. Un panier deja vide (retry Stripe) est ignore.

Le client Stripe est cree a la demande par `getStripe()` : le build ne requiert aucune cle.

Variables d'environnement : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (+ `STRIPE_PUBLISHABLE_KEY`).

---

## Tests

| Niveau | Outil | Emplacement | Dependances |
|---|---|---|---|
| Unitaire | Vitest (projet `unit`) | `src/**/__tests__/*.test.ts` | Aucune (repositories et auth mockes) |
| Integration | Vitest (projet `integration`) | `tests/integration/*.test.ts` | PostgreSQL via `DATABASE_URL` |
| E2E | Playwright (Chromium) | `e2e/*.spec.ts` | PostgreSQL, base nommee `*_e2e` |

**Unitaires** — formatage, schemas Zod, guards d'authentification, Server Actions
(regles d'autorisation, validation, messages d'erreur).

**Integration** — repositories contre une vraie base : totaux du panier, plafond de quantite,
isolation du panier entre utilisateurs, creation de commande transactionnelle (prix figes,
rollback si rupture de stock), commandes visibles par artisan, statistiques de chiffre d'affaires,
ownership des produits, moderation des avis. `tests/integration/setup.ts` vide toutes les tables
avant chaque test ; les fichiers s'executent en serie.

**E2E** — catalogue et fiche produit, redirection du panier anonyme, inscription,
mauvais mot de passe, acces admin (refuse au client, accorde a l'admin), ajout au panier.
`playwright.config.ts` lance `e2e/reset-db.ts` (schema + vidage + seed) puis un build de production
sur le port 3100. Le script refuse toute base dont le nom ne finit pas par `_e2e`.

Lancer en local :

```bash
docker compose up -d db
docker compose exec db createdb -U bozarts bozarts_test
docker compose exec db createdb -U bozarts bozarts_e2e

export TEST_DB="postgresql://bozarts:bozarts_secret@localhost:5432/bozarts_test"
DATABASE_URL="$TEST_DB" npx prisma db push
DATABASE_URL="$TEST_DB" npm test

npx playwright install chromium   # une seule fois
DATABASE_URL="postgresql://bozarts:bozarts_secret@localhost:5432/bozarts_e2e" npm run test:e2e
```

---

## CI (GitHub Actions)

`.github/workflows/ci.yml`, sur push et pull request vers `main` :

| Job | Depend de | Contenu |
|---|---|---|
| `lint-and-typecheck` | — | `npm run lint`, `tsc --noEmit` |
| `test` | lint | Service PostgreSQL, `prisma db push`, `npm test` (unit + integration) |
| `build` | test | `next build` sans aucun secret |
| `e2e` | build | Service PostgreSQL (`bozarts_e2e`), Playwright ; rapport uploade si echec |

---

## Scripts disponibles

```bash
npm run dev          # Serveur de developpement
npm run build        # Build production
npm run start        # Serveur production
npm run lint         # Linting ESLint
npm run test         # Tests Vitest (unit + integration)
npm run test:unit    # Tests unitaires seuls (aucune dependance)
npm run test:integration # Tests d'integration (DATABASE_URL requis)
npm run test:e2e     # Tests Playwright (DATABASE_URL vers une base *_e2e)
npm run test:watch   # Tests en mode watch
npm run test:coverage # Tests avec couverture
npm run db:migrate   # Migration Prisma
npm run db:push      # Push schema sans migration
npm run db:seed      # Seed de la base
npm run db:studio    # Interface Prisma Studio
```

---

## Phases du projet

### Phase 1 — Fondations (completee)
- Setup Next.js 16, Prisma, NextAuth, Tailwind
- Schema de base de donnees complet
- Composants UI Base UI
- Configuration auth (Credentials, JWT, role-based)
- API REST basique

### Phase 2 — Core (completee)
- Repositories pour toutes les entites
- Server Actions pour toutes les mutations
- Schemas Zod de validation
- Pages completes : produits, panier, commandes, profil, artisans
- Navigation responsive (desktop + mobile)

### Phase 3 — Social (completee)
- Systeme d'avis (creation, affichage, approbation)
- Messagerie (inbox, conversations, envoi)
- Evenements (creation, listing, inscription)
- Integration dans la navigation

### Phase 4 — Admin (completee)
- Dashboard, gestion utilisateurs, produits, commandes, evenements
- Moderation des avis, CMS (CGU, FAQ)

### Phase 5 — Paiement (completee)
- Stripe Checkout + webhook de confirmation (voir section Paiement)

### Phase 6 — DevOps (en cours)
- [x] CI GitHub Actions verte (lint, typecheck, tests, build, e2e)
- [x] Tests unitaires, d'integration et E2E
- [ ] Infrastructure Terraform (ECR, ECS, RDS, reseau) — ecrite, jamais appliquee
- [ ] Deploiement continu (image Docker → ECR → ECS)
- [ ] Monitoring (Sentry)

L'historique detaille des changements et des decisions est dans [JOURNAL.md](JOURNAL.md).
