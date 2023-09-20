// components/GameScreen/Navbar/Navbar.js

import React from 'react';
import './Navbar.css';
import Modal from '../../Modal/Modal';
import { useNavigate } from 'react-router-dom';  
import { HelpCircle, BarChart2, Settings } from 'react-feather';  // Importing Feather icons
import logo from '../../../assets/moviepop-logo.png';

function Navbar({ devMode, resetGame, setModalOpen, setModalType }) {
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

                <HelpCircle size={24} color="#fff" cursor="pointer" color="#fff" onClick={() => { setModalOpen(true); setModalType('howToPlay'); }} />
                <BarChart2 size={24} color="#fff" cursor="pointer" color="#fff" onClick={() => { setModalOpen(true); setModalType('statistics'); }} />
                <Settings size={24} color="#fff" cursor="pointer" color="#fff" onClick={() => { setModalOpen(true); setModalType('settings'); }} />
            </div>
        </div>
    );
}

export default Navbar;

