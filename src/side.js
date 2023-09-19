import React, { useState, useEffect } from 'react';
import './sideBar.css';
import MostActive from './mostActive';
import OutsideMainCity from './outsideMainCity';

const Sidebar = (initialProps) => {
    const [componentIndex, setComponentIndex] = useState(0);
    
    const components = [MostActive, OutsideMainCity];

    useEffect(() => {
        const timer = setInterval(() => {
            setComponentIndex((prevIndex) => (prevIndex + 1) % components.length);
        }, (process.env.REACT_APP_CYCLETIME || 3000));
        return () => clearInterval(timer);
    }, [components]);

    // If there are no initialProps yet
    if (!initialProps) {
        return <div>Loading...</div>;
    }

    const ActiveComponent = components[componentIndex];

    return (
        <div className="sidebar">
            <div className="component-container">
                <ActiveComponent props={initialProps} />
            </div>
        </div>
    );
}

export default Sidebar;
