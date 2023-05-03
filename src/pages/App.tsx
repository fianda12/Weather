import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import Layout from "../components/Layout";
import { WeatherType } from "../Types/Data";
import { CountryType } from "../Types/Data";

import "leaflet/dist/leaflet.css";

const App: React.FC = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherType | null>(null);
  const [error, setError] = useState("");
  const [countryData, setCountryData] = useState<CountryType | null>(null);

  useEffect(() => {
    if (city) {
      fetchWeatherData();
    }
  }, [city]);

  function fetchWeatherData() {
    const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${
      import.meta.env.VITE_API_KEY
    }&units=metric`;
    axios
      .get(weatherUrl)
      .then((response) => {
        const data = response.data;
        const weatherData: WeatherType = {
          name: data.name,
          main: {
            temp: data.main.temp,
            humidity: data.main.humidity,
            feels_like: data.main.feels_like,
            temp_max: data.main.temp_max,
            temp_min: data.main.temp_min,
          },
          weather: [
            {
              description: data.weather[0].description,
              icon: data.weather[0].icon,
            },
          ],
          coord: {
            lon: data.coord.lon,
            lat: data.coord.lat,
          },
          wind: {
            speed: data.speed,
          },
          visibility: data.visibility,
        };
        setWeatherData(weatherData);
        setError("");
        fetchCountryData(data.name);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setWeatherData(null);
        setError("Failed to fetch weather data.");
        setCountryData(null);
      });
  }

  function fetchCountryData(name: string) {
    const countryUrl = `https://restcountries.com/v3.1/name/${name}`;

    axios
      .get(countryUrl)
      .then((response) => {
        const data = response.data;
        const countryData: CountryType = {
          name: data[0].name.common,
          capital: data[0].capital?.[0] || "N/A",
          population: data[0].population || 0,
        };
        setCountryData(countryData);
      })
      .catch((error) => {
        console.error("Error fetching country data:", error);
        setCountryData(null);
      });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeatherData();
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center space-y-12">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-7">
          <h1 className="text-4xl font-bold text-black">Weather</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2"
          >
            <input
              type="text"
              placeholder="Enter Country Name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="px-4 py-2 text-black border bg-white border-gray-300 rounded-lg w-full md:w-96"
            />
            <button
              type="submit"
              className="btn bg-black text-white py-2 rounded-lg"
            >
              Get Weather
            </button>
          </form>
        </div>
        {weatherData && (
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2">
            <div className="card-compact card w-96 md:w-96 h-72 rounded-lg-md-sm bg-white shadow-lg-sm shadow-black border border-black transform transition duration-500 hover:z-20 hover:scale-110">
              <div className="card-body items-center text-start">
                <div className="flex flex-row">
                  <h2 className="card-title text-black">
                    {weatherData.name}
                  </h2>
                  <img
                    src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                    alt="Weather Icon"
                  />
                </div>
                <p className="text-xl text-black">{weatherData.main.temp}°C</p>
                <p className="text-xl text-black">{weatherData.main.humidity}%</p>
                <p className="text-xl text-black">{weatherData.weather[0].description}</p>
              </div>
            </div>
            {countryData && (
              <div className="card-compact card w-96 md:w-96 h-72 rounded-lg-md-sm bg-white shadow-lg-sm shadow-black border border-black transform transition duration-500 hover:z-20 hover:scale-110">
                <div className="flex flex-row mt-7">
                  <div className="card-body bg-zinc-800 w-6/12 text-black rounded-lg ml-8">
                    <p className="text-xl text-white">felt Temp</p>
                    <p className="text-xl text-white">Wind</p>
                    <p className="text-xl text-white">Visibility</p>
                    <p className="text-xl text-white">Max Temp</p>
                    <p className="text-xl text-white">Min Temp</p>
                  </div>
                  <div className="card-body">
                    <p className="text-xl text-black">{weatherData.main.feels_like}°C</p>
                    <p className="text-xl text-black">{weatherData.wind.speed} Km/h</p>
                    <p className="text-xl text-black">{weatherData.visibility} Km</p>
                    <p className="text-xl text-black">{weatherData.main.temp_max}°C</p>
                    <p className="text-xl text-black">{weatherData.main.temp_min}°C</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {weatherData && (
          <div className="w-full" style={{ maxWidth: "100%", height: "400px" }}>
            <MapContainer
              center={[weatherData.coord.lat, weatherData.coord.lon]}
              zoom={10}
              scrollWheelZoom={false}
              style={{ width: "100%", height: "480px" }}
            >
              <TileLayer
                attribution="Map data © <a href='https://openstreetmap.org'>OpenStreetMap</a> contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[weatherData.coord.lat, weatherData.coord.lon]}>
                <Popup>{weatherData.name}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
