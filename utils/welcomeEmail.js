const mailSender = require("../utils/mailSender") 
 
const welcomeMail = async  (userEmail , username )=>{
    var message = {
            from: "hjenis451@gmail.com",
            to: userEmail ,
            subject: "Welcome to Cineverse! 🎬",
            // text: "This is the plaintext version of the email.",
            html:`<!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>Welcome to Cineverse</title>
                        <style>
                            /* Reset styles */
                            body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; }
                            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; }
                            .header { background-color: #1a1a1a; padding: 20px; text-align: center; color: #ffffff; }
                            .header h1 { margin: 0; font-size: 24px; letter-spacing: 2px; color: #e50914; /* Red accent color */ }
                            .content { padding: 30px; color: #333333; line-height: 1.6; }
                            .btn { display: inline-block; padding: 12px 24px; background-color: #e50914; color: #ffffff !important; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
                            .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888888; }
                            .movie-icon { font-size: 40px; margin-bottom: 10px; }
                        </style>
                    </head>
                    <body>

                        <div class="container">
                            <div class="header">
                                <div class="movie-icon">🎬</div>
                                <h1>Cineverse!</h1>
                            </div>

                            <div class="content">
                                <h2>Welcome, ${username}!</h2>
                                <p>Thanks for joining us. You are now part of the ultimate movie-booking community.</p>
                                
                                <p>From the biggest screens to the most comfortable recliners, booking your next experience is just a click away.</p>

                                <p style="margin-top: 20px; margin-bottom: 20px;">
                                    <strong>Here is what you can do:</strong><br>
                                    ✅ Check showtimes for all major cinemas<br>
                                    ✅ Select your exact seat number<br>
                                    ✅ Pre-book snacks & drinks
                                </p>

                                <div style="text-align: center;">
                                    <a href="https://your-website-url.com" class="btn">Book Your First Ticket</a>
                                </div>

                                <p style="margin-top: 30px;">See you at the movies!</p>
                            </div>

                            <div class="footer">
                                <p>&copy; 2026 [App Name]. All rights reserved.</p>
                                <p>Address or Unsubscribe Link Here</p>
                            </div>
                        </div>

                    </body>
                    </html>`,
                    };
                    
        console.log('utils :sending welcome mail to user from ')
        await mailSender.sendMail(message)
        console.log("email send success")
}

module.exports = welcomeMail