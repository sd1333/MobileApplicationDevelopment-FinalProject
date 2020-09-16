const jwt = require('jsonwebtoken')
const User = require('../model/user')



exports.authenticate = async (req, res, next) => {
    let token

    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1]
    }
    else {
        res.json({ message: "Authentication failed." })
    }

    try {
        const decodedUserObj = jwt.verify(token, 'superdupersecret')
        req.user = decodedUserObj
        next()
    }
    catch{
        res.json({ message: "Authentication failed." })
    }

}