
const express = require('express')
const router = express.Router()
const middleware = require('../middleware/authenticationMiddleware')

const userController = require('../controllers/userController')

router.post('/login', userController.userLogin)

router.post('/signup', userController.signUp)

router.patch('/dutychange', middleware.authenticate, userController.dutyChange)

router.get('/getuser', middleware.authenticate, userController.getUser)

router.get('/getallusers', middleware.authenticate, userController.getaAllUsers)

router.post('/getVolunteer', middleware.authenticate, userController.getVolunteer)

router.post('/savelocation', middleware.authenticate, userController.saveLocation)


module.exports = router