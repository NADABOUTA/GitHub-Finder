// ==================== TEST DATA ====================
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

const testRepos = [
    {
        name: "linux",
        description: "Linux kernel",
        language: "C",
        stargazers_count: 15000,
        forks_count: 2000,
        html_url: "https://github.com/torvalds/linux"
    },
    {
        name: "cpython",
        description: "Python interpreter",
        language: "C",
        stargazers_count: 50000,
        forks_count: 23000,
        html_url: "https://github.com/python/cpython"
    }
];
// ==================== STATE ====================

const state = {
    currentUser: null,
    bookmarks: [],
    isViewingBookmarks: false
};
// ==================== DOM ELEMENTS ====================

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const userProfile = document.getElementById('userProfile');
const reposList = document.getElementById('reposList');
const welcomeState = document.getElementById('welcomeState');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const bookmarksList = document.getElementById('bookmarksList');
const bookmarkCount = document.getElementById('bookmarkCount');

// ==================== DISPLAY FUNCTIONS ====================
function displayUserProfile(user) {
    // Mettre à jour les éléments du profil
    document.getElementById('userAvatar').src = user.avatar_url;
    document.getElementById('userAvatar').alt = user.login;
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userBio').textContent = user.bio || "";
    document.getElementById('userFollowers').textContent = user.followers;
    document.getElementById('userFollowing').textContent = user.following;
    document.getElementById('userRepos').textContent = user.public_repos;
    document.getElementById('userGithubLink').href = "https://github.com/" + user.login;

    // Masquer tous les autres états
    welcomeState.classList.add('hidden');
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');

    // Afficher resultsState
    document.getElementById('resultsState').classList.remove('hidden');
}
function displayRepositories(repos) {
    // Vider la liste
    reposList.innerHTML = "";

    // Parcourir les repos et créer une carte pour chacun
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
// ==================== STATE FUNCTIONS ====================

// Afficher le loader
function showLoading() {
    welcomeState.classList.add('hidden');
    errorState.classList.add('hidden');
    document.getElementById('resultsState').classList.add('hidden');
    loadingState.classList.remove('hidden');
}

function showError(message) {
    welcomeState.classList.add('hidden');
    loadingState.classList.add('hidden');
    document.getElementById('resultsState').classList.add('hidden');
    errorState.classList.remove('hidden');
    document.getElementById('errorMessage').textContent = message;
}

function showWelcome() {
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    document.getElementById('resultsState').classList.add('hidden');
    welcomeState.classList.remove('hidden');
}
// ==================== API FUNCTIONS ====================

async function fetchUser(username) {
    try {
        showLoading();
        
        const response = await fetch(`https://api.github.com/users/${username}`);
        
        if (response.status === 404) {
            throw new Error(`User "@${username}" not found`);
        } else if (response.status === 403) {
            throw new Error('Rate limit reached. Try again later.');
        } else if (!response.ok) {
            throw new Error('Unexpected error occurred');
        }
        
        const user = await response.json();
        state.currentUser = user;
        displayUserProfile(user);
        
        // Fetch repos aussi
        fetchUserRepos(username);
        
    } catch (error) {
        showError(error.message);
    }
}
// ==// ==================== EVENT LISTENERS ====================

searchBtn.addEventListener('click', () => {
    const username = searchInput.value.trim();
    if (username !== "") {
        fetchUser(username);
    } else {
        showError("Veuillez entrer un nom d'utilisateur");
    }
});

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
///////// ==================== REPOS FUNCTIONS ====================
async function fetchUserRepos(username) {
    try {
        const response = await fetch(
            `https://api.github.com/users/${username}/repos?sort=stars&per_page=5`
        );
        
        if (!response.ok) {
            throw new Error('Could not fetch repositories');
        }
        
        const repos = await response.json();
        displayRepositories(repos);
        
    } catch (error) {
        reposList.innerHTML = `<p style="color: var(--danger)">Could not load repos</p>`;
    }
}

// ==================== INITIALIZE ====================

showWelcome();

