document.addEventListener("DOMContentLoaded", () => {
  // 1. Navigation Logic
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");

  navLinks.forEach((link, index) => {
    link.addEventListener("click", () => {
      navLinks.forEach((l) => l.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));
      link.classList.add("active");
      sections[index].classList.add("active");
    });
  });

  // 2. Seat Layout Generator (JSON Preview)
  const rowsInput = document.getElementById("s_rows");
  const colsInput = document.getElementById("s_cols");
  const preview = document.getElementById("seatJsonPreview");

  function updateSeatPreview() {
    const rows = parseInt(rowsInput.value) || 0;
    const cols = parseInt(colsInput.value) || 0;
    if (preview) preview.textContent = `Will generate ${rows} Rows x ${cols} Columns = ${rows * cols} Total Seats`;
  }

  if (rowsInput && colsInput) {
    rowsInput.addEventListener("input", updateSeatPreview);
    colsInput.addEventListener("input", updateSeatPreview);
    updateSeatPreview();
  }

  // 3. Delete Logic
  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-danger')) {
      const id = e.target.dataset.id;
      const type = e.target.dataset.type; // 'Movie', 'Cinema', 'Screen', 'Show'

      if (confirm(`Are you sure you want to delete this ${type}?`)) {
        try {
          const res = await fetch(`/delete${type}/${id}`, { method: 'DELETE' });
          if (res.ok) {
            window.location.reload();
          } else {
            alert("Failed to delete.");
          }
        } catch (err) { console.error(err); alert("Error deleting."); }
      }
    }
  });

  // 4. Edit Logic
  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-edit')) {
      const id = e.target.dataset.id;
      const type = e.target.dataset.type; // 'Movie', 'Cinema', 'Screen', 'Show'

      try {
        const res = await fetch(`/get${type}/${id}`);
        const data = await res.json();

        if (type === 'Movie') populateMovieForm(data);
        if (type === 'Cinema') populateCinemaForm(data);
        if (type === 'Screen') populateScreenForm(data);
        if (type === 'Show') populateShowForm(data);
        if (type === 'Coupon') populateCouponForm(data);

      } catch (err) { console.error("Error fetching data for edit", err); }
    }
  });

  // --- Form Populators & Resetters ---

  // Movie
  const movieForm = document.getElementById('movieForm');
  const btnMovieSubmit = document.getElementById('btn_movie_submit');
  const btnMovieCancel = document.getElementById('btn_movie_cancel');
  const formTitleMovie = document.getElementById('formTitle_movie');

  function populateMovieForm(data) {
    document.getElementById('m_title').value = data.title;
    document.getElementById('m_genre').value = data.genre.join(', ');
    document.getElementById('m_lang').value = data.language.join(', ');
    document.getElementById('m_rating').value = data.rating;
    document.getElementById('m_poster').value = data.poster || "";
    document.getElementById('m_h').value = data.durationH;
    document.getElementById('m_m').value = data.durationM;

    movieForm.action = `/updateMovie/${data._id}`;
    btnMovieSubmit.textContent = "Update Movie";
    formTitleMovie.textContent = "Edit Movie";
    btnMovieCancel.style.display = 'inline-block';

    // Scroll to form
    movieForm.scrollIntoView({ behavior: 'smooth' });
  }

  btnMovieCancel.addEventListener('click', () => {
    movieForm.reset();
    movieForm.action = "/addMovie";
    btnMovieSubmit.textContent = "Add Movie";
    formTitleMovie.textContent = "Add New Movie";
    btnMovieCancel.style.display = 'none';
  });

  // Cinema
  const cinemaForm = document.getElementById('cinemaForm');
  const btnCinemaSubmit = document.getElementById('btn_cinema_submit');
  const btnCinemaCancel = document.getElementById('btn_cinema_cancel');
  const formTitleCinema = document.getElementById('formTitle_cinema');

  function populateCinemaForm(data) {
    document.getElementById('c_name').value = data.name;
    document.getElementById('c_city').value = data.city;
    document.getElementById('c_addr').value = data.address;

    cinemaForm.action = `/updateCinema/${data._id}`;
    btnCinemaSubmit.textContent = "Update Cinema";
    formTitleCinema.textContent = "Edit Cinema";
    btnCinemaCancel.style.display = 'inline-block';
    cinemaForm.scrollIntoView({ behavior: 'smooth' });
  }

  btnCinemaCancel.addEventListener('click', () => {
    cinemaForm.reset();
    cinemaForm.action = "/addCinema";
    btnCinemaSubmit.textContent = "Add Cinema";
    formTitleCinema.textContent = "Add New Cinema";
    btnCinemaCancel.style.display = 'none';
  });

  // Screen
  const screenForm = document.getElementById('screenForm');
  const btnScreenSubmit = document.getElementById('btn_screen_submit');
  const btnScreenCancel = document.getElementById('btn_screen_cancel');
  const formTitleScreen = document.getElementById('formTitle_screen');

  function populateScreenForm(data) {
    document.getElementById('s_name').value = data.name;
    document.getElementById('s_rows').value = data.rows;
    document.getElementById('s_cols').value = data.columns;
    document.getElementById('s_cinema_select').value = data.theatreId;

    screenForm.action = `/updateScreen/${data._id}`;
    btnScreenSubmit.textContent = "Update Screen";
    formTitleScreen.textContent = "Edit Screen";
    btnScreenCancel.style.display = 'inline-block';
    updateSeatPreview();
    screenForm.scrollIntoView({ behavior: 'smooth' });
  }

  btnScreenCancel.addEventListener('click', () => {
    screenForm.reset();
    screenForm.action = "/addScreen";
    btnScreenSubmit.textContent = "Generate Layout & Add Screen";
    formTitleScreen.textContent = "Add New Screen";
    btnScreenCancel.style.display = 'none';
    updateSeatPreview();
  });

  // Show
  const showForm = document.getElementById('showForm');
  const btnShowSubmit = document.getElementById('btn_show_submit');
  const btnShowCancel = document.getElementById('btn_show_cancel');
  const formTitleShow = document.getElementById('formTitle_show');

  function populateShowForm(data) {
    document.getElementById('sh_movie').value = data.movieId ? data.movieId._id : data.movieId;
    document.getElementById('sh_screen').value = data.screenId ? data.screenId._id : data.screenId;

    // Date input formatting is tricky for datetime-local
    // Needs YYYY-MM-DDTHH:mm
    const start = new Date(data.startTime);
    start.setMinutes(start.getMinutes() - start.getTimezoneOffset());
    document.getElementById('sh_start').value = start.toISOString().slice(0, 16);

    const end = new Date(data.endTime);
    end.setMinutes(end.getMinutes() - end.getTimezoneOffset());
    document.getElementById('sh_end').value = end.toISOString().slice(0, 16);

    document.getElementById('p_reg').value = data.price.REGULAR;
    document.getElementById('p_prem').value = data.price.PREMIUM;
    document.getElementById('p_rec').value = data.price.RECLINER;

    showForm.action = `/updateShow/${data._id}`;
    btnShowSubmit.textContent = "Update Show";
    formTitleShow.textContent = "Edit Show";
    btnShowCancel.style.display = 'inline-block';
    showForm.scrollIntoView({ behavior: 'smooth' });
  }

  btnShowCancel.addEventListener('click', () => {
    showForm.reset();
    showForm.action = "/addShow";
    btnShowSubmit.textContent = "Create Show";
    formTitleShow.textContent = "Add New Show";
    btnShowCancel.style.display = 'none';
  });

  // Coupon
  const couponForm = document.getElementById('couponForm');
  const btnCouponSubmit = document.getElementById('btn_coupon_submit');
  const btnCouponCancel = document.getElementById('btn_coupon_cancel');
  const formTitleCoupon = document.getElementById('formTitle_coupon');

  function populateCouponForm(data) {
    document.getElementById('cp_code').value = data.code;
    document.getElementById('cp_type').value = data.discountType;
    document.getElementById('cp_val').value = data.value;
    document.getElementById('cp_min').value = data.minOrderValue;
    document.getElementById('cp_max').value = data.maxDiscountValue || '';
    
    if (data.validFrom) {
      const from = new Date(data.validFrom);
      from.setMinutes(from.getMinutes() - from.getTimezoneOffset());
      document.getElementById('cp_from').value = from.toISOString().slice(0, 16);
    }
    
    if (data.validTo) {
      const to = new Date(data.validTo);
      to.setMinutes(to.getMinutes() - to.getTimezoneOffset());
      document.getElementById('cp_to').value = to.toISOString().slice(0, 16);
    }
    
    document.getElementById('cp_limit').value = data.maxUsageLimit || '';
    document.getElementById('cp_active').checked = data.isActive;

    couponForm.action = `/updateCoupon/${data._id}`;
    btnCouponSubmit.textContent = "Update Coupon";
    formTitleCoupon.textContent = "Edit Coupon";
    btnCouponCancel.style.display = 'inline-block';
    couponForm.scrollIntoView({ behavior: 'smooth' });
  }

  if (btnCouponCancel) {
    btnCouponCancel.addEventListener('click', () => {
      couponForm.reset();
      couponForm.action = "/addCoupon";
      btnCouponSubmit.textContent = "Create Coupon";
      formTitleCoupon.textContent = "Add New Coupon";
      btnCouponCancel.style.display = 'none';
    });
  }

});