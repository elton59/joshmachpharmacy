import React from 'react';
import './Help.css'; // Import your updated CSS file

const Help = () => {
    return (
        <div className="help-container">
            <h1>Help</h1>
            <p>If you need assistance or have any questions, please feel free to contact us:</p>
            <ul>
                <li>Phone: <a href="tel:+254 703 650893">+254 703 650893</a></li>
                <li>Email: <a href="mailto:info@joshmachpharmacy.com">info@joshmachpharmacy.com</a></li>
                <li>Visit Us: Sultan Apartment Junction, Kikambala</li>
            </ul>
            <p>Our customer service team is available to assist you from Monday to Friday, 9:00 AM - 5:00 PM.</p>
        </div>
    );
};

export default Help;
