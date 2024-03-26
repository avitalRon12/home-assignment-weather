const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const weatherRoutes = require('./routes/weatherRoute');
app.use('/weather', weatherRoutes);

module.exports = app;
