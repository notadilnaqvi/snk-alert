require("dotenv").config();
const fetch = require('node-fetch');
const nodemailer = require("nodemailer");
const MongoClient = require('mongodb').MongoClient;

// reddit api
const URL = "https://api.reddit.com/user/sahnbk/submitted?limit=1";

// regex to match u/SNKbot post title
const re = /\[New Chapter Spoilers\] Chapter \d\d\d RELEASE Megathread!/;

// main function, runs every 2 mins
setInterval(() => {
    (async () => {
        console.log("Starting app...");

        // get the latest u/SNKBot post
        let response = await fetch(URL);
        let json = await response.json();
        let post = json.data.children[0];
        console.log("Got latest post...");

        // connect to database
        const client = await setUpMongoClient();
        await client.connect();
        let collection = client.db("snk-alert").collection("postNameCollection");
        console.log("Conneted to client...");

        // check 3 things:
        // 1. has the latest post been previously detected by this program? check the database
        // 2. does the post have "Latest Chapter" flair?
        // 3. does the post title match the regex?
        let flag = await checkInDatabase(post.data.name, collection);
        if (!flag && post.data.title.match(re)) { // && post.data.link_flair_text == "OC"
            await addToDatabase(post.data.name, collection); // add post to database
            sendEmail(post.data.url); // send email
        }
        
        client.close();
        console.log("Finished!\n");
    })();
}, 120000);

function sendEmail(_url) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            // never hardcode sensitive data, always use environment variables
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_RECIPIENT,
        cc: process.env.GMAIL_CC,
        subject: "Testing app",
        html: `Oi,<br><br>A new ⚔️ SNK ⚔️ chapter just dropped. Go read at <a style="text-decoration: none" href = ${_url}>this link</a>.<br><br><a style="text-decoration: none" href = "https://github.com/notadilnaqvi/snk-alert">– SNK Alert Bot</a><br><p style="opacity: 0.4">Am I not working as inteded? Post an issue <a style="text-decoration: none" href = "https://github.com/notadilnaqvi/snk-alert/issues"><i>here</i></a>.</p>`
    };

    transporter.sendMail(mailOptions);
    console.log(`Email sent at ${new Date()}`);
}

async function setUpMongoClient() {
    URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gs4t3.mongodb.net/snk-alert?retryWrites=true&w=majority`;

    return new MongoClient(URI, { useUnifiedTopology: true });
}

// check for detected post in given collection
async function checkInDatabase(_postName, _collection) {
    let flag = false;
    let cursor = _collection.find({});

    while (await cursor.hasNext()) {
        let currentEntry = await cursor.next();
        if (_postName == currentEntry.postName) {
            flag = true;
            break;
        }
    }
    return flag;
}

// add detected post to given collection
async function addToDatabase(_postName, _collection) {
    await _collection.insertOne({
        "postName": _postName
    });
    console.log(`Added ${_postName} on ${new Date()}`);
}