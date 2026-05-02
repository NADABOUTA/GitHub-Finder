// ==================== DONNÉES DE TEST ====================
// Utilisées pour tester l'affichage sans appeler l'API
const testUsers = [
    {
        id: 1,
        login: "torvalds",
        name: "Linus Torvalds",
        avatar_url: "https://avatars.githubusercontent.com/u/1024588?v=4",
        bio: "Linux creator",
        followers: 200000,
        following: 0,
        public_repos: 50
    },
    {
        id: 2,
        login: "gvanrossum",
        name: "Guido van Rossum",
        avatar_url: "https://avatars.githubusercontent.com/u/6490553?v=4",
        bio: "Python creator",
        followers: 50000,
        following: 50,
        public_repos: 30
    }
];

// ==================== ÉTAT CENTRALISÉ ====================

const state = {
    currentUser: null,
    bookmarks: JSON.parse(localStorage.getItem('githubBookmarks')) || [],
    isViewingBookmarks: false
};

// ==================== ÉLÉMENTS DU DOM ====================
//  récupère les éléments HTML 
const searchInput   = document.getElementById('searchInput');
const searchBtn     = document.getElementById('searchBtn');
const reposList     = document.getElementById('reposList');
const welcomeState  = document.getElementById('welcomeState');
const loadingState  = document.getElementById('loadingState');
const errorState    = document.getElementById('errorState');
const bookmarksList = document.getElementById('bookmarksList');
const bookmarkCount = document.getElementById('bookmarkCount');

// ==================== FONCTIONS D'ÉTAT ====================
// Ces fonctions affichent un écran et cachent les autres

function showLoading() {
    welcomeState.classList.add('hidden');
    errorState.classList.add('hidden');
    document.getElementById('resultsState').classList.add('hidden');
    document.getElementById('bookmarksState').classList.add('hidden');
    loadingState.classList.remove('hidden');
}

function showError(message) {
    welcomeState.classList.add('hidden');
    loadingState.classList.add('hidden');
    document.getElementById('resultsState').classList.add('hidden');
    document.getElementById('bookmarksState').classList.add('hidden');
    errorState.classList.remove('hidden');
    document.getElementById('errorMessage').textContent = message;
}

function showWelcome() {
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    document.getElementById('resultsState').classList.add('hidden');
    document.getElementById('bookmarksState').classList.add('hidden');
    welcomeState.classList.remove('hidden');
}

// ==================== FONCTIONS D'AFFICHAGE ====================

// Affiche le profil d'un utilisateur
function displayUserProfile(user) {
    document.getElementById('userAvatar').src      = user.avatar_url;
    document.getElementById('userAvatar').alt      = user.login;
    document.getElementById('userName').textContent = user.name || user.login;
    document.getElementById('userLogin').textContent = "@" + user.login;
    document.getElementById('userLogin').href       = user.html_url;
    document.getElementById('userBio').textContent  = user.bio || "";
    document.getElementById('userLocation').textContent = user.location || "";
    document.getElementById('userFollowers').textContent = user.followers;
    document.getElementById('userFollowing').textContent = user.following;
    document.getElementById('userRepos').textContent     = user.public_repos;
    document.getElementById('userGithubLink').href       = user.html_url;

    // On vérifie si cet utilisateur est déjà en favori
    const isBookmarked = state.bookmarks.find((b) => b.id === user.id);
    updateBookmarkButton(isBookmarked);

    // On affiche l'écran résultats
    welcomeState.classList.add('hidden');
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    document.getElementById('bookmarksState').classList.add('hidden');
    document.getElementById('resultsState').classList.remove('hidden');
}

// Affiche la liste des repositories
function displayRepositories(repos) {
    reposList.innerHTML = "";

    // Pour chaque repo on crée une carte et on l'ajoute à la page
    repos.forEach((repo) => {
        const card = document.createElement('div');
        card.className = "repo-card";
        card.innerHTML = `
            <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
            <p>${repo.description || "Pas de description"}</p>
            <span>⭐ ${repo.stargazers_count}</span>
            <span>🍴 ${repo.forks_count}</span>
            <span>💻 ${repo.language || "N/A"}</span>
        `;
        reposList.appendChild(card);
    });
}

// Affiche la liste des favoris
function displayBookmarks() {
    const emptyBookmarks = document.getElementById('emptyBookmarks');

    // Si aucun favori → message liste vide
    if (state.bookmarks.length === 0) {
        bookmarksList.innerHTML = "";
        emptyBookmarks.classList.remove('hidden');
        return;
    }

    emptyBookmarks.classList.add('hidden');
    bookmarksList.innerHTML = "";

    state.bookmarks.forEach((bookmark) => {
        const item = document.createElement('div');
        item.className = "bookmark-item";
        item.innerHTML = `
            <img src="${bookmark.avatar_url}" alt="${bookmark.login}" class="bookmark-avatar" />
            <div class="bookmark-info">
                <p class="bookmark-name">${bookmark.name || bookmark.login}</p>
                <p class="bookmark-login">@${bookmark.login}</p>
            </div>
            <div class="bookmark-actions">
                <button class="btn-load" onclick="loadFromBookmark('${bookmark.login}')">Charger</button>
                <button class="btn-remove" onclick="removeBookmark(${bookmark.id})">✕</button>
            </div>
        `;
        bookmarksList.appendChild(item);
    });
}

// ==================== FONCTIONS FAVORIS ====================

// Met à jour le compteur de favoris dans la navbar
function updateBookmarkCount() {
    bookmarkCount.textContent = state.bookmarks.length;
    document.getElementById('totalBookmarks').textContent =
        state.bookmarks.length + " profil(s)";
}

// Change l'apparence du bouton selon si c'est un favori ou non
function updateBookmarkButton(isBookmarked) {
    const btn     = document.getElementById('bookmarkBtn');
    const btnText = document.getElementById('bookmarkBtnText');

    if (isBookmarked) {
        btn.classList.add('active');
        btnText.textContent = "Sauvegardé";
    } else {
        btn.classList.remove('active');
        btnText.textContent = "Ajouter";
    }
}

// Ajoute ou retire un favori
function toggleBookmark() {
    const user = state.currentUser;
    if (!user) return;

    const isBookmarked = state.bookmarks.find((b) => b.id === user.id);

    if (isBookmarked) {
        // Déjà en favori → on le retire
        state.bookmarks = state.bookmarks.filter((b) => b.id !== user.id);
    } else {
        // Pas encore en favori → on l'ajoute
        state.bookmarks.push({
            id: user.id,
            login: user.login,
            name: user.name,
            avatar_url: user.avatar_url
        });
    }

    // On sauvegarde dans localStorage pour persister après rechargement
    localStorage.setItem('githubBookmarks', JSON.stringify(state.bookmarks));

    updateBookmarkCount();
    updateBookmarkButton(!isBookmarked);
}

// Supprime un favori par son id
function removeBookmark(id) {
    state.bookmarks = state.bookmarks.filter((b) => b.id !== id);
    localStorage.setItem('githubBookmarks', JSON.stringify(state.bookmarks));
    updateBookmarkCount();
    displayBookmarks();
}

// Bascule entre la vue favoris et la vue résultats
function toggleBookmarksView() {
    state.isViewingBookmarks = !state.isViewingBookmarks;

    if (state.isViewingBookmarks) {
        welcomeState.classList.add('hidden');
        loadingState.classList.add('hidden');
        errorState.classList.add('hidden');
        document.getElementById('resultsState').classList.add('hidden');
        document.getElementById('bookmarksState').classList.remove('hidden');
        displayBookmarks();
    } else {
        document.getElementById('bookmarksState').classList.add('hidden');
        showWelcome();
    }
}

// Charge un profil depuis les favoris
function loadFromBookmark(login) {
    state.isViewingBookmarks = false;
    document.getElementById('bookmarksState').classList.add('hidden');
    searchInput.value = login;
    fetchUser(login);
}

// ==================== FONCTIONS API ====================

// Récupère les données d'un utilisateur depuis l'API GitHub
async function fetchUser(username) {
    try {
        showLoading();

        const response = await fetch(`https://api.github.com/users/${username}`);

        // Gestion des erreurs HTTP
        if (response.status === 404) {
            throw new Error(`Utilisateur "@${username}" introuvable`);
        } else if (response.status === 403) {
            throw new Error('Limite API atteinte. Réessayez plus tard.');
        } else if (!response.ok) {
            throw new Error('Une erreur inattendue est survenue');
        }

        // On convertit la réponse JSON en objet JavaScript
        const user = await response.json();
        state.currentUser = user;
        displayUserProfile(user);
        fetchUserRepos(username);

    } catch (error) {
        showError(error.message);
    }
}

// Récupère les 5 repositories les plus populaires
async function fetchUserRepos(username) {
    try {
        const response = await fetch(
            `https://api.github.com/users/${username}/repos?sort=stars&per_page=5`
        );

        if (!response.ok) throw new Error('Impossible de charger les repositories');

        const repos = await response.json();
        displayRepositories(repos);

    } catch (error) {
        reposList.innerHTML = `<p style="color:var(--danger)">Impossible de charger les repos</p>`;
    }
}

// ==================== ÉCOUTEURS D'ÉVÉNEMENTS ====================

// Clic sur le bouton Rechercher
searchBtn.addEventListener('click', () => {
    const username = searchInput.value.trim();
    if (username !== "") {
        fetchUser(username);
    } else {
        showError("Veuillez entrer un nom d'utilisateur");
    }
});

// Touche Entrée dans le champ de recherche
searchInput.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        const username = searchInput.value.trim();
        if (username !== "") {
            fetchUser(username);
        } else {
            showError("Veuillez entrer un nom d'utilisateur");
        }
    }
});

// Bouton Ajouter/Retirer favori
document.getElementById('bookmarkBtn')
    .addEventListener('click', toggleBookmark);

// Bouton Favoris dans la navbar
document.getElementById('bookmarksToggleBtn')
    .addEventListener('click', toggleBookmarksView);

// Bouton Nouvelle recherche dans l'écran erreur
document.getElementById('retryBtn')
    .addEventListener('click', showWelcome);

// ==================== INITIALISATION ====================
updateBookmarkCount();
showWelcome();