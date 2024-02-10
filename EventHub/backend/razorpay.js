const express = require('express');
const Razorpay = require('razorpay');
const Attendee = require('./models/RegistrationModel');
const Event = require('./models/EventModel'); 
const { protect } = require('./middlewares/authMiddleware');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const router = express.Router();

router.post('/payment', protect,  async (req, res) => {
    const { user, eventId, paymentDetails } = req.body;
    const  userId  = req.user._id;
    console.log(userId);

    console.log('Received payment request:', user, paymentDetails);

    try {
        // Verify the Razorpay payment
        const verifyPayment = await razorpay.payments.fetch(paymentDetails.razorpay_payment_id);

        const days = user.numberOfDays;
    
        console.log('Razorpay payment verification:', verifyPayment);

        if (verifyPayment.status === 'authorized') {
            // Capture the authorized payment
            const capturePayment = await razorpay.payments.capture(paymentDetails.razorpay_payment_id, verifyPayment.amount);

            console.log('Razorpay payment capture:', capturePayment);

            if (capturePayment.status === 'captured') {
                // Save user data to MongoDB
                const newUser = new Attendee({
                    name: user.name,
                    email: user.email,
                    contactNo: user.contactNo,
                    paymentId: paymentDetails.razorpay_payment_id,
                    eventId: eventId,
                    userId: userId,
                    attendance: new Array(days).fill(false),
                });

                const savedUser = await newUser.save();

                await Event.findByIdAndUpdate(eventId, { $push: { participants: savedUser._id } });

                res.status(200).json({ success: true, message: 'Payment successful and user data saved.' });
            } else {
                res.status(400).json({ success: false, message: 'Payment capture failed.' });
            }
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed or payment not authorized.' });
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

module.exports = router;