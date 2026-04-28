// ==================== DOM ELEMENTS ====================

const searchInput  = document.getElementById('searchInput');
const searchBtn    = document.getElementById('searchBtn');
const badge        = document.getElementById('badge');
const favCount     = document.getElementById('favCount');
const profileCard  = document.getElementById('profileCard');
const favListe     = document.getElementById('favListe');
const errorMessage = document.getElementById('errorMessage');

const welcomeSection = document.getElementById('welcomeSection');
const loadingSection = document.getElementById('loadingSection');
const errorSection   = document.getElementById('errorSection');
const resultsSection = document.getElementById('resultsSection');
const favSection     = document.getElementById('favSection');

const btnSearch  = document.getElementById('btnSearch');
const btnFavoris = document.getElementById('btnFavoris');

// ==================== DISPLAY USER ====================

function displayUserProfile(user) {
  profileCard.innerHTML = `
    <div>
      <img src="${user.avatar_url}" />
      <h2>${user.name || user.login}</h2>
      <p>@${user.login}</p>
    </div>
  `;

  afficherSection('resultsSection');
}

// ==================== DISPLAY REPOS ====================

function displayRepositories(repos) {
  const container = document.createElement('div');

  repos.forEach(repo => {
    const div = document.createElement('div');
    div.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      <p>${repo.description || ''}</p>
    `;
    container.appendChild(div);
  });

  resultsSection.appendChild(container);
}

// ==================== EVENTS ====================

searchBtn.addEventListener('click', lancerRecherche);

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') lancerRecherche();
});

// ==================== INIT ====================

showWelcome();