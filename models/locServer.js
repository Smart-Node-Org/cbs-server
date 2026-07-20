
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const http = require('http');
const path = require('path');
var {authenticateCust,authenticateDrive} = require('./middleware/authenticate');
const socketIO = require('socket.io');
var {Drive,Cust,pro} = require('./db/mongoose');
const cors = require('cors');




var app = express();


app.use(cors());
app.use(function(req, res, next) {
        res.header("Access-Control-Expose-Headers", "X-Auth");
        next();
    });

app.use(bodyParser.json());

app.post('/api/updateDrive',authenticateDrive, (req, res) => {
   
  //var body = _.pick(req.body, ['lat', 'long']);
  console.log(req);
  
   Drive.findByIdAndUpdate(req.user._id, { loc: [req.body.long,req.body.lat] },
function(){
	Drive.findById(req.user._id, function (err, doc) {
		if(doc){
		   res.send(doc);
		   
		}
		else
		res.status(404).send();
		
		});
		
});
  

  


});




app.post('/api/getDrive', (req, res) => {
   
  var body = _.pick(req.body, ['lat', 'long']);
  console.log(req);
  
   Drive.find({
        loc: {
            $near: [body.long,body.lat],
            $maxDistance: 0.006278449
        }
     }).limit(10).exec(function(err, locations) {
      if (err) {
        return res.send({status:0});
      }
       console.log(locations);
      res.json({status:1,locations});
    });
		

  

  


});


app.listen(3005,function(){
	console.log("Server started");
});

module.exports = {app};

