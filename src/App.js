import React, { useEffect, useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import "./App.css";
// import { mock_cities } from "./mock_cities.js";
import { mock_weather } from "./mock_weather.js";

import axios from 'axios';


function App() {
  const [weatherData, setWeatherData ] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);

  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    getCitiesAPI();
  }, []);

  const getCitiesAPI = async () => {
    setIsLoadingCities(true);
    try {
      // W-TODO: Shorten
      const response = await axios.get('https://webapplication120240406185246.azurewebsites.net/api/cities');
      setCitiesData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoadingCities(false);
    }
  };

  const postWeatherAPI = async (cityData) => {
    setIsLoadingWeather(true);
    try {
      // W-TODO: Shorten
      const response = await axios.post('https://webapplication120240406185246.azurewebsites.net/api/weather/forecast', cityData);
      setWeatherData(response.data["list"]);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoadingWeather(false);
    }
  };


  const handleOnSelect = (cityData) => {
    postWeatherAPI(cityData);
  };

  const handleOnClear = () => {
    setWeatherData([]);
  };

  const convertUnixTimestampToString = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-MY', options);
  };

  const formatTemperature = (temp) => {
    const roundedTemp = temp.toFixed(0);
    return roundedTemp + "°C";
  }

  const formatProbability = (pop) => {
    const percentage = (pop * 100).toFixed(0);
    return percentage + "% chance of rain";
  }

  const massageData = (data) => {
    const groupedByDay = data.reduce((acc, item) => {
      // Create a Date object from the timestamp
      const date = new Date(item.dt * 1000);
    
      // Get the year, month, and day as a key string
      const key = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    
      // Initialize the array for this day if it doesn't exist
      acc[key] = acc[key] || [];
    
      // Add the item to the corresponding day array
      acc[key].push(item);
    
      return acc;
    }, {});

    return groupedByDay;
  }
  


  const WeatherDetails = ({item}) => {
    const date = convertUnixTimestampToString(item["dt"])
    const temp = formatTemperature(item["main"]["temp"]);
    const weather = item["weather"][0]["main"];
    const probability = formatProbability(item["pop"]);

    return (
      <div className="w-col-1" style={{ padding: '15px' }}>
        <div className="w-row" style={{display: "flex"}}> 
          <div className="w-col-2">
            <div>{date}</div>
            <div>{weather}</div>
            <div>{temp}</div>
            <div>{probability}</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!weatherData) {
    return <div>Error: Cities list is empty</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ width: 250, margin: 20 }}>
          
          {
            isLoadingCities
            ?
            <div>Loading Cities..</div>
            :
            <ReactSearchAutocomplete
              items={citiesData}
              fuseOptions={{ keys: ["name"] }}
              resultStringKeyName="name" 
              onSelect={handleOnSelect}
              onClear={handleOnClear}
              showIcon={false}
              placeholder="Search for a city"
            />
          }

          {
          isLoadingWeather
          ?
          <div>Loading Weather..</div>
          :
          weatherData.length === 0 
          ? 
            <div></div> 
          :
           weatherData.map((item) => {
              return (<WeatherDetails item={item}/>)
            })
          }
        </div>
      </header>
    </div>
  );
}

export default App;