const Movie = require('../models/Movie');
const Cinema = require('../models/Cinema');
const Screen = require('../models/Screen');
const Show = require('../models/Show');

// --- MOVIES ---
exports.addMovie = async (req, res) => {
    try {
        const { title, genre, movieLanguage, rating, durationHour, durationMinute } = req.body;
        await Movie.create({ 
            title, genre, language: movieLanguage, rating, durationHour, durationMinute 
        });
        res.redirect('/admin'); // Reload admin page
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding movie");
    }
};

exports.getMovies = async (req, res) => {
    const movies = await Movie.find();
    res.json(movies);
};

exports.deleteMovie = async (req, res) => {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ success: true });
};

// --- CINEMAS ---
exports.addCinema = async (req, res) => {
    try {
        await Cinema.create(req.body);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding cinema");
    }
};

exports.getCinemas = async (req, res) => {
    const cinemas = await Cinema.find();
    res.json(cinemas);
};

exports.deleteCinema = async (req, res) => {
    await Cinema.findByIdAndDelete(req.params.id);
    res.json({ success: true });
};

// --- SCREENS ---
exports.addScreen = async (req, res) => {
    try {
        const { name, rows, columns, cinemaId } = req.body;
        
        // Generate Seat Layout (Simple Matrix of 1s)
        const seats = [];
        for(let r=0; r<rows; r++) {
            const row = [];
            for(let c=0; c<columns; c++) {
                row.push(1); // 1 = Available Seat
            }
            seats.push(row);
        }

        await Screen.create({
            name,
            rows,
            columns,
            cinema: cinemaId,
            seats
        });
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding screen");
    }
};

exports.getScreens = async (req, res) => {
    const screens = await Screen.find().populate('cinema');
    res.json(screens);
};

exports.deleteScreen = async (req, res) => {
    await Screen.findByIdAndDelete(req.params.id);
    res.json({ success: true });
};

// --- SHOWS ---
exports.addShow = async (req, res) => {
    try {
        await Show.create(req.body);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding show");
    }
};

exports.getShows = async (req, res) => {
    const shows = await Show.find()
        .populate('movie')
        .populate('screen')
        .sort({ startTime: 1 });
    res.json(shows);
};

exports.deleteShow = async (req, res) => {
    await Show.findByIdAndDelete(req.params.id);
    res.json({ success: true });
};