// index.js

/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const nodemailer = require('nodemailer');

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8080";

/**
 *  App Configuration
 */
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
var urlencodedParser = bodyParser.urlencoded( { extended: false } );

/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
    res.render("index");
});
app.get("/index", (req, res) => {
    res.render("index");
});
app.get("/code", (req, res) => {
    res.render("code");
});
app.get("/personalwebsite", (req, res) => {
    res.render("personalwebsite");
});
app.get("/foodmachinesoftware", (req, res) => {
    res.render("foodmachinesoftware");
});
app.get("/covid19prioritizer", (req, res) => {
    res.render("covid19prioritizer");
});
app.get("/datatree", (req, res) => {
    res.render("datatree");
});
app.get("/travel", (req, res) => {
    res.render("travel");
});
app.get("/feedback", (req, res) => {
    res.render("feedback");
});
app.post("/feedback", urlencodedParser, (req, res) => {
    var info = {
        first: req.body.first,
        last: req.body.last,
        phone: req.body.phone,
        email: req.body.email,
        comment: req.body.comment
    }

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'simon.markus9@gmail.com', pass: 'Dzevara1'
        }
    });
    
    var mailOptions1 = {
        from: 'simon.markus9@gmail.com',
        to: info.email,
        subject: 'Simon Personal Website',
        text: `(automated message)

Dear ${info.first} ${info.last}, thank you for your feedback! 

Simon @ https://simon-website.herokuapp.com/



Simon Markus
217-480-5323
`
    };

    var mailOptions2 = {
        from: 'simon.markus9@gmail.com',
        to: 'simon.markus9@gmail.com',
        subject: 'Website Feedback From ' + info.first + ' ' + info.last,
        text: `
${info.first} ${info.last} (${info.email} - ${info.phone}) left a comment on your website: 

	"${info.comment}"`
    };
    
    transporter.sendMail(mailOptions1, function(error, info) {
        if(error){
            console.log(error);
        }
        else{
            console.log('Email sent: ' + info.response);
        }
    });

    transporter.sendMail(mailOptions2, function(error, info) {
        if(error){
            console.log(error);
        }
        else{
            console.log('Email sent: ' + info.response);
        }
    });
    res.render("postfeedback");
});

/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});