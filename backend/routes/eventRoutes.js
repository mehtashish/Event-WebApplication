const express = require('express');
const Event = require('../models/eventModel');
const User = require('../models/userModel');
const auth = require('../middleware/auth');
const router = express.Router();


router.get('/events', async (req, res) => {
    const events = await Event.find({ date: { $gt: new Date() } });
    res.json(events);
});


router.post('/events', auth, async (req, res) => {
    try {
        const event = await Event.create({ ...req.body, createdBy: req.user });
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


router.post('/events/:eventId/register', auth, async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user;
    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        if (event.attendees.includes(userId)) {
            return res.status(400).json({ error: 'Already registered' });
        }

        event.attendees.push(userId);
        await event.save();
        res.json({ message: 'Registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/users/:userId/events', async (req, res) => {
    const userId = req.params.userId;
    const events = await Event.find({ attendees: userId });
    res.json(events);
});


router.delete('/events/:eventId/cancel/:userId', async (req, res) => {
    const { eventId, userId } = req.params;
    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        event.attendees = event.attendees.filter(id => id.toString() !== userId);
        await event.save();
        res.json({ message: 'registration cancelled' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;