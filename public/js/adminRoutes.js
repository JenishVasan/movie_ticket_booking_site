const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Movies
router.post('/addMovie', adminController.addMovie);
router.get('/movies', adminController.getMovies);
router.delete('/deleteMovie/:id', adminController.deleteMovie);

// Cinemas
router.post('/addCinema', adminController.addCinema);
router.get('/cinemas', adminController.getCinemas);
router.delete('/deleteCinema/:id', adminController.deleteCinema);

// Screens
router.post('/addScreen', adminController.addScreen);
router.get('/screens', adminController.getScreens);
router.delete('/deleteScreen/:id', adminController.deleteScreen);

// Shows
router.post('/addShow', adminController.addShow);
router.get('/shows', adminController.getShows);
router.delete('/deleteShow/:id', adminController.deleteShow);

module.exports = router;