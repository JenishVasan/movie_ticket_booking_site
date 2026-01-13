const Movie = require("../model/moviewmodel");
const Theatre = require("../model/theatorModel");
const Screen = require("../model/screenModel");
const Show = require("../model/showModel");

const adminPage = async (req, res) => {
  try {
    const movies = await Movie.find({});
    const theatres = await Theatre.find({});
    const screens = await Screen.find({}).populate("theatreId");
    const shows = await Show.find({}).populate("movieId").populate("screenId");

    res.render("pages/admin", { movies, theatres, screens, shows });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

const addMovie = async (req, res) => {
  try {
    const {
      title,
      genre,
      movieLanguage,
      rating,
      durationHour,
      durationMinute,
      poster,
    } = req.body;

    // Handle genre and language as comma-separated strings
    const genreArray = genre ? genre.split(",").map((g) => g.trim()) : [];
    const languageArray = movieLanguage
      ? movieLanguage.split(",").map((l) => l.trim())
      : [];

    const newMovie = new Movie({
      title,
      genre: genreArray,
      language: languageArray,
      rating,
      durationH: durationHour,
      durationM: durationMinute,
      poster,
    });

    await newMovie.save();
    res.redirect("/admin");
  } catch (err) {
    console.log("Error adding movie:", err);
    res.status(500).send("Error adding movie");
  }
};

const addCinema = async (req, res) => {
  try {
    const { name, city, address } = req.body;
    const newTheatre = new Theatre({
      name,
      city,
      address,
    });
    await newTheatre.save();
    res.redirect("/admin");
  } catch (err) {
    console.log("Error adding cinema:", err);
    res.status(500).send("Error adding cinema");
  }
};

const addScreen = async (req, res) => {
  try {
    const { name, rows, columns, cinemaId } = req.body;

    let seatLayout = [];
    const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let r = 0; r < rows; r++) {
      for (let c = 1; c <= columns; c++) {
        // Simple logic: first 2 rows premium, rest regular (just an example)
        // Or just all REGULAR for simplicity unless specified
        let type = "REGULAR";
        if (r < 2) type = "PREMIUM";

        seatLayout.push({
          seatNumber: `${rowLabels[r]}${c}`,
          row: rowLabels[r],
          type: type,
          isBooked: false,
        });
      }
    }

    const newScreen = new Screen({
      theatreId: cinemaId,
      name,
      rows,
      columns,
      totalSeats: seatLayout.length,
      seatLayout,
    });

    const savedScreen = await newScreen.save();

    // Update Theatre
    await Theatre.findByIdAndUpdate(cinemaId, {
      $push: { screens: savedScreen._id },
    });

    res.redirect("/admin");
  } catch (err) {
    console.log("Error adding screen:", err);
    res.status(500).send("Error adding screen");
  }
};

const addShow = async (req, res) => {
  try {
    const {
      movieId,
      screenId,
      startTime,
      endTime,
      priceRegular,
      pricePremium,
      priceRecliner,
    } = req.body;

    const newShow = new Show({
      movieId,
      screenId,
      startTime,
      endTime,
      price: {
        REGULAR: priceRegular,
        PREMIUM: pricePremium,
        RECLINER: priceRecliner,
      },
    });

    await newShow.save();
    res.redirect("/admin");
  } catch (err) {
    console.log("Error adding show:", err);
    res.status(500).send("Error adding show");
  }
};

// --- DELETE OPERATIONS ---

const deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCinema = async (req, res) => {
  try {
    await Theatre.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteScreen = async (req, res) => {
  try {
    await Screen.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteShow = async (req, res) => {
  try {
    await Show.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getMovie = async (req, res) => {
  try {
    const data = await Movie.findById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
};
const getCinema = async (req, res) => {
  try {
    const data = await Theatre.findById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
};
const getScreen = async (req, res) => {
  try {
    const data = await Screen.findById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
};
const getShow = async (req, res) => {
  try {
    const data = await Show.findById(req.params.id)
      .populate("movieId")
      .populate("screenId");
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
};
 
const updateMovie = async (req, res) => {
  try {
    const {
      title,
      genre,
      movieLanguage,
      rating,
      durationHour,
      durationMinute,
      poster,
    } = req.body;
    const genreArray =
      typeof genre === "string" ? genre.split(",").map((g) => g.trim()) : genre;
    const languageArray = typeof movieLanguage === "string"
        ? movieLanguage.split(",").map((l) => l.trim())
        : movieLanguage;

    await Movie.findByIdAndUpdate(req.params.id, {
      title,
      genre: genreArray,
      language: languageArray,
      rating,
      durationH: durationHour,
      durationM: durationMinute,
      poster,
    });
    res.redirect("/admin");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateCinema = async (req, res) => {
  try {
    const { name, city, address } = req.body;
    await Theatre.findByIdAndUpdate(req.params.id, { name, city, address });
    res.redirect("/admin");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateScreen = async (req, res) => {
  try {
    const { name, rows, columns, cinemaId } = req.body;
    await Screen.findByIdAndUpdate(req.params.id, {
      name,
      rows,
      columns,
      theatreId: cinemaId,
    });
    res.redirect("/admin");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateShow = async (req, res) => {
  try {
    const {
      movieId,
      screenId,
      startTime,
      endTime,
      priceRegular,
      pricePremium,
      priceRecliner,
    } = req.body;
    await Show.findByIdAndUpdate(req.params.id, {
      movieId,
      screenId,
      startTime,
      endTime,
      price: {
        REGULAR: priceRegular,
        PREMIUM: pricePremium,
        RECLINER: priceRecliner,
      },
    });
    res.redirect("/admin");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  adminPage,
  addMovie,
  addCinema,
  addScreen,
  addShow,
  deleteMovie,
  deleteCinema,
  deleteScreen,
  deleteShow,
  getMovie,
  updateMovie,
  getCinema,
  updateCinema,
  getScreen,
  updateScreen,
  getShow,
  updateShow,
};
