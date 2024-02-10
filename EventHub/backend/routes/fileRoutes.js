const express = require('express');
const upload = require('../middlewares/multerMiddleware');
const { protect } = require('../middlewares/authMiddleware');
const { deleteFile, getAllFiles, uploadFile, downloadFile } = require('../controllers/fileController');
const router  = express.Router();

router.delete("/deleteFile/:projectName/:filename", protect, deleteFile );
router.get("/listFiles/:projectName", protect, getAllFiles);
router.post("/uploadFile", upload.array("files"), protect, uploadFile);
router.get('/getfile/:projectName/:filename', protect, downloadFile);

module.exports = router;