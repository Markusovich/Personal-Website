var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var nodemailer = require('nodemailer');

var app = express();
var port = process.env.PORT || "8080";

app.use(express.static(path.join(__dirname, "public")));  //Enables display of css and other decorations
var urlencodedParser = bodyParser.urlencoded( { extended: false } );

app.get("/", function(req, res){
    res.sendFile(__dirname + "/views/index.htm");
});
app.get("/index.htm", function(req, res){
    res.sendFile(__dirname + "/views/index.htm");
});
app.get("/Code.html", function(req, res){
    res.sendFile(__dirname + "/views/code.html");
});
app.get("/personalWebsite.html", function(req, res){
    res.sendFile(__dirname + "/views/personalWebsite.html");
});
app.get("/foodmachineSoftware.html", function(req, res){
    res.sendFile(__dirname + "/views/foodmachineSoftware.html");
});
app.get("/covid19Prioritzer.html", function(req, res){
    res.sendFile(__dirname + "/views/covid19Prioritzer.html");
});
app.get("/dataTree.html", function(req, res){
    res.sendFile(__dirname + "/views/dataTree.html");
});
app.get("/Travel.html", function(req, res){
    res.sendFile(__dirname + "/views/Travel.html");
});
app.get("/Feedback.html", function(req, res){
    res.sendFile(__dirname + "/views/Feedback.html");
});

app.post("/submit", urlencodedParser, function(req, res){

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
            user: 'markusovichcodes@gmail.com', pass: 'Alexmom99'
        }
    });
    
    var mailOptions1 = {
        from: 'markusovichcodes@gmail.com',
        to: info.email,
        subject: 'Thanks for visiting my website! - Simon Markus',
        text: `(automated message powered by nodemailer)

Dear ${info.first} ${info.last}, thank you for your feedback! 

Simon Markus @ https://simon-website.herokuapp.com/



Contact:
Simon Markus
simon.markus9@gmail.com
217-480-5323
`
    };

    var mailOptions2 = {
        from: 'noreply@markusovichcodes.com',
        to: 'markusovichcodes@gmail.com',
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
    res.sendFile(__dirname + "/views/PostFeedback.html");
});

app.listen(port, function(req, res) {
    console.log(`Listening to requests on http://localhost:${port}`);
});