// components/GameScreen/Navbar/Navbar.js

import React from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';  
// import CloseIcon from '@material-ui/icons/Close';
import HelpIcon from '@material-ui/icons/Help';
import BarChartIcon from '@material-ui/icons/BarChart';
import SettingsIcon from '@material-ui/icons/Settings';
import logo from '../../../assets/moviepop-logo.png';  // Assuming you placed the image in an 'assets' folder


function Navbar() {
    const navigate = useNavigate();  // Instantiate the navigate hook

    const navigateToHome = () => {
        navigate('/');  // Navigate to home route using the updated navigate function
    };

    return (
        <div className="navbar">
            {/* <CloseIcon className="close-btn" onClick={navigateToHome} />   */}
            <img className="close-btn" onClick={navigateToHome} src={logo} alt="MoviePop Logo" />
            <div className="right-icons">
                <HelpIcon />
                <BarChartIcon />
                <SettingsIcon />
            </div>
        </div>
    );
}
export default Navbar;
