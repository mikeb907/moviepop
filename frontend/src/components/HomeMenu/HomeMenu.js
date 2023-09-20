// components/HomeMenu/HomeMenu.js

import React from 'react';
import './HomeMenu.css';
import logo from '../../assets/moviepop-logo.png';  // Assuming you placed the image in an 'assets' folder
import { useNavigate } from 'react-router-dom';  // Import useNavigate

function HomeMenu(props) {
    const currentDate = new Date();
    const navigate = useNavigate();  // Instantiate the hook

    const handleStartClick = () => {
        navigate('/game');
    };

    return (
        <div className="home-menu">
            <div className="menu-title">
                <p className="date">{currentDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>  {/* Fixed class to className */}
                <img src={logo} alt="MoviePop Logo" />   {/* Replaced h1 with img */}
                <p>the daily movie game</p>
            </div>
            <div className="menu-buttons">
                <button onClick={handleStartClick}>Start</button>  {/* Updated onClick handler */}
                <button>How to Play</button>
                <button>Settings</button>
            </div>
        </div>
    );
}

export default HomeMenu;
