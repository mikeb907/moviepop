// Modal.js

import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import './Modal.css';
import { X } from 'react-feather';  // Importing Feather icons

function Modal({ isOpen, onClose, type, statistics }) {  

    console.log("Is modal open?", isOpen);

    const modalContentRef = useRef(null);
    // const [modalType, setModalType] = useState(() => type);
    const [modalType, setModalType] = useState(type);



    const handleFeedbackClick = () => {
        window.location.href = "mailto:hello@moviepop.cc?subject=Feedback on MoviePop";
    };
    
    const handlePrivacyClick = () => {
        window.open("/privacy");
    };
    
    


    // Modal Animation
    // const [closing, setClosing] = useState(false);

    const handleClose = (e) => {
        // If the click is outside the modal content, close the modal
        if (modalContentRef.current && !modalContentRef.current.contains(e.target)) {
            onClose();
        }
    };
    
    
    
    
    
    


    // Statistics states
    const [statisticsData, setStatisticsData] = useState(null);
    const [statisticsCalculated, setStatisticsCalculated] = useState(false);

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
        const scoreForGame = game => {
            const numberCorrect = game.selectedTitles && game.movies ? game.selectedTitles.filter((title, index) => title === game.movies[index].title).length : 0;
            console.log("Game's score:", {game, score: {
                3: '🍿🍿🍿',
                2: '🍿🍿🍅',
                1: '🍿🍅🍅',
                0: '🍅🍅🍅'
            }[numberCorrect]});
            return {
                3: '🍿🍿🍿',
                2: '🍿🍿🍅',
                1: '🍿🍅🍅',
                0: '🍅🍅🍅'
            }[numberCorrect];
        };
        
        
        if (!data || data.length === 0) {
            return {
                totalGames: 0,
                winPercentage: 0,
                winStreak: 0,
                maxStreak: 0,
                scoreCounts: {
                    '🍿🍿🍿': 0,
                    '🍿🍿🍅': 0,
                    '🍿🍅🍅': 0,
                    '🍅🍅🍅': 0
                }
            };
        }
        
        

        // Debug step: Log any game where animatedIndices is undefined
        data.forEach(game => {
            if (!game.animatedIndices) {
                console.error("Game with missing animatedIndices:", game);
            }
        });

        const totalGames = data.length;

        // let totalAnimated = 0;
        // let correctAnimated = 0;

        // data.forEach(game => {
        //     totalAnimated += game.animatedIndices ? game.animatedIndices.length : 0;  
        //     correctAnimated += game.animatedIndices ? game.animatedIndices.filter(index => game.movies[index].title === game.selectedTitles[index]).length : 0;
        // });

        const wins = data.filter(game => scoreForGame(game) !== '🍅🍅🍅').length;
        console.log("Total games:", totalGames);  // Added this log
        console.log("Wins:", wins);               // Added this log
        console.log("Games considered as wins:", data.filter(game => game.animatedIndices && game.animatedIndices.length >= 1));

        const winPercentage = totalGames !== 0 ? (wins / totalGames) * 100 : 0;
        console.log("Win Percentage:", winPercentage);  // Added this log


        let winStreak = 0;
        let maxStreak = 0;
        let currentStreak = 0;

        for (const game of data) {
            if (scoreForGame(game) !== '🍅🍅🍅') {  // Checking if the score is not three tomatoes
                currentStreak++;
                winStreak = currentStreak;
            } else {
                currentStreak = 0;
            }
            if (winStreak > maxStreak) {
                maxStreak = winStreak;
            }
        }

        const scoreCounts = {
            '🍿🍿🍿': data.filter(game => scoreForGame(game) === '🍿🍿🍿').length,
            '🍿🍿🍅': data.filter(game => scoreForGame(game) === '🍿🍿🍅').length,
            '🍿🍅🍅': data.filter(game => scoreForGame(game) === '🍿🍅🍅').length,
            '🍅🍅🍅': data.filter(game => scoreForGame(game) === '🍅🍅🍅').length,
        };
        

        return {
            totalGames,
            winPercentage,
            winStreak,
            maxStreak,
            scoreCounts
        };
    };

    useEffect(() => {
        console.log("Setting modalType to", type);
        setModalType(type);
    }, [type]);
    
    useEffect(() => {
        if (!isOpen) {
            console.log("Modal is closed. Resetting modalType to 'settings'");
            // setModalType('settings');
        }
    }, [isOpen]);
    

    useEffect(() => {
        if (isOpen && modalType === 'statistics') {
            if (!statisticsCalculated) {
                const fetchedData = fetchStatisticsFromLocalStorage();
                console.log("Fetched game data:", fetchedData);  // Added this log
                const stats = calculateStatistics(fetchedData);
                setStatisticsData(stats);
                setStatisticsCalculated(true);
                console.log("Fetched from local storage:", fetchedData);
            }
        }
    }, [modalType, isOpen, statisticsCalculated]);

    useEffect(() => {
        if (!isOpen) {
            setStatisticsCalculated(false);
        }
    }, [isOpen]);
    
    
   
    
    const getContent = () => {
        console.log("Current modalType:", modalType);
        console.log("Rendering content for modalType:", modalType);

        switch(modalType) {
            
            case 'howToPlay':
                return <div className="how-to-play">
                            <div className="close-bar"><X color="#4F4F4F" cursor="pointer" className="modal-close-icon" onClick={onClose} /></div>
                            
                            <h1>How to Play</h1>
                            
                            <h2>Guess the movies of the day:</h2>
                                
                            <ul>
                                <li>Lock in guesses for all three movies.</li>
                                <li>Double-check your answers, you can only submit them once.</li>
                                <li>Enter and share your score!</li>
                            </ul>
                        
                            
                            <h2>Examples:</h2>
                            <h1>🍿 🍅 🍿</h1>
                            <p><span style={{color: "#F7E08E"}}>Popcorn</span> (🍿) means you guessed that movie right, but the <span style={{color: "#FF8E8E"}}>tomato</span> (🍅) means you guessed incorrectly... choose wisely.</p>
                            
                            <div className="divider"></div>
                            <div className="disclaimer">
                                <p>
                                    A new game is released daily at midnight. All rights to images go to the rightful owners, no copyright infringement intended.
                                </p>
                                <p >View our <a href="/privacy" onClick={handlePrivacyClick}>privacy policy</a>.</p> 
                            </div>
                            
                        </div>; 

            case 'settings':
                return <div className="settings">
                            <div className="close-bar"><X color="#4F4F4F" cursor="pointer" className="modal-close-icon" onClick={onClose} /></div>
                            <h1>Settings</h1>
                            <div className="menu-buttons-settings">
                                <button onClick={handleFeedbackClick}>Feedback</button>
                                <button onClick={handlePrivacyClick}>Privacy Policy</button>
                            </div>
                            

                        </div>; 


            case 'statistics':
                if (!statisticsData) {
                    return <div>Loading...</div>;  // or any other placeholder/loading component you'd like
                }
                return (
                    <div>
                        <div className="close-bar">
                            <X color="#4F4F4F" cursor="pointer" className="modal-close-icon" onClick={onClose} />
                        </div>
                        <h1>Statistics</h1>
                        <div className="stat-summary">
                            <div className="games-played">
                                <h3 className="number">{statisticsData.totalGames}</h3>
                                <p className="label">Played</p>
                            </div>
                            <div className="win-perc">
                                <h3 className="number">{Math.round(statisticsData.winPercentage)}%</h3>
                                <p className="label">Win</p>
                            </div>
                            <div className="win-streak">
                                <h3 className="number">{statisticsData.winStreak}</h3>
                                <p className="label">Streak</p>
                            </div>
                            <div className="max-streak">
                                <h3 className="number">{statisticsData.maxStreak}</h3>
                                <p className="label">Max Streak</p>
                            </div>
                          
                        </div>
                        <div className="guess-dist">
                            <h2>Guess Distribution</h2>
                            <div className="guess-chart">
                                {statisticsData.scoreCounts && Object.entries(statisticsData.scoreCounts).map(([score, count]) => (
                                    <div className="bar-row" key={score}>
                                        <p className="guess-label">{score}</p>
                                        <div className="bar" style={{width: `${(count / statisticsData.totalGames) * 100}%`}}><p className="bar-frequency-inside">{count}</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>


                    </div>
                );
            default:
                return null;
        }
    }

    if (!isOpen) {
        return null;
    }

    return (
        <CSSTransition
            in={isOpen}
            timeout={300}
            classNames="modal"
            unmountOnExit
        >
            <div 
                className={`modal-overlay ${isOpen ? 'active' : ''}`} 
                onClick={handleClose}
            >
                <div 
                    ref={modalContentRef}
                    className={`modal-content ${isOpen ? 'active' : ''}`} 
                >
                    {getContent()}   
                </div>
            </div>
        </CSSTransition>
    );

    // if (!isOpen) {
    //     return null;
    // }
    
    // return (
    //     <div className="modal-overlay">
    //         <div className="modal-content">
    //             Hello, this is a test modal!
    //         </div>
    //     </div>
    // );
    
    
}
export default Modal;
