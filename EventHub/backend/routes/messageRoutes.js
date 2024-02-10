const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { sendMessage, getAllMessage } = require('../controllers/messageController');
const router = express.Router();

router.get('/:chatId', protect, getAllMessage);
router.post('/', protect, sendMessage);

module.exports = router;