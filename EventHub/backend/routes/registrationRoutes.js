const { generateQr, scanQr, MyRegisteredEvents } = require('../controllers/registrationController');
const { protect } = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();

router.post('/generateQR', protect, generateQr);
router.post('/scanQr', protect, scanQr);
router.get('/registerdEvents', protect, MyRegisteredEvents);

module.exports = router;