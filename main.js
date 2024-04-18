
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
      timeEntry.innerText = `${team.charAt(0).toUpperCase() + team.slice(1)} goal at ${minutesElapsed}m ${secondsElapsed}s - Q${currentQuarter}`;
      elapsedTime.appendChild(timeEntry);

      // Save data to local storage
      saveToLocalStorage();
    }


     // General Notes script to review
     function addNotes() {
            const notesInput = document.getElementById('notesInput');
           const notes = notesInput.value.trim();
            
            if (notes)  {
                const matchNotes = document.getElementById('matchNotes');
                const newEntry = document.createElement('div');
                newEntry.textContent = notes;
                matchNotes.appendChild(newEntry);
                notesInput.value = ''; // Clear the input field after adding notes
                         }
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






/// Training Areas
function trainingAreas() {
        const trainingAreaSelect = document.getElementById('trainingAreaSelect');
        const selectedTrainingArea = trainingAreaSelect.value;

        if (selectedTrainingArea) {
            const trainingAreas = document.getElementById('trainingAreas');
            const newEntry = document.createElement('div');
            newEntry.textContent = selectedTrainingArea;
            trainingAreas.appendChild(newEntry);
        }
    }
    
	


//ActionSelection

	function handleActionSelection() {
        const selectedPlayer = document.getElementById('playerSelect').value;
        const selectedAction = document.getElementById('actionSelect').value;
        const playerActionDisplay = document.getElementById('playerActionDisplay');

        if (selectedPlayer && selectedAction) {
           // const currentTime = homeElapsedTime > awayElapsedTime ? homeElapsedTime : awayElapsedTime;
           // const timeEntry = formatTime(currentTime);
            playerActionDisplay.innerText = `${selectedPlayer} ${selectedAction}` //, Time: ${timeEntry}`;
			saveToLocalStorage();
			
            // Reset selections
            document.getElementById('playerSelect').value = '';
            document.getElementById('actionSelect').value = '';
		    document.getElementById('actionSelect').addEventListener('change', handleActionSelection);

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


  //Copy to Clipboard

 function copyToClipboard() {
      const matchDetails = `
        Bluebirds Score: ${homeScore}
        Goals: ${formatGoals(homeGoals)}

        Opposition Score: ${awayScore}
        Goals: ${formatGoals(awayGoals)}
        General Notes: ${matchNotes}
		    
        Date & Time: ${getCurrentDateTime()}`;
        

      const textarea = document.createElement('textarea');
      textarea.value = matchDetails;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      alert('Match details copied to clipboard!');
    }



function formatGoals(goals) {
      return goals.map(goal => `(${goal.quarter}Q - ${goal.time})`).join(', ');
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