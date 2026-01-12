
const { login, register, userRegister, userLogin } = require('../controller/authController')
const { home, booking, getShows, storeBooking, bookingSuccess } = require('../controller/userController')
const {
    adminPage, addMovie, addCinema, addScreen, addShow,
    deleteMovie, deleteCinema, deleteScreen, deleteShow,
    getMovie, updateMovie,
    getCinema, updateCinema,
    getScreen, updateScreen,
    getShow, updateShow
} = require('../controller/adminController')
const authMiddleware = require('../middleware/authMiddleware')
const checkLogin = require('../middleware/loginCheck')
const express = require('express')
const router = express.Router()

router.get('/', authMiddleware, home)
router.get('/login', checkLogin, login)
router.post('/userLogin', userLogin)
router.get('/register', checkLogin, register)
router.post('/userRegister', userRegister)

router.get('/booking/:movieId', authMiddleware, booking)
router.post('/api/booking', authMiddleware, storeBooking)
router.get('/booking-success', authMiddleware, bookingSuccess)

router.get('/getShows/:movieId', getShows)

// Admin Routes
router.get('/admin', adminPage)
router.post('/addMovie', addMovie)
router.post('/addCinema', addCinema)
router.post('/addScreen', addScreen)
router.post('/addShow', addShow)

// Delete Routes
router.delete('/deleteMovie/:id', deleteMovie)
router.delete('/deleteCinema/:id', deleteCinema)
router.delete('/deleteScreen/:id', deleteScreen)
router.delete('/deleteShow/:id', deleteShow)

// Update Routes (Get Single & Post Update)
router.get('/getMovie/:id', getMovie)
router.post('/updateMovie/:id', updateMovie)

router.get('/getCinema/:id', getCinema)
router.post('/updateCinema/:id', updateCinema)

router.get('/getScreen/:id', getScreen)
router.post('/updateScreen/:id', updateScreen)

router.get('/getShow/:id', getShow)
router.post('/updateShow/:id', updateShow)

module.exports = router