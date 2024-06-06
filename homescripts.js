// Function to create tiles dynamically
function createTiles() {
    // Define the tile content
    var tileContent = [
      { title: 'Eagles Match', icon: 'fa-solid fa-futbol', hyperlink: './eagles.html', text: 'Make notes on the game, record goals as they happen and use 12.5m/15m timer' },
      { title: 'Eagles Formations', icon:'fa-solid fa-bezier-curve', hyperlink: './formations/formation-3-1-2-Eagles.html',text: 'Create match plans & formations and see summary infomation on how many quarters each players are on pitch' },
      { title: 'Bluebirds Match', icon: 'fa-solid fa-futbol', hyperlink: './Bluebirds.html', text: 'Make notes on the game, record goals as they happen and use 12.5m/15m timer' },
      { title: 'Bluebirds Formations', icon:'fa-solid fa-bezier-curve', hyperlink: './formations/formation-3-1-2-Bluebirds.html', text: 'Create match plans & formations and see summary infomation on how many quarters each players are on pitch' },
      { title: 'Reports', icon:'fa-solid fa-chart-pie', hyperlink: '#', text: 'TBC - holding area for possible reports tracking how many awards each player received throughout the season' },
      { title: 'Opposition Teams', icon:'fa-solid fa-list-ol',  hyperlink: '#', text: 'TBC - list of opposition teams for recording results/reporting purposes' }
    ];
  
    // Get the tiles container
    var tilesContainer = document.getElementById('tiles-container');
  
    // Create tiles dynamically
    tileContent.forEach(function(item) {
      var tile = document.createElement('div');
      tile.className = 'col-md-12 mb-4';
      tile.innerHTML = `
      <a href="${item.hyperlink}" class="tile-link">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title"><i class="fas ${item.icon}"></i> ${item.title}</h5>
              <p class="card-text">${item.text}</p>
            </div>
          </div>
        </a>
      `;
      tilesContainer.appendChild(tile);
    });
  }
  
  // Call the function to create tiles when the page loads
  window.onload = createTiles;

  function toggleNav() {
    var sidebar = document.querySelector('.sidebar');
    var main = document.getElementById('main');
    if (sidebar.style.width === '250px') {
      sidebar.style.width = '0';
      main.classList.remove('active');
    } else {
      sidebar.style.width = '250px';
      main.classList.add('active');
    }
  }
  