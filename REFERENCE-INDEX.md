# Bozarts v1 Reference Files - Index

## Overview

Complete extraction of Bozarts v1 (PHP/vanilla HTML+CSS) project from `~/Documents/projects/Bozarts/` for reference during Bozarts v2 development.

## Files Generated

### 1. **bozarts-v1-complete-reference.md** (42 KB)
**Comprehensive technical reference document**

Contains:
- Full HTML source code for 7 main pages
- Complete CSS breakdown and styling reference
- Asset inventory (icons, images)
- Color palette documentation
- Component structure analysis

**Pages Included:**
1. Homepage (index.html) - Trending items, events, recent searches
2. Product Detail (produit.html) - Product info, reviews, cart button
3. Shopping Cart (panier.html) - Cart items, summary, payment form
4. User Profile (profil.html) - User info with modal editing
5. Search Results (recherche.html) - Grid of product cards
6. My Products (mes-annonces.html) - User's listings
7. Create Event (ajouter-evenement.html) - Event form

**CSS Sections Documented:**
- style.css - Global styles, header, footer, layout (563 lines)
- panier.css - Cart styling (276 lines)
- produit.css - Product page & reviews (446 lines)
- profil.css - Profile page (309 lines)
- recherche.css - Search results (109 lines)
- forms.css - Form styling (183 lines)
- avis.css - Reviews section (165 lines)
- Plus 7 additional CSS files referenced

### 2. **BOZARTS-V1-FILE-SUMMARY.txt** (5.9 KB)
**Quick reference summary**

Contains:
- Extraction summary checklist
- Complete file inventory
- Asset counts and locations
- Color scheme quick reference
- Key findings for v2 migration
- Missing pages/features documentation

## Quick Reference

### HTML Pages Location
```
~/Documents/projects/Bozarts/pages/
- index.html
- produit.html
- panier.html
- profil.html
- recherche.html
- mes-annonces.html
- ajouter-evenement.html
```

### CSS Files Location
```
~/Documents/projects/Bozarts/assets/css/
14 total CSS files including:
- style.css (main)
- panier.css (cart)
- produit.css (product)
- profil.css (profile)
- recherche.css (search)
- forms.css (forms)
- avis.css (reviews)
```

### Assets Location
```
~/Documents/projects/Bozarts/assets/
- icons/ (12 files)
- articles/ (11 files)
- evenements/ (3 files)
Total: 26 image files
```

## Design System

### Brand Colors
| Use | Color | Hex |
|-----|-------|-----|
| Primary | Orange | #f47f3b |
| Secondary | Dark Blue | #2b3e50 |
| Background | Light Beige | #fff6ec |
| White | - | #FFFFFF |
| Hover | Dark | #19242f |

### Functional Colors
| Use | Hex |
|-----|-----|
| Star Ratings | #ffc107 (Gold) |
| Success | #4CAF50 (Green) |
| Errors | #e74c3c / #dc3545 (Red) |
| Borders | #e0e0e0 (Light Gray) |

## Component Reference

### Shared Components (All Pages)

**Header:**
- Logo (links to homepage)
- Search bar with form submission
- User welcome message (conditional)
- Navigation icons (transactions, cart, messages, profile)

**Footer:**
- Copyright notice
- Links (CGU, FAQ, Contact)
- Social media icons (4 icons)

### Page-Specific Patterns

**Homepage:**
- Section titles
- Trending items grid (6 products)
- Events grid (dynamic)
- Recent searches section

**Product Detail:**
- 2-column layout (image + details)
- Quantity input
- Add to cart button (with icon animation)
- Contact seller button
- Review form (star rating + textarea)
- Reviews list with author, rating, date

**Shopping Cart:**
- Cart items list (flex column)
- Sticky summary sidebar
- Payment modal with form
- Remove item buttons

**User Profile:**
- Info groups with labels
- Modal-based editing for each field
- Save/close buttons in modals
- Logout button section

**Search Results:**
- Product card grid
- Card elements: image, title, price, category, artisan, description
- Button per card
- Error message support

## Layout Breakpoints

- **Desktop (1200px+):** Full multi-column layouts
- **Tablet (768px):** Adjusted grid, mobile-friendly
- **Mobile (480px):** Single column, full-width

## Notes for V2 Development

### Patterns to Preserve
- Consistent header/footer across pages
- Brand color scheme (#f47f3b orange primary)
- Grid layouts for product listings
- Modal-based form interactions
- Sticky cart summary
- Star rating system

### New in V2
- Admin dashboard (referenced but not detailed in v1)
- Database-driven content (v1 was static/PHP)
- NextAuth authentication
- Stripe payment integration
- Next.js routing

### Key Differences
- v1: Vanilla HTML + CSS + vanilla JS + PHP
- v2: React (Next.js 15) + TypeScript + Tailwind CSS + Prisma + NextAuth + Stripe

## File Access

All original files remain in: `~/Documents/projects/Bozarts/`

Reference documents in: `~/Documents/projects/bozarts-v2/`
- `bozarts-v1-complete-reference.md` - Full technical reference
- `BOZARTS-V1-FILE-SUMMARY.txt` - Quick summary
- `REFERENCE-INDEX.md` - This file

---

**Last Updated:** 2026-03-26
**Source:** ~/Documents/projects/Bozarts/
**Extraction Timestamp:** 11:05 UTC
