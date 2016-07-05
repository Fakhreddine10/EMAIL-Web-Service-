var express = require("express");
var bodyParser = require("body-parser");
var http=require("http");
var querystring = require('querystring');
var fs=require("fs");
var app = express();
var validator = require('validator');
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
    console.log("sending email");
    }
    else {
      console.log("email are not valide");
      emailnotvalid.push(request.body[i]);

      console.log(emailnotvalid);

    }
 }
fs.writeFile('notvalidemails.json', JSON.stringify(emailnotvalid), function (err) {
  if (err) return console.log(err);
  console.log('look in your repository you will find json file which contain emails not valid if there is some email adress not valid');
});
}
});

const server = http.createServer(app).listen(3000, function(request, response,err) {
  if (err) {
    console.log(err);
  } else {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Server listening on ${host}:${port}`);
  }
});

