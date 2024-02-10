const mongoose = require('mongoose');

const filesSchema = new mongoose.Schema({
    projectName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    files: [
        {
            fileName: {
                type: String,
                required: true
            },
            fileUrl: {
                type: String,
                required: true
            }
        }
    ]
});

const Files = mongoose.model('files', filesSchema);

module.exports = Files;