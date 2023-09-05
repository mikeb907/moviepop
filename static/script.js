document.addEventListener('DOMContentLoaded', function() {
    let currentMovieNumber = 1;
    let userAnswers = new Array(3).fill(null);

    const homeMenu = document.getElementById('home-menu');
    const gameScreen = document.getElementById('game-screen');
    const optionBtns = document.querySelectorAll('.option-btn');
    const submitAnswersBtn = document.getElementById('submit-answers-btn');
    const stillIndicator = document.getElementById('still-indicator');
    const prevArrowButton = document.querySelector('.prev-arrow-btn');
    const nextArrowButton = document.querySelector('.next-arrow-btn');

    fetch('/get-movies')
        .then(response => response.json())
        .then(data => {
            console.log("Received movies data:", data);
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
        });

    document.getElementById('play-btn').addEventListener('click', function() {
        homeMenu.style.display = 'none';
        gameScreen.style.display = 'block';
        showMovieGroup(currentMovieNumber);
        updateStillIndicator();
    });

    optionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const selectedOptionNumber = parseInt(btn.getAttribute('data-option-number'));
        
            // Check if this option was previously selected for another still
            const previousIndex = userAnswers.indexOf(selectedOptionNumber);
            if (previousIndex !== -1) {
                userAnswers[previousIndex] = null;
            }
        
            // Update the answer for this still
            userAnswers[currentMovieNumber - 1] = selectedOptionNumber;
        
            // Remove any previous still number from all titles
            optionBtns.forEach(option => {
                const existingSpan = option.querySelector('.still-number');
                if (existingSpan) existingSpan.remove();
            });
            
            // Place the new still number next to the selected titles
            for (let i = 0; i < userAnswers.length; i++) {
                if (userAnswers[i] !== null) {
                    const chosenTitles = document.querySelectorAll(`.option-btn[data-option-number="${userAnswers[i]}"]`);
                    chosenTitles.forEach(chosenTitle => {
                        // Only add a number if it doesn't already exist
                        if (!chosenTitle.querySelector('.still-number')) {
                            const span = document.createElement('span');
                            span.className = 'still-number';
                            span.innerText = ` ${i + 1}`;
                            chosenTitle.appendChild(span);
                        }
                    });
                }
            }
        
            checkAllAnswersAssigned();
        });
    });

    prevArrowButton.addEventListener('click', function() {
        currentMovieNumber--;
        if (currentMovieNumber < 1) {
            currentMovieNumber = 3;
        }
        showMovieGroup(currentMovieNumber);
        updateStillIndicator();
    });

    nextArrowButton.addEventListener('click', function() {
        currentMovieNumber++;
        if (currentMovieNumber > 3) {
            currentMovieNumber = 1;
        }
        showMovieGroup(currentMovieNumber);
        updateStillIndicator();
    });

    function showMovieGroup(number) {
        document.querySelectorAll('.movie-group').forEach(group => group.style.display = 'none');
        document.querySelector(`[data-movie-number="${number}"]`).style.display = 'block';
    }

    function updateStillIndicator() {
        stillIndicator.textContent = `${currentMovieNumber}/3`;
    }

    function checkAllAnswersAssigned() {
        if (!userAnswers.includes(null)) {
            submitAnswersBtn.removeAttribute('disabled');
        } else {
            submitAnswersBtn.setAttribute('disabled', 'disabled');
        }
    }
});
