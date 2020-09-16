const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectID
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    volunteerStatus: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model('User', userSchema)