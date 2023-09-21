// components/HomeMenu/HomeMenu.js

import React, { useState } from 'react';  // Import useState
import './HomeMenu.css';
import Modal from '../Modal/Modal';
import logo from '../../assets/moviepop-logo.png';  // Assuming you placed the image in an 'assets' folder
import { useNavigate } from 'react-router-dom';  // Import useNavigate

function HomeMenu(props) {
    const currentDate = new Date();
    const navigate = useNavigate();  // Instantiate the hook

    const [modalOpen, setModalOpen] = useState(false);  // State to control modal visibility
    const [modalType, setModalType] = useState(null);   // State to control modal content type

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
                <button onClick={handleStartClick}>Start</button>
                <button onClick={() => { console.log("How to Play Clicked"); setModalOpen(true); setModalType('howToPlay'); }}>How to Play</button>
                <button onClick={() => { setModalOpen(true); setModalType('settings'); }}>Settings</button>
            </div>
            {/* Here, include the Modal component and pass in the required props */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} type={modalType} />

        </div>
    );
}

export default HomeMenu;
