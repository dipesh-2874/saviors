require("dotenv").config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const userSchema = mongoose.Schema({
    type: String,
    username: String,
    name: String,
    age: Number,
    number: Number,
    email: String,
    location: {
        latitude: Number,
        longitude: Number,
        locality: String
    },
    password: String,
    avatar: {
        type: Buffer,
        default: null
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        }
    ],
    rating: {
        tr: Number,
        tu: Number
    },
    availability: {
        type: String,
        default: "Available"
    }
})

module.exports = mongoose.model('user', userSchema);