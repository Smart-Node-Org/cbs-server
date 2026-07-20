var multer = require('multer');
var {con,smart} = require('./../db/db');
var fs=require("fs")
var store={}

var storageOne = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, req.dir)
    },
    filename: function (req, file, cb) {
        if(req.ext)
            req.file_path=req.file_path+file.originalname.substring(file.originalname.lastIndexOf("."))
        cb(null, req.file_path  )
    }
})
store.uploadOne = multer({ storage: storageOne })

var storageMulti= multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, req.dir)
    },
    filename: function (req, file, cb) {
        if(!req.file_pathes)
            req.file_pathes=[]
        if(req.ext)
             req.file_pathes.push(req.pathes[req.file_pathes.length]+file.originalname.substring(file.originalname.lastIndexOf(".")))
         else
            req.file_pathes.push(req.pathes[req.file_pathes.length])
        cb(null, req.file_pathes[req.file_pathes.length-1]  )
    }
})
store.uploadMulti = multer({ storage: storageMulti })

var storageTrainer= multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/var/www/atc-edu.com/html/data/users/')
    },
    filename: function (req, file, cb) {
        if(!req.filePaths)
            req.filePaths=[]
        req.filePaths.push(Date.now()+ '_' +file.originalname.substring(file.originalname.lastIndexOf(".")))
        cb(null, req.filePaths[req.filePaths.length-1]  )
    }
})
store.uploadTrainer = multer({ storage: storageTrainer })

var storageCourseImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/var/www/atc-edu.com/html/data/courses/')
    },
    filename: function (req, file, cb) {
        req.img_path=Date.now()+ '_' +file.originalname.substring(file.originalname.lastIndexOf("."))
       console.log("We are moving the image ...")
        cb(null, req.img_path  )
    }
})
store.uploadCourseImage = multer({ storage: storageCourseImage })

var storageSpecImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/var/www/atc-edu.com/html/data/spec/')
    },
    filename: function (req, file, cb) {
        req.img_path=Date.now()+ '_' +file.originalname.substring(file.originalname.lastIndexOf("."))
        cb(null, req.img_path  )
    } // aliabbas.jpg
})
store.uploadSpecImage = multer({ storage: storageSpecImage })

var storageStudentImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/var/www/atc-edu.com/html/data/students/')
    },
    filename: function (req, file, cb) {
        req.img_path=Date.now()+ '_' +file.originalname.substring(file.originalname.lastIndexOf("."))
        cb(null, req.img_path  )
    } // aliabbas.jpg
})
store.uploadStudentImage = multer({ storage:storageStudentImage})

var storageTrainerImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/var/www/atc-edu.com/html/data/users/')
    },
    filename: function (req, file, cb) {
        req.img_path=Date.now()+ '_' +file.originalname.substring(file.originalname.lastIndexOf("."))
        cb(null, req.img_path  )
    } // aliabbas.jpg
})
store.uploadTrainerImage = multer({ storage:storageTrainerImage})

var storageTrainerCV = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/var/www/atc-edu.com/html/data/users/')
    },
    filename: function (req, file, cb) {
        req.cv_path=Date.now()+ '_' +file.originalname.substring(file.originalname.lastIndexOf("."))
        cb(null, req.cv_path  )
    }
})
store.uploadTrainerCV = multer({ storage:storageTrainerCV})

var storageLectureVidePart = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/var/www/atc-edu.com/html/video/'+req.body.video_path_id+"/")
    },
    filename: function (req, file, cb) {
        req.cv_path='part' +req.body.part_num
        cb(null, req.cv_path  )
    }
})
store.uploadLectureVidePart = multer({ storage:storageLectureVidePart})

var storageCoursePart  = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/var/www/atc-edu.com/html/data/courses/')
    },
    filename: function (req, file, cb) {
        req.cv_path=req.body.id+  '_' +req.body.part_num
        cb(null, req.cv_path  )
    }
})
store.uploadCoursePart = multer({ storage:storageCoursePart})

var storageLectureVideSubtitle = multer.diskStorage({
    destination: function (req, file, cb) {
        con.query(`insert into courses_videos(course_lecture_id,title,body,video_time,isBonus) values('${req.body.course_lecture_id}','${req.body.title}','${req.body.body}','${req.body.video_time}','${req.body.isBonus}')`,function(err,result){
            con.query(`select id,created from courses_videos where course_lecture_id='${req.body.course_lecture_id}' order by id desc limit 1`,function(err,result1){
                if(err) return console.log("95 "+err)
                req.course_video_id=result1[0].id
                req.created=result1[0].id
                if(!req.body.path)
                    var q=`insert into video_pathes(course_video_id,lang,total_parts,hasSubtitle,hash,completed,length,path) values('${result1[0].id}','${req.body.lang}','${req.body.total_parts}','1','${req.body.hash}','${req.body.total_parts}','${req.body.length}','${req.body.path}')`
                else
                    var q=`insert into video_pathes(course_video_id,lang,total_parts,hasSubtitle,hash) values('${result1[0].id}','${req.body.lang}','${req.body.total_parts}','${req.body.hasSubtitle}','${req.body.hash}')`
                con.query(q,function(err,result){
                    con.query(`select id from video_pathes where course_video_id=${result1[0].id} order by id desc limit 1`,function (err,result) {
                        req.video_path_id=result[0].id
                        if(!req.body.path) {
                            req.body.path = result[0].id
                            fs.mkdir(`/var/www/atc-edu.com/html/video/${result[0].id}`, function (err) {
                                if (err) {
                                    return console.log("105 " + err);
                                }
                                cb(null, `/var/www/atc-edu.com/html/video/${req.body.path}`)
                            })
                        }
                        else
                            cb(null, `/var/www/atc-edu.com/html/video/${req.body.path}`)
                    })



                })
            })
        })



    },
    filename: function (req, file, cb) {
        req.cv_path='subtitle' +file.originalname.substring(file.originalname.lastIndexOf("."))
        cb(null, req.cv_path  )
    }
})
store.uploadLectureVideSubtitle = multer({ storage:storageLectureVideSubtitle})

var storageElibraryImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/var/www/atc-edu.com/html/data/elib/')
    },
    filename: function (req, file, cb) {
        req.file_path=Date.now()+ '_' +file.originalname.substring(file.originalname.lastIndexOf("."))
        cb(null, req.file_path  )
    } // aliabbas.jpg
})
store.uploadElibraryImage= multer({ storage: storageElibraryImage })

var storageWorkshop = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/var/www/atc-edu.com/html/data/workshops/')
    },
    filename: function (req, file, cb) {
        if(!req.filePaths)
            req.filePaths=[]
        req.filePaths.push(Date.now()+ '_' +file.originalname.substring(file.originalname.lastIndexOf(".")))
        cb(null, req.filePaths[req.filePaths.length-1]  )
    }//iabbas.jpg
})
store.uploadWorkshop= multer({storage: storageWorkshop})



module.exports=store
