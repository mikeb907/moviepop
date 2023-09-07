import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import necessary components
import './App.css';
import HomeMenu from '../HomeMenu/HomeMenu';
import GameScreen from '../GameScreen/GameScreen';  // Import the GameScreen component

function App() {
    return (
        <Router> {/* Wrap the entire application in a Router */}
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomeMenu />} />
                    <Route path="/game" element={<GameScreen />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
