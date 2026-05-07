# CineBook - Movie Ticket Booking System 🎬

![CineBook Banner](C:\Users\hjeni\.gemini\antigravity\brain\0cdce792-bd4c-40ae-b7af-1d094ced421d\movie_booking_banner_1778070284899.png)

CineBook is a full-stack movie ticket booking application built with **Node.js**, **Express**, **EJS**, and **MongoDB**. It provides a seamless experience for users to browse movies, select shows, and book tickets, while offering a robust administrative dashboard for theater management.

---

## ✨ Key Features

### 👤 For Users
- **User Authentication**: Secure signup and login system with password hashing.
- **Movie Browsing**: Explore current and upcoming movies with detailed information.
- **Interactive Booking**: Select cinemas, screens, and shows for your favorite movies.
- **Coupon System**: Apply discount codes during checkout to save on tickets.
- **Profile Management**: View booking history and manage account details.
- **Ticket Cancellation**: Easy 24-hour cancellation policy for booked tickets.
- **Email Notifications**: Receive OTPs and booking confirmations via email.

### 🛠️ For Administrators

**Admin Login Credentials:**
- **Email:** `MovieAdmin@gmail.com`
- **Password:** `12345678`

- **Dashboard**: Overview of system statistics.
- **Movie Management**: CRUD operations for movies (title, description, posters).
- **Theater Setup**: Manage Cinemas, Screens, and Showtimes efficiently.
- **Coupon Management**: Create and manage discount coupons.
- **Real-time Updates**: Changes reflect instantly on the user-facing site.

---

## 🚀 Tech Stack

- **Backend**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Frontend**: [EJS](https://ejs.co/) (Embedded JavaScript Templates), CSS3, Vanilla JS
- **Authentication**: Bcrypt, Cookie-parser
- **Notifications**: [Nodemailer](https://nodemailer.com/)
- **File Handling**: Multer

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js installed on your machine.
- MongoDB running locally (default: `mongodb://localhost:27017/movie_site`).

### Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/JenishVasan/movie_ticket_booking_site.git
   cd movie_site
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory and add the following:
   ```env
   APP_PASS=your_email_app_password   -> gen by using -> 2fa(required) + app password (google account -> security)
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/movie_site
   ```
   *(Note: `APP_PASS` is used for Nodemailer to send emails via Gmail or similar services.)*

4. **Run the Application**
   ```bash
   npm start
   ```
   The app will be running at `http://localhost:3000`.

---

## 📂 Project Structure

```text
movie_site/
├── controller/     # Backend business logic
├── db/             # Database connection configuration
├── middleware/     # Authentication & custom middlewares
├── model/          # Mongoose schemas/models
├── public/         # Static assets (CSS, JS, Images)
├── routers/        # Express route definitions
├── utils/          # Helper functions (OTP, Email)
├── views/          # EJS templates (Pages & Partials)
├── index.js        # Main application entry point
└── package.json    # Dependencies and scripts
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve CineBook, feel free to fork the repo and submit a pull request.

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

---

## 📄 License

This project is licensed under the ISC License.

---

*Made with ❤️ by Jenish Vasan*
