'use strict';

var nodemailer = require("nodemailer");
var nconf = require('nconf');
nconf.argv().env().file({ file: 'local.json' });
var mailuser = nconf.get('mailuser'); 
var mailpass = nconf.get('mailpass');
// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: mailuser,
        pass: mailpass
    }
});



// send mail with defined transport object
exports.send = function(client, msg){
// setup e-mail data with unicode symbols
var mailOptions = {
    from: "client ✔ <"+mailuser+">", // sender address
    to: "dellitours@gmail.com", // list of receivers  dellitours
    subject: "Mensaje de "+client+" ✔", // Subject line
    text: msg, // plaintext body
    html: "<p>"+msg+"</p>" // html body
}  
smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }

    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
});
};