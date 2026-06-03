/**
 * Panthi Clinic - Core Bootstrap Server
 * 
 * This file boots the Node.js Express web application:
 * 1. Loads environmental secrets from the root .env file.
 * 2. Connects to MongoDB Atlas using the config database initialization.
 * 3. Mounts public static folder directory mappings.
 * 4. Mounts modular routes (appointment booking APIs) from backend/routes/.
 * 5. Handles global error fallbacks.
 */

// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const path = require('path');
const connectDB = require('./backend/config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas (returns connection state and handles offline mock mode)
connectDB();

// ----------------------------------------------------
// MIDDLEWARES
// ----------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend assets statically
app.use(express.static(path.join(__dirname, 'frontend')));

// ----------------------------------------------------
// MODULAR ROUTES MOUNTING
// ----------------------------------------------------
app.use(require('./backend/routes/appointmentRoutes'));

// ----------------------------------------------------
// FRONTEND STATIC PAGE ROUTING FALLBACKS
// ----------------------------------------------------

// Clean Route: Homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/html/index.html'));
});

// Clean Route: Appointment Booking Page
app.get('/appointment', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/html/appointment.html'));
});

// Redirect /book to /appointment
app.get('/book', (req, res) => {
    res.redirect('/appointment');
});

// 404 Exception Fallback
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'frontend/html/404.html'));
});

// 500 Server Error Fallback
app.use((err, req, res, next) => {
    console.error(`[Server Error]`, err);
    res.status(500).sendFile(path.join(__dirname, 'frontend/html/500.html'));
});

// ----------------------------------------------------
// SERVER LAUNCH (local dev only)
// ----------------------------------------------------
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`\n======================================================`);
        console.log(`🏥 Panthi Clinic Express Web Server is Live!`);
        console.log(`🔗 Local Address:  http://localhost:${PORT}`);
        console.log(`======================================================\n`);
    });
}

module.exports = app;
