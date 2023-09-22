// components/HomeMenu/HomeMenu.js

import React, { useState, useRef, useEffect } from 'react';  // Import useState, useRef, useEffect
import './HomeMenu.css';
import Modal from '../Modal/Modal';
import logo from '../../assets/moviepop-logo.png';  // Assuming you placed the image in an 'assets' folder
import { useNavigate } from 'react-router-dom';  // Import useNavigate

function HomeMenu(props) {
    const currentDate = new Date();
    const navigate = useNavigate();  // Instantiate the hook
    const videoRef = useRef(null);  // Create a reference for the video


    const [modalOpen, setModalOpen] = useState(false);  // State to control modal visibility
    const [modalType, setModalType] = useState(null);   // State to control modal content type

    const handleStartClick = () => {
        navigate('/game');
    };

    useEffect(() => {
        const playPromise = videoRef.current.play();  // Play the video when the component mounts
    
        if (playPromise !== undefined) {
            playPromise
                .then(_ => {
                    // Autoplay started!
                })
                .catch(error => {
                    // Autoplay was prevented, handle it
                    console.warn("Autoplay was prevented:", error.message);
                });
        }
    }, []);
    

    return (
        <div className="home-menu">
            <div className="menu-title">
                <img src={logo} alt="MoviePop Logo" />
                <p>the daily movie game</p>
                <p className="date">{currentDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>

            <div className="background-video">
                <video ref={videoRef} playsInline autoPlay muted loop preload="auto">
                    <source src="https://concessionstand.nyc3.cdn.digitaloceanspaces.com/concessionstand/homemenu/updatedvideo.mp4" type="video/mp4"/>
                </video>
            </div>

            <div className="menu-buttons">
                <button onClick={handleStartClick}>Start</button>
                <button onClick={() => { console.log("How to Play Clicked"); setModalOpen(true); setModalType('howToPlay'); }}>How to Play</button>
                <button onClick={() => { setModalOpen(true); setModalType('settings'); }}>Settings</button>
            </div>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} type={modalType} />
        </div>
    );
}

export default HomeMenu;