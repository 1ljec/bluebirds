const players = [
    'Amelia', 'Chanel',  'Elsie',  
     'Harriet', 'Isla B',  'Molly' , 
     'Naynah', 'NewPlayer1'
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



function updatePlayerCounts() {
    // Reset counts
    players.forEach(player => {
        playerCount[player].q1 = 0;
        playerCount[player].q2 = 0;
        playerCount[player].q3 = 0;
        playerCount[player].q4 = 0;
   
    });

    // Sort players by total quarters played
const sortedPlayers = players.slice().sort((a, b) => {
    const totalA = playerCount[a].q1 + playerCount[a].q2 + playerCount[a].q3 + playerCount[a].q4; // + playerCount[a].q5 + playerCount[a].q6 + playerCount[a].q7;
    const totalB = playerCount[b].q1 + playerCount[b].q2 + playerCount[b].q3 + playerCount[b].q4; // + playerCount[a].q5 + playerCount[a].q6 + playerCount[a].q7;
    return totalB - totalA; // Sort in descending order
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
sortedPlayers.forEach(player => {
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
    if (quartersPlayed > 4) {
        row.classList.add('highlight');
    }
    tableBody.appendChild(row);
});




    // Highlight quarter column totals if they exceed 9
    for (let i = 1; i <= 4; i++) {
        const quarterTotalElement = document.getElementById('total-q' + i);
        const total = Object.values(playerCount).reduce((acc, curr) => acc + curr['q' + i], 0);
        if (total > 9) {
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

    
    
    // // Calculate summary statistics
    // const totalQuartersArray = Object.values(playerCount).map(player => player.q1 + player.q2 + player.q3 + player.q4);
    // const minQuarters = Math.min(...totalQuartersArray);
    // const maxQuarters = Math.max(...totalQuartersArray);
    // const avgQuarters = totalQuartersArray.reduce((acc, val) => acc + val, 0) / totalQuartersArray.length;

    // // Update summary table
    // document.getElementById('min-quarters').textContent = minQuarters;
    // document.getElementById('max-quarters').textContent = maxQuarters;
    // document.getElementById('avg-quarters').textContent = avgQuarters.toFixed(2);

     // Calculate summary statistics
     updateSummaryStatistics();
}

function updateSummaryStatistics() {
    const quartersPlayedArray = players.map(player => {
        return playerCount[player].q1 + playerCount[player].q2 + playerCount[player].q3 + playerCount[player].q4;
    }).filter(total => total > 0); // Exclude players with 0 total quarters

    if (quartersPlayedArray.length > 0) {
        const minQuarters = Math.min(...quartersPlayedArray);
        const maxQuarters = Math.max(...quartersPlayedArray);
        const avgQuarters = quartersPlayedArray.reduce((a, b) => a + b, 0) / quartersPlayedArray.length;

        document.getElementById('min-quarters').textContent = minQuarters;
        document.getElementById('max-quarters').textContent = maxQuarters;
        document.getElementById('avg-quarters').textContent = avgQuarters.toFixed(2);
    } else {
        document.getElementById('min-quarters').textContent = '0';
        document.getElementById('max-quarters').textContent = '0';
        document.getElementById('avg-quarters').textContent = '0.00';
    }
}



// Initialize player info on page load
updatePlayerInfo();



function exportDivToPDF(divId) {
 const element = document.getElementById(divId);
 
 // Ensure all images are loaded before converting to PDF
 const images = element.getElementsByTagName('img');
 const promises = Array.from(images).map(img => {
     return new Promise((resolve, reject) => {
         if (!img.complete) {
             img.onload = () => {
                 console.log('Image loaded: ' + img.src);
                 resolve();
             };
             img.onerror = () => {
                 console.error('Image failed to load: ' + img.src);
                 reject(new Error('Image failed to load: ' + img.src));
             };
         } else {
             console.log('Image already loaded: ' + img.src);
             resolve();
         }
     });
 });

 Promise.all(promises).then(() => {
     console.log('All images loaded, proceeding with PDF export.');
     const opt = {
         margin:       0.25,
         filename:     divId+'_formations.pdf',
         image:        { type: 'jpeg', quality: 0.98 },
         html2canvas:  { scale: 2, useCORS: true },
         jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
     };

     // Convert to PDF
     html2pdf().set(opt).from(element).save().catch((error) => {
         console.error('Error exporting div content to PDF:', error);
     });
 }).catch((error) => {
     console.error('Error loading images:', error);
 });
}



// Save player selections to localStorage
function saveSelections() {
    const selections = {};
    playerSelects.forEach(select => {
        const quarter = select.closest('.quarter').id;
        if (!selections[quarter]) selections[quarter] = {};
        selections[quarter][select.name] = select.value;
    });
    localStorage.setItem('playerSelections', JSON.stringify(selections));
}

// Load player selections from localStorage
function loadSelections() {
    const selections = JSON.parse(localStorage.getItem('playerSelections'));
    if (selections) {
        Object.keys(selections).forEach(quarter => {
            Object.keys(selections[quarter]).forEach(selectName => {
                const select = document.querySelector(`#${quarter} select[name="${selectName}"]`);
                if (select) {
                    select.value = selections[quarter][selectName];
                }
            });
        });
    }
}

// Add event listener for DOMContentLoaded to load selections and update player counts
document.addEventListener('DOMContentLoaded', (event) => {
    loadSelections();
    updatePlayerCounts();
    playerSelects.forEach(select => {
        select.addEventListener('change', () => {
            saveSelections();
            updatePlayerCounts();
        });
    });
});




//NAVIGATION MENU
/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }
  
  /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
  }

  document.addEventListener('DOMContentLoaded', (event) => {
    loadSelections();
    updatePlayerCounts();
    document.getElementById('available-players').addEventListener('change', updateAvailablePlayersText);
    document.getElementById('color-select').addEventListener('change', updateOptionColors);
    playerSelects.forEach(select => {
        select.addEventListener('change', () => {
            saveSelections();
            updatePlayerCounts();
        });
    });
});

function updateOptionColors() {
    const colorSelect = document.getElementById('color-select');
    const selectedOptions = Array.from(colorSelect.selectedOptions).map(option => option.value);

    playerSelects.forEach(select => {
        Array.from(select.options).forEach(option => {
            if (selectedOptions.includes(option.value)) {
                option.classList.add('option-highlight');
            } else {
                option.classList.remove('option-highlight');
            }
        });
    });
}
