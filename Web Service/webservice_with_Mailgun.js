var express = require("express");
var bodyParser = require("body-parser");
var http=require("http");
var querystring = require('querystring');
var fs=require("fs");
var app = express();
var validator = require('validator');
var Mailgun = require('mailgun-js');
//Your api key
var api_key = 'MAILGUN-API-KEY';
//Your domain
var domain = 'YOUR-DOMAIN.com';
var emailnotvalid=[];


  app.use(bodyParser.urlencoded({ extended: true })); 
  app.use(bodyParser.json());
  app.post("/ReceiveJSON", function(request, response) {
    console.log(request.body.length);
    var verif=true;
    for(var i=0 ; i<request.body.length; i++)
    {
      if(((request.body[i]["to"] == undefined )||(request.body[i]["to"].length == 0))||((request.body[i]["subject"] == undefined )||(request.body[i]["subject"].length == 0 )) || ((request.body[i]["text"] == undefined )||(request.body[i]["text"].length == 0 ))){
    console.log("email is not fine");
    verif=false;
    response.send("400");
    break;
    }
 }
 if(verif==true)
 {
  response.send("code :200 and waiting for sending emails");
   for(var i=0 ; i<request.body.length; i++)
    {
      if(validator.isEmail(request.body[i]["to"])){
 //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var data = {
    //Specify email data
      from: "postbote@mycasavi.com",
    //The email to contact
      to: request.body[i]["to"],
    //Subject and text data  
      subject: request.body[i]["subject"],
      html: request.body[i]["text"]
    }

    //Invokes the method to send emails given the above data with the helper library
    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
            res.render('error', { error : err});
            console.log("got an error: ", err);
        }
        //Else we can greet    and leave
        else {
            //Here "submitted.jade" is the view file for this landing page 
            //We pass the variable "email" from the url parameter in an object rendered by Jade
            res.render('submitted', { email : req.params.mail });
            console.log(body);
        }
    });
    }
    else {
      console.log("email are not valide");
      emailnotvalid.push(request.body[i]);

      console.log(emailnotvalid);

    }
 }
fs.writeFile('notvalidemails.json', JSON.stringify(emailnotvalid), function (err) {
  if (err) return console.log(err);
  console.log('look in your repository you will find json file which contain emails not valid');
});
}
const server = http.createServer(app).listen(3000, function(request, response,err) {
  if (err) {
    console.log(err);
  } else {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Server listening on ${host}:${port}`);
  }
});