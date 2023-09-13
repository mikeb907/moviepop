import React, { useState, useEffect } from 'react';
import './GameScreen.css';
import Navbar from './Navbar/Navbar';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';


function GameScreen() {
    const [stillsData, setStillsData] = useState([]);
    const [currentStillIndex, setCurrentStillIndex] = useState(0);
    const [selectedTitles, setSelectedTitles] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const gameNumber = 1;  
    const [devMode, setDevMode] = useState(false); 
    const [animationKey, setAnimationKey] = useState(0);
    const [emojiTransitionIndex, setEmojiTransitionIndex] = useState(-1);
    const [animatedIndices, setAnimatedIndices] = useState([]);



    useEffect(() => {
        const currentDateKey = `moviepop_data_${new Date().toLocaleDateString()}`;
        const localData = JSON.parse(localStorage.getItem(currentDateKey));

        if (localData) {
            setStillsData(localData.movies);
            setSelectedTitles(localData.selectedTitles || new Array(localData.movies.length).fill(null));
            setHasSubmitted(localData.hasSubmitted || false);
            setEmojiTransitionIndex(localData.emojiTransitionIndex || -1);
            setAnimatedIndices(localData.animatedIndices || []);
            
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
                        localStorage.setItem(currentDateKey, JSON.stringify({ movies: data.movies }));
                    }
                })
                .catch(error => console.error('Error fetching movies:', error));
        }
    }, []);
    
    useEffect(() => {
        if (hasSubmitted) {
            let index = 0;
            const interval = setInterval(() => {
                setEmojiTransitionIndex(index);
                index++;
                if (index >= stillsData.length) {
                    clearInterval(interval);
                }
            }, 500);
            return () => clearInterval(interval);
        }
    }, [hasSubmitted, stillsData.length]);
    

    const handleSubmission = () => {
        const intervals = [];
        setHasSubmitted(true);
    
        const newAnimatedIndices = [];
        // Animate circles and emojis
        stillsData.forEach((_, index) => {
            intervals.push(setTimeout(() => {
                newAnimatedIndices.push(index);
                setAnimatedIndices([...newAnimatedIndices]);
            }, index * 500));
        });
    
        // After all animations are done, update local storage
        intervals.push(setTimeout(() => {
            const currentDateKey = `moviepop_data_${new Date().toLocaleDateString()}`;
            const localData = JSON.parse(localStorage.getItem(currentDateKey));
            localData.hasSubmitted = true;
            localData.emojiTransitionIndex = -1;
            localData.animatedIndices = newAnimatedIndices;  // Using the new array directly
    
            localStorage.setItem(currentDateKey, JSON.stringify(localData));
        }, stillsData.length * 500));
    
        return () => intervals.forEach(interval => clearInterval(interval));
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
    const handleShare = () => {
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
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'd') {
                setDevMode(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="game-screen" key={animationKey}>
            <Navbar devMode={devMode} resetGame={resetGameForTesting} />
            <div className="question-content-container">
                <div className="movie-still-container">
                    <div className="circle-indicators-container">
                        <button className="prev-arrow" onClick={() => setCurrentStillIndex(prev => Math.max(prev - 1, 0))}>
                            <ArrowBackIosIcon />
                        </button>
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
                                            {isCorrect ? '🍿' : '🍅'}
                                        </span>
                                    )}
                                </div>
                            );
                        })}

                        </div>

                        <button className="next-arrow" onClick={() => setCurrentStillIndex(prev => Math.min(prev + 1, stillsData.length - 1))}>
                            <ArrowForwardIosIcon />
                        </button>
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
            </div>
        </div>
    );
}

export default GameScreen;