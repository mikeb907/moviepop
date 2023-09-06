import React, { useState } from 'react';
import './App.css';
import HomeMenu from '../HomeMenu/HomeMenu';
import GameScreen from '../GameScreen/GameScreen';  // Import the GameScreen component (ensure you have this component in your directory)

function App() {
    const [gameStarted, setGameStarted] = useState(false);

    const startGame = () => {
        setGameStarted(true);
    };

    return (
        <div className="App">
            {gameStarted ? <GameScreen /> : <HomeMenu startGame={startGame} />}
        </div>
    );
}

export default App;
