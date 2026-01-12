
// --- DATA ---
let selectedSeats = [];
let currentShowId = null;
let selectedShow = null; // To store the full show object

// --- INIT ---
document.addEventListener("DOMContentLoaded", () => {
    initDropdowns();
});

async function initDropdowns() {
    const movieIdInput = document.querySelector('input[name="movie_id"]');
    if (!movieIdInput) return;

    const movieId = movieIdInput.value;
    let shows = [];

    try {
        const res = await fetch(`/getShows/${movieId}`);
        if (res.ok) {
            shows = await res.json();
        } else {
            console.error("Failed to fetch shows");
        }
    } catch (e) { console.error("Error fetching shows:", e) }

    window.movieShows = shows;

    const theaterSelect = document.getElementById('theaterSelect');
}

function handleTheaterChange() {
    const theaterSelect = document.getElementById('theaterSelect');
    const dateSelect = document.getElementById('dateSelect');
    const timeSelect = document.getElementById('timeSelect');

    // Reset dependent dropdowns
    dateSelect.innerHTML = '<option value="" disabled selected>Choose Date...</option>';
    timeSelect.innerHTML = '<option value="" disabled selected>Choose Time...</option>';

    const selectedTheaterId = theaterSelect.value;
    const shows = window.movieShows || [];

    // Filter shows by Theater
    const theaterShows = shows.filter(s => s.screenId && s.screenId.theatreId._id === selectedTheaterId);

    // Extract Unique Dates
    const uniqueDates = new Set();
    theaterShows.forEach(s => {
        const dateObj = new Date(s.startTime);
        // Use local date for logic to match what users see
        const dateStr = dateObj.toLocaleDateString('en-CA'); // YYYY-MM-DD
        uniqueDates.add(dateStr);
    });

    // Populate Date Dropdown
    uniqueDates.forEach(dateStr => {
        const opt = document.createElement('option');
        opt.value = dateStr;
        const d = new Date(dateStr);
        opt.textContent = new Date(dateStr + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        // Note: adding T00:00:00 to force local time interpretation from the YYYY-MM-DD string
        dateSelect.appendChild(opt);
    });
}

function handleDateChange() {
    const theaterSelect = document.getElementById('theaterSelect');
    const dateSelect = document.getElementById('dateSelect');
    const timeSelect = document.getElementById('timeSelect');

    // Reset Time
    timeSelect.innerHTML = '<option value="" disabled selected>Choose Time...</option>';

    const selectedTheaterId = theaterSelect.value;
    const selectedDateStr = dateSelect.value; // YYYY-MM-DD
    const shows = window.movieShows || [];

    // Filter shows by Theater AND Date
    const validShows = shows.filter(s => {
        const tMatch = s.screenId && s.screenId.theatreId._id === selectedTheaterId;
        const showDateStr = new Date(s.startTime).toLocaleDateString('en-CA');
        const dMatch = showDateStr === selectedDateStr;
        return tMatch && dMatch;
    });

    // Populate Time Dropdown
    validShows.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s._id; // Value is SHOW ID
        const time = new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        opt.textContent = `${time} (${s.screenId.name})`;
        timeSelect.appendChild(opt);
    });
}

function handleTimeChange() {
    const timeSelect = document.getElementById('timeSelect');
    const showId = timeSelect.value;
    currentShowId = showId;
    document.getElementById('hiddenShowInput').value = showId;

    // Find selected show to get price/seat info later
    selectedShow = window.movieShows.find(s => s._id === showId);

    // We'll update seat price based on show if needed
    // For now, assuming fixed or handled in seat rendering
}


// --- INIT SEATS GRID (Called when "Select Seats" is clicked) ---
function initSeatsGrid() {
    const grid = document.getElementById('seatsGrid');
    grid.innerHTML = ''; // clear previous

    const rows = selectedShow && selectedShow.screenId ? selectedShow.screenId.rows : 6;
    const cols = selectedShow && selectedShow.screenId ? selectedShow.screenId.columns : 8;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const seat = document.createElement('div');
            seat.classList.add('seat');

            const seatId = `${String.fromCharCode(65 + r)}${c + 1}`;

            // Determine Seat Type & Price
            let seatType = 'REGULAR';
            const layoutSeat = selectedShow.screenId && selectedShow.screenId.seatLayout
                ? selectedShow.screenId.seatLayout.find(s => s.seatNumber === seatId)
                : null;
            if (layoutSeat) seatType = layoutSeat.type;

            // Set price
            let price = 18.00;
            if (selectedShow && selectedShow.price && selectedShow.price[seatType]) {
                price = selectedShow.price[seatType];
            }
            seat.dataset.price = price;
            seat.dataset.id = seatId;

            if (selectedShow && selectedShow.bookedSeats && selectedShow.bookedSeats.includes(seatId)) {
                seat.classList.add('occupied');
            } else {
                seat.addEventListener('click', () => toggleSeat(seat));
            }

            grid.appendChild(seat);
        }
    }
}

// --- VALIDATION & TRANSITION ---
function goToSeats() {
    const theater = document.getElementById('theaterSelect').value;
    const date = document.getElementById('dateSelect').value;
    const time = document.getElementById('timeSelect').value;

    if (!theater || !date || !time) {
        alert("Please select Theater, Date, and Time first.");
        return;
    }

    // Animate Phase 1 Out
    gsap.to("#phase1", { x: "-100%", opacity: 0, duration: 0.8, ease: "power3.inOut", pointerEvents: "none" });

    // Initialize Grid based on selection
    initSeatsGrid();

    // Animate Phase 2 In
    const phase2 = document.getElementById('phase2');
    phase2.style.opacity = 1;
    phase2.style.pointerEvents = "all";

    gsap.fromTo(".cinema-hall",
        { scale: 0.8, opacity: 0, rotateX: 30 },
        { scale: 1, opacity: 1, rotateX: 0, duration: 1, delay: 0.3, ease: "power2.out" }
    );

    gsap.fromTo(".seat",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.02, duration: 0.5, delay: 0.5, ease: "back.out" }
    );

    // Update UI
    document.getElementById('bookingBar').classList.add('visible');
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    document.getElementById('headerSub').textContent = `${time} • Select Seats`;

    // Enable 3D Tilt
    document.addEventListener('mousemove', (e) => {
        const hall = document.getElementById('hall');
        const x = (window.innerWidth / 2 - e.clientX) / 80;
        const y = (window.innerHeight / 2 - e.clientY) / 80;
        gsap.to(hall, { rotationY: -x, rotationX: y, duration: 1 });
    });
}

// --- SEAT SELECTION & FORM UPDATE ---
function toggleSeat(seat) {
    if (seat.classList.contains('occupied')) return;

    seat.classList.toggle('selected');
    const id = seat.dataset.id;
    const price = parseFloat(seat.dataset.price);

    if (seat.classList.contains('selected')) {
        selectedSeats.push({ id, price });
        gsap.fromTo(seat, { scale: 0.5 }, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" });
    } else {
        selectedSeats = selectedSeats.filter(s => s.id !== id);
    }

    // UPDATE HIDDEN INPUTS FOR BACKEND
    const seatIds = selectedSeats.map(s => s.id);
    document.getElementById('hiddenSeatsInput').value = seatIds.join(',');

    const total = selectedSeats.reduce((acc, s) => acc + s.price, 0);
    document.getElementById('hiddenPriceInput').value = total;
    document.getElementById('priceDisplay').textContent = `$${total.toFixed(2)}`;
}

// --- HANDLE FORM SUBMISSION (Client Side Check) ---
const form = document.getElementById('mainBookingForm');
form.addEventListener('submit', async (e) => {
    // Standard form submission to /api/booking
    // We only prevent default if validation fails
    if (selectedSeats.length === 0) {
        e.preventDefault();
        alert("Please select at least one seat.");
        return;
    }
});

