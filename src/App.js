import React, { useEffect, useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import "./App.css";
import axios from 'axios';


function App() {
  const [weatherData, setWeatherData ] = useState([]);
  const [citiesData, setCitiesData] = useState([]);

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
      const response = await axios.post('https://webapplication120240406185246.azurewebsites.net/api/weather/forecast', cityData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = massageData(response.data["list"]);
      setWeatherData(data);
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

  const convertUnixTimestampToDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-MY', options);
  };

  const convertUnixTimestampToTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { hour: 'numeric', hour12: true };
    return date.toLocaleTimeString('en-US', options);
  };

  const formatTemperature = (temp) => {
    const roundedTemp = temp.toFixed(0);
    return roundedTemp + "°C";
  }

  const formatProbability = (pop) => {
    const percentage = (pop * 100).toFixed(0);
    return percentage + "% 🌧️";
  }

  const massageData = (data) => {
    const groupedByDay = data.reduce((acc, item) => {
      const date = new Date(item.dt * 1000);
    
      const key = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    
      acc[key] = acc[key] || [];
    
      acc[key].push(item);
    
      return acc;
    }, {});

    return groupedByDay;
  }

  const WeatherDetails = ({data}) => {
    //W-Todo: handle danger
    const date = convertUnixTimestampToDate(data[0]["dt"])

    return (
      <div className="weather-details" style={{padding: 15}} >
        <div>{date}</div>
        <div className="wd-row" style={{display: 'flex', justifyContent: 'space-around'}}>
          {
            data.map((data,index) => {
              const time = convertUnixTimestampToTime(data["dt"])
              const temp = formatTemperature(data["main"]["temp"]);
              const weather = data["weather"][0]["main"];
              const probability = formatProbability(data["pop"]);

              return (
                <div className="wd-col" style={{ padding: '15px' }}>
                    <div>{time}</div>
                    <div>{weather}</div>
                    <div>{temp}</div>
                    <div>{probability}</div>
                </div>
              )
            })
          }
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
        <div style={{ width: '100%', margin: '15px auto' }}>
          
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
          <div className="w-all" style={{padding: 15}}>
            {
              Object.keys(weatherData).map((key, index) => {
                return <WeatherDetails key={index} data={weatherData[key]} />
              })
            }
          </div>
          }
        </div>
      </header>
    </div>
  );
}

export default App;