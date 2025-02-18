import Head from 'next/head'
import { useState, useEffect } from 'react' // Import useState and useEffect

export default function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('London'); // Initial city
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


    const fetchWeatherData = async (cityName) => {
        setLoading(true);
        setError(null);

      try {
          // 1. Search for the city to get the woeid (Where On Earth ID)
          const cityResponse = await fetch(`https://www.metaweather.com/api/location/search/?query=${cityName}`);
          const cityData = await cityResponse.json();

          if (!cityData || cityData.length === 0) {
              throw new Error("City not found");
          }

          const woeid = cityData[0].woeid;

          // 2. Fetch weather data using the woeid
          const weatherResponse = await fetch(`https://www.metaweather.com/api/location/${woeid}/`);
          const weatherDataResult = await weatherResponse.json();

        setWeatherData(weatherDataResult);

      } catch (err) {
        setError(err.message);
          console.error("Error fetching weather data:", err);
      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
      fetchWeatherData(city);  // Fetch weather data on initial load
  }, [city]); // Refetch when city changes


  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeatherData(city);
  }


  return (
    <div className="container">
      <Head>
        <title>Weather App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Weather Information</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={city}
            onChange={handleCityChange}
            placeholder="Enter city name"
          />
          <button type="submit">Get Weather</button>
        </form>

        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        {weatherData && (
          <div>
            <h2>{weatherData.title}</h2>
            <p>Timezone: {weatherData.timezone}</p>

            <h3>Consolidated Weather</h3>
            {weatherData.consolidated_weather.map((day, index) => (
               <div key={index}>
                 <p>Date: {day.applicable_date}</p>
                 <p>Weather State: {day.weather_state_name}</p>
                 <p>Min Temp: {day.min_temp.toFixed(2)}°C</p>
                 <p>Max Temp: {day.max_temp.toFixed(2)}°C</p>
                 <p>Wind Speed: {day.wind_speed.toFixed(2)} mph</p>
                 <hr/>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
