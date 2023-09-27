import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import HomeMenu from '../HomeMenu/HomeMenu';
import GameScreen from '../GameScreen/GameScreen';
import PrivacyPolicy from '../PrivacyPolicy/PrivacyPolicy';  // <-- Import the new component here
import ReactGA from 'react-ga';

ReactGA.initialize('G-3CRZGVCEKY');



function App() {

    // Use the useEffect hook to run the function once the component mounts
    useEffect(() => {
        // Define the function that sets the custom --vh CSS variable
        function setVHProperty() {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }

        // Set the --vh value when the component mounts
        setVHProperty();

        // Update the --vh value whenever the window is resized
        window.addEventListener('resize', setVHProperty);

        // Cleanup: remove the event listener when the component is unmounted
        return () => {
            window.removeEventListener('resize', setVHProperty);
        };
    }, []); // Empty dependency array ensures this useEffect runs only once when the component mounts

    // Google Analytics tracking
    let location = useLocation();
    
    useEffect(() => {
        ReactGA.pageview(location.pathname);
    }, [location]);

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomeMenu />} />
                    <Route path="/game" element={<GameScreen />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />  {/* <-- Add this new route */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
