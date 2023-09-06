document.addEventListener('DOMContentLoaded', function() {
    let currentMovieNumber = 1;
    let userAnswers = new Array(3).fill(null);

    const homeMenu = document.getElementById('home-menu');
    const gameScreen = document.getElementById('game-screen');
    const startGameBtn = document.getElementById('start-game');
    const draggableOptions = document.querySelectorAll('.draggable');
    const dropZones = document.querySelectorAll('.drop-zone');
    const movieGroups = document.querySelectorAll('.movie-group');
    const prevArrowBtn = document.querySelector('.prev-arrow-btn');
    const nextArrowBtn = document.querySelector('.next-arrow-btn');
    const submitAnswersBtn = document.getElementById('submit-answers-btn');

    let draggedItem = null;

    startGameBtn.addEventListener('click', function() {
        homeMenu.style.display = 'none';
        gameScreen.style.display = 'block';
        updateStillsDisplay();
    });

    function dragStartFunction(e) {
        draggedItem = e.target;
        setTimeout(() => {
            e.target.style.opacity = '0';
        }, 0);
    }

    function dragEndFunction(e) {
        setTimeout(() => {
            draggedItem.style.opacity = '1';
            draggedItem = null;
        }, 0);
    }

    draggableOptions.forEach(option => {
        option.addEventListener('dragstart', dragStartFunction);
        option.addEventListener('dragend', dragEndFunction);
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
        });

        zone.addEventListener('dragenter', function(e) {
            e.preventDefault();
        });

        zone.addEventListener('drop', function(e) {
            if (!draggedItem) return;

            const movieNumber = parseInt(e.target.getAttribute('data-movie-number'));
            userAnswers[movieNumber - 1] = parseInt(draggedItem.getAttribute('data-option-number'));

            // Update UI
            e.target.innerText = draggedItem.innerText;
            e.target.setAttribute('data-option-number', draggedItem.getAttribute('data-option-number')); // Store the original option number
            draggedItem.style.display = 'none'; // Hide the dragged item

            checkAllAnswersAssigned();
        });

        // Allow a title to be dragged back to the options
        zone.addEventListener('dragstart', dragStartFunction);
        zone.addEventListener('dragend', function(e) {
            if (!draggedItem) return;

            const optionNumber = parseInt(draggedItem.getAttribute('data-option-number'));
            document.querySelector(`.draggable[data-option-number="${optionNumber}"]`).style.display = 'block';
            draggedItem.innerText = '';
            draggedItem.removeAttribute('data-option-number');
            checkAllAnswersAssigned();
        });
    });

    prevArrowBtn.addEventListener('click', function() {
        if (currentMovieNumber > 1) {
            currentMovieNumber--;
            updateStillsDisplay();
        }
    });

    nextArrowBtn.addEventListener('click', function() {
        if (currentMovieNumber < 3) {
            currentMovieNumber++;
            updateStillsDisplay();
        }
    });

    function updateStillsDisplay() {
        movieGroups.forEach(group => {
            if (parseInt(group.getAttribute('data-movie-number')) === currentMovieNumber) {
                group.classList.add('active');
            } else {
                group.classList.remove('active');
            }
        });
    }

    function checkAllAnswersAssigned() {
        if (!userAnswers.includes(null)) {
            submitAnswersBtn.removeAttribute('disabled');
        } else {
            submitAnswersBtn.setAttribute('disabled', 'disabled');
        }
    }

    // TODO: Add logic for submitting and checking answers.
});
