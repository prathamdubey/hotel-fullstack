const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const mongoose = require('mongoose')

const roomRoute = require('./routes/Rooms')
const BookingRoute = require('./routes/Booking')
const cors = require('cors');
mongoose
    .connect("mongodb+srv://yashbaghel09680:yashB20130125239@cluster0.qfb4slj.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("DB connection successfull"))
    .catch(er => console.log(er))


var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json());
app.use(cors());


app.get("/", (req, res) => {
    res.send("helo")
})

app.use("/api/",urlencodedParser, roomRoute)
app.use("/api/",urlencodedParser, BookingRoute)

app.listen(5000, () => console.log('app running '))