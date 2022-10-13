const Booking = require("../models/Booking")
const asyncHandler = require("express-async-handler")
const User = require("../models/User")



const getAllBookings = asyncHandler(async (req,res) => { 
    const bookings = await Booking.find().select().lean()
    if(!bookings?.length) {
        return res.status(400).json({message: "Reservas no encontradas"})
    }

    const bookingsWithUser = await Promise.all(bookings.map(async (booking) => {
        const user = await User.findById(booking.user).lean().exec()
        return { ...booking, username: user.username }
    }))

    res.json(bookingsWithUser)
})

const createNewBookings = asyncHandler(async (req,res) => {  
    const {user ,name, comments , email, phone, amount, deposit, date, completed, cabin} = req.body

    if(!user, !name || !comments || !email || !phone || !amount || !deposit || !date || !completed || !cabin) {
        return res.status(400).json({message: "Todos los campos son necesarios"})
    }
    
    const bookingObj = {user,name,comments,email,phone,amount,deposit,date,completed,cabin}
    
    //Creamos reserva
    const booking = await Booking.create(bookingObj)
    

    if(booking) {
        res.status(201).json({message: `Reserva a nombre de ${name} creada correctamente`})
    } else {
        res.status(400).json({message: "Hubo un error en la informacion recibida"})
    }
})

const updateBookings = asyncHandler(async (req,res) => {  
    const {id, name, comments , email, phone, amount, deposit, date, completed, cabin} = req.body

    if(!id || !name || !comments || !email || !phone || !amount || !deposit || !date || !completed || !cabin) {
        return res.status(400).json({message: "Todos los campos son necesarios"})
    }

    const booking = await Booking.findById(id).exec()

    if (!booking) {
        return res.status(400).json({message: "Reserva no encontrada"})
    }   


    booking.name = name
    booking.comments = comments
    booking.email = email
    booking.phone = phone
    booking.amount = amount
    booking.deposit = deposit
    booking.date = date
    booking.completed = completed
    booking.cabin = cabin


    const updatedBooking = await booking.save()

    res.json({ message: `${updatedBooking.name} actualizado` })
})

const deleteBookings = asyncHandler(async (req,res) => {  
    const {id} = req.body

    if(!id) {
        return res.status(400).json({message: "Se requiere la ID del usuario"})
    }

    const idNum = id.trim()

    const booking = await Booking.findById(idNum).exec()

    if(!booking) {
        return res.status(400).json({message: "Reserva no encontrada"})
    }

    const result = await booking.deleteOne()

    const reply = `reserva a nombre de ${result.name} con ID ${result._id} eliminada`

    res.json(reply)
})

module.exports = {
    getAllBookings,
    createNewBookings,
    updateBookings,
    deleteBookings
}