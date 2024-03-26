import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const defaultWeatherData = {
  location: {
    lat: 0,
    lon: 0,
    localtime: new Date().toISOString(),
    name: "Unknown",
    country: "Unknown",
  },
  current: {
    feelslike_c: 0,
    condition: { text: "Unknown" },
    precip_mm: 0,
    humidity: 0,
    wind_kph: 0,
  },
  forecast: { forecastday: [{ hour: Array(24).fill({ feelslike_c: 0 }) }] },
};

const App = () => {
  const [city, setCity] = useState("Tel aviv");
  const [weatherData, setWeatherData] = useState(defaultWeatherData);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      if (!city) {
        setError("Please enter a city name");
        return;
      }
      const response = await axios.get(
        `http://localhost:8000/weather/?city=${city}`,
        { timeout: 5000 }
      );
      setWeatherData(response.data);
      setError("");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError("City not found");
        } else {
          setError(
            "Error getting weather data, try again later or try a different city name"
          );
        }
      } else if (
        error.message.includes("timeout") ||
        error.message.includes("Network Error")
      ) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const formatDate = (dateString, includeMinutes = true) => {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = includeMinutes
      ? date.getMinutes().toString().padStart(2, "0")
      : "00";

    return `${day}/${month}/${year} at ${hours}:${minutes}`;
  };

  useEffect(() => {}, [weatherData]);

  return (
    <div className="body">
      <div className="content">
        <div className="first-section">
          <div className="img">
            <img
              src="./src/assets/Fintech_Black_LOGO.webp"
              alt="Fintech Logo" //alt for image accessibility
              className="logo"
            />
          </div>
          <br />
          <div className="general-div">
            <div className="general-text">
              <p>Use our weather app to see the weather around the world</p>
            </div>
            <div className="search-div-father">
              <label htmlFor="cityInput">City name</label>
              <div className="search-div">
                <input
                  type="text"
                  id="cityInput"
                  placeholder=""
                  className="input-field"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  aria-labelledby="cityInput" /* label accessibility */
                />
                <button onClick={handleSearch} className="search-button">
                  Check
                </button>
              </div>
              {error && (
                <div role="alert">
                  {" "}
                  {/*  error message accessibility */}
                  <p className="error-message">{error}</p>
                </div>
              )}
            </div>
            <div className="alt-lat-date">
              <div>
                <p>{`latitude ${weatherData.location.lat} longitude ${weatherData.location.lon}`}</p>
                <p className="local_time">{`accurate to ${formatDate(
                  weatherData.location.localtime
                )}`}</p>
              </div>
            </div>
          </div>
        </div>
        {weatherData && (
          <div className="second-section">
            <div className="inside-second-section">
              <p className="city_name">{weatherData.location.name}</p>
              <p className="country_name">{weatherData.location.country}</p>
              <p className="local_time_no_minutes">{`${formatDate(
                weatherData.location.localtime,
                false
              )}`}</p>
              <div className="big_degree">
                <div className="temperature">
                  <p className="feelslike_degree">
                    {Math.round(weatherData.current.feelslike_c)}°
                  </p>
                  <p className="condition_text">
                    {weatherData.current.condition.text}
                  </p>
                </div>
              </div>
              <div className="weather-condition">
                <div className="condition-div">
                  <p className="description-text">precipitation</p>
                  <span className="description-info">
                    {weatherData.current.precip_mm} mm
                  </span>
                </div>
                <div className="condition-div">
                  <p className="description-text">humidity</p>
                  <span className="description-info">
                    {weatherData.current.humidity}%
                  </span>
                </div>
                <div className="condition-div">
                  <p className="description-text">wind</p>
                  <span className="description-info">
                    {weatherData.current.wind_kph} km/h
                  </span>
                </div>
              </div>
              <div className="forecast_hours">
                {[13, 14, 15, 16, 17].map((hour) => (
                  <div key={hour} className="hour_temp">
                    <p className="temp">{`${hour}:00`}</p>
                    <p className="hour">
                      {Math.round(
                        weatherData.forecast.forecastday[0].hour[hour]
                          .feelslike_c
                      )}
                      °
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
