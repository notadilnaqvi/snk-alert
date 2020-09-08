require("dotenv").config();
const fetch = require('node-fetch');
const nodemailer = require("nodemailer");

// reddit api
const URL = "https://api.reddit.com/user/SNKbot/submitted?limit=1"

// regex to match u/SNKbot post title
const re = /\[New Chapter Spoilers\] Chapter \d\d\d RELEASE Megathread!/;
let oldPost = "";

// check for new chapter post every 30 seconds, send email if detected
setInterval(() => {
    (async () => {
        let response = await fetch(URL);
        json = await response.json();
        
        json.data.children.forEach(child => {
            // checks 3 things:
            // 1. has the latest post been previously detected by this program?
            // 2. does the post have "Latest Chapter" flair?
            // 3. does the post title match the regex?
            if(child.data.name != oldPost && child.data.link_flair_text == "Latest Chapter" && child.data.title.match(re)){
                // hold detected post's name in memory
                oldPost = child.data.name;
                // send email
                sendEmail(child.data.url);
                console.log("Email Sent! New chapter: " + child.data.name);
            }
        });
    })();
}, 30000);

function sendEmail(_url) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            // never hardcode sensitive data, always use environment variables
            user: process.env.GMAIL_USER,
            pass:  process.env.GMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_RECIPIENT,
        subject: "New SNK Chapter",
        html: `Oi,<br><br>A new ⚔️ SNK ⚔️ chapter just dropped. Go read at <a style="text-decoration: none" href = ${_url}>this link</a>.<br><br><a style="text-decoration: none" href = "https://github.com/notadilnaqvi/snk-alert">– SNK Alert Bot</a><br><p style="opacity: 0.4">Am I not working as inteded? Post an issue <a style="text-decoration: none" href = "https://github.com/notadilnaqvi/snk-alert/issues"><i>here</i></a>.</p>`
    }

    transporter.sendMail(mailOptions);
}