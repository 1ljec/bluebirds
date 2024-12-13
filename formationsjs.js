let players = [];

// Function to fetch player names from JSON file
async function fetchPlayers() {
    try {
        const response = await fetch('players.json');
        players = await response.json();
        populatePlayerSelects();
    } catch (error) {
        console.error("Error fetching player data:", error);
    }
}

// Function to populate select options
function populatePlayerSelects() {
    const selects = document.querySelectorAll(".player-select");
    selects.forEach(select => {
        select.innerHTML = '<option value="">Select...</option>';
        players.forEach(player => {
            const option = document.createElement("option");
            option.value = player;
            option.textContent = player;
            select.appendChild(option);
        });
    });
}

// Function to update player summary
function updateSummary() {
    const summaryBody = document.getElementById("summary-body");
    const quarters = ["Q1", "Q2", "Q3", "Q4"];
    summaryBody.innerHTML = ""; // Clear the summary table

    quarters.forEach((quarter, index) => {
        const row = document.createElement("tr");
        const quarterCell = document.createElement("td");
        quarterCell.textContent = quarter;

        row.appendChild(quarterCell);
        for (let i = 0; i < 7; i++) {
            const playerCell = document.createElement("td");
            const playerSelects = document.querySelectorAll(`#q${index + 1} .player-select`);
            playerCell.textContent = playerSelects[i]?.value || "-";
            row.appendChild(playerCell);
        }
        summaryBody.appendChild(row);
    });
}

// Initialize the selects and summary
document.addEventListener("DOMContentLoaded", () => {
    fetchPlayers();

    // Add event listeners to update summary when a selection changes
    document.querySelectorAll(".player-select").forEach(select => {
        select.addEventListener("change", updateSummary);
    });

    // Initial summary
    updateSummary();
});
