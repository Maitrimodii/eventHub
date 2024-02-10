const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { createEvent, getEvents, getMyEvents, getParticipants, updateEvent, getEventDetails, deleteEvent } = require('../controllers/eventController');

const router = express.Router();

router.post('/create-event', protect, createEvent);
router.get('/all-events', protect, getEvents);
router.get('/myEvent', protect, getMyEvents );
router.get('/participants/:eventId', protect, getParticipants);
router.put('/update-event/:eventId', protect, updateEvent);
router.get('/get-event/:eventId', protect, getEventDetails);
router.delete('/delete-event/:eventId', protect, deleteEvent);

module.exports = router;
