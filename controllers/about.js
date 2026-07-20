var { con } = require("./../db/db");
const utils = require("../utils/utils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { RSA_NO_PADDING } = require("constants");
const { result } = require("lodash");
const { query } = require("express");
var about = {};

about.getOurMission = (req, res) => {
  //   console.log("getOurMission");
  //   console.log("");
  //   console.log(req.body);
  con.query(
    `SELECT mission ,missionar FROM info  WHERE id =1`,
    function (err, result) {
      if (err) {
        console.log(err + "19");
      } else {
        res.send({
          status: true,
          data: result,
        });
      }
    }
  );
};

about.updateOurMission = (req, res) => {
  //   console.log("updateOurMission");
  //   console.log("");
  //   console.log(req.body);

  con.query(
    `UPDATE info SET mission = '${req.body.mission}' , missionar ='${req.body.missionar}'  WHERE id =1`,
    function (err, result) {
      if (err) {
        console.log(err + "19");
      } else {
        res.send({
          status: true,
        });
      }
    }
  );
};

about.getOurVision = (req, res) => {
  //   console.log("getOurVision");
  //   console.log("");
  //   console.log(req.body);
  con.query(
    `SELECT Vision,visionar FROM info  WHERE id =1`,
    function (err, result) {
      if (err) {
        console.log(err + "19");
      } else {
        res.send({
          status: true,
          data: result,
        });
      }
    }
  );
};

about.updateOurVision = (req, res) => {
  //   console.log("updateOurVision");
  //   console.log("");
  //   console.log(req.body);

  con.query(
    `UPDATE info SET vision = '${req.body.Vision}' , visionar = '${req.body.Visionar}' WHERE id =1`,
    function (err, result) {
      if (err) {
        console.log(err + "19");
      } else {
        res.send({
          status: true,
        });
      }
    }
  );
};
about.getOurGoal = (req, res) => {
  //   console.log("getOurGoal");
  //   console.log("");
  //   console.log(req.body);
  con.query(
    `SELECT goal ,goalar FROM info  WHERE id =1`,
    function (err, result) {
      if (err) {
        console.log(err + "19");
      } else {
        res.send({
          status: true,
          data: result,
        });
      }
    }
  );
};
about.updateOurGoal = (req, res) => {
  //   console.log("updateOurGoal");
  //   console.log("");
  //   console.log(req.body);

  con.query(
    `UPDATE info SET goal = '${req.body.goal}' , goalar = '${req.body.goalar}' WHERE id =1`,
    function (err, result) {
      if (err) {
        console.log(err + "19");
      } else {
        res.send({
          status: true,
        });
      }
    }
  );
};
about.getDepartments = (req, res) => {
  con.query(
    `SELECT * FROM cbs_departments
  `,
    function (err, result) {
      if (err) {
        console.log(err + "19");
      } else {
        res.send({
          status: true,
          data: result,
        });
      }
    }
  );
};
about.getPermissions = (req, res) => {
  con.query(
    `SELECT * FROM permissions
  `,
    function (err, result) {
      if (err) {
        console.log(err + "147");
      } else {
        res.send({
          status: true,
          data: result,
        });
      }
    }
  );
};
about.addOrganiztionChart = (req, res) => {
  console.log("addOrganiztionChart");
  console.log("");
  utils.saveSingle(req, "img", '/var/www/smart-node.net/html/data/cbs/organiztion/' + Date.now()).then(function (pathes) {
    con.query(
      `INSERT INTO organiztion_chart (img,name,position_job) VALUES ('${pathes}','${req.body.name}','${req.body.position_job}') `,
      function (err, result) {
        if (err) {
          console.log("12 " + err);
          try {
            fs.unlinkSync("/var/www/smart-node.net/html/data/cbs/organiztion/" + pathes);
            res.send({
              status: false,
              msg: "organiztionchart already exists !",
            });
          } catch (err) {
            return console.log("149" + err);
          }
        } else {
          res.send({ status: true });
        }
      }
    );
  });
};
about.getOrganiztionChart = (req, res) => {
  console.log("getOrganiztionChart");
  con.query(`SELECT * from organiztion_chart`, function (err, result) {
    if (err) {
      console.log(err + "19");
    } else {
      res.send({
        status: true,
        data: result,
      });
    }
  });
};
about.updateOrganiztionChart = (req, res) => {
  con.query(`update organiztion_chart SET  name ='${req.body.name}',position_job='${req.body.position_job}' where id = '${req.body.id}' `, function (err, result) {
    if (err) {
      console.log("72059" + err)
      return res.send({ status: false, msg: "Failed at the last step please contact technical support 988" })
    }
    res.send({ status: true })
  })
};
about.updateOrganiztionChartWithImage = (req, res) => {
  utils.saveSingle(req, "image", "/var/www/smart-node.net/html/data/cbs/organiztion/").then(function (loc) {
    console.log("loc",loc)
    con.query(`select img from organiztion_chart where id = '${req.body.id}'`, function (err, result) {
      if (err) {
        console.log(err + " 186");
        return res.send({ status: false, msg: "Problem in replacing the image" })
      } else {
        if (result.length > 0) {
          try {
            var x = `/var/www/smart-node.net/html/data/cbs/organiztion/${result[0].img}`
            x = x.replace(/"/g, "")
            fs.unlinkSync(x)
          } catch (e) {
            console.log("1195 " + e)
          }
          var newLoc = req.body.id + "_" + loc
          console.log("newLoc",newLoc)
          try {
            fs.renameSync("/var/www/smart-node.net/html/data/cbs/organiztion/" + loc, "/var/www/smart-node.net/html/data/cbs/organiztion/" + newLoc)
          } catch (e) {
            return console.log("1015 " + e)
          }
          con.query(`update organiztion_chart SET img='${newLoc}',name ='${req.body.name}',position_job='${req.body.position_job}' where id = '${req.body.id}' `, function (err, result) {
            if (err) {
              console.log("72059" + err)
              return res.send({ status: false, msg: "Failed at the last step please contact technical support 988" })
            }
            res.send({ status: true, img: newLoc })
          })
        }
      }
    })
  });
};
module.exports = about;
