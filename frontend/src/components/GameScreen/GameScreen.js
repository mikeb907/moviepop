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

    return (
        <div className="game-screen">
            <Navbar />

            <div class="question-content-container">

                <div className="movie-still-container">
                    <div className="title-bar">
                        <h2>Movie {currentStillIndex + 1}/3</h2>
                        <div className="circle-indicators">
                            {stillsData.map((_, index) => (
                                <div 
                                    key={index} 
                                    className={`circle ${selectedTitles[index] ? 'answered' : ''}`}
                                    onClick={() => setCurrentStillIndex(index)}  // <-- This is the new line
                                />
                            ))}
                        </div>

                    </div>

                    <div className="movie-still">
                        <img src={stillsData[currentStillIndex].image} alt={`Movie Still ${currentStillIndex + 1}`} />
                    </div>
                    
                </div>
                
                <div className="title-choices">
                    {stillsData[currentStillIndex].options.map((title, index) => (
                        <button 
                            key={index} 
                            className={`title-choice-button ${selectedTitles[currentStillIndex] === title ? 'selected' : ''}`} 
                            onClick={() => selectTitle(title)}
                        >
                            {title}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="action-bar">
                <button className="prev-arrow" onClick={() => setCurrentStillIndex(prev => Math.max(prev - 1, 0))}>
                    <ArrowBackIosIcon />
                </button>
                <button className={`submit-btn ${selectedTitles.length === 3 && !selectedTitles.includes(null) ? 'active' : ''}`} disabled={selectedTitles.length < 3 || selectedTitles.includes(null)}>Submit</button>
                <button className="next-arrow" onClick={() => setCurrentStillIndex(prev => Math.min(prev + 1, stillsData.length - 1))}>
                    <ArrowForwardIosIcon />
                </button>
            </div>
        </div>
    );
}

export default GameScreen;
