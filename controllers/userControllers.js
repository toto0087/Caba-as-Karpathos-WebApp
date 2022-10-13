const User = require("../models/User")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const Booking = require("../models/Booking")
const { findById } = require("../models/Booking")

//descripcion: Obtiene a todos los usuarios
//ruta: GET /users
//acceso: privado
const getAllUsers = asyncHandler(async (req,res) => {
    const users = await User.find().select("-password").lean()
    if(!users?.length) {
        return res.status(400).json({message: "Users no encontrados"})
    }
    res.json(users)
})

//descripcion: crear nuevos usuarios
//ruta: POST /users
//acceso: privado
const createNewUser = asyncHandler(async (req,res) => {
    const {username,password,roles} = req.body

    if(!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({message: "Todos los campos son necesarios"})
    }

    const duplicado = await User.findOne({username}).lean().exec()

    if(duplicado) {
        return res.status(409).json({message: "Usuario ya creado"})
    }

    //hasheamos pass
    const passHashed = await bcrypt.hash(password,10)
    
    const userObj = {username,"password":passHashed,roles}

    //Creamos user
    const user = await User.create(userObj)

    if(user) {
        res.status(201).json({message: `Usuario ${username} creado correctamente`})
    } else {
        res.status(400).json({message: "Hubo un error en la informacion recibida"})
    }
})


//descripcion: actualizar a los usuarios
//ruta: PATCH /users
//acceso: privado
const updateUser = asyncHandler(async (req,res) => {
    const {username,id,roles,active,password} = req.body

    if(!username || !Array.isArray(roles) || !roles.length || !id || typeof active !== "boolean") {
        return res.status(400).json({message: "Todos los campos son necesarios"})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({message: "Usuario no encontrado"})
    }   

    const duplicate = await User.findOne({username}).lean().exec()

    if(duplicate && duplicate?._id.toString() !== id) {
        return res.status(400).json({message: "El usuario ya fue creado"})
    }

    user.username = username
    user.roles = roles
    user.active = active

    if(password) {
        user.password = bcrypt.hash(password,10)
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} actualizado` })
})

//descripcion: elimina usuarios
//ruta: DELETE /users
//acceso: privado
const deleteUser = asyncHandler(async (req,res) => {
    const {id} = req.body

    if(!id) {
        return res.status(400).json({message: "Se requiere la ID del usuario"})
    }

    const booking = await Booking.findOne({user: id}).lean().exec()

    if(booking) {
        return res.status(400).json({message: "El usuario tiene reservas"})
    }

    const user = await User.findById(id).exec()

    if(!user) {
        return res.status(400).json({message: "User no encontrado"})
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} con ID ${result._id} eliminado`

    res.json(reply)


    
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}