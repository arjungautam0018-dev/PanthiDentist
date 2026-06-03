/**
 * Panthi Clinic - Appointment API Routes
 *
 * Endpoints for checking slot availability and submitting reservations.
 * Requires a live MongoDB Atlas connection via MONGODB_URI in .env
 */

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Reservation = require('../models/Reservation');

// Service estimated duration values in minutes
const SERVICE_DURATIONS = {
    general: 30,
    cosmetic: 60,
    implant: 120,
    ortho: 90
};

// Display name mappings
const SPECIALISTS = {
    'dr-panthi': 'Dr. Aryan Panthi (Prosthodontist)',
    'dr-chen': 'Dr. Elena Chen (Orthodontist)'
};

const SERVICES = {
    general: 'General Consultation',
    cosmetic: 'Cosmetic Dentistry',
    implant: 'Dental Implants',
    ortho: 'Orthodontics'
};

// ----------------------------------------------------
// TIME UTILITIES
// ----------------------------------------------------

function timeStringToMinutes(timeStr) {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (hours === 12) {
        hours = modifier === 'AM' ? 0 : 12;
    } else if (modifier === 'PM') {
        hours += 12;
    }
    return hours * 60 + minutes;
}

function minutesToTimeString(minutes) {
    let hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const modifier = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${modifier}`;
}

// ----------------------------------------------------
// GET /api/available-slots
// ----------------------------------------------------
router.get('/api/available-slots', async (req, res) => {
    const { date, specialist, service } = req.query;

    if (!date || !specialist || !service) {
        return res.status(400).json({ error: 'Missing date, specialist, or service parameters.' });
    }

    const duration = SERVICE_DURATIONS[service] || 30;

    let dayBookings;
    try {
        dayBookings = await Reservation.find({ date, specialist });
    } catch (err) {
        console.error('[MongoDB Error] Failed to query reservations:', err.message);
        return res.status(500).json({ error: 'Failed to retrieve bookings. Please try again.' });
    }

    const clinicStart = 7 * 60;
    const clinicEnd   = 19 * 60;
    const lunchStart  = 13 * 60;
    const lunchEnd    = 14 * 60;

    const slots = [];

    for (let current = clinicStart; current < clinicEnd; current += 30) {
        const slotEnd = current + duration;
        let available = true;
        let reason = '';

        if (slotEnd > clinicEnd) {
            available = false;
            reason = 'Exceeds clinic hours';
        }

        if (current < lunchEnd && slotEnd > lunchStart) {
            available = false;
            reason = 'Lunch Break (1:00 PM - 2:00 PM)';
        }

        if (available) {
            for (const booking of dayBookings) {
                const bookingStart = timeStringToMinutes(booking.time);
                const bookingEnd   = bookingStart + booking.duration;
                if (current < bookingEnd && slotEnd > bookingStart) {
                    available = false;
                    reason = `Booked (${booking.time})`;
                    break;
                }
            }
        }

        slots.push({ time: minutesToTimeString(current), end: minutesToTimeString(slotEnd), available, reason });
    }

    res.json({ date, specialist, service, duration, slots });
});

// ----------------------------------------------------
// POST /api/book
// ----------------------------------------------------
router.post('/api/book', async (req, res) => {
    const { name, email, phone, date, time, service, specialist, notes } = req.body;

    if (!name || !email || !phone || !date || !time || !service || !specialist) {
        return res.status(400).json({ error: 'Missing required reservation fields.' });
    }

    const duration = SERVICE_DURATIONS[service];
    if (!duration) {
        return res.status(400).json({ error: 'Invalid service selected.' });
    }

    const proposedStart = timeStringToMinutes(time);
    const proposedEnd   = proposedStart + duration;

    // Boundary validation
    if (proposedEnd > 19 * 60) {
        return res.status(400).json({ error: 'Booking exceeds operating hours (Closes at 7:00 PM).' });
    }
    if (proposedStart < 14 * 60 && proposedEnd > 13 * 60) {
        return res.status(400).json({ error: 'Selected time overlaps with clinic lunch break (1:00 PM - 2:00 PM).' });
    }

    // Collision check
    let dayBookings;
    try {
        dayBookings = await Reservation.find({ date, specialist });
    } catch (err) {
        console.error('[MongoDB Error] Failed to query reservations:', err.message);
        return res.status(500).json({ error: 'Database error. Please try again.' });
    }

    for (const booking of dayBookings) {
        const bookingStart = timeStringToMinutes(booking.time);
        const bookingEnd   = bookingStart + booking.duration;
        if (proposedStart < bookingEnd && proposedEnd > bookingStart) {
            return res.status(400).json({ error: 'The selected slot has just been booked. Please pick another slot.' });
        }
    }

    // Save reservation
    const bookingId = `PC-${Math.floor(100000 + Math.random() * 900000)}`;
    try {
        await new Reservation({
            id: bookingId, name, email, phone, date, time,
            duration, service, specialist, notes: notes || ''
        }).save();
    } catch (dbErr) {
        console.error('[MongoDB Save Error]:', dbErr.message);
        return res.status(500).json({ error: 'Database save failure. Please try again.' });
    }

    // ----------------------------------------------------
    // EMAIL CONFIRMATION (Nodemailer)
    // ----------------------------------------------------
    const dentistEmail    = process.env.DENTIST_EMAIL || 'aryanpanthi77@gmail.com';
    const specialistLabel = SPECIALISTS[specialist] || specialist;
    const serviceLabel    = SERVICES[service] || service;

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e8e8e8; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #004D4D; color: white; padding: 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">Panthi Clinic Reservation</h1>
                <p style="margin: 5px 0 0; color: #00E5FF; font-weight: bold;">Booking Code: ${bookingId}</p>
            </div>
            <div style="padding: 30px; color: #2b2f30;">
                <h2 style="color: #003434; border-bottom: 2px solid #004D4D; padding-bottom: 8px;">Reservation Details</h2>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <tr><td style="padding: 8px 0; font-weight: bold; width: 35%;">Specialist:</td><td style="color: #475569;">${specialistLabel}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: bold;">Service:</td><td style="color: #475569;">${serviceLabel}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: bold;">Est. Duration:</td><td style="color: #475569;">${duration} minutes</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: bold;">Date:</td><td style="color: #475569;">${date}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: bold;">Time Slot:</td><td style="color: #475569;">${time} to ${minutesToTimeString(proposedEnd)}</td></tr>
                </table>
                <h2 style="color: #003434; margin-top: 30px; border-bottom: 2px solid #004D4D; padding-bottom: 8px;">Patient Information</h2>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <tr><td style="padding: 8px 0; font-weight: bold; width: 35%;">Name:</td><td style="color: #475569;">${name}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td style="color: #475569;">${phone}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td style="color: #475569;">${email}</td></tr>
                    ${notes ? `<tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Notes:</td><td style="color: #475569; background: #f9f9f9; padding: 10px; border-radius: 6px;">${notes}</td></tr>` : ''}
                </table>
            </div>
            <div style="background: #dadada; color: #475569; padding: 15px; text-align: center; font-size: 12px;">
                © 2024 Panthi Clinic • Operating hours: 7 AM to 7 PM
            </div>
        </div>
    `;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });
        try {
            await transporter.sendMail({
                from: '"Panthi Clinic Scheduler" <scheduler@panthiclinic.com>',
                to: dentistEmail,
                subject: `[New Appointment] ${name} - ${serviceLabel} | ${date}`,
                html: htmlContent
            });
            await transporter.sendMail({
                from: '"Panthi Clinic Concierge" <concierge@panthiclinic.com>',
                to: email,
                subject: `Appointment Confirmed - Code ${bookingId} | Panthi Clinic`,
                html: htmlContent
            });
            console.log(`[Email] Dispatched to ${dentistEmail} and ${email}.`);
        } catch (mailErr) {
            console.error('[Mail Error]:', mailErr.message);
        }
    } else {
        console.log(`[Email] SMTP not configured — skipping email dispatch for booking ${bookingId}.`);
    }

    res.json({
        success: true,
        bookingId,
        message: 'Your reservation has been confirmed. Email notifications have been dispatched.'
    });
});

module.exports = router;
