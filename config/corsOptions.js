const allowedOrigins = require("./allowedOrigins")

const corsOptions = {
    origin: (origin,callback) => {
        if (allowedOrigins.indexOf(origin) !== 1 || !origin) {
            callback(null,true) 
        } else {
            const error = new Error("No permitido por CORS")
        }
    },
    credentials: true ,
    optionsSuccessStatus: 200
} 
module.exports = corsOptions