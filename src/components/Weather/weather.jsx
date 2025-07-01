"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const WeatherApp = () => {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  const API_KEY = "519f2ba9f7f69ff116be67375c8339a1";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getWeather = async () => {
    const sanitizedLocation = location.trim();

    if (!sanitizedLocation) {
      setError("Please enter a location");
      setWeather(null);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${sanitizedLocation}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Location not found or error fetching data");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const getBackground = () => {
    if (!weather) return "from-indigo-500 via-purple-500 to-pink-500";
    const desc = weather.weather[0].main.toLowerCase();
    if (desc.includes("rain")) return "from-blue-900 via-blue-700 to-blue-500";
    if (desc.includes("cloud")) return "from-gray-700 via-gray-500 to-gray-300";
    if (desc.includes("clear")) return "from-yellow-400 via-orange-400 to-pink-500";
    if (desc.includes("snow")) return "from-white via-blue-100 to-blue-300";
    return "from-green-500 via-teal-400 to-blue-500";
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackground()} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl text-white transition-all">
        <h1 className="text-4xl font-extrabold text-center mb-4 drop-shadow-md">🌤️ Weather Now</h1>

        <p className="text-center text-sm text-white/80 mb-6">{currentDate}</p>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search city or country"
            className="flex-1 px-4 py-2 rounded-lg bg-white/30 placeholder-white/80 text-white focus:outline-none focus:ring-2 focus:ring-white transition"
          />
          <button
            onClick={getWeather}
            disabled={loading}
            className="bg-white text-indigo-600 font-bold px-4 py-2 rounded-lg hover:bg-indigo-100 transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Get Weather"}
          </button>
        </div>

        {error && <p className="text-red-200 text-center mb-4">{error}</p>}

        {weather && (
          <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 space-y-3 animate-fade-in shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {weather.name}, {weather.sys.country}
                </h2>
                <p className="text-sm text-white/70">{weather.weather[0].main}</p>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather-icon"
                className="w-14 h-14"
              />
            </div>
            <p className="text-lg">🌡 <strong>Temp:</strong> {weather.main.temp}°C</p>
            <p className="text-lg">💧 <strong>Humidity:</strong> {weather.main.humidity}%</p>
            <p className="text-lg">💨 <strong>Wind:</strong> {weather.wind.speed} m/s</p>
            <p className="text-sm text-white/70">Feels like {weather.main.feels_like}°C</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
