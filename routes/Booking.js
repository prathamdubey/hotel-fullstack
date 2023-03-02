const router = require("express").Router();
const Booking = require("../models/Booking");
const Room = require("../models/Rooms");


router.post("/booking", async (req, res) => {

    // Extract the necessary information from the request body
    const { roomNumber, user, Email, startTime, endTime } = req.body;

    const roomData = await Room.findOne({
        roomNumber: roomNumber
    })
    // .then((roomData) => {
    // console.log(roomData)
    if (roomData != null) {

        if (roomData.Available) {
            const roomPrice = roomData.pricePerHour;
            let end = new Date(endTime)
            let start = new Date(startTime)
            let timeDiffInMs = end.getTime() - start.getTime();
            let duration = Math.round(timeDiffInMs / 3600000);
            const bookingPrice = duration * roomPrice;

            const prevbooking = await Booking.find({ roomNumber: roomNumber }).sort({ _id: -1 }).limit(1);
            let prevends = new Date(prevbooking[0]?.endTime)
            timeDiffInMs = start.getTime() - prevends.getTime()
            duration = Math.round(timeDiffInMs / 3600000);
            if (duration < 0) {
                res.json({ result: false, msg: "Room is not available for the given timing" })
            }
            else {
                const newBooking = new Booking({
                    roomNumber: roomNumber,
                    user: user,
                    Email: Email,
                    startTime: startTime,
                    endTime: endTime,
                    totalPrice: bookingPrice

                })
                try {
                    const NewBooking = newBooking.save()
                        .then(() => res.json({ result: true, msg: "Booking successful" }))
                        .catch((er) => res.send(er))

                    // res.status(201).json(savedProduct);
                } catch (err) {
                    res.status(500).json({ result: false, msg: er });
                }
            }

        }
        else {
            res.json({ result: false, msg: "room not available" })
        }
    }
    else {
        res.json({ result: false, msg: "Room not found" })
    }
})


router.put("/edit-booking/:id", async (req, res) => {

    // Extract the necessary information from the request body
    const { roomNumber, user, Email, startTime, endTime } = req.body;

    const roomData = await Room.findOne({
        roomNumber: roomNumber
    })
    const roomPrice = roomData.pricePerHour;
    let end = new Date(endTime)
    let start = new Date(startTime)
    let timeDiffInMs = end.getTime() - start.getTime();
    let duration = Math.round(timeDiffInMs / 3600000);
    const totalPrice = duration * roomPrice;
    newVaules = { ...req.body, totalPrice }
    try {
        const editbooking = Booking.findByIdAndUpdate(
            req.params.id,
            {
                $set: newVaules,
            },
            { new: true }
        ).then((data) => res.status(200).json("edited sucessfully"))
            .catch((err => console.log(err)))
    } catch (err) {
        res.status(500).json(err);
    }

})

router.get("/Allbooking/:type", async (req, res) => {

    const rooms = await Room.find({ roomType: req.params.type })
    if (rooms.length) {
        let data = [];
        const promise = rooms.map(async (room) => {
            const temp = await Booking.find({ roomNumber: room.roomNumber })
            temp.map((v) => {
                data.push(v)
            })
        })
        const promiseComplete = await Promise.all(promise)
        // console.log("data")
        res.send(data)

    }
    else {
        res.send("room not found")
    }

})

router.get("/booking/:id", async (req, res) => {
    try {

        const data = await Booking.findById(req.params.id)
        if (data) {
            res.send(data)
        }
        else {
            res.status(404).send("not found")
        }
    }
    catch (er) {
        console.log(er)
    }



    // if (rooms.length) {
    //     let data = [];
    //     const promise =  rooms.map(async (room) => {
    //         const temp = await Booking.find({ roomNumber: room.roomNumber })
    //         temp.map((v) => {
    //             data.push(v)
    //         })
    //     })
    //     const promiseComplete = await  Promise.all(promise)
    //     // console.log("data")
    //     res.send(data)

    // }
    // else {
    //     res.send("room not found")
    // }

})


router.delete("/delete-booking/:id", async (req, res) => {

    const BookingData = await Booking.findById(req.params.id)
    let start = new Date(BookingData.startTime)

    diffHours = (new Date(BookingData.startTime) - new Date()) / 36e5
    if (diffHours > 48) {
        let refundAmount = BookingData.totalPrice
        const deletedItem = await Booking.findByIdAndDelete(req.params.id)
            .then(() => {
                res.json({ msg: "deleted successfully", Amount: refundAmount })
            })
            .catch((er) => res.send(er))
    } else if (diffHours < 48 && diffHours > 24) {
        let refundAmount = BookingData.totalPrice / 2
        const deletedItem = await Booking.findByIdAndDelete(req.params.id)
            .then(() => {
                res.json({ msg: "deleted successfully", Amount: refundAmount })
            })
            .catch((er) => res.send(er))
    }
    else {
        const deletedItem = await Booking.findByIdAndDelete(req.params.id)
            .then(() => {
                res.json({ msg: "deleted successfully", Amount: 0 })
            })
            .catch((er) => res.send(er))
    }



})

module.exports = router;