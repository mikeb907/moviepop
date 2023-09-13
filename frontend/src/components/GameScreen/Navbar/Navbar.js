// components/GameScreen/Navbar/Navbar.js

import React from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';  
import HelpIcon from '@material-ui/icons/Help';
import BarChartIcon from '@material-ui/icons/BarChart';
import SettingsIcon from '@material-ui/icons/Settings';
import logo from '../../../assets/moviepop-logo.png';

function Navbar({ devMode, resetGame }) {
    const navigate = useNavigate();

    const navigateToHome = () => {
        navigate('/');
    };

    return (
        <div className="navbar">
            <img className="close-btn" onClick={navigateToHome} src={logo} alt="MoviePop Logo" />
            <div className="right-icons">
            {devMode && (
                <button style={{ backgroundColor: "#FFAB49", color: "#FFf", border: "none", fontWeight: "bold" }} onClick={resetGame}>R</button>
            )}

                <HelpIcon />
                <BarChartIcon />
                <SettingsIcon />
            </div>
        </div>
    );
}

export default Navbar;
