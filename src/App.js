import React from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import "./App.css";
import { mock_cities } from "./mock_cities.js";
import { mock_weather } from "./mock_weather.js";


function App() {
  const handleOnSearch = (string, results) => {
    console.log(string, results);
  };

  const handleOnHover = (result) => {
    console.log(result);
  };

  const handleOnSelect = (item) => {
    console.log(item);
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  const handleOnClear = () => {
    console.log("Cleared");
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

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ width: 250, margin: 20 }}>
          
          <ReactSearchAutocomplete
            items={mock_cities}
            fuseOptions={{ keys: ["name"] }} // Search on both fields
            resultStringKeyName="name" // String to display in the results
            onSearch={handleOnSearch}
            onHover={handleOnHover}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            onClear={handleOnClear}
            showIcon={false}
            placeholder="Search for a city"
          />
          {
            mock_weather["list"].map((item) => {
              return (<WeatherDetails item={item}/>)
            })
          }
        </div>
      </header>
    </div>
  );
}

export default App;