//mostActive makes a list of the top 10 most active accounts
//across all 365 accounts

import React, { useState, useEffect } from 'react';
import './sideBar.css';

//A function that returns the size of an object passed to it
const objSize = (obj) => {
    let size = 0;
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

//The main component
const MostActive = ( propData ) => {
    const [Data, setData] = useState(null);

    //Sets the incoming prop as Data
    useEffect(() => {
        if (propData) {
            setData(propData.props.props.eventData);
        }
    }, [propData]);

    //the array to hold the final render
    let finalRender = [];

    //If the Data isn't undefined, it will begin being processed
    if (Data) {
        // Filter out unwanted user names and create a frequency map
        const freqMap = Data.reduce((acc, entry) => {
            const name = entry._source.user.name;
            if (!name.includes("runnetworkrun.com")) {
                acc[name] = (acc[name] || 0) + 1;
            }
            return acc;
        }, {});
    
        // Convert frequency map to array, sort it, then slice to get the top entries
        const topList = Object.entries(freqMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});
    
        // Render the top list
        const Keys = Object.keys(topList);
        const Values = Object.values(topList);
        for (let i = 0; i < Keys.length; i++) {
            finalRender.push(<p key={i}>{i + 1}. {Keys[i]} ({Values[i]} logins)</p>);
        }
    }
    //Return the list.
    return (
        <div className='Container'>
            <h2>Top 10 most active accounts</h2>
            {finalRender}
        </div>
    );
}

export default MostActive;
