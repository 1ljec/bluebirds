// Function to create tiles dynamically
function createTiles() {
    // Define the tile content
    var tileContent = [
      { title: 'Jam Sandwich', icon: 'fa-solid fa-bread-slice', hyperlink: '#', text: 'Good warm up excercise, two lines of players either side of the pitch/sidelines with 1 player in the middle. Players need to dribble a ball to the other side without being tackled. Any that do get tackled join the middle until all players tackled.' },
      { title: 'G/line Shoot', icon:'fa-regular fa-flag', hyperlink: '#', text: 'Players line up evenly on either side of the goal, balls are laid out on edge of box, players race to a ball & turn & shoot.' },
      { title: '1v1 to 5v5', icon: 'fas fa-people-arrows', hyperlink: '#', text: 'Starts with 1 goal keeper & 1 defender, players line up 1/2 way line and attack in turn. once attack ended, player joins either the defending or attacking team until all players have gone. 1v1, 1v2, 2v2 etc. ' },
      { title: 'Channel Defenders', icon:'fa-solid fa-archway', hyperlink: '#',text: 'Narrow channel with single defender. Attackers line up and take in turns to get from one side of channel to the other. Focuses defender on tackling.' },
      { title: '1/2 dribble & shoot', icon:'fa-solid fa-futbol', hyperlink: '#', text: 'Players line up on 1/2 way line and dribble with the ball to the box and take a shot. <b>Variants include relay race, 1v1, dribble around cones, with defenders & without. </b>' },
      { title: 'Cone/Pole Dribble', icon:'fa-solid fa-shoe-prints',  hyperlink: '#', text: 'Min 3 cones/poles, players line up to dribble around the cones/poles, with 1 player/coach feeding passes to the players to start dribbling.' },
      { title: 'Basics x 5', icon:'fa-solid fa-play',  hyperlink: '#', text: 'In pairs/trios, practice 5 passess with each foot, 5 throw ins to feet, 5 throw arial throw ins to chest down, 5 long passes/goal kicks' },
      { title: 'Corners', icon:'fa-solid fa-square',  hyperlink: '#', text: '2 teams, attckers & defenders - practice taking & defending corners from both sides' },
      { title: 'Coach Tag', icon:'fa-solid fa-tag',  hyperlink: '#', text: 'End of session bit of fun with 1 or 2 coaches vs all the players' }
    
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
  