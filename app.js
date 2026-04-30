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
