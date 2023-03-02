const mongoose = require('mongoose')


const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: Number,
        required: true,
        unique: true
    },
    roomType: {
        type: String,
        required: true
    },
    pricePerHour: {
        type: Number,
        required: true
    },
    Available: {
        type: Boolean,
        default:true
    }
})

module.exports = mongoose.model("Room", roomSchema)