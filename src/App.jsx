import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function App() {
  const [city, setCity] = useState('');
  const [airQuality, setAirQuality] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearch = () => {
    if (!city) {
      setError('Por favor, ingresa una ciudad.');
      return;
    }

    const apiKey = 'cce2ef6a2fe91345e99ebe702550c280';
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    axios.get(geoUrl)
      .then(geoResponse => {
        if (geoResponse.data.length === 0) {
          setError('Ciudad no encontrada. Por favor, intenta de nuevo.');
          return;
        }

        const { lat, lon } = geoResponse.data[0];
        
        const airQualityUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        return Promise.all([axios.get(airQualityUrl), axios.get(weatherUrl)]);
      })
      .then(([airQualityResponse, weatherResponse]) => {
        if (airQualityResponse) {
          setAirQuality(airQualityResponse.data);
        }
        if (weatherResponse) {
          setWeather(weatherResponse.data);
        }
        setError(null); // Limpiar errores anteriores
      })
      .catch(error => {
        console.error('Error al obtener los datos', error);
        setError('Error al obtener los datos. Por favor, intenta de nuevo.');
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-sm-12">
          <h2 className="text-center mb-4">Consulta la Calidad del Aire y el Clima en tu Ciudad</h2>
          <div className="mb-4">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ingresa tu ciudad" 
              value={city} 
              onChange={handleInputChange} 
            />
          </div>
          <button className="btn btn-primary w-100 mb-4" onClick={handleSearch}>Buscar</button>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {airQuality && weather && (
            <div className="card text-center p-4">
              <h3 className="card-title">Índice de Calidad del Aire (AQI)</h3>
              <p className="card-text">AQI: {airQuality.list[0].main.aqi}</p>
              <h4 className="card-title mt-4">Concentraciones de Contaminantes</h4>
              <p className="card-text">PM₂.₅: {airQuality.list[0].components.pm2_5} µg/m³</p>
              <p className="card-text">PM₁₀: {airQuality.list[0].components.pm10} µg/m³</p>
              <p className="card-text">O₃: {airQuality.list[0].components.o3} µg/m³</p>
              <p className="card-text">NO₂: {airQuality.list[0].components.no2} µg/m³</p>
              <p className="card-text">SO₂: {airQuality.list[0].components.so2} µg/m³</p>
              <p className="card-text">CO: {airQuality.list[0].components.co} µg/m³</p>
              <h4 className="card-title mt-4">Condiciones Meteorológicas Actuales</h4>
              <p className="card-text">Temperatura: {weather.main.temp}°C</p>
              <p className="card-text">Humedad: {weather.main.humidity}%</p>
              <p className="card-text">Velocidad del Viento: {weather.wind.speed} m/s</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
