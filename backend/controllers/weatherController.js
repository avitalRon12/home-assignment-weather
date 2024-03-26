const axios = require("axios");
const apiKey = process.env.WEATHER_API_KEY;

exports.getWeather = async (req, res) => {
  try {
    const { city } = req.query;
    if (city) {
      const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=no&alerts=no`;
      const response = await axios.get(apiUrl);
      res.json(response.data);
    } else {
      res.status(400).json({ error: "City parameter is missing" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching weather data, city not found or try again later" });
  }
};
