const Movie = require('../model/moviewmodel');
const Show = require('../model/showModel');
const Ticket = require('../model/ticketModel');
const Coupon = require('../model/couponModel');
const ticketMail = require("../utils/ticketMailSender")
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
        res.status(500).json({ error: err.message });
    }
}

const checkoutPage = async (req, res) => {
    try {
        const { movie_id, show_id, selected_seats, total_price } = req.body;
        
        if (!movie_id || !show_id || !selected_seats || !total_price) {
            return res.status(400).send("Invalid checkout request");
        }

        const movie = await Movie.findById(movie_id);
        const show = await Show.findById(show_id).populate({
            path: "screenId",
            populate: {
                path: "theatreId"
            }
        });

        res.render('pages/checkout', {
            movie,
            show,
            selected_seats,
            total_price
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
};

const applyCoupon = async (req, res) => {
    try {
        const { coupon_code, total_price, movie_id } = req.body;

        if (!coupon_code) return res.status(400).json({ error: "Coupon code is required" });

        const coupon = await Coupon.findOne({ code: coupon_code.toUpperCase(), isActive: true });
        
        if (!coupon) return res.status(400).json({ error: "Invalid or inactive coupon" });

        const now = new Date();
        if (now < coupon.validFrom || now > coupon.validTo) {
            return res.status(400).json({ error: "Coupon is expired or not yet valid" });
        }

        if (coupon.maxUsageLimit !== null && coupon.usageCount >= coupon.maxUsageLimit) {
            return res.status(400).json({ error: "Coupon usage limit reached" });
        }

        if (total_price < coupon.minOrderValue) {
            return res.status(400).json({ error: `Minimum order value of $${coupon.minOrderValue} required` });
        }

        if (coupon.applicableMovies && coupon.applicableMovies.length > 0) {
            const isValidMovie = coupon.applicableMovies.some(id => id.toString() === movie_id);
            if (!isValidMovie) {
                return res.status(400).json({ error: "Coupon is not applicable for this movie" });
            }
        }

        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = (total_price * coupon.value) / 100;
            if (coupon.maxDiscountValue) {
                discountAmount = Math.min(discountAmount, coupon.maxDiscountValue);
            }
        } else if (coupon.discountType === 'fixed') {
            discountAmount = coupon.value;
        }

        const newTotal = Math.max(0, total_price - discountAmount);

        res.json({
            success: true,
            discountAmount,
            newTotal,
            message: "Coupon applied successfully!"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

const storeBooking = async (req, res) => {
    try {
        const { movie_id, show_id, selected_seats, total_price, coupon_code } = req.body;

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
        
        let final_price = parseFloat(total_price);
        let appliedCoupon = null;
        let discountPerSeat = 0;

        if (coupon_code) {
            appliedCoupon = await Coupon.findOne({ code: coupon_code.toUpperCase(), isActive: true });
            if (appliedCoupon) {
                const now = new Date();
                const isValid = (now >= appliedCoupon.validFrom && now <= appliedCoupon.validTo) &&
                                (appliedCoupon.maxUsageLimit === null || appliedCoupon.usageCount < appliedCoupon.maxUsageLimit) &&
                                (total_price >= appliedCoupon.minOrderValue) &&
                                (!appliedCoupon.applicableMovies || appliedCoupon.applicableMovies.length === 0 || appliedCoupon.applicableMovies.some(id => id.toString() === movie_id));
                
                if (isValid) {
                    let discountAmount = 0;
                    if (appliedCoupon.discountType === 'percentage') {
                        discountAmount = (total_price * appliedCoupon.value) / 100;
                        if (appliedCoupon.maxDiscountValue) {
                            discountAmount = Math.min(discountAmount, appliedCoupon.maxDiscountValue);
                        }
                    } else if (appliedCoupon.discountType === 'fixed') {
                        discountAmount = appliedCoupon.value;
                    }
                    final_price = Math.max(0, total_price - discountAmount);
                    discountPerSeat = discountAmount / seatIds.length;
                }
            }
        }

        seatIds.forEach(seatNum => {

            let type = 'REGULAR';
            seatObjects.push({
                seatNumber: seatNum,
                price: (total_price / seatIds.length) - discountPerSeat
            });
        });

        const newTicket = new Ticket({
            user: req.cookies.userId,
            movie: movie_id,
            show: show_id,
            seats: seatObjects,
            status: 'BOOKED',
            totalAmount: final_price
        });

        await newTicket.save();
        showDoc.bookedSeats.push(...seatIds);
        await showDoc.save();

        if (appliedCoupon) {
            appliedCoupon.usageCount += 1;
            await appliedCoupon.save();
        }

        let ticket = await Ticket.findOne({ _id: newTicket.id })
            .populate({
                path: "user",
                select: "userName email"
            })
            .populate({
                path: "movie",
                select: "title"
            }).populate({
                path: "show",
                select: "screenId startTime endTime",
                populate: {
                    path: "screenId",
                    select: "name"
                }
            })
        let totalPrice = 0;
        ticket.seats.forEach(e => {
            totalPrice += e.price
        })

        let ticketObj = {

            userName: ticket.user.userName,
            userEmail: ticket.user.email,
            movieName: ticket.movie.title,
            screenName: ticket.show.screenId.name,
            showDate: ticket.show.startTime.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                timeZone: "Asia/Kolkata"
            }),
            startTime: ticket.show.startTime.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "Asia/Kolkata"
            }),
            endTime: ticket.show.startTime.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "Asia/Kolkata"
            }),
            seatNo: ticket.seats.map(s => s.seatNumber).join(', '),
            totalPrice: totalPrice,
            ticketId: ticket._id
        }
        console.log("ticket object : ", ticketObj)
        res.redirect('/booking-success');

        ticketMail(ticketObj).catch(err => {
            console.error("Failed to send ticket email:", err);
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Booking Failed");
    }
}

const bookingSuccess = (req, res) => {
    res.render('pages/success');
}

const profilePage = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const tickets = await Ticket.find({ user: userId })
            .populate('movie')
            .populate({
                path: 'show',
                populate: {
                    path: 'screenId',
                    populate: {
                        path: 'theatreId'
                    }
                }
            })
            .sort({ createdAt: -1 });
        
        res.render('pages/profile', { tickets });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

const cancelTicket = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const userId = req.cookies.userId;

        const ticket = await Ticket.findOne({ _id: ticketId, user: userId }).populate('show');

        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        if (ticket.status === 'CANCELLED') {
            return res.status(400).json({ error: "Ticket is already cancelled" });
        }

        const show = ticket.show;
        const now = new Date();
        const timeDiffHours = (new Date(show.startTime).getTime() - now.getTime()) / (1000 * 60 * 60);

        if (timeDiffHours < 24) {
            return res.status(400).json({ error: "Cancellations are not allowed within 24 hours of the showtime." });
        }

        // Proceed to cancel
        ticket.status = 'CANCELLED';
        await ticket.save();

        // Free up seats in Show
        const seatNumbersToCancel = ticket.seats.map(s => s.seatNumber);
        
        await Show.findByIdAndUpdate(show._id, {
            $pullAll: { bookedSeats: seatNumbersToCancel }
        });

        res.json({ success: true, message: "Ticket cancelled successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
};

module.exports = { home, booking, getShows, storeBooking, bookingSuccess, checkoutPage, applyCoupon, profilePage, cancelTicket }