import { useEffect, useState } from "react";
import "./App.css";
import PropType from "prop-types";

// images
import clearIcon from "./assets/clear.png";
import cloudIcon from "./assets/cloud.png";
import drizzleIcon from "./assets/drizzle.png";
import humidityIcon from "./assets/humidity.png";
import rainIcon from "./assets/rain.png";
import searchIcon from "./assets/search.png";
import snowIcon from "./assets/snow.png";
import windIcon from "./assets/wind.png";

const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  lat,
  log,
  humidity,
  wind,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="image" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="city">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="log">longtitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon" />
          <div className="data">
            <div className="humidity-percentage">{humidity}%</div>
            <div className="text">Himudity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="icon" />
          <div className="data">
            <div className="wind-percentage">{wind}km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
      <div className="last">
        Design by <span> Yatheentharan Riyadna</span>
      </div>
    </>
  );
};

WeatherDetails.PropType = {
  icon: PropType.string.isRequired,
  temp: PropType.number.isRequired,
  city: PropType.string.isRequired,
  country: PropType.string.isRequired,
  lat: PropType.number.isRequired,
  log: PropType.number.isRequired,
  humidity: PropType.number.isRequired,
  wind: PropType.number.isRequired,
};

function App() {
  const api_key = import.meta.env.VITE_APP_API_KEY;
  const [icon, setIcon] = useState(clearIcon);
  const [temp, setTemp] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [lat, setLat] = useState();
  const [log, setLog] = useState();
  const [humidity, setHumidity] = useState();
  const [wind, setWind] = useState();
  const [text, setText] = useState("london");
  const [loading, setLoading] = useState(false);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();
      // console.log(data);
      if (data.cod === "404") {
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setTemp(Math.floor(data.main.temp));
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setCountry(data.sys.country);
      setCity(data.name);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError("An error occurred while fetching weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className="container">
        <div className="box-container">
          <input
            type="text"
            className="cityInput"
            placeholder="Search City"
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div className="search-icon" onClick={() => search()}>
            <img src={searchIcon} alt="searchIcon" />
          </div>
        </div>
        {loading && <div className="loading-message">Loading...</div>}{" "}
        {error && <div className="error-message">{error}</div>}{" "}
        {cityNotFound && <div className="city-not-found">City not found</div>}{" "}
        {!loading && !cityNotFound && (
          <WeatherDetails
            icon={icon}
            temp={temp}
            city={city}
            country={country}
            lat={lat}
            log={log}
            humidity={humidity}
            wind={wind}
          />
        )}
      </div>
    </>
  );
}

export default App;
