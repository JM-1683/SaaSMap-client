//the Sidebar. This will cycle through any component it calls over any given period of time in milliseconds
import React, { useState, useEffect } from 'react';
import './sideBar.css';
import MostActive from './mostActive';
import OutsideMainCity from './outsideMainCity';

const Sidebar = (props) => {
    
    const components = [<MostActive props={props}/>, <OutsideMainCity props={props} />]; //Components are added to this array if they're to be cycled in the sidebar
    const [activeIndex, setActiveIndex] = useState(0);

    //the timer. REACT_APP_CYCLETIME is defined as 8000 ms in .env, also defaults to 8000 if
    //the variable can't be found in .env.
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % components.length);
        }, (process.env.REACT_APP_CYCLETIME || 3000));

        return () => clearInterval(timer);  // Clean up on component unmount
    },[]);

    //returns sidebar + component
    return (
        <div className="sidebar">
            <div className="component-container">
                {components[activeIndex]}
            </div>
        </div>
    );
}

export default Sidebar;
