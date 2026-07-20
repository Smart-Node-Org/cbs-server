var { con } = require('../db/db');
const utils = require('../utils/utils');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs')
const { RSA_NO_PADDING } = require('constants');
const { result } = require('lodash');
const { query } = require('express');
// const {compact} = require('lodash');
var news = {}

//insert into news (img, title_en, title_ar, body_en, body_ar, shown) values ('${req.body.img}','${req.body.title_en}','${req.body.tile_ar}','${req.body.body_en}','${req.body.body_ar}','${req.body.shown}')
news.AddNews = function (req, res) {
  utils.saveSingle(req, 'img', "/var/www/smart-node.net/html/data/cbs/news/" + Date.now()).then(function (loc) {
    if (loc) {
      console.log(req.body)
      var q = `insert into news (img, title_en, title_ar, body_en, body_ar,created) values ('${loc}','${req.body.title_en}','${req.body.title_ar}','${req.body.body_en}','${req.body.body_ar}',${req.body.created?"'"+req.body.created+"'":",now()"})`
      console.log(q)
      con.query(q, function (err, result) {
        if (err) {
          console.log("90" + err)
          return res.send({ status: false, msg: "Failed at the last step please contact technical support 988" })
        }
        res.send({ status: true, img: loc });
      });
    }
    else res.send({ status: false, msg: "you are to do access something you are not allowed to" });
  })
}

news.getAllNews = function (req, res) {
  con.query(`select * from news ORDER BY news.created  ASC`, function (err, result) {
    if (err) {
      console.log(err + "31");
    } else {
      res.send({ status: true, data: result })
    }
  })
}


news.removeNews = function (req, res) {
  con.query(`delete from news where id = '${req.body.id}'`, function (err, result) {
    if (err) {
      console.log(err + "31");
    } else {
      res.send({ status: true, data: [] })
    }
  })
}

news.ShowNews = function (req, res) {
  console.log(req.body)
  con.query(`update news set shown = '${req.body.shown}' where id = '${req.body.id}'`, function (err, result) {
    if (err) {
      console.log(err + "86");
    } else {
      res.send({ status: true })
    }
  })
}



news.updateNews = function (req, res) {
  utils.saveSingle(req, 'img', "/var/www/smart-node.net/html/data/cbs/news/" + Date.now()).then(function (loc) {
    con.query(`SELECT img from news where id=${req.body.id}`, function (err, result) {
      if (err) {
        console.log("34 " + err)
        return res.send({ status: false, msg: "Problem in replacing the image" })
      } else {

        if (result.length > 0) {
          try {
            var x = `/var/www/smart-node.net/html/data/cbs/news/${result[0].img}`
            x = x.replace(/"/g, "")
            fs.unlinkSync(x)
          } catch (e) {
            console.log("988 " + e)
          }
          var newLoc = req.body.id + "_" + loc
          try {
            fs.renameSync("/var/www/smart-node.net/html/data/cbs/news/" + loc, "/var/www/smart-node.net/html/data/cbs/news/" + newLoc)
          } catch (e) {
            return console.log("1015 " + e)
          }
          con.query(`update news set img='${newLoc}',title_en='${req.body.title_en}',title_ar='${req.body.title_ar}',body_en='${req.body.body_en}',body_ar='${req.body.body_ar}',title_en='${req.body.title_en}' where id=${req.body.id}`, function (err, result) {
            if (err) {
              console.log("90" + err)
              return res.send({ status: false, msg: "Failed at the last step please contact technical support 988" })
            } else {
              res.send({ status: true, img: newLoc })
            }
          })
        } else {
          res.send({ status: false, msg: "you are to do access something you are not allowed to" })
        }
      }
    })
  })
}


news.getOneNews = function (req, res) {
  con.query(`select * from news where id = '${req.body.id}'`, function (err, result) {
    if (err) {
      console.log(err + "104");
    } else {
      res.send({ status: true, data: result })
    }
  })
}

module.exports = news
