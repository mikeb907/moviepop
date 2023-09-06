import React, { useState } from 'react';
import './GameScreen.css';
import Navbar from './Navbar/Navbar';

function GameScreen() {
    const stillsData = [
        {
            id: 1,
            image: 'path/to/image1.jpg',
            correctTitle: 'Correct Title 1',
            options: ['Correct Title 1', 'Wrong Title A', 'Wrong Title B']
        },
        {
            id: 2,
            image: 'path/to/image2.jpg',
            correctTitle: 'Correct Title 2',
            options: ['Correct Title 2', 'Wrong Title C', 'Wrong Title D']
        },
        {
            id: 3,
            image: 'path/to/image3.jpg',
            correctTitle: 'Correct Title 3',
            options: ['Correct Title 3', 'Wrong Title E', 'Wrong Title F']
        }
    ];

    const [currentStillIndex, setCurrentStillIndex] = useState(0);
    const [selectedTitles, setSelectedTitles] = useState([]);

    const selectTitle = (title) => {
        const updatedSelections = [...selectedTitles];
        updatedSelections[currentStillIndex] = title;
        setSelectedTitles(updatedSelections);
    };

    return (
        <div className="game-screen">
            <Navbar />

            <div className="movie-still-container">
                <div className="title-bar">
                    <span>Movie {currentStillIndex + 1}/3</span>
                    {/* Three circles indicator will go here */}
                </div>
                <img src={stillsData[currentStillIndex].image} alt={`Movie Still ${currentStillIndex + 1}`} />
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
            
            <div className="action-bar">
                <button className="prev-arrow" onClick={() => setCurrentStillIndex(prev => Math.max(prev - 1, 0))}>←</button>
                <button className="submit-btn" disabled={selectedTitles.length < 3}>Submit</button>
                <button className="next-arrow" onClick={() => setCurrentStillIndex(prev => Math.min(prev + 1, stillsData.length - 1))}>→</button>
            </div>
        </div>
    );
}

export default GameScreen;
