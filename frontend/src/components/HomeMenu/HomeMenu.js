// components/HomeMenu/HomeMenu.js

import React from 'react';
import './HomeMenu.css';

function HomeMenu(props) {
    const currentDate = new Date();

    return (
        <div className="home-menu">
            <div className="menu-title">
                <p>{currentDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <h1>MoviePop</h1>
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
