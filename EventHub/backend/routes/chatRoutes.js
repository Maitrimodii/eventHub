const express =  require('express');
const { getAllChats, createChat } = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', protect, getAllChats);
router.post('/create', protect, createChat);


module.exports = router;