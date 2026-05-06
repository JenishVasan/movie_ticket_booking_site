const mailSender = require("./mailSender")

const ticketMail = async (ticketObj) => {
    const seats = ticketObj.seatNo;
    var message = {
        from: "hjenis451@gmail.com",
        to: ticketObj.userEmail,
        subject: "Welcome to Cineverse! 🎬",
        // text: "This is the plaintext version of the email.",
        html: `<!DOCTYPE html>
                    <html>
                    <head>
                    <meta charset="UTF-8" />
                    <title>Ticket Confirmed</title>
                    </head>
                    <body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, sans-serif;">

                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                        <td align="center" style="padding:20px 0;">

                            <!-- Main Card -->
                            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:6px; overflow:hidden;">

                            <!-- Header -->
                            <tr>
                                <td style="background:#111827; color:#ffffff; padding:20px; text-align:center;">
                                <h1 style="margin:0; font-size:22px;">🎟 Ticket Booked Successfully</h1>
                                </td>
                            </tr>

                            <!-- Body -->
                            <tr>
                                <td style="padding:20px; color:#333333;">

                                <p style="margin:0 0 10px;">Hi <strong>${ticketObj.userName}</strong>,</p>
                                <p style="margin:0 0 20px;">
                                    Your movie ticket has been successfully booked.  
                                    Please find the details below:
                                </p>

                                <!-- Ticket Details -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                    <tr>
                                    <td style="padding:8px; border-bottom:1px solid #ddd;"><strong>Movie</strong></td>
                                    <td style="padding:8px; border-bottom:1px solid #ddd;">${ticketObj.movieName}</td>
                                    </tr>

                                    <tr>
                                    <td style="padding:8px; border-bottom:1px solid #ddd;"><strong>Screen</strong></td>
                                    <td style="padding:8px; border-bottom:1px solid #ddd;">${ticketObj.screenName}</td>
                                    </tr>

                                    <tr>
                                    <td style="padding:8px; border-bottom:1px solid #ddd;"><strong>Date</strong></td>
                                    <td style="padding:8px; border-bottom:1px solid #ddd;">${ticketObj.showDate}</td>
                                    </tr>

                                    <tr>
                                    <td style="padding:8px; border-bottom:1px solid #ddd;"><strong>Time</strong></td>
                                    <td style="padding:8px; border-bottom:1px solid #ddd;">
                                        ${ticketObj.startTime} - ${ticketObj.endTime}
                                    </td>
                                    </tr>

                                    <tr>
                                    <td style="padding:8px; border-bottom:1px solid #ddd;"><strong>Seats</strong></td>
                                    <td style="padding:8px; border-bottom:1px solid #ddd;">${seats}</td>
                                    </tr>

                                    <tr>
                                    <td style="padding:8px;"><strong>Total Price</strong></td>
                                    <td style="padding:8px;"><strong>₹ ${ticketObj.totalPrice}</strong></td>
                                    </tr>
                                </table>

                                <!-- Ticket ID -->
                                <p style="margin:20px 0 0;">
                                    <strong>Ticket ID:</strong> ${ticketObj.ticketId}
                                </p>

                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#666;">
                                Please show this email at the theatre entrance.  
                                <br />
                                © 2026 CINEVERSE
                                </td>
                            </tr>

                            </table>

                        </td>
                        </tr>
                    </table>

                    </body>
                    </html>
`,
    };

    console.log('utils :sending ticket to user via mail ')
    await mailSender.sendMail(message)
    console.log("email send success")
}

module.exports = ticketMail;




