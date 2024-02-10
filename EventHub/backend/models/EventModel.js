const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    days: [{
        date:{
            type: Date,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        lunchIncluded: {
            type: Boolean,
            default: false,
        },
        dinnerIncluded: {
            type: Boolean,
            default: false,
        },
        refreshmentIncluded:{
            type: Boolean,
            default: false,
        }
    }],
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['Draft', 'Published', 'Ongoing', 'Completed'],
        default: 'Draft',
    },
    fees: {
        type: Number,
        default: 0
    },
    applyBy: {
        type: Date,
        required: true,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attendee',
    }]
}, {timestamps: true})

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;