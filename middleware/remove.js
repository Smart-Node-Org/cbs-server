var {con} = require('./../db/db');
var fs = require("fs")
var remove={}
remove.delCourseImage=function(req,res,next){
	console.log(req.body)
	con.query("select img from courses where id="+req.body.course_id,function(err,result){
		if(err){
			console.log("8 "+err)
			return res.send({status:false,msg:err})
		}
		try {
			fs.unlinkSync('/var/www/atc-edu.com/html/data/courses/' + result[0].img)
		}catch(e) {

		}
		next()
	})

}
remove.delStudentImage=function(req,res,next){
	con.query("select img from students_users where id="+req.body.id,function(err,result){
		if(err){
			res.send({status:false,msg:"Image Not Found"})
			return console.log(err)
		}

		if(result[0].img){
			try{
				fs.unlinkSync('/var/www/atc-edu.com/html/data/students/'+result[0].img )
			}catch(e) {

			}
		}
		next()
	})

}
remove.delTrainerImage=function(req,res,next){
	console.log(req.body)
	con.query("select img from trainers where id="+req.body.id,function(err,result){
		if(err){
			res.send({status:false,msg:"Image Not Found"})
			return console.log(err)
		}

		if(result[0].img){
			try{
				fs.unlinkSync('/var/www/atc-edu.com/html/data/users/'+result[0].img )
			}catch(e) {

			}
		}
		next()
	})
}
remove.delTrainerCV=function(req,res,next){
	console.log(req.body)
	con.query("select cv from trainers where id="+req.body.id,function(err,result){
		if(err){
			res.send({status:false,msg:"CV Not Found"})
			return console.log(err)
		}

		if(result[0].cv){
			try{
				fs.unlinkSync('/var/www/atc-edu.com/html/data/users/'+result[0].cv )
			}catch(e) {

			}
		}
		next()
	})

}
remove.delWorkshopImage=function(req,res,next){
	con.query("select img from workshops where id="+req.body.id,function(req,result){
		try {
			fs.unlinkSync('/var/www/atc-edu.com/html/data/workshops/' + result[0].img)
		}catch (e) {
			
		}
		next()
	})

}


module.exports=remove