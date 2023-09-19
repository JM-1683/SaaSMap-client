//Exports a list of logins outside main cities to. 
//the DB of emails + ISPs is retrieved and stored, then referenced
import React, { useEffect, useState } from 'react';
import './sideBar.css';

//This formats the data coming in as a prop
const transformData = (placeData, dbData) => {

    const seenKeys = new Set(); // Tracks seen combinations of email and trimmedCity

    return placeData
        .map(place => { //The user info is mapped out, and the name + city is returned
            const { location, user } = place._source;
            const currentCity = `${location.city}, ${location.region}`;
            return `${user.name} (${currentCity})`;
        })
        .filter(Boolean) //null values are removed
        .reduce((acc, cityInfo) => {
            const [email, city] = cityInfo.split(" ("); //Separate email and city
            const trimmedCity = city.slice(0, -5); //Remove unneeded characters from city
            const foundItem = dbData.find(item => item.EmailAddress === email); //matches the email with an email in the DB, stores into foundItem
            const key = email + trimmedCity;

            if (foundItem && !seenKeys.has(key)) { // as long as the set seenKeys doesn't have the key built from the current item,
                if (!Object.values(foundItem).some(value => String(value).includes(trimmedCity))) { //and if the city isn't found among the user's approved cities,
                    acc.push(<p key={key}>{cityInfo}</p>); //push into the accumulator the cityInfo, which is the user and the city they've logged in from
                    seenKeys.add(key);  // Adds key to the set
                }
            }
            return acc;
        }, []);
};


//the exported component
const OutsideMainCity = ({props}) => {
    const [placeData, setPlaceData] = useState([]);
    const [dbData, setDbData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (props.props.tableData && props.props.eventData) {
            const tableData = props.props.tableData;
            const eventData = props.props.eventData;
            setDbData(tableData);
            setPlaceData(eventData);
            setIsLoading(false); // Data has been set, stop the loading state
        }
    }, [props]);

    let finalRender = [];

    if (isLoading) {
        finalRender.push(<i key="Loading">Loading ...</i>);
    } else if (placeData.length && dbData.length) {
        finalRender = transformData(placeData, dbData);
        if (!finalRender.length) {
            finalRender.push(<i key="no-logins">No current logins outside usual locations.</i>);
        }
    } else {
        finalRender.push(<i key="no-data">No data available.</i>);
    }

    return (
        <div className='Container'>
            <h2>Logins outside usual locations</h2>
            {finalRender}
        </div>
    );
};

export default OutsideMainCity;