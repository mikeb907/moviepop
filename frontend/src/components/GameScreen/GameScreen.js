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
    const [emojiPop, setEmojiPop] = useState(false); 

    useEffect(() => {
        fetch('/get-movies')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.movies) {
                    setStillsData(data.movies);
                    setSelectedTitles(new Array(data.movies.length).fill(null));
                } else {
                    console.error('Unexpected data format:', data);
                }
            })
            .catch(error => console.error('Error fetching movies:', error));
    }, []);

    const handleSubmission = () => {
        setHasSubmitted(true);
        setTimeout(() => setEmojiPop(true), 100); 
    };

    const getEmojiScore = () => {
        return selectedTitles.map((title, index) => {
            return title === stillsData[index].title ? '🍿' : '🍅';
        }).join(' ');
    };    

    const handleShare = () => {
        const numberCorrect = selectedTitles.filter((title, index) => title === stillsData[index].title).length;
        const emojiScore = getEmojiScore();
        
        if (navigator.share) {
            navigator.share({
                title: 'My MoviePop Results',
                text: `MoviePop #${gameNumber} • ${numberCorrect}/3\n\n${emojiScore}`,
            })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
        } else {
            alert("Your browser doesn't support the Web Share API.");
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
    };

    const getButtonClass = (title) => {
        if (!hasSubmitted) {
            return selectedTitles[currentStillIndex] === title ? 'selected' : '';
        }
        if (title === stillsData[currentStillIndex].title) { // Updated this line
            return 'correct';
        } else if (selectedTitles[currentStillIndex] === title) {
            return 'incorrect';
        }
        return '';
    };

    return (
        <div className="game-screen">
            <Navbar />
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
                                            className={`circle ${isAnswered ? 'answered' : ''} ${hasSubmitted ? 'submitted' : ''} ${index === currentStillIndex ? 'current' : ''}`}
                                        />
                                        {hasSubmitted && (
                                            <span className={`emoji ${emojiPop ? 'emoji-pop' : ''}`}>
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
