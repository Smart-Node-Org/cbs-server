const express = require('express');
const bodyParser = require('body-parser');
const clearkey = require('./clearkey')
const fs = require("fs")

const cors = require('cors')

const app = express();

var server = app.listen(7000,function(){
 console.log("server started");
});

app.use(function(request, response, next) {
//	console.log(request)
	//console.log(response)
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  response.header("Access-Control-Expose-Headers", "X-Auth");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,X-Auth");
  next();
});

app.use(bodyParser.json());
app.set('json spaces', 2);
app.options('/get_content_key',function(req,res,nex){
	console.log("requesting options")
	response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  response.header("Access-Control-Expose-Headers", "X-Auth");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,X-Auth");
  next();
	next()
})
app.get('/get_content_key', (req, res) => {
        console.log(req.header('some-header'));
    try {
    //    let response = clearkey.getContentKey(request);
        res.json({
    "keys": [{
        "kid": "syb4lbaiTMWk3HCZVygFnA",
        "k": "YX2KElooTfSOPGsYZjSKPw",
        "kty": "oct"
    }]
});
    }
    catch (e) {
        res.status(400).send({ error: e });
    }
})

app.get('/get_hls', (req, res) => {
        console.log(req.header('some-header'));
		console.log(req.body);
    try {
    
	   var key=fs.readFileSync("/var/www/atc-edu.com/html/video/test/key.bin")
	   res.set('Content-Type', 'application/octet-stream').send(key);
    }
    catch (e) {
        res.status(400).send({ error: e });
    }
})

app.options('/get_license',cors())
app.post('/get_license',cors(), (req, res) => {
	let request = req.body;
    try {
        let response = clearkey.getLicense(request);
        res.json(response);
    }
    catch (e) {
        res.status(400).send({ error: e });
    }
})

module.exports = app


