var { con } = require('./../db/db');
const utils = require('../utils/utils');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs')
const { RSA_NO_PADDING } = require('constants');
const { result } = require('lodash');
const { query } = require('express');
// const {compact} = require('lodash');
var pub = {}

pub.AddPublication = function (req, res) {
  utils.saveMulti(req, 'files', "publications/").then(function (pathes) {
    console.log(req.body)
    console.log(pathes);
    if (pathes) {
      req.pathes = pathes
      con.query(`insert into publications (title,title_ar, img, file, year, department) values('${req.body.title}','${req.body.title_ar}','${pathes[1]}','${pathes[0]}','${req.body.year}','${req.body.department}')`, function (err, result) {
        if (err) {
          console.log("19 " + err)
          if (req.pathes) {
            req.pathes.forEach(function (file) {
              try {
                fs.unlinkSync('/var/www/smart-node.net/html/data/cbs/publications' + file)
              } catch (e) {
                console.log("890 " + e)
              }
            })
          }
          console.log("error");
          return res.send({ status: false, msg: "Problem in file insertion 893" })
        }
        else {
          res.send({ status: true, data: [] })
          console.log("AddPublication");
        }
      })
    }
    else
      res.send({ status: false, msg: "Problem in uploading the files. try again if the problem exists please contact technical support" })
  })
}

pub.AddDepartmentPublication=function (req,res) {
  con.query(`insert into departments_publications (title) values ('${req.body.title}')`,function(err,result){
    if (err) {
      console.log(err+"47");
    } else {
      res.send({status:true,data:[]})
    }
  })
}

pub.deleteDepartment=function (req,res) {
  con.query(`delete from departments_publications where id = '${req.body.id}'`,function(err,result){
    if (err) {
      console.log(err+"47");
    } else {
      res.send({status:true,data:[]})
    }
  })
}

pub.getAllDepartments=function (req,res) {
  con.query(`select * from departments_publications`,function(err,result){
    if (err) {
      console.log(err+"47");
    } else {
      res.send({status:true,data:result})
    }
  })
}


pub.getAllPublications = function (req, res) {
  con.query(`select publications.*,dp.title as department_title from publications join departments_publications dp on dp.id = publications.department order by title desc`, function (err, result) {
    if (err) {
      console.log(err + "46");
    } else {
      res.send({ status: true, data: result })
    }
  })
}

pub.removePublication = function (req, res) {
  con.query(`delete from publications where id = '${req.body.id}' `, function (err, result) {
    if (err) {
      console.log(err + "55");
    } else {
      res.send({ status: true, data: [] })
    }
  })
}

pub.updatePublicationImg = function (req, res) {
  utils.saveSingle(req, 'file', "/var/www/smart-node.net/html/data/cbs/publications/" + Date.now()).then(function (loc) {
    con.query(`SELECT img from publications where id=${req.body.id}`, function (err, result) {
      if (err) {
        console.log("66 " + err)
        return res.send({ status: false, msg: "Problem in replacing the image" })
      }
      if (result.length > 0) {
        try {
          var x = `/var/www/smart-node.net/html/data/cbs/publications/${result[0].img}`
          x = x.replace(/"/g, "")
          fs.unlinkSync(x)
        } catch (e) {
          console.log("988 " + e)
        }
        var newLoc = req.body.id + "_" + loc
        try {
          fs.renameSync("/var/www/smart-node.net/html/data/cbs/publications/" + loc, "/var/www/smart-node.net/html/data/cbs/publications/" + newLoc)
        } catch (e) {
          return console.log("1015 " + e)
        }
        con.query(`update publications set img="${newLoc}" where id=${req.body.id}`, function (err, result) {
          if (err) {
            console.log("90" + err)
            return res.send({ status: false, msg: "Failed at the last step please contact technical support 988" })
          }
          res.send({ status: true, img: newLoc })
        })
      }
      else res.send({ status: false, msg: "you are to do access something you are not allowed to" })

    })
  })
}

pub.updatePublicationFile = function (req, res) {
  utils.saveSingle(req, 'file', "/var/www/smart-node.net/html/data/cbs/publications/" + Date.now()).then(function (loc) {
    con.query(`SELECT file from publications where id=${req.body.id}`, function (err, result) {
      if (err) {
        console.log("66 " + err)
        return res.send({ status: false, msg: "Problem in replacing the image" })
      }
      if (result.length > 0) {
        try {
          var x = `/var/www/smart-node.net/html/data/cbs/publications/${result[0].file}`
          x = x.replace(/"/g, "")
          fs.unlinkSync(x)
        } catch (e) {
          console.log("988 " + e)
        }
        var newLoc = req.body.id + "_" + loc
        try {
          fs.renameSync("/var/www/smart-node.net/html/data/cbs/publications/" + loc, "/var/www/smart-node.net/html/data/cbs/publications/" + newLoc)
        } catch (e) {
          return console.log("1015 " + e)
        }
        con.query(`update publications set file="${newLoc}" where id=${req.body.id}`, function (err, result) {
          if (err) {
            console.log("90" + err)
            return res.send({ status: false, msg: "Failed at the last step please contact technical support 988" })
          }
          res.send({ status: true, file: newLoc })
        })
      }
      else res.send({ status: false, msg: "you are to do access something you are not allowed to" })

    })
  })
}

pub.updatePublicationData = function (req, res) {
  con.query(`update publications set title='${req.body.title}' , title_ar='${req.body.title_ar}', year='${req.body.year}', department='${req.body.department}' where id = '${req.body.id}' `, function (err, result) {
    if (err) {
      console.log(err + "137");
    } else {
      res.send({ status: true, data: [] })
    }
  })
}

pub.downloadPublication = function(req, res){

  console.log("downloadPublication api ..");
  console.log(req);
  var file_format;
  if(req.body.file.endsWith('pdf')){
    file_format = 2
  }else if(req.body.file.endsWith('docx')){
    file_format = 1
  }else if(req.body.file.endsWith('xlsx')){
    file_format = 0
  }else{
    file_format = 3;
  }
  con.query(`insert into visitors_exports (session_id,title,dept_id,format) values ('${req.body.visit_id}','${req.body.title}','${req.body.id}','${file_format}')`,function(err,result){
    if(err){
      console.log('191'+ err);
    }else{
      res.send({status:true,data:[]});
    }
  })
}

pub.getAllDownloadedPublications = function(req, res){
  con.query(`select (SELECT json_arrayagg(json_object("book_name",temp.title,"count",book_count,"department",dp.title,"publication_format",format))  FROM (select format,dept_id,title, count(*) as book_count from visitors_exports GROUP by visitors_exports.title) as temp JOIN departments_publications as dp on temp.dept_id = dp.id ) as book_count,(SELECT json_arrayagg(json_object("dept_name",departments_publications.title,"count",dept_count)) FROM (select dept_id, count(*) as dept_count from visitors_exports GROUP by dept_id) as temp join departments_publications on temp.dept_id = departments_publications.id ) as dept_count`,function(err,result){
    if(err){
      console.log(err + "201")
      res.send({status:false,data:[]})
    }else{
      res.send({status:true,data:result})
    }
  })
}



module.exports = pub
