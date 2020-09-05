require("dotenv").config();
const moment = require('moment');
const fetch = require('node-fetch');
const nodemailer = require("nodemailer");

URL = "https://api.reddit.com/user/SNKbot/submitted?limit=2"

let re = /\[New Chapter Spoilers\] Chapter \d\d\d RELEASE Megathread!/;

(async () => {
    let response = await fetch(URL);
    json = await response.json();
    json.data.children.forEach(child => {
        if(child.data.title.match(re) && child.data.link_flair_text == "Latest Chapter"){
            sendEmail(child.data.url);
        }
    });
})();


function sendEmail(_url) {

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL_USER, // generated ethereal user
            pass:  process.env.GMAIL_PASSWORD, // generated ethereal password
        },
    });

    const mailOptions = {
        from: "notadilnaqvi@gmail.com", // sender address
        to: "olz56908@cuoly.com", // list of receivers
        subject: "New SNK Chapter", // Subject line
        html: `Oi,<br><br>A new ⚔️ SNK ⚔️ chapter just dropped. Go read at <a style="text-decoration: none" href = ${_url}>this link</a>. Thank me later!<br><br>–Adil<br><a style="text-decoration: none" href = "https://github.com/notadilnaqvi/snk-alert">SNK Alert Github Repo</a>`
    }

    transporter.sendMail(mailOptions);
}