// components/GameScreen/Navbar/Navbar.js

import React from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';  
import CloseIcon from '@material-ui/icons/Close';
import HelpIcon from '@material-ui/icons/Help';
import BarChartIcon from '@material-ui/icons/BarChart';
import SettingsIcon from '@material-ui/icons/Settings';

function Navbar() {
    const navigate = useNavigate();  // Instantiate the navigate hook

    const navigateToHome = () => {
        navigate('/');  // Navigate to home route using the updated navigate function
    };

    return (
        <div className="navbar">
            <CloseIcon className="close-btn" onClick={navigateToHome} />  {/* Attach click handler */}
            <div className="right-icons">
                <HelpIcon />
                <BarChartIcon />
                <SettingsIcon />
            </div>
        </div>
    );
}
export default Navbar;
