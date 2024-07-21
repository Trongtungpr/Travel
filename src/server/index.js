// Require Express to run server and routes
const express = require("express");
// Middleware
const bodyParser = require("body-parser");
// dotenv for process.env
require("dotenv").config();
// Cors for cross origin allowance
const cors = require("cors");
// Fetch for making API requests
const fetch = require("node-fetch");
// Import Axios for making API requests
const axios = require('axios');

// Start up an instance of app
const app = express();

// Configure body-parser as middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable CORS for all origins
app.use(cors());

// Initialize the main project folder
app.use(express.static("dist"));

// Setup Server
const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});

// ----------------------------------------
// API Endpoints and Helper Functions:
// ----------------------------------------

// app.post("/getDataFromAllAPI", async (req, res) => {
//   try {
//     const location = req.body.location;
//     const startDate = req.body.startDate;

//     // Input Validation (Add more checks as needed)
//     if (!location || !startDate) {
//       return res.status(400).json({ error: "Missing location or startDate." });
//     }

//     const locationData = await getLatLngCountryFromGeoNames(location);
//     if (!locationData) { // Handle the case where getLatLngCountryFromGeoNames returns null
//       return res.status(404).json({ error: "Location not found." });
//     }

//     const weatherData = await getForecastWeatherFromWeatherbit(locationData);
//     const imageData = await getImagesFromPixabay(locationData);

//     // Create the returnData object
//     const returnData = {
//       startDate: startDate,
//       country: locationData.country,
//       city_name: weatherData.city_name, 
//       // ... other properties to be added from weatherData and imageData
//     };

//     // Find weather data for the specified startDate
//     getWeatherDataForDate(returnData, weatherData, startDate);

//     // Add image URL from imageData
//     if (imageData.hits && imageData.hits.length > 0) {
//       returnData.webformatURL = imageData.hits[0].webformatURL;
//     } else {
//       // Handle cases where no image is found
//       returnData.webformatURL = ""; // Or a default image URL
//     }

//     res.send(returnData);

//   } catch (error) {
//     console.error("Error processing request:", error); 
//     res.status(500).json({ error: "An error occurred while processing the request." });
//   }
// });
app.post("/getDataFromAllAPI", async (req, res) => {
  try {
    const location = req.body.location;
    const startDate = req.body.startDate;

    // Input Validation
    if (!location || !startDate) {
      return res.status(400).json({ error: "Missing location or startDate." });
    }
    // Validate date format
    if (!isValidDate(startDate)) {
      return res.status(400).json({ error: "Invalid startDate format. Please use YYYY-MM-DD." });
    }

    const locationData = await getLatLngCountryFromGeoNames(location);
    if (!locationData) { 
      return res.status(404).json({ error: "Location not found." });
    }

    const weatherData = await getForecastWeatherFromWeatherbit(locationData);
    // Check weatherData 
    if (!weatherData || !weatherData.data) {
      return res.status(500).json({ error: "Error fetching weather data." });
    }

    const imageData = await getImagesFromPixabay(locationData);
    // Check imageData
    if (imageData.totalHits === 0) {
      console.log("No images found for this location.");
    }

    const returnData = {
      startDate: startDate,
      country: locationData.country,
      city_name: weatherData.city_name,
      // ... other properties from weatherData and imageData
    };

    // Find weather data for the specified startDate
    const weatherForDate = getWeatherDataForDate(weatherData.data, startDate);
    if (weatherForDate) {
      Object.assign(returnData, weatherForDate);
    } else {
      return res.status(404).json({ error: "No weather data found for the specified date." }); 
    }

    // Add image URL from imageData
    returnData.webformatURL = imageData.hits && imageData.hits.length > 0 ? imageData.hits[0].webformatURL : ""; 

    res.send(returnData);

  } catch (error) {
    console.error("Error processing request:", error); 
    res.status(500).json({ error: "An error occurred while processing the request.", details: error.message }); 
  }
});

// Hàm kiểm tra định dạng ngày tháng
function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString);
}
// --- API Client Functions ---

async function getLatLngCountryFromGeoNames(location) {
  try {
    const response = await axios.get('http://api.geonames.org/searchJSON', {
      params: {
        q: location,
        maxRows: 1,
        username: process.env.GEONAMES_USERNAME, // Use process.env for API credentials
      },
    });

    if (response.data.geonames && response.data.geonames.length > 0) {
      const firstResult = response.data.geonames[0];
      return {
        latitude: firstResult.lat,
        longitude: firstResult.lng,
        country: firstResult.countryName,
      };
    } else {
      console.error('Location not found in GeoNames API:', location);
      return null; // Return null to indicate location not found
    }
  } catch (error) {
    console.error('Error fetching data from GeoNames:', error.message);
    console.error('Location:', location);
    throw error; // Re-throw to be handled by the calling function
  }
}


async function getForecastWeatherFromWeatherbit(locationData) {
  const requestURL = `${process.env.WEATHERBIT_URL}lat=${locationData.latitude}&lon=${locationData.longitude}${process.env.WEATHERBIT_API_KEY}`;

  try {
    const response = await fetch(requestURL);
    const data = await response.json();

    // Validation for Weatherbit response (add more checks as needed)
    if (data.data && data.data.length > 0) { 
      return data; 
    } else {
      console.error("Invalid data format from Weatherbit:", data);
      throw new Error("Invalid data received from Weatherbit API.");
    }
  } catch (error) {
    console.error("Error fetching data from Weatherbit:", error);
    throw error;
  }
}

async function getImagesFromPixabay(locationData) {
  const requestURL = `${process.env.PIXABAY_URL}${encodeURIComponent(locationData.country.trim())}${process.env.PIXABAY_KEY}`;
  try {
    const response = await fetch(requestURL);
    const data = await response.json();

    // Validation for Pixabay response (add more checks as needed)
    if (data.hits) { 
      return data;
    } else {
      console.error("Invalid data format from Pixabay:", data);
      throw new Error("Invalid data received from Pixabay API.");
    } 
  } catch (error) {
    console.error("Error fetching data from Pixabay:", error);
    throw error;
  }
}

// --- Helper Function ---

function getWeatherDataForDate(returnData, weatherData, startDate) {
  // Assuming weatherData.data is an array of daily forecasts
  for (const dailyData of weatherData.data) {
    if (dailyData.valid_date === startDate) {
      returnData.temp = dailyData.temp;
      returnData.weather = dailyData.weather.description;
      return; // Exit the loop once a match is found
    }
  }
  // Handle cases where no matching date is found (optional)
  console.warn("No matching weather data found for the specified date.");
} 