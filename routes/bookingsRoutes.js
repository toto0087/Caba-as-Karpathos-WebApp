const express = require("express"); 
const router = express.Router()
const bookingsControllers = require("../controllers/bookingsControllers")

router.route("/")
    .get(bookingsControllers.getAllBookings)
    .post(bookingsControllers.createNewBookings)
    .patch(bookingsControllers.updateBookings)
    .delete(bookingsControllers.deleteBookings)


module.exports = router

