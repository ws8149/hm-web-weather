import React from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import "./App.css";
import { mock_cities } from "./mock_cities.js";

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

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ width: 200, margin: 20 }}>
          {/* <img
            src={logo}
            alt="logo"
            style={{ width: "100%", marginBottom: 20 }}
          /> */}
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
            styling={{
              // height: "34px",
              // border: "1px solid darkgreen",
              // borderRadius: "4px",
              // backgroundColor: "white",
              // boxShadow: "none",
              // hoverBackgroundColor: "lightgreen",
              // color: "darkgreen",
              // fontSize: "12px",
              // fontFamily: "Courier",
              // iconColor: "green",
              // lineColor: "lightgreen",
              // placeholderColor: "darkgreen",
              // clearIconMargin: "3px 8px 0 0",
              // zIndex: 2,
            }}
          />
          <div style={{ marginTop: 20 }}>City Weather</div>
        </div>
      </header>
    </div>
  );
}

export default App;