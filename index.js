var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var nodemailer = require('nodemailer');

var app = express();
var port = process.env.PORT || "8080";

app.use(express.static(path.join(__dirname, "public")));
var urlencodedParser = bodyParser.urlencoded( { extended: false } );

app.get("/", function(req, res){
    res.sendFile(__dirname + "/views/index.htm");
});
app.get("/index.htm", function(req, res){
    res.sendFile(__dirname + "/views/index.htm");
});
app.get("/Work.html", function(req, res){
    res.sendFile(__dirname + "/views/Work.html");
});
app.get("/personalWebsite.html", function(req, res){
    res.sendFile(__dirname + "/views/personalWebsite.html");
});
app.get("/EDA.html", function(req, res){
    res.sendFile(__dirname + "/views/EDA.html");
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

    const { MongoClient } = require("mongodb");
    const client = new MongoClient("mongodb+srv://markusovich:Alexmom99@cluster0.enna3.mongodb.net/websiteDatabase?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true");

    async function run() {
        try {
            await client.connect();

            const db = client.db("websiteDatabase");
   
            const collection = db.collection("feedback");

            var ifExists = await collection.countDocuments({phone: info.phone, first: info.first, last: info.last}, { limit: 1 });
            if(ifExists == 1){
                res.sendFile(__dirname + "/views/PostFeedbackReturn.html");
            }
            else{
                res.sendFile(__dirname + "/views/PostFeedback.html");
            }
   
            await collection.insertOne(info);

            var num = await collection.estimatedDocumentCount();
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'markusovichcodes@gmail.com', 
                    pass: 'Alexmom99'
                }
            });
        
            var mailOptions1 = {
                from: 'markusovichcodes@gmail.com',
                to: info.email,
                subject: 'Thanks for visiting my website! - Simon Markus',
                text: `(automated message powered by nodemailer)
    
Dear ${info.first} ${info.last}, thank you for your feedback!
Your submission is the ${num}th recorded.
            
Simon Markus @ https://simon-website.herokuapp.com/
            
            
            
Contact:
Simon Markus
simon.markus9@gmail.com
217-480-5323
`
            };
    
            var mailOptions2 = {
                from: 'markusovichcodes@gmail.com',
                to: 'markusovichcodes@gmail.com',
                subject: 'Website Feedback From ' + info.first + ' ' + info.last,
                text: `${info.first} ${info.last} (${info.email} - ${info.phone}) left a comment on your website: 
    
            "${info.comment}"`
            };
        
            transporter.sendMail(mailOptions1);
            transporter.sendMail(mailOptions2);

        } catch (err) {
            console.log(err.stack);
        }
        finally {
            await client.close();
        }
    }

    run().catch(console.dir);

});

app.listen(port, function(req, res) {
    console.log(`Listening to requests on http://localhost:${port}`);
});