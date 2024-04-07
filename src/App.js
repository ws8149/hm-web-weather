import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://webapplication120240406185246.azurewebsites.net/api/cities');
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data found</div>;
  }

  return (
    <div>
      <h1>My Data</h1>
      loop through the data and display
      {data.map((item) => (
        <div key={item.id}>
          <p>Name: {item.name}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
