import React from 'react';
import './Navigation.css';

const Navigation = () => {
    return (
        <div className="navigation">
            <div className="categories">
                <span>Categories:</span>
                <a href="#all">All</a>
                <a href="#prescription">Prescription Medications</a>
                <a href="#otc">Over-the-Counter Products</a>
                <a href="#vitamins">Vitamins & Supplements</a>
                <a href="#first-aid">First Aid Supplies</a>
            </div>
            <div className="search">
                <input type="text" placeholder="Search" />
            </div>
        </div>
    );
};

export default Navigation;
