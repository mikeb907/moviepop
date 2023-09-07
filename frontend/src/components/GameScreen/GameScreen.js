import React, { useState } from 'react';
import './GameScreen.css';
import Navbar from './Navbar/Navbar';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

// Importing the images
import still1Image from '../../assets/still1.jpeg';
import still2Image from '../../assets/still2.jpeg';
import still3Image from '../../assets/still3.jpeg';

function GameScreen() {
    const stillsData = [
        {
            id: 1,
            image: still1Image,
            correctTitle: 'The Godfather: Part II',
            options: ['The Godfather: Part II', 'Scarface', 'The Shawshank Redemption']
        },
        {
            id: 2,
            image: still2Image,
            correctTitle: 'The Aviator',
            options: ['The Aviator', 'Catch Me If You Can', 'The Great Gatsby']
        },
        {
            id: 3,
            image: still3Image,
            correctTitle: 'Halloween',
            options: ['Halloween', 'Friday the 13th', 'A Nightmare on Elm Street']
        }
    ];

    const [currentStillIndex, setCurrentStillIndex] = useState(0);
    const [selectedTitles, setSelectedTitles] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    
    const gameNumber = 1;  // This is just an example, replace with your actual logic
    const [emojiPop, setEmojiPop] = useState(false); // New state for emoji pop effect

    const handleSubmission = () => {
        setHasSubmitted(true);
        setTimeout(() => setEmojiPop(true), 100); // Delay the pop effect slightly for a fun effect
    };

    const getEmojiScore = () => {
        return selectedTitles.map((title, index) => {
            return title === stillsData[index].correctTitle ? '🍿' : '🍅';
        }).join(' ');
    };

    const handleShare = () => {
        const numberCorrect = selectedTitles.filter((title, index) => title === stillsData[index].correctTitle).length;
        const emojiScore = getEmojiScore();
        
        if (navigator.share) {
            navigator.share({
                title: 'My MoviePop Results',
                text: `MoviePop #${gameNumber} • ${numberCorrect}/3\n\n${emojiScore}`,
                // Add a URL if you want to share a link too (optional)
                // url: 'https://your-quiz-url.com',
            })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
        } else {
            // Fallback for browsers that don't support the Web Share API
            alert("Your browser doesn't support the Web Share API.");
        }
    };

    const selectTitle = (title) => {
        const updatedSelections = [...selectedTitles];
        
        // If the title is the same as the previously selected title, clear it. Otherwise, set the new title.
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
        
        if (title === stillsData[currentStillIndex].correctTitle) {
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
                    <div className="title-bar">
                        <h2>Movie {currentStillIndex + 1}/3</h2>
                    </div>

                    <div className="movie-still">
                        <img src={stillsData[currentStillIndex].image} alt={`Movie Still ${currentStillIndex + 1}`} />
                    </div>
                </div>

                <div className="title-choices">
                    {stillsData[currentStillIndex].options.map((title, index) => (
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

            <div className="circle-indicators">
                {stillsData.map((still, index) => {
                    const isAnswered = selectedTitles[index];
                    const isCorrect = selectedTitles[index] === still.correctTitle;
                    return (
                        <div key={index} className={hasSubmitted ? 'answered-container' : ''} onClick={() => setCurrentStillIndex(index)}>
                            <div 
                                className={`circle ${isAnswered ? 'answered' : ''} ${hasSubmitted ? 'submitted' : ''}`}
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

            <div className="action-bar">
                <button className="prev-arrow" onClick={() => setCurrentStillIndex(prev => Math.max(prev - 1, 0))}>
                    <ArrowBackIosIcon />
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
                    <ArrowForwardIosIcon />
                </button>
            </div>
        </div>
    );
}

export default GameScreen;
