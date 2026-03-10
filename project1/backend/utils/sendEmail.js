const nodemailer = require("nodemailer")

const sendVerificationEmail = async (email, token) => {

const transporter = nodemailer.createTransport({
 service: "gmail",
 auth: {
   user: process.env.EMAIL,
   pass: process.env.EMAIL_PASS
 }
})

const url = `http://localhost:3000/verify/${token}`

await transporter.sendMail({
 to: email,
 subject: "Verify your email",
 html: `<h2>Email Verification</h2>
        <a href="${url}">Click here to verify</a>`
})

}

module.exports = sendVerificationEmail