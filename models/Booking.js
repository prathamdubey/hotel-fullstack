const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    roomNumber: {
        type: Number,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    }

});

module.exports = mongoose.model('Booking', bookingSchema);