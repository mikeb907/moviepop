// components/PrivacyPolicy/PrivacyPolicy.js

import React from 'react';
import './PrivacyPolicy.css';  // <-- Import the CSS file here


function PrivacyPolicy() {
    return (
        <div className="privacy">
            <h1 className="popcorn-header">🍿</h1>
            <h1>Privacy Policy</h1>
            <p><strong>Last updated: September 19th, 2023</strong></p>
            <p>Welcome to MoviePop! We respect your privacy and are committed to protecting it. This privacy policy describes our practices concerning the information we collect from you when you use our app.</p>
            
            <h2>1. Information We Collect</h2>
            <p>While using our app, we do not collect any personal identifiable information. However, we store certain game-related data on your device to ensure that you can return to the correct state in which you were playing the game.</p>

            <h2>2. How We Use The Information</h2>
            <p>The information stored locally on your device is solely used to enhance your gaming experience by allowing the app to remember your game state.</p>

            <h2>3. Cookies</h2>
            <p>As of the date of this privacy policy, we do not use cookies in our app. However, we're always striving to improve user experience, and cookies might be implemented in the future to help achieve this goal.</p>

            <h2>4. External Links</h2>
            <p>Our app doesn't contain any external links. Should we decide to include links in the future, we are not responsible for the content, privacy policies, or practices of any third-party websites.</p>

            <h2>5. Security</h2>
            <p>While we don't store personal user data, we are committed to ensuring that your gaming experience is secure. Any future features, like sign-ups or sign-ins, that would require data collection will be developed with security in mind.</p>

            <h2>6. Changes to This Privacy Policy</h2>
            <p>From time to time, we may update this privacy policy. If we make any changes, we will notify users through our app. In the future, if we maintain an email list, we may also notify users through our newsletters.</p>

            <h2>7. Contact Us</h2>
            <p>For any questions or concerns regarding this privacy policy, please contact us at <a href="mailto:hello@moviepop.cc">hello@moviepop.cc</a>.</p>
            <div className="spacer"></div>
        </div>
    );
}

export default PrivacyPolicy;
