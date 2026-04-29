export const fetchWeather = async (destination) => {
  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1`);
    if (!geoRes.ok) throw new Error('Geocoding failed');
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) throw new Error('Location not found');
    const { latitude, longitude } = geoData.results[0];

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,precipitation_probability_max,uv_index_max&hourly=temperature_2m&timezone=auto&forecast_days=1`
    );
    const weatherData = await weatherRes.json();

    return {
      maxTemp: weatherData.daily.temperature_2m_max[0],
      precipProb: weatherData.daily.precipitation_probability_max[0],
      maxUv: weatherData.daily.uv_index_max[0],
      hourly: weatherData.hourly.temperature_2m.slice(6, 22),
    };
  } catch {
    return { maxTemp: 30, precipProb: 10, maxUv: 7, hourly: Array(16).fill(30) };
  }
};
