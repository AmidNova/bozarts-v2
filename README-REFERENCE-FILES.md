# Bozarts v1 Reference Files - Complete Extract

## Summary

Successfully extracted and documented the complete Bozarts v1 project from `~/Documents/projects/Bozarts/`. Three comprehensive reference documents have been created in this directory to support Bozarts v2 development.

## Reference Documents Created

### 1. `bozarts-v1-complete-reference.md` (44 KB)
The main technical reference containing:
- **7 Complete HTML Pages** with full source code
  - Homepage (index.html)
  - Product Detail (produit.html) 
  - Shopping Cart (panier.html)
  - User Profile (profil.html)
  - Search Results (recherche.html)
  - My Products/Listings (mes-annonces.html)
  - Event Creation (ajouter-evenement.html)

- **7 Major CSS Files Documented** (563 lines total core CSS)
  - style.css (global styles, header, footer)
  - panier.css (cart styling)
  - produit.css (product page & reviews)
  - profil.css (profile page)
  - recherche.css (search results)
  - forms.css (form styling)
  - avis.css (reviews section)

- **Asset Inventory**
  - 12 icon files
  - 11 product images
  - 3 event images
  - Logos in 3 variants

- **Design System Documentation**
  - Complete color palette
  - Typography defaults
  - Layout patterns
  - Component structures

### 2. `BOZARTS-V1-FILE-SUMMARY.txt` (8 KB)
Quick reference summary including:
- Extraction checklist
- Complete file inventory organized by type
- Asset count and locations
- Color scheme quick lookup
- Key migration findings
- Identified gaps in v1 documentation

### 3. `REFERENCE-INDEX.md` (8 KB)
Navigation and overview document providing:
- Quick file location references
- Brand colors table
- Component reference guide
- Layout breakpoints
- Patterns to preserve in v2
- Notes on differences between v1 and v2

## What Was Extracted

### HTML Files (7 pages)
All complete with:
- Full header structure (logo, search, user state, nav icons)
- Page-specific content
- Consistent footer (copyright, links, social media)
- Form elements and modals
- Grid layouts for listings

### CSS Files (14 total)
- 7 major CSS files documented in detail
- 7 additional CSS files referenced
- Complete style breakdown
- Color variables and design tokens
- Responsive breakpoints (768px, 480px)
- Animation and transition definitions

### Assets (26 image files)
- Brand logos and variations
- Navigation/UI icons
- Sample product images
- Event photos
- All asset paths documented

## Key Design Elements

### Brand Colors
```
Primary:    #f47f3b (Orange)
Secondary:  #2b3e50 (Dark Blue)  
Background: #fff6ec (Light Beige)
White:      #FFFFFF
Hover:      #19242f (Dark)
Accents:    #ffc107 (Gold - ratings)
Error:      #dc3545 (Red)
Success:    #4CAF50 (Green)
```

### Layout Patterns
- Header: Fixed, consistent across all pages
- Footer: Fixed, consistent across all pages
- Products: Grid layout (auto-fill, minmax 280px)
- Cart: 2-column (items left, summary right with sticky positioning)
- Profile: Modal-based editing for each field
- Forms: Primary color background, white text, full-width inputs

### Interactive Components
- Star rating system (5 stars, gold color)
- Add to cart animation (icon slides in on hover)
- Quantity controls (input + buttons)
- Payment modal with comprehensive form
- Modal-based profile editing
- Search with form submission

## Page Structures

### All Pages Share
- Header with: logo, search bar, user welcome (conditional), 4 nav icons
- Footer with: copyright, 3 links, 4 social icons

### Homepage (index.html)
- Join/CTA banner
- Recent searches section
- Trending items (6 sample products in grid)
- Upcoming events (dynamic grid)

### Product Detail (produit.html)
- 2-column layout (image + info)
- Product title, reference, description, price
- Quantity input
- Add to cart button (special animation)
- Contact seller button
- Complete review section (form + list)

### Shopping Cart (panier.html)
- Cart items list
- Sticky summary sidebar
- Payment modal with form fields
  - Card number, expiry, CVV
  - Name, address, postal code, city

### User Profile (profil.html)
- Info groups for: name, first name, email, phone, address, password, type
- Modal for editing each field
- Logout button
- Green save button, red logout button

### Search Results (recherche.html)
- Grid of product cards
- Each card: image, title, price, category, artisan, description, button
- Error message support

### My Products (mes-annonces.html)
- User's product listings
- Grid layout
- Dynamic content loading

### Event Creation (ajouter-evenement.html)
- Form fields: title, description, start date, end date, location, image
- Submit/cancel buttons

## Asset Files Location

```
~/Documents/projects/Bozarts/
├── assets/
│   ├── icons/           (12 files - logos, navigation)
│   ├── articles/        (11 files - product images)
│   ├── evenements/      (3 files - event images)
│   └── css/             (14 files - all stylesheets)
├── pages/               (7 HTML files)
├── js/                  (JavaScript files)
└── includes/            (PHP includes)
```

## Usage for V2 Development

These reference files are meant to:

1. **Visual Design Reference**
   - Color schemes and palettes
   - Layout patterns and breakpoints
   - Component styling details

2. **Functional Specification**
   - Feature checklist (cart, reviews, profile editing)
   - Form structures and field requirements
   - User interaction patterns

3. **Migration Guide**
   - Component structure to replicate
   - Styling to adapt to Tailwind CSS
   - Layout patterns to preserve

4. **Assets Reference**
   - Icon and image locations
   - Logo variations available
   - Asset naming conventions

## Notes

- All original v1 files remain in: `~/Documents/projects/Bozarts/`
- These are reference documents only - not the source files
- v1 uses vanilla HTML/CSS/JS + PHP backend
- v2 uses Next.js 15 + React + TypeScript + Tailwind CSS + Prisma + NextAuth
- Design system should be preserved, technology stack is completely different

## File Recommendations

For quick reference:
1. Start with `REFERENCE-INDEX.md` for navigation
2. Check `BOZARTS-V1-FILE-SUMMARY.txt` for quick facts
3. Use `bozarts-v1-complete-reference.md` for detailed component specifications

---

**Extraction Date:** 2026-03-26
**Source Project:** ~/Documents/projects/Bozarts/
**Target Project:** ~/Documents/projects/bozarts-v2/
**Total Reference Size:** 60 KB across 3 documents
