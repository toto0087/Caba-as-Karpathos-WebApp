require("dotenv").config()
const express = require("express");
const app = express()
const path = require("path")
const { logger,logEvents } = require("./middleware/logger")
const errorHandler = require("./middleware/errorHandler")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const connectDB = require("./config/dbConnection")
const mongoose = require("mongoose")
const corsOptions = require("./config/corsOptions")
const PORT = process.env.PORT || 3500

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use("/", express.static(path.join(__dirname, "public")))


app.use("/", require("./routes/root"))
app.use("/users", require("./routes/userRoutes"))
app.use("/bookings", require("./routes/bookingsRoutes"))

app.all("*", (req,res) => {
    res.status(404)
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname,"views","404.html"))
    } else if (req.accepts("json")) {
        res.json({message: "404 Not Found" })
    } else {
        res.type("txt").send("404 Not Found")
    }
})

app.use(errorHandler)

mongoose.connection.once("open", () => {
    console.log("Conectado a MongoDB")
    app.listen(PORT, () => {console.log(`La app esta corriendo en el puerto ${PORT}`)})
})

mongoose.connection.on("error",error => { 
    console.log(error)
    logEvents(`${error.no}: ${error.code}\t${error.syscall}\t${error.hostname}`,
    "mongoErrorLog.log")
})
