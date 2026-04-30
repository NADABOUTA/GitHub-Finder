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

