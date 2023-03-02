const router = require("express").Router();
const Room = require("../models/Rooms");


router.post("/room", async (req, res) => {

    // Extract the necessary information from the request body
    const { type, number, price } = req.body;

    // Create a new room object using the Room model
    const newRoom = new Room({
        roomNumber: number,
        roomType: type,
        pricePerHour: price,
    });

    try {
        const savedProduct = await newRoom.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }

})


module.exports = router;