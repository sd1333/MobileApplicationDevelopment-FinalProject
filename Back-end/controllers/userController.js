
const User = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const ObjectId = require('mongodb').ObjectID

exports.userLogin = async (req, res, next) => {
    const { email, password } = req.body

    console.log(`Login credentials at userLogin: email: ${email} password: ${password}`)

    let user

    await User.findOne({ email: email }, (err, obj) => {
        console.log('user Object: ', obj)
        user = obj
    })

    if (!user) {
        res.json({ message: "User not found" })
    }

    console.log(`E-mail: ${email}, Password: ${password}`)

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        console.log('isMatch status: ', isMatch)
        console.log('incorrect password')
        res.json({ message: "Authentication failed" })
    }
    else {
        const token = jwt.sign(JSON.stringify(user), 'superdupersecret')
        res.json({ message: "Login successfull", token: token })
    }
}

exports.signUp = async (req, res, next) => {

    const { firstName, lastName, email, phoneNumber, password } = req.body
    const user = await User.findOne({ email: email })

    if (user) {
        res.json({ message: "Auth Failed" })
    }
    else {
        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            password: password,
            volunteerStatus: false
        })

        const salt = await bcrypt.genSalt(5)
        newUser.password = await bcrypt.hash(newUser.password, salt)
        await newUser.save()

        res.json({ message: "User saved!" })
    }
}

exports.dutyChange = async (req, res, next) => {

    User.findById(req.user._id, (err, doc) => {
        doc.volunteerStatus = !doc.volunteerStatus;
        doc.save()
        res.json({ status: 'success' })
    })
}

exports.getaAllUsers = async (req, res, next) => {
    console.log('getAllUsers req.user: ', req.user)
    await User.find({
        volunteerStatus: true, location: {
            $near: [req.user.location[0], req.user.location[1]], $maxDistance: 1 / 69
        }
    }
        , function (err, docs) {
            console.log(docs)
            res.json({ data: docs })
        }).limit(5)
}

exports.getUser = async (req, res, next) => {

    await User.findById(req.user._id, function (err, doc) {
        res.json({ data: doc })
    })
}

exports.getVolunteer = async (req, res, next) => {

    console.log('getUser req.body: ', req.body)
    console.log('getUser req.user: ', req.user)

    await User.findById(req.body.volId, function (err, doc) {
        res.json({ data: doc })
    })
}

exports.saveLocation = async (req, res, next) => {

    console.log('saveLocation req.body.userLocation: ', req.body.userLocation)
    console.log('req.user: ', req.user)
    await User.updateOne({ _id: ObjectId(req.user._id) }, [{ $set: { location: req.body.userLocation } }])

}

