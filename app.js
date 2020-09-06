require("dotenv").config();
const fetch = require('node-fetch');
const nodemailer = require("nodemailer");

const URL = "https://api.reddit.com/user/sahnbk/submitted?limit=1"

const re = /\[New Chapter Spoilers\] Chapter \d\d\d RELEASE Megathread!/;
let oldPost = "";

setInterval(() => {
    (async () => {
        let response = await fetch(URL);
        json = await response.json();
        
        json.data.children.forEach(child => {
            if(child.data.name != oldPost && child.data.title.match(re)){
                // sendEmail(child.data.url);
                console.log("New chapter: " + child.data.name);
                oldPost = child.data.name;
            } else {
                console.log("Nothing new...");
            }
        });
    })();
}, 10000);
// (async () => {
//     let response = await fetch(URL);
//     json = await response.json();
//     json.data.children.forEach(child => {
//         if(child.data.name != oldPost && child.data.title.match(re) && child.data.link_flair_text == "Latest Chapter"){
//             // sendEmail(child.data.url);
//             console.log(child.data.name);
//             oldPost = child.data.name;
//         }
//     });
// })();

// function sendEmail(_url) {

//     let transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         port: 465,
//         secure: true,
//         auth: {
//             user: process.env.GMAIL_USER,
//             pass:  process.env.GMAIL_PASSWORD,
//         },
//     });

//     const mailOptions = {
//         from: process.env.GMAIL_USER,
//         to: process.env.GMAIL_RECIPIENT,
//         subject: "New SNK Chapter",
//         html: `Oi,<br><br>A new ⚔️ SNK ⚔️ chapter just dropped. Go read at <a style="text-decoration: none" href = ${_url}>this link</a>. Thank me later!<br><br><a style="text-decoration: none" href = "https://github.com/notadilnaqvi/snk-alert">– SNK Alert Bot</a>`
//     }

//     transporter.sendMail(mailOptions);
// }