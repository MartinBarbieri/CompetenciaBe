const loginBtn = document.getElementById('login-btn');
const loginModal = document.getElementById('login-modal');
const closeBtn = document.querySelector('.close');
const loginSubmit = document.getElementById('login-submit');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const adminPanel = document.getElementById('admin-panel');
const addTeamBtn = document.getElementById('add-team');
const teamNameInput = document.getElementById('team-name');
const teamCategorySelect = document.getElementById('team-category');
const beginnerTable = document.getElementById('beginner-table').getElementsByTagName('tbody')[0];
const advancedTable = document.getElementById('advanced-table').getElementsByTagName('tbody')[0];
const confirmChangesBtn = document.getElementById('confirm-changes');
const clearDataBtn = document.createElement('button'); // Nuevo botón

let isLoggedIn = false;
let teams = JSON.parse(localStorage.getItem('teams')) || [];

function saveTeams() {
    localStorage.setItem('teams', JSON.stringify(teams));
}

function clearData() {
    localStorage.removeItem('teams');
    teams = [];
    updateTables();
}

loginBtn.onclick = function() {
    loginModal.style.display = 'block';
}

closeBtn.onclick = function() {
    loginModal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == loginModal) {
        loginModal.style.display = 'none';
    }
}

loginSubmit.onclick = function() {
    if (usernameInput.value === 'admin' && passwordInput.value === '1234') {
        isLoggedIn = true;
        loginModal.style.display = 'none';
        adminPanel.classList.remove('hidden');
        document.querySelectorAll('.admin-col').forEach(col => col.style.display = 'table-cell');

        // Agregar el botón "Limpiar Datos"
        clearDataBtn.textContent = 'Limpiar Datos';
        clearDataBtn.onclick = clearData;
        adminPanel.appendChild(clearDataBtn);

        updateTables();
    } else {
        loginError.textContent = 'Usuario o contraseña incorrectos.';
    }
}

addTeamBtn.onclick = function() {
    const teamName = teamNameInput.value;
    const teamCategory = teamCategorySelect.value;
    teams.push({ name: teamName, category: teamCategory, wod1: 0, wod2: 0, final: 0, total: 0 });
    saveTeams();
    updateTables();
}

function updateTables() {
    beginnerTable.innerHTML = '';
    advancedTable.innerHTML = '';

    const sortedTeams = teams.slice().sort((a, b) => b.total - a.total);

    sortedTeams.forEach((team, index) => {
        team.total = team.wod1 + team.wod2 + team.final;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}°</td>
            <td>${team.name}</td>
            <td class="wod1">${team.wod1}</td>
            <td class="wod2">${team.wod2}</td>
            <td class="final">${team.final}</td>
            <td class="total">${team.total}</td>
            <td class="admin-col">
                <button onclick="editTeam('${team.name}')">Editar</button>
            </td>
        `;

        if (isLoggedIn) {
            row.querySelector('.admin-col').style.display = 'table-cell';
        }

        if (team.category === 'Principiante') {
            beginnerTable.appendChild(row);
        } else {
            advancedTable.appendChild(row);
        }
    });
}

function editTeam(teamName) {
    const team = teams.find(t => t.name === teamName);
    if (team) {
        const newName = prompt('Ingrese el nuevo nombre del equipo:', team.name);
        const newWod1 = prompt('Ingrese el puntaje de WOD 1:', team.wod1);
        const newWod2 = prompt('Ingrese el puntaje de WOD 2:', team.wod2);
        const newFinal = prompt('Ingrese el puntaje de la Final:', team.final);
        if (newName !== null && newWod1 !== null && newWod2 !== null && newFinal !== null) {
            team.name = newName;
            team.wod1 = parseInt(newWod1);
            team.wod2 = parseInt(newWod2);
            team.final = parseInt(newFinal);
            saveTeams();
            updateTables();
        }
    }
}

confirmChangesBtn.onclick = function() {
    isLoggedIn = false;
    adminPanel.classList.add('hidden');
    document.querySelectorAll('.admin-col').forEach(col => col.style.display = 'none');

    // Eliminar el botón "Limpiar Datos"
    if (clearDataBtn.parentNode) {
        adminPanel.removeChild(clearDataBtn);
    }

    updateTables();
}

updateTables();