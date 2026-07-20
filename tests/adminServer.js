const fs = require('fs');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const http = require('http');
const path = require('path');
var {authenticateCust,authenticateDrive} = require('./middleware/authenticate');
var {Drive,Cust,pro,driverCat,carCat,Users} = require('./db/mongoose');
const cors = require('cors');
var RateLimit = require('express-rate-limit');


var app = express();

var user = new Users({user:"admin",pass:"admin1234",type:"admin"});
  
  user.save().then(() => {
	  
	  
	  console.log(user);
    
  })

//app.use('/api/', apiLimiter);
app.use(cors());
app.use(function(req, res, next) {
        res.header("Access-Control-Expose-Headers", "X-Auth");
		res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        next();
    });

app.use(bodyParser.json());

app.post('/new/regUser', (req, res) => {
   
	console.log(req.body);
	
  var body = _.pick(req.body, ['user','pass']);
  console.log(body);
  var user = new Users(body);
  
  user.save().then(() => {
	  
	  
	  console.log(user);
    
  }).then(() => {
	 
    res.header('x-auth', user.tokens[0].token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
  


});





// app.post('/new/regDrive',createAccountLimiter, (req, res) => {
   
  // var body = _.pick(req.body, ['name','tel', 'pass','type','car','ref']);
  // console.log(body);
  // var user = new Drive(body);
  
  // user.save().then(() => {
	  // console.log(user);
    
  // }).then(() => {
	 // fs.writeFile('/var/www/atc-edu.com/html/images/'+body.tel+'d', req.body.imgData, function (err) {
    // if (err) 
        // return console.log(err);
    // console.log('Wrote Hello World in file helloworld.txt, just check it'); 
	
	// });
    // res.header('x-auth', user.tokens[0].token).send(user);
  // }).catch((e) => {
    // res.status(400).send(e);
  // })
  


// });

// app.delete('/api/logoutCust', authenticateCust, (req, res) => {
	// console.log("")
  // req.user.removeToken(req.token).then(() => {
    // res.status(200).send();
  // }, () => {
    // res.status(400).send();
  // });
// });

// app.delete('/api/logoutDrive', authenticateDrive, (req, res) => {
	// console.log("")
  // req.user.removeToken(req.token).then(() => {
    // res.status(200).send();
  // }, () => {
    // res.status(400).send();
  // });
// });

// app.post('/api/loginCust', (req, res) => {
  // var body = _.pick(req.body, ['tel', 'pass']);

  // Cust.findByCredentials(body.tel, body.pass).then((user) => {
	  
    // return user.generateAuthToken().then((u) => {
		// console.log(u);
		// var body = _.pick(req.body, ['tel', 'pass']);
      // res.header('x-auth', u.tokens[0].token).send({name:u.name,img:u.img});
    // });
  // }).catch((e) => {
	  
    // res.status(400).send(e);
  // });
// });

// app.post('/api/loginDrive', (req, res) => {
  // var body = _.pick(req.body, ['tel', 'pass']);

  // Drive.findByCredentials(body.tel, body.pass).then((user) => {
	  
    // return user.generateAuthToken().then((u) => {
		// console.log(u);
		// var resp = _.pick(u, ['name', 'type','car']);
      // res.header('x-auth', u.tokens[0].token).send(resp);
    // });
  // }).catch((e) => {
	  
    // res.status(400).send(e);
  // });
// });

// app.post('/api/conDrive', authenticateDrive, (req, res) => {
	// Drive.findByIdAndUpdate(req.user._id, { connected: req.body.connect },
    // function(){
	
		// res.send({status:1});
		
// });
// })
app.listen(3020,function(){
	console.log("Server started");
});

module.exports = {app};

