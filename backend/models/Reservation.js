/**
 * Panthi Clinic - Reservation Database Model
 * 
 * Defines the Mongoose schema and compile the database model for
 * storing patient reservations in MongoDB Atlas collections.
 */

const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Please provide the patient name.'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide the patient email address.'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'Please provide the patient contact number.'],
        trim: true
    },
    date: {
        type: String, // Stored as standard "YYYY-MM-DD" for simple query comparisons
        required: true
    },
    time: {
        type: String, // Stored as standard "HH:MM AM/PM" (e.g., "09:30 AM")
        required: true
    },
    duration: {
        type: Number, // Stored in minutes
        required: true
    },
    service: {
        type: String, // (general, cosmetic, implant, ortho)
        required: true
    },
    specialist: {
        type: String, // (dr-panthi, dr-chen)
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create compound index for fast calendar day specialist lookups
ReservationSchema.index({ date: 1, specialist: 1 });

module.exports = mongoose.model('Reservation', ReservationSchema);
