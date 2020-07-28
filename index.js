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
app.get("/Code.html", function(req, res){
    res.sendFile(__dirname + "/views/Code.html");
});
app.get("/personalWebsite.html", function(req, res){
    res.sendFile(__dirname + "/views/personalWebsite.html");
});
app.get("/foodmachineSoftware.html", function(req, res){
    res.sendFile(__dirname + "/views/foodmachineSoftware.html");
});
app.get("/covid19Prioritizer.html", function(req, res){
    res.sendFile(__dirname + "/views/covid19Prioritizer.html");
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

    const { MongoClient } = require("mongodb");
 
    // Replace the following with your Atlas connection string                                                                                                                                        
    const url = "mongodb+srv://markusovich:Alexmom99@cluster0.enna3.mongodb.net/websiteDatabase?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true";
    const client = new MongoClient(url);

    // The database to use
    const dbName = "websiteDatabase";

    async function run() {
        try {
            await client.connect();

            const db = client.db(dbName);
   
            // Use the collection "feedback"
            const col = db.collection("feedback");

            var ifExists = col.countDocuments({phone: info.phone, first: info.first, last: info.last}, { limit: 1 });
            ifExists.then(function(value) {
                if(value == 1){
                    res.sendFile(__dirname + "/views/PostFeedbackReturn.html");
                }
                else{
                    res.sendFile(__dirname + "/views/PostFeedback.html");
                }
            });
   
            // Insert a single document, wait for promise so we can read it back
            const p = await col.insertOne(info);

            var num = col.estimatedDocumentCount();
            num.then(function(value) {
        
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
Your submission is the ${value}th recorded.
            
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
        
            });

        } catch (err) {
            console.log(err.stack);
        }
        finally {
            await client.close();
        }
    }

    run().catch(console.dir);

    /*

    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://markusovich:Alexmom99@cluster0.enna3.mongodb.net/websiteDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {

        const collection = client.db("websiteDatabase").collection("feedback");

        var ifExists = collection.countDocuments({phone: info.phone, first: info.first, last: info.last}, { limit: 1 });
        ifExists.then(function(value) {
            if(value == 1){
                res.sendFile(__dirname + "/views/PostFeedbackReturn.html");
            }
            else{
                res.sendFile(__dirname + "/views/PostFeedback.html");
            }
        });

        collection.insertOne(info);

        var num = collection.estimatedDocumentCount();
        num.then(function(value) {
    
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
Your submission is the ${value+1}th recorded.
        
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
    
        });
    });
    client.close();

    */

});

app.listen(port, function(req, res) {
    console.log(`Listening to requests on http://localhost:${port}`);
});