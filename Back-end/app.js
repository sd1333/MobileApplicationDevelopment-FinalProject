const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userRoutes = require('./routes/userRoutes')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res, next) => {
    res.json({ hello: 'hello' })
})

app.use(userRoutes)

mongoose.connect('mongodb://localhost:27017/571FinalDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(7000, () => {
            console.log('571FinalDB server running on 7000')
        })
    })
    .catch((err) => {
        console.log(err)
    })