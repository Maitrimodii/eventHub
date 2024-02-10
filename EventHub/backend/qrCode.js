const QrCode = require('qrcode');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');

const router = express.Router();

router.post('/generateQR', protect, asyncHandler(async (req, res, next) => {
    try{
        const sensitiveData = req.body;

        const algorithm = 'aes-256-cbc';
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
        let encryptedData = cipher.update(JSON.stringify(sensitiveData), 'utf-8', 'hex');
        encryptedData += cipher.final('hex');

        const qrCode = await QrCode.toDataURL(encryptedData);

        console.log({qrCode});

        res.status(200).json({qrCode});
    }catch(error){
        next(error);
    }
}))

module.exports = router;