# Bozarts v1 - Complete HTML, CSS, and Asset Reference

## PROJECT STRUCTURE

### Key Directories
- `pages/` - All HTML pages
- `assets/css/` - All stylesheets
- `assets/icons/` - Logo and navigation icons
- `assets/articles/` - Product images
- `assets/evenements/` - Event images
- `includes/` - PHP includes (server-side)
- `js/` - JavaScript files

---

## HTML FILES

### 1. INDEX/HOMEPAGE - index.html
```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bozarts</title>
    <link rel="stylesheet" href="../assets/css/style.css" />
    <base href="../pages/index.html" />
  </head>
  <body>
    <header>
      <div class="logo">
        <a href="../pages/index.html" class="icon-button">
          <img src="../assets/icons/LOGO.png" alt="BOZARTS" />
        </a>
      </div>
      <div class="search-container">
        <form action="recherche.html" method="get">
          <input type="text" name="search" class="search-box" placeholder="Rechercher" />
          <button type="submit" class="search-button">
            <img src="../assets/icons/search-icon.png" class="search-icon" alt="search icon" />
          </button>
        </form>
      </div>
      <div class="user-welcome" id="userWelcome">
      </div>
      <div class="header-right">
        <a href="mes-transactions.html" class="icon-button" style="width: 20%">
          <img
            src="../assets/icons/mes-transactions.png"
            alt="Transactions"
            class="icon-img"
          />
        </a>
        <a href="panier.html" class="icon-button" style="width: 20%">
          <img
            src="../assets/icons/panier-icon.png"
            alt="Panier"
            class="icon-img"
          />
        </a>
        <a href="messagerie.html" class="icon-button" id="notifications-link">
          <img
            src="../assets/icons/notifications-icon.png"
            alt="Notifications"
            class="icon-img"
          />
        </a>
        <a href="connexion.html" class="icon-button" id="profile-link">
          <img
            src="../assets/icons/profil-icon.png"
            alt="Profil"
            class="icon-img"
          />
        </a>
      </div>
    </header>

    <main>
      <section class="join-us">
      <!-- Affiche dynamique du bandeau en fonction du statut de connexion-->
      </section>
      

      <section>
        <h2 class="section-title">Recherches récentes</h2>
        <div class="recent-searches">
          <p>Pas encore de recherche récente</p>
          <!-- A REMPLIR ENSUITE SUIVANT LES RECHERCHES DE L'UTILISATEUR -->
        </div>
      </section>

      <section>
        <h2 class="section-title">Tendance du moment</h2>
        <div class="trending-items">
          <a href="produit.html?id=1" class="item-card">
            <img src="../assets/articles/article1.jpg" alt="Tableau" class="item-image" />
          </a>
          <a href="produit.html?id=2" class="item-card">
            <img
              src="../assets/articles/article2.jpg"
              alt="Fauteil orange"
              class="item-image"
            />
          </a>
          <a href="produit.html?id=3" class="item-card">
            <img
              src="../assets/articles/article3.jpg"
              alt="Table en verre"
              class="item-image"
            />
          </a>
          <a href="produit.html?id=4" class="item-card">
            <img
              src="../assets/articles/article4.jpg"
              alt="Pot en ceramique"
              class="item-image"
            />
          </a>
          <a href="produit.html?id=5" class="item-card">
            <img
              src="../assets/articles/article5.jpg"
              alt="Vase en verre bleu"
              class="item-image"
            />
          </a>
          <a href="produit.html?id=6" class="item-card">
            <img
              src="../assets/articles/article6.jpg"
              alt="Horloge en marbre noir"
              class="item-image"
            />
          </a>
        </div>
      </section>
      <section>
        <h2 class="section-title">Événements à venir</h2>
        <div id="evenements-container" class="evenements-grid">
          <!-- Les événements seront chargés dynamiquement ici -->
        </div>
      </section>
    </main>

    <footer>
      <div class="footer-content">
        <div class="footer-left">
          <p>© 2025 Bozarts. Tous droits réservés.</p>
          <p><a href="../pages/CGU.html" class="footer-link">CGU & Mentions légales</a></p>
          <p>Un problème non résolu par la FAQ ? <a href="messagerie.html?destinataire=admin" class="footer-link">Contactez-nous</a></p>
        </div>
    
        <div class="footer-center">
          <ul class="footer-links">
            <li><a href="faq.html" class="footer-link">Notre FAQ</a></li>
          </ul>
        </div>
    
        <div class="footer-right">
          <p>Suivez-nous</p>
          <div class="social-icons">
            <a href="#"><img src="../assets/icons/facebook.png" alt="Facebook" /></a>
            <a href="#"><img src="../assets/icons/twitter.png" alt="Twitter" /></a>
            <a href="#"><img src="../assets/icons/instagram.png" alt="Instagram" /></a>
            <a href="#"><img src="../assets/icons/linkedin.png" alt="LinkedIn" /></a>
          </div>
        </div>
      </div>
    </footer>

    <script src="../js/header.js"></script>
    <script src="../js/index.js"></script>
    <script src="../js/recent-searches.js"></script>
  </body>
</html>
```

### 2. PRODUCT DETAIL PAGE - produit.html
```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Détails du produit - Bozarts</title>
    <link rel="stylesheet" href="../assets/css/style.css" />
    <link rel="stylesheet" href="../assets/css/produit.css" />
    <link rel="stylesheet" href="../css/avis.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
  </head>
  <body>
    <header>
      <div class="logo">
        <a href="../pages/index.html" class="icon-button">
          <img src="../assets/icons/LOGO.png" alt="BOZARTS" />
        </a>
      </div>
      <div class="search-container">
        <form action="recherche.html" method="get">
          <input type="text" name="search" class="search-box" placeholder="Rechercher" />
          <button type="submit" class="search-button">
            <img src="../assets/icons/search-icon.png" class="search-icon" alt="search icon" />
          </button>
        </form>
      </div>
      <div class="user-welcome" id="userWelcome">
      </div>
      <div class="header-right">
        <a href="mes-transactions.html" class="icon-button" style="width: 20%">
          <img src="../assets/icons/mes-transactions.png" alt="Transactions" class="icon-img" />
        </a>
        <a href="panier.html" class="icon-button" style="width: 20%">
          <img
            src="../assets/icons/panier-icon.png"
            alt="Panier"
            class="icon-img"
          />
        </a>
        <a href="messagerie.html" class="icon-button" id="notifications-link">
          <img
            src="../assets/icons/notifications-icon.png"
            alt="Notifications"
            class="icon-img"
          />
        </a>
        <a href="connexion.html" class="icon-button">
          <img
            src="../assets/icons/profil-icon.png"
            alt="Profil"
            class="icon-img"
          />
        </a>
      </div>
    </header>
    <main class="product-container">
      <div class="product-image">
        <img id="product-img" src="" alt="Image du produit" />
      </div>

      <div class="product-info">
        <h1 id="product-title"></h1>
        
        <div class="product-details">
          <p class="reference" id="product-reference"></p>
          <p class="description" id="product-description"></p>
          <p class="price" id="product-price"></p>
          <div class="quantity-controls">
            <input type="number" class="quantity-input" value="1" min="1">
          </div>
          <button class="CartBtn add-to-cart">
            <span class="IconContainer">
              <img src="../assets/icons/panier-icon.png" alt="Panier" class="icon">
            </span>
            <span class="text">Ajouter au panier</span>
          </button>
        </div>

        <button class="contact-seller">Envoyer un message à l'annonceur</button>
      </div>

      <section class="avis-section">
        <h2>Avis des clients</h2>
        
        <form id="avis-form" class="avis-form">
          <h3>Laisser un avis</h3>
          <div class="form-group">
            <label for="note">Note</label>
            <div class="rating">
              <input type="radio" name="note" id="star1" value="1">
              <label for="star1"><i class="fas fa-star"></i></label>
              <input type="radio" name="note" id="star2" value="2">
              <label for="star2"><i class="fas fa-star"></i></label>
              <input type="radio" name="note" id="star3" value="3">
              <label for="star3"><i class="fas fa-star"></i></label>
              <input type="radio" name="note" id="star4" value="4">
              <label for="star4"><i class="fas fa-star"></i></label>
              <input type="radio" name="note" id="star5" value="5">
              <label for="star5"><i class="fas fa-star"></i></label>
            </div>
          </div>
          <div class="form-group">
            <label for="commentaire">Commentaire</label>
            <textarea id="commentaire" class="form-control" required></textarea>
          </div>
          <button type="submit" class="btn-submit">Publier mon avis</button>
        </form>

        <div id="avis-container" class="avis-container">
          <!-- Les avis seront chargés ici -->
        </div>
      </section>
    </main>

    <footer>
      <div class="footer-content">
        <div class="footer-left">
          <p>© 2025 Bozarts. Tous droits réservés.</p>
          <p><a href="../pages/CGU.html" class="footer-link">CGU & Mentions légales</a></p>
          <p>Un problème non résolu par la FAQ ? <a href="messagerie.html?destinataire=admin" class="footer-link">Contactez-nous</a></p>
        </div>
    
        <div class="footer-center">
          <ul class="footer-links">
            <li><a href="faq.html" class="footer-link">Notre FAQ</a></li>
          </ul>
        </div>
    
        <div class="footer-right">
          <p>Suivez-nous</p>
          <div class="social-icons">
            <a href="#"><img src="../assets/icons/facebook.png" alt="Facebook" /></a>
            <a href="#"><img src="../assets/icons/twitter.png" alt="Twitter" /></a>
            <a href="#"><img src="../assets/icons/instagram.png" alt="Instagram" /></a>
            <a href="#"><img src="../assets/icons/linkedin.png" alt="LinkedIn" /></a>
          </div>
        </div>
      </div>
    </footer>

    <script src="../js/produit.js"></script>
    <script src="../js/header.js"></script>
    <script src="../js/footer.js"></script>
    <script src="../js/avis.js"></script>
  </body>
</html>
```

### 3. CART PAGE - panier.html
```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mon Panier - Bozarts</title>
    <link rel="stylesheet" href="../assets/css/panier.css" />
    <link rel="stylesheet" href="../assets/css/style.css" />

  </head>
  <body>
    <header>
      <div class="logo">
        <a href="../pages/index.html" class="icon-button">
          <img src="../assets/icons/LOGO.png" alt="BOZARTS" />
        </a>
      </div>
      <div class="search-container">
        <form action="recherche.html" method="get">
          <input type="text" name="search" class="search-box" placeholder="Rechercher" />
          <button type="submit" class="search-button">
            <img src="../assets/icons/search-icon.png" class="search-icon" alt="search icon" />
          </button>
        </form>
      </div>
      <div class="user-welcome" id="userWelcome">
      </div>
      <div class="header-right">
        <a href="mes-transactions.html" class="icon-button" style="width: 20%">
          <img src="../assets/icons/mes-transactions.png" alt="Transactions" class="icon-img" />
        </a>
        <a href="panier.html" class="icon-button" style="width: 20%">
          <img
            src="../assets/icons/panier-icon.png"
            alt="Panier"
            class="icon-img"
          />
        </a>
        <a href="messagerie.html" class="icon-button" id="notifications-link">
          <img
            src="../assets/icons/notifications-icon.png"
            alt="Notifications"
            class="icon-img"
          />
        </a>
        <a href="connexion.html" class="icon-button">
          <img
            src="../assets/icons/profil-icon.png"
            alt="Profil"
            class="icon-img"
          />
        </a>
      </div>
    </header>

    <main class="cart-container">
      <h1>Mon panier</h1>

      <div class="cart-content">
        <!-- Cart items will be loaded here -->
        <div class="cart-items"></div>

        <div class="cart-summary">
          <h2>Total</h2>
          <div class="summary-details">
            <div class="summary-line">
              <span>Sous-Total :</span>
              <span><!----></span>
            </div>
            <div class="summary-line">
              <span>Livraison :</span>
              <span>0€</span>
            </div>
            <div class="summary-line total">
              <span>Total :</span>
              <span>0€</span>
            </div>
            <button class="checkout-button">Paiement</button>
          </div>
        </div>
      </div>
    </main>

    <footer>
      <div class="footer-content">
        <div class="footer-left">
          <p>© 2025 Bozarts. Tous droits réservés.</p>
          <p><a href="../pages/CGU.html" class="footer-link">CGU & Mentions légales</a></p>
          <p>Un problème non résolu par la FAQ ? <a href="messagerie.html?destinataire=admin" class="footer-link">Contactez-nous</a></p>
        </div>
    
        <div class="footer-center">
          <ul class="footer-links">
            <li><a href="faq.html" class="footer-link">Notre FAQ</a></li>
          </ul>
        </div>
    
        <div class="footer-right">
          <p>Suivez-nous</p>
          <div class="social-icons">
            <a href="#"><img src="../assets/icons/facebook.png" alt="Facebook" /></a>
            <a href="#"><img src="../assets/icons/twitter.png" alt="Twitter" /></a>
            <a href="#"><img src="../assets/icons/instagram.png" alt="Instagram" /></a>
            <a href="#"><img src="../assets/icons/linkedin.png" alt="LinkedIn" /></a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Modal de paiement -->
    <div id="paymentModal" class="modal">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Paiement</h2>
        <form id="paymentForm" class="payment-form">
          <div class="form-group">
            <label for="cardNumber">Numéro de carte</label>
            <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="expiryDate">Date d'expiration</label>
              <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/AA" maxlength="5" required>
            </div>
            <div class="form-group">
              <label for="cvv">CVV</label>
              <input type="text" id="cvv" name="cvv" placeholder="123" maxlength="3" required>
            </div>
          </div>

          <div class="form-group">
            <label for="cardName">Nom sur la carte</label>
            <input type="text" id="cardName" name="cardName" placeholder="JEAN DUPONT" required>
          </div>

          <div class="form-group">
            <label for="address">Adresse de livraison</label>
            <input type="text" id="address" name="address" placeholder="123 rue Example" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="postalCode">Code postal</label>
              <input type="text" id="postalCode" name="postalCode" placeholder="75000" maxlength="5" required>
            </div>
            <div class="form-group">
              <label for="city">Ville</label>
              <input type="text" id="city" name="city" placeholder="Paris" required>
            </div>
          </div>

          <button type="submit" class="payment-submit">Payer</button>
        </form>
      </div>
    </div>

    <script src="../js/header.js"></script>
    <script src="../js/panier.js"></script>
  </body>
</html>
```

### 4. PROFILE PAGE - profil.html
Complete file already provided above in the initial read.

### 5. PRODUCT SEARCH/LISTING - recherche.html
```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Recherche</title>
    <link rel="stylesheet" href="../assets/css/style.css" />
    <link rel="stylesheet" href="../assets/css/recherche.css" />
  </head>
  <body>
    <header>
      <div class="logo">
        <a href="../pages/index.html" class="icon-button">
          <img src="../assets/icons/LOGO.png" alt="BOZARTS" />
        </a>
      </div>
      <div class="search-container">
        <form action="recherche.html" method="get">
          <input type="text" name="search" class="search-box" placeholder="Rechercher" />
          <button type="submit" class="search-button">
            <img src="../assets/icons/search-icon.png" class="search-icon" alt="search icon" />
          </button>
        </form>
      </div>
      <div class="header-right">
        <a href="mes-transactions.html" class="icon-button" style="width: 20%">
          <img src="../assets/icons/mes-transactions.png" alt="Transactions" class="icon-img" />
        </a>
        <a href="panier.html" class="icon-button" style="width: 20%">
          <img
            src="../assets/icons/panier-icon.png"
            alt="Panier"
            class="icon-img"
          />
        </a>
        <a href="messagerie.html" class="icon-button" id="notifications-link">
          <img
            src="../assets/icons/notifications-icon.png"
            alt="Notifications"
            class="icon-img"
          />
        </a>
        <a href="connexion.html" class="icon-button">
          <img
            src="../assets/icons/profil-icon.png"
            alt="Profil"
            class="icon-img"
          />
        </a>
      </div>
    </header>

    <main>
      <section id="section-title">
        <h1>Résultats de recherche</h1>
      </section>

      <section id="search-results">
        <!-- Les résultats seront affichés ici dynamiquement -->
      </section>
    </main>

    <footer>
      <div class="footer-content">
        <div class="footer-left">
          <p>© 2025 Bozarts. Tous droits réservés.</p>
          <p><a href="../pages/CGU.html" class="footer-link">CGU & Mentions légales</a></p>
          <p>Un problème non résolu par la FAQ ? <a href="messagerie.html?destinataire=admin" class="footer-link">Contactez-nous</a></p>
        </div>
    
        <div class="footer-center">
          <ul class="footer-links">
            <li><a href="faq.html" class="footer-link">Notre FAQ</a></li>
          </ul>
        </div>
    
        <div class="footer-right">
          <p>Suivez-nous</p>
          <div class="social-icons">
            <a href="#"><img src="../assets/icons/facebook.png" alt="Facebook" /></a>
            <a href="#"><img src="../assets/icons/twitter.png" alt="Twitter" /></a>
            <a href="#"><img src="../assets/icons/instagram.png" alt="Instagram" /></a>
            <a href="#"><img src="../assets/icons/linkedin.png" alt="LinkedIn" /></a>
          </div>
        </div>
      </div>
    </footer>

    <script src="../js/recherche.js"></script>
    <script src="../js/header.js"></script>
  </body>
</html>
```

### 6. MY PRODUCTS/LISTINGS PAGE - mes-annonces.html
```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mes Annonces</title>
    <link rel="stylesheet" href="../assets/css/style.css" />
    <link rel="stylesheet" href="../assets/css/mes-annonces.css" />
  </head>
  <body>
    <header>
      <div class="logo">
        <a href="../pages/index.html" class="icon-button">
          <img src="../assets/icons/LOGO.png" alt="BOZARTS" />
        </a>
      </div>
      <div class="search-container">
        <form action="recherche.html" method="get">
          <input type="text" name="search" class="search-box" placeholder="Rechercher" />
          <button type="submit" class="search-button">
            <img src="../assets/icons/search-icon.png" class="search-icon" alt="search icon" />
          </button>
        </form>
      </div>
      <div class="user-welcome" id="userWelcome">
      </div>
      <div class="header-right">
        <a href="mes-transactions.html" class="icon-button" style="width: 20%">
          <img src="../assets/icons/mes-transactions.png" alt="Transactions" class="icon-img" />
        </a>
        <a href="panier.html" class="icon-button" style="width: 20%">
          <img
            src="../assets/icons/panier-icon.png"
            alt="Panier"
            class="icon-img"
          />
        </a>
        <a href="messagerie.html" class="icon-button" id="notifications-link">
          <img
            src="../assets/icons/notifications-icon.png"
            alt="Notifications"
            class="icon-img"
          />
        </a>
        <a href="connexion.html" class="icon-button" id="profile-link">
          <img
            src="../assets/icons/profil-icon.png"
            alt="Profil"
            class="icon-img"
          />
        </a>
      </div>
    </header>

    <main>
      <section id="section-title">
        <h1>Mes Annonces</h1>
        <p>Des créations qui racontent une histoire.</p>
      </section>

      <section class="products-grid" id="products-container">
        <!-- Le contenu sera chargé dynamiquement via JavaScript -->
      </section>
    </main>

    <footer>
      <div class="footer-content">
        <div class="footer-left">
          <p>© 2025 Bozarts. Tous droits réservés.</p>
          <p><a href="../pages/CGU.html" class="footer-link">CGU & Mentions légales</a></p>
          <p>Un problème non résolu par la FAQ ? <a href="messagerie.html?destinataire=admin" class="footer-link">Contactez-nous</a></p>
        </div>
    
        <div class="footer-center">
          <ul class="footer-links">
            <li><a href="faq.html" class="footer-link">Notre FAQ</a></li>
          </ul>
        </div>
    
        <div class="footer-right">
          <p>Suivez-nous</p>
          <div class="social-icons">
            <a href="#"><img src="../assets/icons/facebook.png" alt="Facebook" /></a>
            <a href="#"><img src="../assets/icons/twitter.png" alt="Twitter" /></a>
            <a href="#"><img src="../assets/icons/instagram.png" alt="Instagram" /></a>
            <a href="#"><img src="../assets/icons/linkedin.png" alt="LinkedIn" /></a>
          </div>
        </div>
      </div>
    </footer>

    <script src="../js/header.js"></script>
    <script src="../js/mes-annonces.js"></script>
  </body>
</html>
```

### 7. ADD EVENT PAGE - ajouter-evenement.html
```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ajouter un événement - Bozarts</title>
    <link rel="stylesheet" href="../assets/css/ajouter-evenement.css" />
    <link rel="stylesheet" href="../assets/css/style.css" />
    <link rel="stylesheet" href="../assets/css/form.css" />
  </head>
  <body>
    <header>
      <div class="logo">
        <a href="../pages/index.html" class="icon-button">
          <img src="../assets/icons/LOGO.png" alt="BOZARTS" />
        </a>
      </div>
      <div class="search-container">
        <form action="recherche.html" method="get">
          <input type="text" name="search" class="search-box" placeholder="Rechercher" />
          <button type="submit" class="search-button">
            <img src="../assets/icons/search-icon.png" class="search-icon" alt="search icon" />
          </button>
        </form>
      </div>
      <div class="header-right">
        <a href="mes-transactions.html" class="icon-button" style="width: 20%">
          <img src="../assets/icons/mes-transactions.png" alt="Transactions" class="icon-img" />
        </a>
        <a href="panier.html" class="icon-button" style="width: 20%">
          <img src="../assets/icons/panier-icon.png" alt="Panier" class="icon-img" />
        </a>
        <a href="messagerie.html" class="icon-button" id="notifications-link">
          <img src="../assets/icons/notifications-icon.png" alt="Notifications" class="icon-img" />
        </a>
        <a href="connexion.html" class="icon-button" id="profile-link">
          <img src="../assets/icons/profil-icon.png" alt="Profil" class="icon-img" />
        </a>
      </div>
    </header>

    <main>
      <section class="form-container">
        <h1>Créer un nouvel événement</h1>
        <form id="event-form" enctype="multipart/form-data">
          <div class="form-group">
            <label for="titre">Titre de l'événement *</label>
            <input type="text" id="titre" name="titre" required />
          </div>

          <div class="form-group">
            <label for="description">Description *</label>
            <textarea id="description" name="description" rows="4" required></textarea>
          </div>

          <div class="form-group">
            <label for="date_debut">Date de début *</label>
            <input type="datetime-local" id="date_debut" name="date_debut" required />
          </div>

          <div class="form-group">
            <label for="date_fin">Date de fin *</label>
            <input type="datetime-local" id="date_fin" name="date_fin" required />
          </div>

          <div class="form-group">
            <label for="lieu">Lieu *</label>
            <input type="text" id="lieu" name="lieu" required />
          </div>

          <div class="form-group">
            <label for="image">Image de l'événement</label>
            <input type="file" id="image" name="image" accept="image/*" />
          </div>

          <div class="form-buttons">
            <button type="submit" class="submit-button">Créer l'événement</button>
            <a href="index.html" class="cancel-button">Annuler</a>
          </div>
        </form>
      </section>
    </main>

    <footer>
      <div class="footer-content">
        <div class="footer-left">
          <p>© 2025 Bozarts. Tous droits réservés.</p>
          <p><a href="../pages/CGU.html" class="footer-link">CGU & Mentions légales</a></p>
          <p>Un problème non résolu par la FAQ ? <a href="messagerie.html?destinataire=admin" class="footer-link">Contactez-nous</a></p>
        </div>
    
        <div class="footer-center">
          <ul class="footer-links">
            <li><a href="faq.html" class="footer-link">Notre FAQ</a></li>
          </ul>
        </div>
    
        <div class="footer-right">
          <p>Suivez-nous</p>
          <div class="social-icons">
            <a href="#"><img src="../assets/icons/facebook.png" alt="Facebook" /></a>
            <a href="#"><img src="../assets/icons/twitter.png" alt="Twitter" /></a>
            <a href="#"><img src="../assets/icons/instagram.png" alt="Instagram" /></a>
            <a href="#"><img src="../assets/icons/linkedin.png" alt="LinkedIn" /></a>
          </div>
        </div>
      </div>
    </footer>

    <script src="../js/header.js"></script>
    <script src="../js/ajouter-evenement.js"></script>
  </body>
</html>
```

---

## CSS FILES COMPLETE LIST

### Key CSS Files:
1. **style.css** - Main stylesheet (header, footer, layout, utilities)
2. **panier.css** - Cart/shopping cart styles
3. **produit.css** - Product detail page styles
4. **profil.css** - User profile page styles
5. **recherche.css** - Search results page styles
6. **forms.css** - Form styling for login/registration
7. **avis.css** - Reviews/ratings section styles
8. **mes-annonces.css** - My products/listings styles
9. **ajouter-evenement.css** - Event creation form styles
10. **admin.css** - Admin panel styles
11. **CGU.css** - Terms and conditions page styles
12. **faq.css** - FAQ page styles
13. **messagerie.css** - Messaging page styles
14. **transactions.css** - User transactions/orders page styles

---

## COMPLETE ASSET FILES INVENTORY

### Icons (Header/Navigation)
- `/assets/icons/LOGO.png` - Main Bozarts logo
- `/assets/icons/LOGO_SOMBRE.png` - Dark version of logo
- `/assets/icons/LOGO-transparent.png` - Transparent logo variant
- `/assets/icons/search-icon.png` - Search icon
- `/assets/icons/panier-icon.png` - Shopping cart icon
- `/assets/icons/profil-icon.png` - Profile/user icon
- `/assets/icons/notifications-icon.png` - Notifications/messaging icon
- `/assets/icons/mes-transactions.png` - Transactions/orders icon
- `/assets/icons/facebook.png` - Facebook social icon
- `/assets/icons/instagram.png` - Instagram social icon
- `/assets/icons/twitter.png` - Twitter social icon
- `/assets/icons/linkedin.png` - LinkedIn social icon

### Product Images (Articles)
- `/assets/articles/article1.jpg` - Sample product 1 (Tableau)
- `/assets/articles/article2.jpg` - Sample product 2 (Fauteil orange)
- `/assets/articles/article3.jpg` - Sample product 3 (Table en verre)
- `/assets/articles/article4.jpg` - Sample product 4 (Pot en ceramique)
- `/assets/articles/article5.jpg` - Sample product 5 (Vase en verre bleu)
- `/assets/articles/article6.jpg` - Sample product 6 (Horloge en marbre noir)
- `/assets/articles/article_sans_image.jpg` - Placeholder for products without images
- `/assets/articles/6832fbc733fc5-peinture_foret.png` - User-uploaded product image
- `/assets/articles/6832fc40bd005-peinture-oiseau.jpg` - User-uploaded product image
- `/assets/articles/6832fca8080a2-nature_octobre.jpg` - User-uploaded product image
- `/assets/articles/68330d19ab4d6-chaise_osier.jpg` - User-uploaded product image

### Event Images
- `/assets/evenements/galerie_perigord.jpg` - Event image 1
- `/assets/evenements/gallerie_paris.jpg` - Event image 2
- `/assets/evenements/gallerie_sculpture.jpg` - Event image 3

---

## COLOR SCHEME & DESIGN VARIABLES

Primary Colors (from style.css):
- `--primary-color: #f47f3b` (Orange - Main brand color)
- `--secondary-color: #2b3e50` (Dark Blue - Secondary)
- `--background-color: #fff6ec` (Light Beige - Page background)
- `--white: #FFFFFF`
- `--hover-color: #19242f` (Dark for hover states)

---

## HEADER & FOOTER STRUCTURE

All pages share the same header and footer pattern:

### Header includes:
- Logo (links to homepage)
- Search bar with search icon
- User welcome message area (hidden by default, shown when logged in)
- Right section icons:
  - Transactions/Orders
  - Shopping Cart
  - Notifications/Messages
  - Profile

### Footer includes:
- Left section: Copyright, CGU/Legal links, Contact link
- Center section: FAQ link
- Right section: Social media icons (Facebook, Twitter, Instagram, LinkedIn)

---

## KEY OBSERVATIONS FOR V2 MIGRATION

1. **Events Display**: Homepage has a dedicated events grid section (`#evenements-container`)
2. **Artisan Profile**: No dedicated artisan page - artisans are referenced in product cards via seller contact
3. **Search**: Product search works via query parameter (`recherche.html?search=...`)
4. **Cart**: Contains payment modal with full payment form (card, address, postal code, city)
5. **Product Listing**: Uses grid layout with cards showing product image, title, price, artisan, and category
6. **Reviews**: Products have a dedicated reviews section with star ratings and comments
7. **User Profile**: Modal-based editing for each field (name, email, phone, address, type)
8. **Authentication**: Separate login/registration pages (connexion.html, inscription.html)

---

**File Reference Paths:**
- Homepage: `/pages/index.html`
- Product Detail: `/pages/produit.html`
- Cart: `/pages/panier.html`
- Profile: `/pages/profil.html`
- Search: `/pages/recherche.html`
- My Products: `/pages/mes-annonces.html`
- Create Event: `/pages/ajouter-evenement.html`
- Main Stylesheet: `/assets/css/style.css`
- Product Images: `/assets/articles/`
- Event Images: `/assets/evenements/`
- Icons: `/assets/icons/`
# Bozarts v1 - Complete CSS Reference

## 1. STYLE.CSS - Main Stylesheet (563 lines)

**Color Variables:**
```css
:root {
    --primary-color: #f47f3b; /* Orange */
    --secondary-color: #2b3e50; /* Bleu marine */
    --background-color: #fff6ec; /* Fond beige clair */
    --text-color: #f47f3b;
    --white: #FFFFFF;
    --hover-color: #19242f;
}
```

**Key Sections:**
- Reset and global styles
- Header and navigation (.logo, .search-container, .icon-button, .header-right)
- Search bar styling (.search-box, .search-button, .search-icon)
- Main content sections (.section-title, .recent-searches, .trending-items, .item-card)
- Join/CTA banner (.join-us, .join-button)
- Footer styling (.footer-content, .footer-links, .social-icons)
- Events grid (.evenements-grid, .event-card, .event-content)
- User welcome message (.user-welcome, .welcome-text)
- Responsive design (media queries for 768px, 480px)

---

## 2. PANIER.CSS - Shopping Cart (276 lines)

**Key Classes:**
- `.cart-container` - Main cart layout
- `.cart-content` - Grid layout (products + summary)
- `.cart-items` - Vertical flex for cart items
- `.cart-item` - Individual item with image and details
- `.cart-summary` - Sticky summary sidebar
- `.checkout-button` - Payment button
- `.remove-item` - Remove from cart button
- `.modal` - Payment modal overlay
- `.modal-content` - Modal dialog
- `.payment-form` - Payment form styling
- `.form-group`, `.form-row` - Form field layout
- `.payment-submit` - Submit button

**Color Scheme:**
- Primary: #f47f3b (orange)
- Secondary: #2b3e50 (dark blue)
- Cards: White background with shadow
- Hover: Dark blue hover state
- Error: #e74c3c (red)

---

## 3. PRODUIT.CSS - Product Detail Page (446 lines)

**Key Sections:**

1. **Product Layout:**
   - `.product-container` - 2-column grid
   - `.product-image` - Left side image (100% width with hover border)
   - `.product-info` - Right side details
   - `.product-details` - Price, description, quantity
   - `.quantity-controls`, `.quantity-input` - Quantity selector
   - `.quantity-btn` - +/- buttons

2. **Add to Cart Button:**
   - `.CartBtn` - Primary action button (special icon animation)
   - `.IconContainer` - Icon that slides in on hover
   - `.text` - Button text that shifts on hover
   - Animation: Icon slides from left (-50px) to center (58px)

3. **Contact Seller:**
   - `.contact-seller` - Secondary button for messaging

4. **Reviews Section:**
   - `.avis-section` - Reviews container
   - `.avis-form` - Review form styling
   - `.rating` - Star rating system
   - `.form-control` - Textarea for review text
   - `.btn-submit` - Submit review button
   - `.avis-container` - Reviews list
   - `.avis-card` - Individual review card
   - `.avis-header`, `.avis-user`, `.avis-note`, `.avis-content`, `.avis-date`
   - `.no-avis` - Empty state message
   - `.alert`, `.alert-success`, `.alert-danger` - Alert notifications

---

## 4. PROFIL.CSS - User Profile Page (309 lines)

**Key Variables:**
```css
:root {
    --primary-color: #f47f3b;
    --primary-hover: #e96c25;
    --primary-active: #d55f1e;
    --secondary-color: #2b3e50;
    --background-color: #fff6ec;
    --text-color: #333333;
    --gray: #e0e0e0;
    --gray-light: #f7f7f7;
    --white: #FFFFFF;
    --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    --border-radius: 8px;
    --transition: all 0.3s ease;
}
```

**Key Classes:**
- `.profile-container` - Main layout (gap: 30px)
- `.profile-sidebar` - Left sidebar (width: 250px)
- `.sidebar-button` - Navigation buttons
- `.profile-content` - Right content area (flex: 1)
- `.profile-info` - User info sections
- `.info-group` - Individual info item with label and value
- `.info-value` - Editable info display
- `.modify-button` - Edit button (orange with padding)
- `.modal-container` - Modal overlay
- `.modal` - Modal dialog (width: 400px)
- `.modal input`, `.modal select` - Form inputs in modal
- `.save-button` - Save changes button (green: #4CAF50)
- `.close-button` - Close modal button
- `.logout-container`, `.logout-button` - Logout section (red: #dc3545)

**Animations:**
- `.profile-content` - Fade-in animation on load
- Hover effects on info groups (background color + translateX)

---

## 5. RECHERCHE.CSS - Search Results (109 lines)

**Layout:**
- `#search-results` - Grid layout (auto-fill minmax 280px)
- `.search-count` - Results counter (grid-column: 1 / -1)

**Product Cards:**
- `.product-card` - Card with flexbox column layout
- `.product-card img` - Product image (220px height, object-fit: cover)
- `.product-card h3` - Product title (color: primary)
- `.product-card .price` - Price styling (bold, secondary color)
- `.product-card .category` - Category tag (uppercase, primary color)
- `.product-card .artisan` - Seller name (italic, gray)
- `.product-card p` - Description (max-height: 85px, overflow hidden)
- `.product-card button` - Add to cart button

**Error Handling:**
- `.error-message` - Error notification (red background, spans full width)

---

## 6. FORMS.CSS - Form Styling (183 lines)

**Form Container:**
- `.form-container` - Centered flexbox column
- `.form-container h1` - Title (35px, primary color)

**Forms (Login/Register):**
- `.connexion-form`, `.inscription-form` - Main form boxes
  - Background: Primary color (#f47f3b)
  - Width: 450px
  - Padding: 30px 20px
  - Border-radius: 10px
  - Box-shadow with elevation
  - Hover: translateY(-8px)

**Form Groups:**
- `.form-group` - Wrapper for inputs
- `.form-group label` - Labels (bold, background color text)
- `.form-group input` - Text inputs
  - Border: 3px solid secondary color
  - Background: background color
  - Padding: 10px
- `.form-group select` - Dropdowns with custom styling
  - Custom dropdown arrow via SVG background
  - Appearance: none with webkit/moz overrides
- `.form-group textarea` - Text areas (min-height: 100px)

**Checkboxes:**
- `.checkbox-group` - Flex layout for checkboxes
- `.checkbox-group input[type="checkbox"]` - 25px square, styled border

**Buttons:**
- `.form-submit` - Submit button (secondary color background, white text)
  - Hover: darker hover-color
  - Full width

**Error Messages:**
- `.error-message` - Error styling (red background, border, shadow)
  - Padding: 12px
  - Width: 320px
  - Display: flex

**Success Messages:**
- `.message.success` - Green background (#d4edda) with dark text

---

## 7. AVIS.CSS - Reviews Section (165 lines)

**Section:**
- `.avis-section` - Margin: 2rem, padding: 1rem
- `.avis-form` - Form background (#f8f9fa), padding: 1.5rem

**Rating System:**
- `.rating` - Flex display with flex-direction: row-reverse
- `.rating input` - Hidden radio inputs
- `.rating label` - Clickable stars (cursor: pointer, 1.5rem font-size)
- Hover/Active: Color changes to #ffc107 (gold)

**Form Elements:**
- `.form-group` - Margin-bottom: 1rem
- `.form-control` - Full width inputs with light borders
- `textarea.form-control` - Min-height: 100px, resizable

**Submit Button:**
- `.btn-submit` - Blue background (#007bff), white text
  - Hover: Darker blue (#0056b3)

**Reviews Display:**
- `.avis-container` - Grid layout
- `.avis-card` - White background with shadow
- `.avis-header` - Flex layout with justify-content: space-between
- `.avis-user` - Flex with icon and name
- `.avis-note` - Gold color (#ffc107)
- `.avis-content` - Review text (color: #333)
- `.avis-date` - Timestamp (right-aligned, gray, italic)
- `.no-avis` - Empty state (center, padding: 2rem, light gray background)

**Alerts:**
- `.alert` - Fixed position (top-right), z-index: 1000
- `.alert-success` - Green (#d4edda) with dark text
- `.alert-danger` - Red (#f8d7da) with dark text
- Animation: slideIn (100ms translateX, opacity)

---

## CSS FILE SIZES

- style.css: ~563 lines
- panier.css: ~276 lines
- produit.css: ~446 lines
- profil.css: ~309 lines
- recherche.css: ~109 lines
- forms.css: ~183 lines
- avis.css: ~165 lines
- mes-annonces.css: (referenced, styling for product listings)
- ajouter-evenement.css: (referenced, styling for event form)
- admin.css: (referenced, admin panel)
- CGU.css: (referenced, legal page)
- faq.css: (referenced, FAQ)
- messagerie.css: (referenced, messaging)
- transactions.css: (referenced, orders)

---

## COLOR PALETTE SUMMARY

**Primary Brand:**
- Primary: #f47f3b (Orange) - Main CTA, links, highlights
- Secondary: #2b3e50 (Dark Blue) - Text, backgrounds, emphasis
- Background: #fff6ec (Light Beige) - Page background

**Functional Colors:**
- White: #FFFFFF - Content backgrounds, text
- Gray: #e0e0e0 - Borders, disabled states
- Light Gray: #f7f7f7, #f8f9fa - Hover backgrounds, cards
- Gold: #ffc107 - Star ratings
- Green: #4CAF50, #d4edda - Success messages and buttons
- Red: #e74c3c, #dc3545, #f8d7da - Delete, logout, error messages

---

## RESPONSIVE BREAKPOINTS

- **1200px and above**: Full desktop layout
- **768px**: Tablet breakpoint - adjusts footer, form fields, grid columns
- **480px**: Mobile breakpoint - full-width layouts, single column

---

## TRANSITION EFFECTS

- Default transition: `all 0.3s ease`
- Hover effects: Scale, translateY, background-color
- Animation: slideIn (300ms), fadeIn (500ms), modalFadeIn (300ms)

