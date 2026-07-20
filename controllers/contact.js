var { con } = require("./../db/db");
const utils = require("../utils/utils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { RSA_NO_PADDING } = require("constants");
const { result } = require("lodash");
const { query } = require("express");
var contact = {};

contact.insertContactUs = function(req,res){
    var q=`INSERT INTO contact_us(name,email,subject,message,state_id)
     VALUES ('${req.body.name}','${req.body.email}','${req.body.subject}','${req.body.message}','${req.body.id}')`
    
    con.query(q,function(err,result){
        if(err){
            console.log(err+'14')
            res.send({status:false,msg:"Cannot post contact. you can contact us at +249925777109"})
            }else{
                res.send({status:true,data:result})
            }
    }) 

}

contact.getContact= function(req,res){
   
    con.query(`SELECT *,states.name as S_name FROM contact_us INNER JOIN states ON contact_us.state_id=states.id`,function(err,result){
        if(err){
            console.log(err+'14')
            }else{
                res.send({status:true,data:result})
            }
    })  
}

module.exports = contact;
