import './App.css';
import { Map } from './emailISPMap';
import Sidebar from './side'
import React, { useState, useEffect } from 'react';

const App = () => {
  const [data, setData] = useState(null);
  const [dbData, setDbData] = useState(null);

  //getLoginData and retrieveDb are both defined then called in a useEffect at the same time via an await Promise.all
  const getLoginData = async () => {
    const response = await fetch('http://localhost:4000/updateMapAndLogins');
    const eventData = await response.json();
    setData(eventData);
  }

  const retrieveDb = async () => {
    try {
      const response = await fetch('http://localhost:4000/getDb');
      const tableData = await response.json();
      setDbData(tableData);
    } catch (error) {
      console.log(error);
    }
  }

  //The data is retrieved ...
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getLoginData(), retrieveDb()]);
    }
    fetchData();
  }, []);

  // Add useEffect to refresh the page every three minutes
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.reload();
    }, 150000); // Refresh every 3 minutes

    return () => clearTimeout(timer); // Clear the timer when component unmounts
  }, []);

  //And, if not undefined,
  if (data && dbData) {
    const passData = {
      eventData: data,
      tableData: dbData
    }

    //passed to components as props
    return (
      <div className="container">
          <Map props={passData}/>
          <Sidebar props={passData} />
      </div>
    );
  } else {
    return (<h1>Loading data ...</h1>)
  }
}

export default App;
