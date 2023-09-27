import React, { useState, useEffect } from 'react';
import './GameScreen.css';
import Navbar from './Navbar/Navbar';
import Modal from '../Modal/Modal';

import { ArrowLeft, ArrowRight } from 'react-feather'; // Import Feather arrow icons


const fetchStatisticsFromLocalStorage = () => {
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
    const now = new Date();
    const data = [];

    // Loop through the last 365 days (1 year)
    for (let i = 0; i < 365; i++) {
        const date = new Date(now - i * oneDay);
        const key = `moviepop_data_${date.toLocaleDateString()}`;
        const value = localStorage.getItem(key);
        if (value) {
            data.push(JSON.parse(value));
        }
    }
    return data;
};


const calculateStatistics = (data) => {
    const totalGames = data.length;
    if (totalGames === 0) {
        return {
            popcornPercentage: 0,
            mixedPercentage: 0,
            badPercentage: 0,
            terriblePercentage: 0
        };
    }

    const popcornGames = data.filter(game => game.animatedIndices && game.animatedIndices.length === 3).length;
    const mixedGames = data.filter(game => game.animatedIndices && game.animatedIndices.length === 2).length;
    const badGames = data.filter(game => game.animatedIndices && game.animatedIndices.length === 1).length;
    const terribleGames = data.filter(game => !game.animatedIndices || game.animatedIndices.length === 0).length;

    return {
        popcornPercentage: (popcornGames / totalGames) * 100,
        mixedPercentage: (mixedGames / totalGames) * 100,
        badPercentage: (badGames / totalGames) * 100,
        terriblePercentage: (terribleGames / totalGames) * 100
    };
};




function GameScreen() {
    const [stillsData, setStillsData] = useState([]);
    const [currentStillIndex, setCurrentStillIndex] = useState(0);
    const [selectedTitles, setSelectedTitles] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const gameNumber = 1;  
    const [devMode, setDevMode] = useState(false); 
    const [animationKey, setAnimationKey] = useState(0);
    // const [emojiTransitionIndex, setEmojiTransitionIndex] = useState(-1);
    const [animatedIndices, setAnimatedIndices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [latestStatistics, setLatestStatistics] = useState(null);



    useEffect(() => {
        const currentDateKey = `moviepop_data_${new Date().toLocaleDateString()}`;
        const localData = JSON.parse(localStorage.getItem(currentDateKey));

        console.log("Initializing from localStorage:", localData);
    
        if (localData) {
            setStillsData(localData.movies);
            setSelectedTitles(localData.selectedTitles || new Array(localData.movies.length).fill(null));
            setHasSubmitted(localData.hasSubmitted || false);
            // setEmojiTransitionIndex(localData.emojiTransitionIndex || -1);
            setAnimatedIndices(localData.animatedIndices || []);  // Ensure animatedIndices is set
                
            if (localData.hasSubmitted) {
                setAnimationKey(prevKey => prevKey + 1);
            }
        } else {
            fetch('/get-movies')
                .then(response => response.json())
                .then(data => {
                    if (data && data.movies) {
                        setStillsData(data.movies);
                        setSelectedTitles(new Array(data.movies.length).fill(null));
                    }
                })
                .catch(error => console.error('Error fetching movies:', error));
        }
        
    }, []);
    

    /* MAIN SCORE ANIMAITON USEEFFECT */
    
    useEffect(() => {
        if (hasSubmitted) {
            let index = 0;
            const interval = setInterval(() => {
                // console.log('Emoji update interval - Current index:', index);
                // setEmojiTransitionIndex(index);
                index++;
                if (index >= stillsData.length) {
                    clearInterval(interval);
                }
            }, 200);
            return () => clearInterval(interval);
        }
    }, [hasSubmitted, stillsData.length]);
    
    

    const handleSubmission = () => {
        setHasSubmitted(true);
    
        const newAnimatedIndices = [];
        let index = 0;
        
        const interval = setInterval(() => {
            if (index < stillsData.length) {
                // console.log('Checking answer for index:', index);
                
                if (selectedTitles[index] === stillsData[index].title) {
                    // console.log('Correct answer for index:', index);
                } else {
                    // console.log('Wrong answer for index:', index);
                }
                newAnimatedIndices.push(index); 
                setAnimatedIndices([...newAnimatedIndices]);
                index++;
            } else {
                clearInterval(interval);
    
                // Determine the user's score based on correct answers
                const numberCorrect = selectedTitles.filter((title, idx) => title === stillsData[idx].title).length;
    
                // console.log("Number of Correct Answers:", numberCorrect);
                // console.log("Selected Titles:", selectedTitles);
                // console.log("Actual Movies:", stillsData.map(movie => movie.title));
    
                // Based on the number of correct answers, categorize the user's score
                const scoreKey = {
                    3: '🍿🍿🍿',
                    2: '🍿🍿🍅',
                    1: '🍿🍅🍅',
                    0: '🍅🍅🍅'
                }[numberCorrect];
    
                // Now save to localStorage
                const currentDateKey = `moviepop_data_${new Date().toLocaleDateString()}`;
                const localData = JSON.parse(localStorage.getItem(currentDateKey) || '{}');
                        
                localData.hasSubmitted = true;
                // localData.emojiTransitionIndex = -1;
                localData.animatedIndices = newAnimatedIndices;
                localData.movies = stillsData;
                localData.selectedTitles = selectedTitles;
    
                localStorage.setItem(currentDateKey, JSON.stringify(localData));
                console.log("Saving to local storage:", localData);
    
                // Update score in local storage
                const currentScore = parseInt(localStorage.getItem(scoreKey) || '0');
                localStorage.setItem(scoreKey, (currentScore + 1).toString());
    
                // After storing the game data in localStorage...
                const data = fetchStatisticsFromLocalStorage();  
                const stats = calculateStatistics(data);  
                setLatestStatistics(stats);

                // After storing the game data in localStorage, trigger the statistics modal
                const totalAnimationDuration = stillsData.length * 200; // considering 200ms delay for each emoji animation
                setTimeout(() => {
                    setIsModalOpen(true);
                }, totalAnimationDuration);
            }
        }, 200);
    };
    
    
    
    

    const getEmojiScore = () => {
        return selectedTitles.map((title, index) => {
            return title === stillsData[index].title ? '🍿' : '🍅';
        }).join(' ');
    };    

    // New function to copy a message to the clipboard
    function copyToClipboard(message) {
        const textArea = document.createElement("textarea");
        textArea.value = message;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }

        document.body.removeChild(textArea);
    }

    // Updated handleShare function
    // const handleShare = () => {
    //     const numberCorrect = selectedTitles.filter((title, index) => title === stillsData[index].title).length;
    //     const emojiScore = getEmojiScore();

    //     const shareMessage = `MoviePop #${gameNumber} • ${numberCorrect}/3\n\n${emojiScore}`;

    //     if (navigator.share) {
    //         navigator.share({
    //             title: 'My MoviePop Results',
    //             text: shareMessage,
    //         })
    //         .then(() => console.log('Successful share'))
    //         .catch((error) => console.log('Error sharing', error));
    //     } else {
    //         // Fallback: Copy the share message to the clipboard
    //         copyToClipboard(shareMessage);
    //         alert("Your score was copied to clipboard");
    //     }
    // };


    const handleShare = () => {
        // Get the current date
        const currentDate = new Date();
    
        // Determine the start date of MoviePop as September 25th, 2023
        const startDate = new Date("2023-09-25");
    
        // Calculate the difference in days between the current date and the start date
        const diffTime = Math.abs(currentDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
        // Use the difference in days as the game number
        const gameNumber = diffDays;
    
        const numberCorrect = selectedTitles.filter((title, index) => title === stillsData[index].title).length;
        const emojiScore = getEmojiScore();
    
        const shareMessage = `MoviePop #${gameNumber} • ${numberCorrect}/3\n\n${emojiScore}`;
    
        if (navigator.share) {
            navigator.share({
                title: 'My MoviePop Results',
                text: shareMessage,
            })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
        } else {
            // Fallback: Copy the share message to the clipboard
            copyToClipboard(shareMessage);
            alert("Your score was copied to clipboard");
        }
    };
    
    
    

    const selectTitle = (title) => {
        const updatedSelections = [...selectedTitles];
        if (selectedTitles[currentStillIndex] === title) {
            updatedSelections[currentStillIndex] = null;
        } else {
            updatedSelections[currentStillIndex] = title;
        }
        setSelectedTitles(updatedSelections);
    
        // Save to local storage
        const currentDateKey = `moviepop_data_${new Date().toLocaleDateString()}`;
        const localData = JSON.parse(localStorage.getItem(currentDateKey));
        localData.selectedTitles = updatedSelections;
        localData.animatedIndices = animatedIndices;  // Store animatedIndices here
        localStorage.setItem(currentDateKey, JSON.stringify(localData));
    };
    

    
    

    const getButtonClass = (title) => {
        if (!hasSubmitted) {
            return selectedTitles[currentStillIndex] === title ? 'selected' : '';
        }
        if (title === stillsData[currentStillIndex].title) {
            return 'correct';
        } else if (selectedTitles[currentStillIndex] === title) {
            return 'incorrect';
        }
        return '';
    };

    const resetGameForTesting = () => {
        const currentDateKey = `moviepop_data_${new Date().toLocaleDateString()}`;
        localStorage.removeItem(currentDateKey);
        window.location.reload();
    };

    // Use the 'd' key to toggle developer mode on/off
    // useEffect(() => {
    //     const handleKeyDown = (e) => {
    //         if (e.key === 'd') {
    //             setDevMode(prev => !prev);
    //         }
    //     };
    //     window.addEventListener('keydown', handleKeyDown);
    //     return () => window.removeEventListener('keydown', handleKeyDown);
    // }, []);

    return (
        
        <div className="game-screen" key={animationKey}>
            <Navbar 
                devMode={devMode} 
                resetGame={resetGameForTesting} 
                setModalOpen={setModalOpen} 
                setModalType={setModalType}
            />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} type={modalType} statistics={latestStatistics} />
            {/* <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} type={modalType} statistics={latestStatistics} /> */}





            <div className="question-content-container">
                <div className="movie-still-container">
                    <div className="circle-indicators-container">
                     
                        <div className="circle-indicators">
                        {stillsData.map((still, index) => {
                            const isAnswered = selectedTitles[index];
                            const isCorrect = selectedTitles[index] === still.title;
                            return (
                                <div key={index} className={hasSubmitted ? 'answered-container' : ''} onClick={() => setCurrentStillIndex(index)}>
                                    <div 
                                        className={`circle ${isAnswered ? 'answered' : ''} ${animatedIndices.includes(index) ? 'animate-circle' : ''} ${index === currentStillIndex ? 'current' : ''}`}
                                    />


                                    {hasSubmitted && (
                                        <span className={`emoji ${animatedIndices.includes(index) ? 'animate-emoji' : ''}`}>
                                            {(() => {
                                                const isCorrect = selectedTitles[index] === still.title;
                                                console.log(`Rendering emoji for index ${index}. Correct?`, isCorrect);
                                                return isCorrect ? '🍿' : '🍅';
                                            })()}
                                        </span>
                                    )}
                                </div>
                            );
                        })}

                        </div>

                    </div>
                    <div className="movie-still">
                        {stillsData[currentStillIndex] && <img src={stillsData[currentStillIndex].still_url} alt={`Movie Still ${currentStillIndex + 1}`} />}
                    </div>
                </div>
                <div className="title-choices">
                    {stillsData[currentStillIndex] && stillsData[currentStillIndex].options.map((title, index) => (
                        <button 
                            key={index} 
                            className={`title-choice-button ${getButtonClass(title)}`} 
                            onClick={() => selectTitle(title)}
                            disabled={hasSubmitted}
                        >
                            {title}
                        </button>
                    ))}
                </div>
            </div>
            <div className="action-bar">
                <button className="prev-arrow" onClick={() => setCurrentStillIndex(prev => Math.max(prev - 1, 0))}>
                    <ArrowLeft />
                </button>
                {!hasSubmitted ? (
                    <button 
                        className={`submit-btn ${selectedTitles.length === 3 && !selectedTitles.includes(null) ? 'active' : ''}`} 
                        onClick={handleSubmission}
                        disabled={selectedTitles.length < 3 || selectedTitles.includes(null)}
                    >
                        Submit
                    </button>
                ) : (
                    <button className="submit-btn share-btn" onClick={handleShare}>
                        Share
                    </button>
                )}
                <button className="next-arrow" onClick={() => setCurrentStillIndex(prev => Math.min(prev + 1, stillsData.length - 1))}>
                    <ArrowRight />
                </button>
            </div>
        </div>
    );
}

export default GameScreen;