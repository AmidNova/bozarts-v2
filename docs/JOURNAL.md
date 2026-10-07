# Bozarts v2 — Journal de bord

Historique daté des changements, des bugs trouvés et des décisions techniques.
La documentation de référence (état actuel) est dans [TECHNICAL.md](TECHNICAL.md).

---

## 2026-03 — Phases 1 à 5

- Phases 1 à 3 (fondations, core, social) puis 4 (panel admin) et 5 (Stripe Checkout).
- CI GitHub Actions (lint/typecheck → test → build) ajoutée, mais **rouge** depuis l'intégration Stripe (voir 2026-10-07).
- 26/03 : refonte du design system (`c2393ac`) ; la suite de cette refonte est restée non commitée jusqu'au 2026-10-07.

---

## 2026-10-07 — Reprise du projet, CI réparée

### Bug : le build échouait en CI

- **Symptôme** : job `build` rouge sur les 3 derniers runs ; logs GitHub expirés.
- **Reproduction** : `next build` dans une copie propre du repo, **sans `.env`** (comme le CI) :
  `Error: Neither apiKey nor config.authenticator provided` en collectant `/api/stripe/webhook`.
- **Cause** : `src/lib/stripe.ts` instanciait le client Stripe au chargement du module.
  Next évalue les routes au build ; le CI n'a pas `STRIPE_SECRET_KEY`.
- **Correctif** (`76bd297`) : `getStripe()` crée le client à la première utilisation et lève
  `STRIPE_SECRET_KEY is not set` à l'exécution seulement. Les 3 appelants sont mis à jour.
- **Au passage** : le webhook renvoyait `400 Invalid signature` quand `STRIPE_WEBHOOK_SECRET`
  manquait (erreur de config masquée en erreur client). Il renvoie maintenant `500` et logge la cause.

### Refonte UI commitée

- `471ec0c` : palette Bozarts v1 (`#fff6ec` / `#f47f3b`), composants partagés
  `EmptyState`, `PageHeader`, `SearchBar`, suppression des composants shadcn inutilisés
  (`avatar`, `dialog`, `dropdown-menu`, `select`, `UserNav`) et des fichiers de référence v1 temporaires.
- `docs/TECHNICAL.md` conservé (décision : garder la doc technique).

---

## 2026-10-07 — Suites de tests (PR #1)

### Ce qui a été ajouté

| Niveau | Outil | Nb | Emplacement |
|---|---|---|---|
| Unitaire | Vitest | 59 | `src/**/__tests__/*.test.ts` |
| Intégration | Vitest + PostgreSQL réel | 16 | `tests/integration/*.test.ts` |
| E2E | Playwright (Chromium) | 7 | `e2e/*.spec.ts` |

Le smoke test `expect(true).toBe(true)` a été supprimé.

### Bug trouvé par les tests d'intégration : quantité panier non plafonnée

- **Symptôme** : ajouter 60 puis 60 fois le même produit donnait **120** articles (max métier : 99).
- **Cause** : `AddToCartSchema` borne chaque ajout (1..99) mais `cartRepository.addItem`
  faisait un `upsert` avec `increment` sans borne sur le cumul.
- **Correctif** : `addItem` s'exécute dans une transaction et ramène la quantité à
  `CART_QUANTITY_MAX` si l'incrément la dépasse. Test de régression :
  `tests/integration/cart.test.ts › never lets repeated additions exceed the maximum quantity`.

### Décisions

- **Deux projets Vitest** (`unit`, `integration`) dans un seul `vitest.config.ts` :
  `npm test` lance tout, `test:unit` / `test:integration` séparément.
- **Intégration sur une vraie base** plutôt que des mocks Prisma : les bugs visés
  (transactions, contraintes uniques, `where` composites d'ownership) n'existent qu'avec PostgreSQL.
  Les tables sont vidées (`TRUNCATE ... CASCADE`) avant chaque test, fichiers exécutés en série.
- **Fuseau fixé** (`TZ=Europe/Paris`) pour que les tests de formatage de date soient déterministes.
- **E2E sur build de production** (`next build && next start` sur le port 3100) : comportement réel
  et pages bien plus rapides qu'en `next dev`.
- **Reset de la base E2E dans la commande `webServer`** et non dans `globalSetup` :
  Playwright démarre le serveur *avant* `globalSetup`, la page d'accueil répondait donc 500 sur une base vide.
- **Reset par `TRUNCATE` + seed**, pas `prisma db push --force-reset` : Prisma bloque ce dernier
  lorsqu'il est lancé par un agent IA sans consentement explicite. Le script `e2e/reset-db.ts`
  refuse toute base dont le nom ne finit pas par `_e2e` (protection contre un mauvais `DATABASE_URL`).
- **CI** : nouveau job `e2e` après `build`, avec son propre service PostgreSQL ;
  rapport Playwright uploadé en artefact en cas d'échec.

### Résultats

- Local : 59 + 16 + 7 tests verts, `tsc --noEmit` propre, lint 0 erreur (19 warnings préexistants).
- CI sur PR #1 : 4 jobs verts (`lint-and-typecheck`, `test`, `build`, `e2e`).

### Dette identifiée (traitée ensuite)

- Le webhook Stripe dupliquait la création de commande de `orderRepository.createFromCart`
  **sans vérifier le stock**, et lisait le panier **au moment du webhook** : si le client modifiait
  son panier entre le paiement et la réception du webhook, la commande ne correspondait plus au montant payé.

---

## 2026-10-07 — Paiement Stripe fiabilise (PR #2)

### Problemes de l'ancien flux

L'ancien webhook `checkout.session.completed` recreait la commande **a partir du panier lu au moment du webhook** :

1. **Montant incoherent** : si le client modifiait son panier (autre onglet) entre l'ouverture du paiement
   et la reception du webhook, la commande enregistree ne correspondait plus a ce qui avait ete debite.
2. **Pas de controle de stock** au moment de la creation (logique dupliquee de `createFromCart`, sans la verification).
3. **Panier entierement vide** a la confirmation, y compris les articles ajoutes pendant le paiement.
4. **Idempotence fragile** : basee sur "panier vide = deja traite" ; un client qui re-remplissait son panier
   avant un retry Stripe aurait obtenu une seconde commande.
5. **Erreurs techniques exposees** : `createOrder` renvoyait `error.message` brut (ex. message Prisma/reseau).

### Nouveau flux

- `checkout-session` cree une commande **PENDING** (stock verifie, prix figes, panier conserve) et construit
  les lignes Stripe depuis cette commande ; seul `orderId` part en metadata. Session expirant a 30 min.
- Le webhook ne cree plus rien : il fait passer la commande PENDING → CONFIRMED (`confirmPayment`)
  ou PENDING → CANCELLED a l'expiration (`cancelPending`). Transitions conditionnees au statut PENDING,
  donc idempotentes.
- `confirmPayment` ne retire du panier que les produits de la commande.
- `OrderValidationError` distingue les erreurs metier (affichees) des erreurs techniques (loggees, message generique).
- Si la creation de la session Stripe echoue, la commande PENDING est annulee (502).

### Decisions

- **Commande avant paiement plutot que panier serialise dans les metadata Stripe** : les metadata sont
  limitees (50 cles, 500 caracteres par valeur), insuffisant pour un panier ; la commande en base est
  la source de verite et sert aussi a construire les lignes Stripe.
- **Pas de reservation de stock** : `inStock` est un booleen, pas une quantite ; hors perimetre.
- **Prerequis de deploiement** : abonner l'endpoint au nouvel evenement `checkout.session.expired`,
  sinon les paiements abandonnes restent PENDING.

### Tests ajoutes

- Integration (`tests/integration/stripe-order.test.ts`, 8 tests) : commande PENDING sans vider le panier,
  confirmation, articles ajoutes apres le checkout conserves, montant fige malgre un panier modifie,
  retry idempotent, commande annulee non confirmable, commande payee non annulable.
- Unitaires : webhook (9 tests : signature, secret manquant, paiement non finalise, metadata manquante,
  expiration, evenements ignores, 500 sur erreur base) et `checkout-session` (5 tests : auth, validation,
  erreurs metier, construction des lignes depuis la commande, annulation si Stripe indisponible).
- `createOrder` : erreur technique masquee.

Total : 98 tests Vitest (74 unitaires, 24 integration) + 7 E2E.
