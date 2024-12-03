const express = require("express");
const axios = require("axios");
const app = express();

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve the public folder as static files
app.use(express.static("public"));

// Render the index template with default values for weather, events, and error
app.get("/", (req, res) => {
  res.render("index", { weather: null, events: null, error: null });
});

// Handle the /weather route
app.get("/weather", async (req, res) => {
  const city = req.query.city;
  const apiKey = "dd9a41836b5a953e7724b4b75da83933"; // Your OpenWeather API key
  const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  let weather;
  let error = null;
  try {
    const response = await axios.get(APIUrl);
    weather = response.data;
  } catch (error) {
    weather = null;
    error = "Error, Please try again";
  }
  res.render("index", { weather, events: null, error });
});

// Handle the /events route to fetch events from the Ticketmaster API
app.get("/events", async (req, res) => {
  const apiKey = "ON8A7Y2xxsgk3TfYqhbqzXiJElizmJ6e"; // Your Ticketmaster API key
  const APIUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&locale=*`;

  let events;
  let error = null;
  try {
    const response = await axios.get(APIUrl);
    if (response.data._embedded && response.data._embedded.events) {
      events = response.data._embedded.events;
    } else {
      error = "No events found.";
    }
  } catch (error) {
    events = null;
    error = "Error fetching events. Please try again";
  }
  res.render("index", { weather: null, events, error });
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
