
const { login, register, userRegister, userLogin , logOut} = require('../controller/authController')
const { home, booking, getShows, storeBooking, bookingSuccess, checkoutPage, applyCoupon, profilePage, cancelTicket } = require('../controller/userController')
const {
    adminPage, addMovie, addCinema, addScreen, addShow,
    deleteMovie, deleteCinema, deleteScreen, deleteShow,
    getMovie, updateMovie,
    getCinema, updateCinema,
    getScreen, updateScreen,
    getShow, updateShow,
    addCoupon, deleteCoupon, getCoupon, updateCoupon
} = require('../controller/adminController')


const authMiddleware = require('../middleware/authMiddleware')
const checkLogin = require('../middleware/loginCheck')
const express = require('express')
const router = express.Router()

router.get('/', authMiddleware, home)
router.get('/login', checkLogin, login)
router.post('/userLogin', userLogin)
// register
router.get('/register', checkLogin, register)
router.post('/userRegister', userRegister)
// logout 
router.get("/logout" , authMiddleware , logOut)
router.get('/booking/:movieId', authMiddleware, booking)
router.post('/checkout', authMiddleware, checkoutPage)
router.post('/api/apply-coupon', authMiddleware, applyCoupon)
router.post('/api/booking', authMiddleware, storeBooking)
router.get('/booking-success', authMiddleware, bookingSuccess)

router.get('/profile', authMiddleware, profilePage)
router.post('/cancel-ticket/:id', authMiddleware, cancelTicket)

router.get('/getShows/:movieId', getShows)

 
router.get('/admin', adminPage)
router.post('/addMovie', addMovie)
router.post('/addCinema', addCinema)
router.post('/addScreen', addScreen)
router.post('/addShow', addShow)
 
router.delete('/deleteMovie/:id', deleteMovie)
router.delete('/deleteCinema/:id', deleteCinema)
router.delete('/deleteScreen/:id', deleteScreen)
router.delete('/deleteShow/:id', deleteShow)

 
router.get('/getMovie/:id', getMovie)
router.post('/updateMovie/:id', updateMovie)

router.get('/getCinema/:id', getCinema)
router.post('/updateCinema/:id', updateCinema)

router.get('/getScreen/:id', getScreen)
router.post('/updateScreen/:id', updateScreen)

router.get('/getShow/:id', getShow)
router.post('/updateShow/:id', updateShow)

router.post('/addCoupon', addCoupon)
router.delete('/deleteCoupon/:id', deleteCoupon)
router.get('/getCoupon/:id', getCoupon)
router.post('/updateCoupon/:id', updateCoupon)

module.exports = router