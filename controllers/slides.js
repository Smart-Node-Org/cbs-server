var { con } = require('./../db/db');
const utils = require('../utils/utils');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs')
const { RSA_NO_PADDING } = require('constants');
const { result } = require('lodash');
const { query } = require('express');
// const {compact} = require('lodash');
var slide = {}

//insert into slides (img, title_en, title_ar, body_en, body_ar, shown) values ('${req.body.img}','${req.body.title_en}','${req.body.tile_ar}','${req.body.body_en}','${req.body.body_ar}','${req.body.shown}')
slide.AddSlide = function (req, res) {
  utils.saveSingle(req, 'img', "/var/www/smart-node.net/html/data/cbs/slides/" + Date.now()).then(function (loc) {
    if (loc) {
      con.query(`insert into slides (img, title_en, title_ar, body_en, body_ar) values ('${loc}','${req.body.title_en}','${req.body.title_ar}','${req.body.body_en}','${req.body.body_ar}')`, function (err, result) {
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

slide.getAllSlides = function (req, res) {
  con.query(`select * from slides`, function (err, result) {
    if (err) {
      console.log(err + "31");
    } else {
      res.send({ status: true, data: result })
    }
  })
}


slide.removeSlide = function (req, res) {
  con.query(`delete from slides where id = '${req.body.id}'`, function (err, result) {
    if (err) {
      console.log(err + "31");
    } else {
      res.send({ status: true, data: [] })
    }
  })
}

slide.ShowSlide = function (req, res) {
  console.log(req.body)
  con.query(`update slides set shown = '${req.body.shown}'`, function (err, result) {
    if (err) {
      console.log(err + "86");
    } else {
      res.send({ status: true })
    }
  })
}



slide.updateSlide = function (req, res) {
  utils.saveSingle(req, 'img', "/var/www/smart-node.net/html/data/cbs/slides/" + Date.now()).then(function (loc) {
    con.query(`SELECT img from slides where id=${req.body.id}`, function (err, result) {
      if (err) {
        console.log("34 " + err)
        return res.send({ status: false, msg: "Problem in replacing the image" })
      } else {

        if (result.length > 0) {
          try {
            var x = `/var/www/smart-node.net/html/data/cbs/slides/${result[0].img}`
            x = x.replace(/"/g, "")
            fs.unlinkSync(x)
          } catch (e) {
            console.log("988 " + e)
          }
          var newLoc = req.body.id + "_" + loc
          try {
            fs.renameSync("/var/www/smart-node.net/html/data/cbs/slides/" + loc, "/var/www/smart-node.net/html/data/cbs/slides/" + newLoc)
          } catch (e) {
            return console.log("1015 " + e)
          }
          con.query(`update slides set img='${newLoc}',title_en='${req.body.title_en}',title_ar='${req.body.title_ar}',body_en='${req.body.body_en}',body_ar='${req.body.body_ar}',title_en='${req.body.title_en}' where id=${req.body.id}`, function (err, result) {
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

module.exports = slide
