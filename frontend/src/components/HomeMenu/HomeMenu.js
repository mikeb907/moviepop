// components/HomeMenu/HomeMenu.js

import React from 'react';
import './HomeMenu.css';
import logo from '../../assets/moviepop-logo.png';  // Assuming you placed the image in an 'assets' folder


function HomeMenu(props) {
    const currentDate = new Date();

    return (
        <div className="home-menu">
            <div className="menu-title">
                <p class="date">{currentDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <img src={logo} alt="MoviePop Logo" />   {/* Replaced h1 with img */}
                <p>Do you know which movie is which?</p>
            </div>
            <div className="menu-buttons">
                <button onClick={props.startGame}>Start</button>
                <button>How to Play</button>
                <button>Settings</button>
            </div>
        </div>
    );
}

export default HomeMenu;
