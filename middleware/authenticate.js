var {con} = require('./../db/db');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');
  if(!token){
	  res.status(401).send({status:0});
      return
  }	  
  var user=req.body.user;
  con.query("select * from users where token='"+token+"' and user='"+user+"'", function (err, result) {
		if (err) throw console.log(err);
		console.log("fff "+result.length)
		if(result.length>0)
			next()
		else
			res.status(401).send({status:0});
	})


  
};

var checkDomain = (req, res, next) => {
  var token = req.header('x-auth');
  console.log("22 "+token)
  var domain=req.body.domain;
  console.log(domain)
  con.query("select * from domains where domain='"+domain+"' and cust_id=(select id from users where token='"+token+"')", function (err, result) {
		if (err) throw res.status(401).send();
		console.log(result);
		if(result.length>0){
			console.log("found")
			next()
			
		}
		else{
			console.log("not found")
			res.status(401).send();
		}
	})


  
};





module.exports = {authenticate,checkDomain};
