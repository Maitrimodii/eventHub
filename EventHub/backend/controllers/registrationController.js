const QrCode = require('qrcode');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const Attendee = require('../models/RegistrationModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const Event = require('../models/EventModel');
const { default: mongoose } = require('mongoose');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "modimaitri12@gmail.com",
        pass: "cbsmsiiywgtaxmzu",
    }
});

const generateQr = asyncHandler(async (req, res, next) => {
    try {
        const { body: sensitiveData } = req;
        console.log({ sensitiveData });

        const { user, eventId } = sensitiveData;
        const { name, email, numberOfDays } = user;

        // Convert numberOfDays to a number
        const days = parseInt(numberOfDays, 10);

        console.log("email", email);

        const pdfStream = fs.createWriteStream('attendance_report.pdf');
        const pdfDoc = new PDFDocument();

        pdfDoc.pipe(pdfStream);
        for (let day = 1; day <= days; day++) {
            const algorithm = 'aes-256-cbc';
            const key = crypto.randomBytes(32);
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
            
            // Include eventId in the encrypted data
            let encryptedData = cipher.update(JSON.stringify({ user, eventId, day }), 'utf-8', 'hex');
            encryptedData += cipher.final('hex');

            const token = jwt.sign({ key: key.toString('hex'), iv: iv.toString('hex'), day }, process.env.JWT_TOKEN, { expiresIn: '30d' });

            console.log('key', key);
            console.log('iv', iv);

            const qrData = {
                encryptedData,
                token,
            };

            const qrCode = await QrCode.toDataURL(JSON.stringify(qrData));

            console.log({ qrData });

            pdfDoc.addPage().fontSize(14).text(`Day ${day} Attendance QR Code:`, { continued: true, underline: true });
            pdfDoc.image(qrCode, { fit: [250, 250], align: 'center' });
        }

        pdfDoc.end();
        pdfStream.on('finish', async () => {
            console.log('PDF created successfully');

            const mailOptions = {
                from: "modimaitri12@gmail.com",
                to: email,  // Access email from user
                subject: `Attendance Report for ${days} Days`,
                text: `Please find the attendance report attached.`,
                attachments: [
                    {
                        filename: 'attendance_report.pdf',
                        content: fs.createReadStream('attendance_report.pdf'),
                    },
                ],
            };

            console.log("transporter", transporter);

            await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    res.status(500).send('Internal Server Error');
                } else {
                    console.log('Email sent:', info.response);
                    res.status(200).json({ message: `QR Codes and attendance report sent successfully.` });
                }
            });
        });
    } catch (error) {
        next(error);
    }
});


const scanQr = asyncHandler(async (req, res, next) => {
    try {
        const { encryptedData } = req.body;
        const parsedData = JSON.parse(encryptedData);
        const { token, encryptedData: data } = parsedData;

        console.log(token);

        const { key, iv } = jwt.verify(token, process.env.JWT_TOKEN);
        const algorithm = 'aes-256-cbc';
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
        let decryptedData = decipher.update(data, 'hex', 'utf-8');
        decryptedData += decipher.final('utf-8');

        console.log(decryptedData);

        const { user, eventId, day } = JSON.parse(decryptedData);
        const { name, email } = user;

        const attendee = await Attendee.findOne({ name, email, eventId });

        console.log({attendee});
        if (!attendee) {
            return res.status(404).json({ message: 'Attendee not found' });
        }

        if (attendee.attendance && attendee.attendance[day-1]) {
            return res.status(400).json({ message: `Attendance already marked for Day ${day}` });
        }

        attendee.attendance[day-1] = true; 
        await attendee.save();

        res.status(200).json({ message: `Attendance marked successfully for Day ${day}` });
    } catch (error) {
        next(error);
    }
});

const MyRegisteredEvents = asyncHandler( async(req, res, next) => {
    try {
        const userId = req.user.id;
        console.log(userId);
        
        // Find all Attendees for a specific user
        const attendeeIds = await Attendee.find({ userId }).distinct('eventId');

        // Find all Events where the attendee is registered
        const myEvents = await Event.find({ _id: { $in: attendeeIds } });

        res.status(200).json({ myEvents });
    } catch (error) {
        next(error);
    }
})
module.exports = { generateQr, scanQr, MyRegisteredEvents };
