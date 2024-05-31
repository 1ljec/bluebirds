const players = [
    'Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 
    'Player 6', 'Player 7', 'Player 8', 'Player 9', 'Player 10', 
    'Player 11', 'Player 12', 'Player 13', 'Player 14'
];

const playerCount = {};
players.forEach(player => {
    playerCount[player] = { q1: 0, q2: 0, q3: 0, q4: 0 };
});

const playerSelects = document.querySelectorAll('.player-select');

playerSelects.forEach(select => {
    select.addEventListener('change', updatePlayerCounts);
});

const availablePlayersSelect = document.getElementById('availablePlayers');
const playerInfo = document.getElementById('playerInfo');

//availablePlayersSelect.addEventListener('change', updatePlayerInfo);

/*function updatePlayerInfo() {
    const selectedValue = availablePlayersSelect.value;
    let infoText = "";

    switch (selectedValue) {
        case '7':
            infoText = "With 7 Players available, all 7 players will be playing all 4 quarters";
            break;
        case '8':
            infoText = "With 8 Players available, 5 players will be playing all 4 quarters, 2 players will have 3 quarters and 1 player will have 2 quarters of play";
            break;
        case '9':
            infoText = "With 9 Players available, 4 players will be playing all 4 quarters, 4 players will have 3 quarters and 1 player will have 2 quarters of play";
            break;
        case '10':
            infoText = "With 10 Players available, 3 players will be playing all 4 quarters, 6 players will have 3 quarters and 1 player will have 2 quarters of play";
            break;
        case '11':
            infoText = "With 11 Players available, 2 players will be playing all 4 quarters, 8 players will have 3 quarters and 1 player will have 2 quarters of play";
            break;
        case '12':
            infoText = "With 12 Players available, 1 player will be playing all 4 quarters, 9 players will have 3 quarters and 2 players will have 2 quarters of play";
            break;
        default:
            infoText = "";
    }

    playerInfo.textContent = infoText;
}
*/
function updatePlayerCounts() {
    // Reset counts
    players.forEach(player => {
        playerCount[player].q1 = 0;
        playerCount[player].q2 = 0;
        playerCount[player].q3 = 0;
        playerCount[player].q4 = 0;
    });

    // Count player selections
    playerSelects.forEach(select => {
        const selectedPlayer = select.value;
        const quarter = select.closest('.quarter').id;

        if (selectedPlayer) {
            playerCount[selectedPlayer][quarter]++;
        }
    });

    // Update table
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    let totalQuarters = 0;
    players.forEach(player => {
        const quartersPlayed = playerCount[player].q1 + playerCount[player].q2 + playerCount[player].q3 + playerCount[player].q4;
        totalQuarters += quartersPlayed;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player}</td>
            <td>${playerCount[player].q1}</td>
            <td>${playerCount[player].q2}</td>
            <td>${playerCount[player].q3}</td>
            <td>${playerCount[player].q4}</td>
            <td>${quartersPlayed}</td>
        `;
        let totalPlayerQuarters = playerCount[player].q1 + playerCount[player].q2 + playerCount[player].q3 + playerCount[player].q4;
        if (totalPlayerQuarters > 4) {
            row.classList.add('highlight');
        }
        tableBody.appendChild(row);
    });

    // Update total quarters
    const totalQuartersElement = document.getElementById('total-quarters');
    totalQuartersElement.textContent = totalQuarters;
    if (totalQuarters > 28) {
        totalQuartersElement.classList.add('highlight');
    } else {
        totalQuartersElement.classList.remove('highlight');
    }

    // Highlight quarter column totals if they exceed 7
    for (let i = 1; i <= 4; i++) {
        const quarterTotalElement = document.getElementById('total-q' + i);
        const total = Object.values(playerCount).reduce((acc, curr) => acc + curr['q' + i], 0);
        if (total > 7) {
            quarterTotalElement.classList.add('highlight');
        } else {
            quarterTotalElement.classList.remove('highlight');
        }
        quarterTotalElement.textContent = total;
    }

    // Highlight players with counts > 1 in each quarter
    players.forEach(player => {
        for (let i = 1; i <= 4; i++) {
            const quarterCount = playerCount[player]['q' + i];
            if (quarterCount > 1) {
                const playerRows = tableBody.getElementsByTagName('tr');
                for (let j = 0; j < playerRows.length; j++) {
                    if (playerRows[j].getElementsByTagName('td')[0].textContent === player) {
                        playerRows[j].classList.add('highlight');
                        break;
                    }
                }
            }
        }
    });

    // Calculate summary statistics
    const totalQuartersArray = Object.values(playerCount).map(player => player.q1 + player.q2 + player.q3 + player.q4);
    const minQuarters = Math.min(...totalQuartersArray);
    const maxQuarters = Math.max(...totalQuartersArray);
    const avgQuarters = totalQuartersArray.reduce((acc, val) => acc + val, 0) / totalQuartersArray.length;

    // Update summary table
    document.getElementById('min-quarters').textContent = minQuarters;
    document.getElementById('max-quarters').textContent = maxQuarters;
    document.getElementById('avg-quarters').textContent = avgQuarters.toFixed(2);
}

// Initialize player info on page load
//updatePlayerInfo();

