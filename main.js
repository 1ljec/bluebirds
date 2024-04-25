
    let startTime;
    let elapsedPausedTime = 0;
    let isTimerPaused = false;
    let countdown;
    let homeScore = 0;
    let awayScore = 0;
    let homeGoals = [];
    let awayGoals = [];
    let currentQuarter = 1;



    // Load data from local storage on page load
    window.onload = function () {
      loadFromLocalStorage();
    };



/// Accordian function
function toggleDiv(id) {
    var div = document.getElementById(id);
    var allDivs = document.querySelectorAll('.expandableDiv');

    // Collapse all other expandable divs
    allDivs.forEach(function(item) {
        if (item.id !== id) {
            item.style.maxHeight = '0';
        }
    });

    // Toggle the selected expandable div
    div.style.maxHeight = div.style.maxHeight ? null : div.scrollHeight + 'px';
}


//Load data from local storage if page refreshed for exmaple

    function loadFromLocalStorage() {
      const storedHomeScore = localStorage.getItem('homeScore');
      const storedAwayScore = localStorage.getItem('awayScore');
      const storedHomeGoals = localStorage.getItem('homeGoals');
      const storedAwayGoals = localStorage.getItem('awayGoals');
      const storedCurrentQuarter = localStorage.getItem('currentQuarter');

      if (storedHomeScore !== null) homeScore = parseInt(storedHomeScore);
      if (storedAwayScore !== null) awayScore = parseInt(storedAwayScore);
      if (storedHomeGoals !== null) homeGoals = JSON.parse(storedHomeGoals);
      if (storedAwayGoals !== null) awayGoals = JSON.parse(storedAwayGoals);
      if (storedCurrentQuarter !== null) currentQuarter = parseInt(storedCurrentQuarter);

      updateUI();
    }

//START TIMER

    function startTimer(minutes) {
      clearInterval(countdown); // Clear any existing countdown

      document.getElementById('goalButtonHome').removeAttribute('disabled');
      document.getElementById('goalButtonAway').removeAttribute('disabled');
      document.getElementById('upButtonHome').removeAttribute('disabled');
      document.getElementById('downButtonHome').removeAttribute('disabled');
      document.getElementById('upButtonAway').removeAttribute('disabled');
      document.getElementById('downButtonAway').removeAttribute('disabled');
      document.getElementById('pauseResumeButton').removeAttribute('disabled');

      startTime = new Date().getTime() - elapsedPausedTime;
      const endTime = startTime + minutes * 60 * 1000;

      countdown = setInterval(function() {
        if (!isTimerPaused) {
          const currentTime = new Date().getTime();
          const elapsedMillis = currentTime - startTime;

          if (elapsedMillis >= minutes * 60 * 1000) {
            if ("vibrate" in navigator) {
                navigator.vibrate(2000);
            }

            clearInterval(countdown);
            alert("End of quarter");
            document.getElementById('timerContainer').classList.add('hidden');
            document.getElementById('goalButtonHome').setAttribute('disabled', true);
            document.getElementById('goalButtonAway').setAttribute('disabled', true);
            document.getElementById('upButtonHome').setAttribute('disabled', true);
            document.getElementById('downButtonHome').setAttribute('disabled', true);
            document.getElementById('upButtonAway').setAttribute('disabled', true);
            document.getElementById('downButtonAway').setAttribute('disabled', true);
            document.getElementById('pauseResumeButton').setAttribute('disabled', true);

            // Increment the quarter
            currentQuarter++;
            document.getElementById('quarter').innerText = `Current Quarter: ${currentQuarter}`;
          } else {
            const minutesElapsed = Math.floor(elapsedMillis / (1000 * 60));
            const secondsElapsed = Math.floor((elapsedMillis % (1000 * 60)) / 1000);
            const secondsElapsedAsString = secondsElapsed < 10 ? "0" + secondsElapsed: secondsElapsed;
                        
            document.getElementById('timerContainer').classList.remove('hidden');
            document.getElementById('timer').innerHTML = `${minutesElapsed}:${secondsElapsedAsString}`;
          }
        }
      }, 1000);

      // Save data to local storage
      saveToLocalStorage();
    }

    //PauseResume Time

    function pauseResumeTimer() {
      isTimerPaused = !isTimerPaused;
      if (isTimerPaused) {
        clearInterval(countdown);
      } else {
        startTimer((startTime + elapsedPausedTime) / (60 * 1000));
      }

      // Save data to local storage
      saveToLocalStorage();
    }


//RecordGoal

    function recordGoal(team) {
      const currentTime = document.getElementById('timer').innerText;
      if (team === 'home') {
        homeScore++;
        homeGoals.push({ time: currentTime, quarter: currentQuarter });
        document.getElementById('homeScore').innerText = homeScore;
      } else if (team === 'away') {
        awayScore++;
        awayGoals.push({ time: currentTime, quarter: currentQuarter });
        document.getElementById('awayScore').innerText = awayScore;
      }

      const elapsedMillis = new Date().getTime() - startTime;
      const minutesElapsed = Math.floor(elapsedMillis / (1000 * 60));
      const secondsElapsed = Math.floor((elapsedMillis % (1000 * 60)) / 1000);

      const elapsedTimeColumn = team === 'home' ? 'homeElapsedTime' : 'awayElapsedTime';
      const elapsedTime = document.getElementById(elapsedTimeColumn);
      const timeEntry = document.createElement('p');
      timeEntry.innerText = `${team.charAt(0).toUpperCase() + team.slice(1)} goal at ${minutesElapsed}m ${secondsElapsed}s - Q${currentQuarter} `+ '\n\n';
      elapsedTime.appendChild(timeEntry);

      // Save data to local storage
      saveToLocalStorage();
    }

      //ChangeScore
      function changeScore(team, value) {
        const scoreElement = document.getElementById(`${team}Score`);
        const currentScore = parseInt(scoreElement.innerText);
        scoreElement.innerText = currentScore + value;
  
        const elapsedMillis = new Date().getTime() - startTime;
        const minutesElapsed = Math.floor(elapsedMillis / (1000 * 60));
        const secondsElapsed = Math.floor((elapsedMillis % (1000 * 60)) / 1000);
  
        const elapsedTimeColumn = team === 'home' ? 'homeElapsedTime' : 'awayElapsedTime';
        const elapsedTime = document.getElementById(elapsedTimeColumn);
        const timeEntry = document.createElement('p');
        timeEntry.innerText = `Goal Disallowed at ${minutesElapsed}m ${secondsElapsed}s - Q ${currentQuarter}`;
        elapsedTime.appendChild(timeEntry);
  
        // Save data to local storage
        saveToLocalStorage();
      }


     // General Notes script to review
     function addNotes() {
            const notesInput = document.getElementById('notesInput');
           const notes = notesInput.value.trim();
            
            if (notes)  {
            // original output div    const matchNotes = document.getElementById('matchNotes');
                const matchNotes = document.getElementById('selections');  //testing combining manual notes & selections notes
                const newEntry = document.createElement('div');
                newEntry.textContent = 'Q' + currentQuarter +  ' ' + notes;
                matchNotes.appendChild(newEntry);
                notesInput.value = ''; // Clear the input field after adding notes
                         }
     saveToLocalStorage();
    }

     //PLAYER ACTIONS---------------   
     function savePlayerAction() {
        const playerSelect = document.getElementById('playerSelect');
        const actionSelect = document.getElementById('actionSelect');
        const player = '\n' + playerSelect.value;
        const action = actionSelect.value;
        
        if (player && action) {
            updateSelection(player, action);
            // Reset selected options
            playerSelect.value = '';
            actionSelect.value = '';
        } else {
            alert('Please select both a player and an action.');
        }
    }
    
    // Function to save & update the selections div
    function updateSelection(player, action) {
        const selectionsDiv = document.getElementById('selections');
        const selectionText = document.createTextNode('Q' +currentQuarter + player + ' - ' + action + '\n');
        const br = document.createElement('br');
        selectionsDiv.appendChild(selectionText);
        selectionsDiv.appendChild(br);
    }
    
      
    
    /// Training Areas
    function saveTraining() {
        const trainingAreaSelect = document.getElementById('trainingAreaSelect');
        const selectedOption = trainingAreaSelect.value;
        
        if (selectedOption !== '') {
            const trainingAreasDiv = document.getElementById('trainingAreas');
            const newTrainingArea = document.createElement('div');
            newTrainingArea.textContent = selectedOption;
            trainingAreasDiv.appendChild(newTrainingArea);
        } else {
            alert('Please select a training area.');
        }
    }
    

//UpdateUI
    function updateUI() {
      // Update your UI based on the loaded data
      document.getElementById('homeScore').innerText = homeScore;
      document.getElementById('awayScore').innerText = awayScore;
    
    }


    // GetCurrentDate and Time
 function getCurrentDateTime() {
      const now = new Date();
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString();
      return `${date} ${time}`;
    }

//Reset local data / clear local storage
function clearLocalStorage() {
      localStorage.clear();
      alert('Local storage cleared!');
location.reload();
    }
	

function saveToLocalStorage() {
      localStorage.setItem('homeScore', homeScore.toString());
      localStorage.setItem('awayScore', awayScore.toString());
      localStorage.setItem('homeGoals', JSON.stringify(homeGoals));
      localStorage.setItem('awayGoals', JSON.stringify(awayGoals));
      localStorage.setItem('currentQuarter', currentQuarter.toString());
      localStorage.setItem('selections', JSON.stringify(homeGoals));
    
    }

    function showNotes()    {
    //document.getElementById("expandableDiv1").style.display ='block';

    var x = document.getElementById('expandableDiv1');
    if (x.style.display === 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';}

    }
    function hideNotes(){
    document.getElementById("expandableDiv1").style.display ='none';
}


function showFooter()    {
    //document.getElementById("expandableDiv1").style.display ='block';
    var x = document.getElementById('expandableDiv4');
    if (x.style.display === 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';}
    }
    function hideFooter(){
    document.getElementById("expandableDiv4").style.display ='none';
}



function showFormations()    {
    //document.getElementById("expandableDiv1").style.display ='block';
    var x = document.getElementById('expandableDiv5');
    if (x.style.display === 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';}
    }
    function hideFormations(){
    document.getElementById("expandableDiv5").style.display ='none';
}

function saveAndShare() {
    const awardsDiv = document.getElementById('awards');
    const trainingAreasDiv = document.getElementById('trainingAreas');
    const selections = document.getElementById('selections');
    const matchNotes = document.getElementById('matchNotes');
    const homeElapsedTime = document.getElementById('homeElapsedTime');
    const awayElapsedTime = document.getElementById('awayElapsedTime');
    const homeScore = document.getElementById('homeScore');
    const awayScore = document.getElementById('awayScore');
    
    // Concatenate all entries from awards and trainingAreas divs
    const clipboardText =   'Bluebirds '            + homeScore.textContent.trim() + ' - ' +awayScore.textContent.trim() + ' Opposition' + '\n\n' + 
                            'Bluebirds Goals: '     + homeElapsedTime.textContent.trim() + '\n\n' + 
                            'Opposition Goals: '    + awayElapsedTime.textContent.trim() + '\n\n' + 
                            // original notes separated 'Player Notes: '        + '\n' + selections.textContent.trim() + '\n\n' + 
                            'Game Notes: '        + '\n' + selections.textContent.trim() + '\n\n' + 
                           // 'Manual Notes: '        + '\n' + matchNotes.textContent.trim() + '\n\n' +  
                            'Training Areas: '      + '\n' + trainingAreasDiv.textContent.trim() + '\n\n' +
                            'Awards: '              + '\n' + awardsDiv.textContent.trim() + '\n\n' ;
    
    if (clipboardText !== '') {
        navigator.clipboard.writeText(clipboardText)
            .then(() => {
                console.log('Data copied to clipboard:', clipboardText);
                alert('Data copied to clipboard');
            })
            .catch((error) => {
                console.error('Error copying data to clipboard:', error);
                alert('Error copying data to clipboard');
            });
    } else {
        alert('No data to share.');
    }
}


//TEST FUNCTION FOR CUSTOM MODAL VIBRATE

// Function to trigger end of quarter alert
function endOfQuarterAlert() {
  // Vibrate before showing the modal
  if ("vibrate" in navigator) {
      navigator.vibrate(500);
  }
  // Show the modal
  const modal = document.getElementById("myModal");
  modal.style.display = "block";


// Close the modal when the close button is clicked
document.querySelector(".close").addEventListener("click", function() {
  document.getElementById("myModal").style.display = "none";
});
}
// Close the modal when the user clicks anywhere outside of the modal
window.addEventListener("click", function(event) {
  const modal = document.getElementById("myModal");
  if (event.target === modal) {
      modal.style.display = "none";
  }
});
//ENF OF TEST MODAL FOR VIBRATION TEST



//TODO TIDY / DELETE?

/*
    function sharePlayerActions() {
        const selectionsDiv = document.getElementById('selections');
        const clipboardText = selectionsDiv.textContent.trim();
        
        if (clipboardText !== '') {
            navigator.clipboard.writeText(clipboardText)
                .then(() => {
                    console.log('Player actions copied to clipboard:', clipboardText);
                    alert('Player actions copied to clipboard');
                })
                .catch((error) => {
                    console.error('Error copying player actions to clipboard:', error);
                    alert('Error copying player actions to clipboard');
                });
        } else {
            alert('No player actions to share.');
        }
    }
    */


    
/*
function shareAwards() {
    const awardsDiv = document.getElementById('awards');
    const clipboardText = awardsDiv.textContent.trim();
    
    if (clipboardText !== '') {
        navigator.clipboard.writeText(clipboardText)
            .then(() => {
                console.log('Awards copied to clipboard:', clipboardText);
                alert('Awards copied to clipboard');
            })
            .catch((error) => {
                console.error('Error copying awards to clipboard:', error);
                alert('Error copying awards to clipboard');
            });
    } else {
        alert('No awards to share.');
    }
}
*/


/*
function saveAwards() {
    const awardsDiv = document.getElementById('awards');
    const awardSelects = document.querySelectorAll('select[id^="awardSelect"]');
    
    awardSelects.forEach((select) => {
        const selectedOption = select.value;
        const selectId = select.id;
        
        if (selectedOption !== '') {
            const awardText = document.createTextNode(` ${selectId}: ${selectedOption} \n`);
            const br = document.createElement('br');
            awardsDiv.appendChild(awardText);
            awardsDiv.appendChild(br);
        }
    });
}

*/



  //Copy to Clipboard
/*
 function copyToClipboard() {
      const matchDetails = `
        Bluebirds Score: ${homeScore}
        Goals: ${formatGoals(homeGoals)}
        Opposition Score: ${awayScore}
        Goals: ${formatGoals(awayGoals)}
        Date & Time: ${getCurrentDateTime()}`;
        

      const textarea = document.createElement('textarea');
      textarea.value = matchDetails;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      alert('Match details copied to clipboard!');
    }
*/

/*
function formatGoals(goals) {
      return goals.map(goal => `(${goal.quarter}Q - ${goal.time})`).join(', ');
    }
*/

//Todo - allow goal in extra time script below


/*
let timerCompleted = false;
let currentTime = 0;

// Function to start the timer
function startTimer(minutes) {
    let seconds = minutes * 60;
    let timerInterval = setInterval(() => {
        currentTime++;
        seconds--;

        // Check if timer is completed
        if (seconds <= 0) {
            clearInterval(timerInterval);
            timerCompleted = true;
            alert("End of quarter (extra time)");
        }
    }, 1000);
}

// Function to record a goal
function recordGoal(team) {
    if (timerCompleted) {
        console.log("Goal recorded during extra time for " + team + " team at " + currentTime + " minutes");
    } else {
        console.log("Goal recorded for " + team + " team at " + currentTime + " minutes");
    }
}

// Example usage
startTimer(1); // Start a 1-minute timer

// Simulate recording a goal after the timer completes
setTimeout(() => {
    recordGoal("Home"); // Record a goal after the timer completes
}, 1500); // Simulating 1.5 seconds after the timer completes
In this example:

We introduce a timerCompleted variable to keep track of whether the timer has completed or not.
When a goal is recorded, we check if the timer has completed (timerCompleted is true). If it has completed, we label the time as "extra time."
Otherwise, the time is labeled as the current elapsed time.
This approach allows goals to be recorded even after the timer completes, with the time labeled appropriately.

*/