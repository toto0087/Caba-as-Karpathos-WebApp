const mongoose = require("mongoose")
const AutoIncrement = require("mongoose-sequence")(mongoose)


const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId ,
        required: true,
        ref: "User",
    },
    name: {
        type: String ,
        required: true,
        trim: true,
    },
    comments: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type:String,
        default: null,
        trim: true,
    },
    amount: {
        type:String,
        default: null,
        trim: true,
    },
    deposit: {
        type:String,
        default: null,
        trim: true,
    },
    date: {
        type:Date,
        required: true,
        default: Date.now(),
    },
    cabin: {
        type:String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
},
{
    timestamps: true
}
)

bookingSchema.plugin(AutoIncrement,{
    inc_field:"ticket",
    id:"ticketNums",
    start_seq: 1
})

module.exports = mongoose.model("Bookings",bookingSchema)