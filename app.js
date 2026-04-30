// ==================== State ====================
var state = {
  currentUser: null,           // L'utilisateur affiché en ce moment
  bookmarks: [],               // La liste des favoris
  isViewingBookmarks: false    // Est-ce qu'on regarde les favoris ?
};

// ==================== DOM ELEMENTS ====================


var searchInput        = document.getElementById("searchInput");
var searchBtn          = document.getElementById("searchBtn");

var welcomeState       = document.getElementById("welcomeState");
var loadingState       = document.getElementById("loadingState");
var errorState         = document.getElementById("errorState");
var resultsState       = document.getElementById("resultsState");
var bookmarksState     = document.getElementById("bookmarksState");

var errorMessage       = document.getElementById("errorMessage");

var userAvatar         = document.getElementById("userAvatar");
var userName           = document.getElementById("userName");
var userLogin          = document.getElementById("userLogin");
var userBio            = document.getElementById("userBio");
var userLocation       = document.getElementById("userLocation");
var userFollowers      = document.getElementById("userFollowers");
var userFollowing      = document.getElementById("userFollowing");
var userRepos          = document.getElementById("userRepos");
var userGithubLink     = document.getElementById("userGithubLink");

var reposList          = document.getElementById("reposList");

var bookmarkBtn        = document.getElementById("bookmarkBtn");
var bookmarkBtnText    = document.getElementById("bookmarkBtnText");
var bookmarkCount      = document.getElementById("bookmarkCount");
var bookmarksList      = document.getElementById("bookmarksList");
var totalBookmarks     = document.getElementById("totalBookmarks");
var emptyBookmarks     = document.getElementById("emptyBookmarks");
var bookmarksToggleBtn = document.getElementById("bookmarksToggleBtn");


// ==================== UI STATE FUNCTIONS ====================


// Cache toutes les sections
function hideAllStates() {
  welcomeState.classList.add("hidden");
  loadingState.classList.add("hidden");
  errorState.classList.add("hidden");
  resultsState.classList.add("hidden");
  bookmarksState.classList.add("hidden");
}

// Affiche l'écran d'accueil
function showWelcome() {
  hideAllStates();
  welcomeState.classList.remove("hidden");
  state.isViewingBookmarks = false;
}

// Affiche le loader (pendant la requête API)
function showLoading() {
  hideAllStates();
  loadingState.classList.remove("hidden");
}

// Affiche un message d'erreur
function showError(message) {
  hideAllStates();
  errorState.classList.remove("hidden");
  errorMessage.textContent = message;
}

// Affiche les résultats (profil + repos)
function showResults() {
  hideAllStates();
  resultsState.classList.remove("hidden");
  state.isViewingBookmarks = false;
}

// Affiche la liste des favoris
function showBookmarks() {
  hideAllStates();
  bookmarksState.classList.remove("hidden");
  state.isViewingBookmarks = true;
  renderBookmarksList();
}

// Formate un nombre 
function formatNumber(number) {
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + "k";
  }
  return number;
}


// ==================== DISPLAY FUNCTIONS ====================
// Ces fonctions mettent les données dans la page HTML

// Affiche le profil d'un utilisateur
function displayUserProfile(user) {

  // On met chaque donnée dans l'élément HTML correspondant
  userAvatar.src = user.avatar_url;
  userAvatar.alt = "Avatar de " + user.login;

  // Si l'utilisateur a un nom → on l'affiche, sinon on affiche le login
  if (user.name) {
    userName.textContent = user.name;
  } else {
    userName.textContent = user.login;
  }

  userLogin.textContent = "@" + user.login;
  userLogin.href        = user.html_url;

  // Si pas de bio, on met une chaîne vide (rien n'apparaît)
  if (user.bio) {
    userBio.textContent = user.bio;
  } else {
    userBio.textContent = "";
  }

  // Pareil pour la localisation
  if (user.location) {
    userLocation.textContent = user.location;
  } else {
    userLocation.textContent = "";
  }

  // Les statistiques
  userFollowers.textContent = formatNumber(user.followers);
  userFollowing.textContent = formatNumber(user.following);
  userRepos.textContent     = user.public_repos;

  // Le lien vers GitHub
  userGithubLink.href = user.html_url;

  // Met à jour le bouton favori
  updateBookmarkButton(user.login);

  // Affiche la section résultats
  showResults();
}

// Affiche la liste des repositories
function displayRepositories(repos) {

  // On vide d'abord la liste
  reposList.innerHTML = "";

  // Si aucun repo
  if (repos.length === 0) {
    reposList.innerHTML = "<p style='color:#8b949e;font-size:0.85rem;'>Aucun repository public.</p>";
    return;
  }

  // Pour chaque repo, on crée une carte HTML
  for (var i = 0; i < repos.length; i++) {
    var repo = repos[i];

    // Crée (lien cliquable)
    var card = document.createElement("a");
    card.href      = repo.html_url;
    card.target    = "_blank";
    card.className = "repo-card";

    // Description : si elle existe on la met, sinon rien
    var descriptionHTML = "";
    if (repo.description) {
      descriptionHTML = "<div class='repo-desc'>" + repo.description + "</div>";
    }

    // Langage : si renseigné on l'affiche
    var languageHTML = "";
    if (repo.language) {
      var color = getLanguageColor(repo.language);
      languageHTML = "<span class='repo-badge'><span class='lang-dot' style='background:" + color + "'></span>" + repo.language + "</span>";
    }

    // On construit le contenu HTML de la carte
    card.innerHTML =
      "<div class='repo-name'>" + repo.name + "</div>" +
      descriptionHTML +
      "<div class='repo-meta'>" +
        languageHTML +
        "<span class='repo-badge'>⭐ " + formatNumber(repo.stargazers_count) + "</span>" +
        "<span class='repo-badge'>🍴 " + formatNumber(repo.forks_count) + "</span>" +
      "</div>";

    // Ajoute la carte dans la liste
    reposList.appendChild(card);
  }
}

// Retourne une couleur selon le langage
function getLanguageColor(language) {
  if (language === "JavaScript") return "#f1e05a";
  if (language === "TypeScript") return "#3178c6";
  if (language === "Python")     return "#3572A5";
  if (language === "Java")       return "#b07219";
  if (language === "C")          return "#555555";
  if (language === "C++")        return "#f34b7d";
  if (language === "Go")         return "#00ADD8";
  if (language === "Rust")       return "#dea584";
  if (language === "Ruby")       return "#701516";
  if (language === "PHP")        return "#4F5D95";
  if (language === "CSS")        return "#563d7c";
  if (language === "HTML")       return "#e34c26";
  if (language === "Shell")      return "#89e051";
  return "#8b949e"; // couleur par défaut
}

// ==================== BOOKMARKS LOGIC ====================
// Tout ce qui concerne les favoris : ajout, suppression, affichage

// Charge les favoris depuis localStorage au démarrage
function loadBookmarksFromStorage() {
  var saved = localStorage.getItem("github_finder_bookmarks");

  // Si des favoris existent (saved n'est pas null)
  if (saved) {
    // JSON.parse convertit le texte en tableau JavaScript
    state.bookmarks = JSON.parse(saved);
  }

  updateBookmarkCount();
}

// Sauvegarde les favoris dans localStorage
function saveBookmarksToStorage() {
  // JSON.stringify convertit le tableau en texte pour le stocker
  localStorage.setItem("github_finder_bookmarks", JSON.stringify(state.bookmarks));
}

// Met à jour le compteur affiché dans la navbar
function updateBookmarkCount() {
  var count = state.bookmarks.length;
  bookmarkCount.textContent  = count;
  totalBookmarks.textContent = count + " profil(s)";
}

// Vérifie si un utilisateur est déjà dans les favoris
function isBookmarked(login) {
  for (var i = 0; i < state.bookmarks.length; i++) {
    if (state.bookmarks[i].login === login) {
      return true;
    }
  }
  return false;
}

// Ajoute un utilisateur aux favoris
function addBookmark(user) {
  var bookmark = {
    id:         user.id,
    login:      user.login,
    name:       user.name || user.login,
    avatar_url: user.avatar_url
  };

  state.bookmarks.push(bookmark);
  saveBookmarksToStorage();
  updateBookmarkCount();
}

// Supprime un utilisateur des favoris
function removeBookmark(login) {
  var newBookmarks = [];

  // On recopie tous les favoris SAUF celui qu'on veut supprimer
  for (var i = 0; i < state.bookmarks.length; i++) {
    if (state.bookmarks[i].login !== login) {
      newBookmarks.push(state.bookmarks[i]);
    }
  }

  state.bookmarks = newBookmarks;
  saveBookmarksToStorage();
  updateBookmarkCount();
}

// Ajoute ou supprime un favori selon l'état actuel
function toggleBookmark() {
  if (!state.currentUser) return;

  if (isBookmarked(state.currentUser.login)) {
    removeBookmark(state.currentUser.login);
  } else {
    addBookmark(state.currentUser);
  }

  updateBookmarkButton(state.currentUser.login);
}

// Change l'apparence du bouton favori
function updateBookmarkButton(login) {
  if (isBookmarked(login)) {
    bookmarkBtn.classList.add("active");
    bookmarkBtnText.textContent = "Sauvegardé";
  } else {
    bookmarkBtn.classList.remove("active");
    bookmarkBtnText.textContent = "Ajouter";
  }
}

// Affiche la liste des favoris dans la page
function renderBookmarksList() {
  bookmarksList.innerHTML = "";

  // Si aucun favori, on affiche le message vide
  if (state.bookmarks.length === 0) {
    emptyBookmarks.classList.remove("hidden");
    return;
  }

  emptyBookmarks.classList.add("hidden");

  // On crée une carte pour chaque favori
  for (var i = 0; i < state.bookmarks.length; i++) {
    var bookmark = state.bookmarks[i];

    var item = document.createElement("div");
    item.className = "bookmark-item";

    item.innerHTML =
      "<img class='bookmark-avatar' src='" + bookmark.avatar_url + "' alt='Avatar de " + bookmark.login + "' />" +
      "<div class='bookmark-info'>" +
        "<div class='bookmark-name'>" + bookmark.name + "</div>" +
        "<div class='bookmark-login'>@" + bookmark.login + "</div>" +
      "</div>" +
      "<div class='bookmark-actions'>" +
        "<button class='btn-load' data-login='" + bookmark.login + "'>Voir</button>" +
        "<button class='btn-remove' data-login='" + bookmark.login + "'>✕</button>" +
      "</div>";

    bookmarksList.appendChild(item);
  }

  // Ajoute les événements sur les boutons "Voir" et "✕"
  var loadButtons   = document.querySelectorAll(".btn-load");
  var removeButtons = document.querySelectorAll(".btn-remove");

  for (var j = 0; j < loadButtons.length; j++) {
    loadButtons[j].addEventListener("click", function() {
      var login = this.getAttribute("data-login");
      searchInput.value = login;
      searchUser(login);
    });
  }

  for (var k = 0; k < removeButtons.length; k++) {
    removeButtons[k].addEventListener("click", function() {
      var login = this.getAttribute("data-login");
      removeBookmark(login);
      renderBookmarksList();
    });
  }
}


// ==================== API FUNCTIONS ====================
// Les requêtes vers l'API GitHub 

// Récupère les données d'un utilisateur GitHub
async function fetchUser(username) {
  // Hkki s7i7 b backticks
var response = await fetch("https://api.github.com/users/" + username, {
  headers: {
    Authorization: `token ${env.token}`
  }
});
  // On vérifie le code de statut HTTP de la réponse
  if (response.status === 404) {
    throw new Error("Utilisateur \"" + username + "\" non trouvé");
  }

  if (response.status === 403) {
    throw new Error("Limite API atteinte. Réessayez dans quelques minutes.");
  }

  if (!response.ok) {
    throw new Error("Une erreur inattendue est survenue.");
  }

  // Convertit la réponse en objet JavaScript
  var data = await response.json();
  return data;
}

// Récupère les repositories d'un utilisateur
async function fetchUserRepos(username) {
  var response = await fetch(
    "https://api.github.com/users/" + username + "/repos?sort=stars&per_page=6"
  );

  if (response.status === 403) {
    throw new Error("Limite API atteinte.");
  }

  if (!response.ok) {
    throw new Error("Impossible de récupérer les repositories.");
  }

  var data = await response.json();
  return data;
}

// Fonction principale : cherche un utilisateur et affiche son profil
async function searchUser(username) {

  // Supprime les espaces au début et à la fin
  var trimmed = username.trim();

  // Si le champ est vide, on ne fait rien
  if (trimmed === "") return;

  // Affiche le loader
  showLoading();

  try {
    // Requête 1 : le profil
    var user = await fetchUser(trimmed);
    state.currentUser = user;

    // Requête 2 : les repositories
    var repos = await fetchUserRepos(trimmed);

    // Affichage
    displayUserProfile(user);
    displayRepositories(repos);

  } catch (error) {
    // En cas d'erreur, on affiche le message
    showError(error.message);
  }
}


// ==================== EVENT LISTENERS + INIT ====================
// Les événements : que se passe-t-il quand l'utilisateur clique / tape ?

// Clic sur le bouton "Rechercher"
searchBtn.addEventListener("click", function() {
  searchUser(searchInput.value);
});

// Appui sur la touche Entrée dans le champ
searchInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    searchUser(searchInput.value);
  }
});

// Clic sur "Favoris" dans la navbar
bookmarksToggleBtn.addEventListener("click", function() {
  if (state.isViewingBookmarks) {
    // Si on est déjà sur les favoris → retour aux résultats ou accueil
    if (state.currentUser) {
      showResults();
    } else {
      showWelcome();
    }
  } else {
    showBookmarks();
  }
});

// Clic sur le bouton "Ajouter / Sauvegardé"
bookmarkBtn.addEventListener("click", function() {
  toggleBookmark();
});

// Bouton "Nouvelle recherche" sur l'écran d'erreur
document.getElementById("retryBtn").addEventListener("click", function() {
  showWelcome();
  searchInput.value = "";
  searchInput.focus();
});

// Les chips de suggestion (torvalds, gvanrossum, github)
var chips = document.querySelectorAll(".suggestion-chip");
for (var i = 0; i < chips.length; i++) {
  chips[i].addEventListener("click", function() {
    var user = this.getAttribute("data-user");
    searchInput.value = user;
    searchUser(user);
  });
}


// ==================== INITIALISATION ====================

loadBookmarksFromStorage();
showWelcome();

