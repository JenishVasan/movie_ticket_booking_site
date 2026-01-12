const Movie = require('../model/moviewmodel');
const Show = require('../model/showModel');
const Ticket = require('../model/ticketModel');
const home = async (req, res) => {
    try {
        const movies = await Movie.find({});
        res.render('pages/index', { movies });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
}

const booking = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const movie = await Movie.findById(movieId);

        const show = await Show.find({ movieId: movieId }).populate({
            path: "screenId",
            select: "theatreId",
            populate: {
                path: "theatreId",
                select: "name city"
            }
        });

        show.forEach(e => {
            e.startTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            })
        })

        res.render('pages/booking', { movie, show });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
}





const getShows = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const shows = await Show.find({ movieId: movieId })

            .populate({
                path: 'screenId',
                populate: {
                    path: 'theatreId'
                }
            });
        res.status(200).json(shows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server Error" });
    }
}

const storeBooking = async (req, res) => {
    try {
        const { movie_id, show_id, selected_seats, total_price } = req.body;


        const seatIds = selected_seats.split(',');

        if (!seatIds || seatIds.length === 0) {
            return res.status(400).send("No seats selected");
        }


        const showDoc = await Show.findById(show_id);
        if (!showDoc) return res.status(404).send("Show not found");

        const alreadyBooked = showDoc.bookedSeats.some(seat => seatIds.includes(seat));
        if (alreadyBooked) {
            return res.status(400).send("One or more selected seats are already booked. Please try again.");
        }

        const seatObjects = [];
        let calculatedTotal = 0;

        seatIds.forEach(seatNum => {

            let type = 'REGULAR';
            seatObjects.push({
                seatNumber: seatNum,
                price: total_price / seatIds.length
            });
        });

        const newTicket = new Ticket({
            user: req.cookies.userId,
            movie: movie_id,
            show: show_id,
            seats: seatObjects
        });

        await newTicket.save();


        showDoc.bookedSeats.push(...seatIds);
        await showDoc.save();

        res.redirect('/booking-success');

    } catch (err) {
        console.error(err);
        res.status(500).send("Booking Failed");
    }
}

const bookingSuccess = (req, res) => {
    res.render('pages/success');
}

module.exports = { home, booking, getShows, storeBooking, bookingSuccess }
