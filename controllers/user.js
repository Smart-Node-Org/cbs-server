var { con } = require("./../db/db");
const utils = require("../utils/utils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const WhichBrowser = require("which-browser");

const fs = require("fs");
const { RSA_NO_PADDING } = require("constants");
const { result } = require("lodash");
const { query } = require("express");
var user = {};

user.insertNewUser = (req, res) => {
  console.log("insertNewUser");
  console.log(req.body);
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.pass, salt, function (err, hash) {
      con.query(
        `insert into users(name,user,pass) values('${req.body.name}','${req.body.user}','${hash}')`,
        function (err, result) {
          if (err) {
            console.log("12 " + err);
            try {
              res.send({ status: false, msg: "User already exists !" });
            } catch (err) {
              return console.log("18 " + err);
            }
          } else {
            con.query(
              `SELECT id FROM users ORDER BY id  DESC LIMIT 1`,
              function (err, result1) {
                if (err) {
                  console.log(err + "31");
                } else {
                  req.body.department_ids.forEach((id) => {
                    con.query(
                      `INSERT INTO user_permissions (user_id,department_id) VALUES ( '${result1[0].id}','${id}') `,
                      function (err, result) {
                        if (err) {
                          console.log(err + "31");
                        } else {
                          // res.send({ status: true });
                        }
                      }
                    );
                  });
                  res.send({ status: true });
                }
              }
            );
          }
        }
      );
    });
  });
};

user.getAllUsers = (req, res) => {
  console.log("getAllUsers");
  con.query(
    `SELECT users.id,users.name,users.user,users.created As joinDate,users.updated,json_arrayagg(json_object('title',permissions.title)) as departments
FROM users 
LEFT JOIN user_permissions on users.id = user_permissions.user_id
LEFT JOIN permissions  on permissions .id = user_permissions.department_id
where user != 'admin' GROUP by users.id;`,
    function (err, result) {
      if (err) {
        console.log(err + "70");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};

user.deleteUser = (req, res) => {
  console.log("deleteUser");
  con.query(
    `DELETE FROM users WHERE id = ${req.body.id}`,
    function (err, result) {
      if (err) {
        console.log(err + "85");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};

user.editUser = (req, res) => {
  console.log("editUser");
  console.log(req.body.pass)
  if(req.body.pass)
  {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.pass, salt, function (err, hash)
    {
  con.query(
    `UPDATE users SET name='${req.body.name}',user='${req.body.user}',pass='${hash}',updated = CURRENT_TIMESTAMP WHERE id = ${req.body.id}`,
    function (err, result) {
      if (err) {
        console.log(err + "99");
      } else {
        con.query(
          `delete from user_permissions where user_id=${req.body.id}`,
          function (err, resul) {
            if (err) {
              console.log("1111 " + err);
              return res.send({
                status: false,
                msg: "Failed to delete old permissions",
              });
            }
            req.body.departments.forEach(function (department_id) {
              con.query(
                `INSERT INTO user_permissions(user_id, department_id) VALUES ('${req.body.id}','${department_id}')`,
                function (err, result) {
                  if (err) {
                    console.log(err + "106");
                  } else {
                  }
                }
              );
            });
            res.send({ status: true, data: result });
          }
        );
      }
    }
  );
  })
})
  }
else
{
  con.query(
    `UPDATE users SET name='${req.body.name}',user='${req.body.user}',updated = CURRENT_TIMESTAMP WHERE id = ${req.body.id}`,
    function (err, result) {
      if (err) {
        console.log(err + "99");
      } else {
        con.query(
          `delete from user_permissions where user_id=${req.body.id}`,
          function (err, resul) {
            if (err) {
              console.log("1111 " + err);
              return res.send({
                status: false,
                msg: "Failed to delete old permissions",
              });
            }
            req.body.departments.forEach(function (department_id) {
              con.query(
                `INSERT INTO user_permissions(user_id, department_id) VALUES ('${req.body.id}','${department_id}')`,
                function (err, result) {
                  if (err) {
                    console.log(err + "106");
                  } else {
                  }
                }
              );
            });
            res.send({ status: true, data: result });
          }
        );
      }
    }
  );
}
};

user.login = function (req, res) {
  let date_ob = new Date();
  console.log(date_ob);
  console.log(req.body);

  var user = req.body.user;
  var pass = req.body.pass;

  console.log(req.body);
  if (!user || !pass) {
    res.send({ status: false, msg: "INCOMPLETE" });
    return;
  }

  con.query(
    `SELECT id 
    from users
    WHERE user = '${user}'`,
    function (err, result) {
      // console.log(result + "user exsist");
      if (result.length > 0) {
        if (err) {
          console.log(err);

          res.status(401).send({ status: 0 });
          return;
        } else {
          // console.log(result);
          con.query(
            `SELECT users.id as uuser_id,name , pass , user ,created,updated ,
            (SELECT json_arrayagg(department_id) FROM user_permissions 
            WHERE user_id = (SELECT id from users WHERE user = '${user}')
            ) as permissions FROM users WHERE user= '${user}'
            `,
            function (err, result1) {
              if (err) {
                console.log(err);
              } else if (result && result.length > 0) {
                // console.log(result1);
                bcrypt.compare(pass, result1[0].pass, (err, resp) => {
                  if (resp) {
                    // var token = jwt.sign({_id: user, access:"auth"}, 'atcsmart').toString();
                    // res.header('x-auth', token).send(resp);
                    delete result1[0].pass;

                    res.send({ status: true, data: result1[0] });
                  } else {
                    res.send({
                      status: 0,
                      msg: "Wrong Password 1",
                    });
                  }
                });
              } else {
                res.send({ status: 0, msg: "Wrong Username or Password" });
              }
            }
          );
        }
      } else {
        res.send({ status: 0, msg: "Wrong Username or Password" });
      }
    }
  );
};

user.getuserinfo = (req, res) => {
  console.log("visitor ");
  const result = new WhichBrowser(req.headers);
  var info = {};
  info.os_name = result.os.name.toString();
  info.os_version = result.os.version.toString();
  info.browser_name = result.browser.name.toString();
  info.browser_version = result.browser.version.toString();
  if (result.isMobile()) info.device = result.device.toString();
  else info.device = "Desktop";
  console.log(info);
  res.send({ status: true, data: info });
};

user.getVisitorsInfo = (req, res) => {
  console.log("getVisitorsInfo");
  con.query(`select (select json_arrayagg(json_object("location",location,"count",g)) from (SELECT count(*) g,location from sessions group by location) tmp) as per_country,
(select json_arrayagg(json_object("day",day,"count",f)) from (SELECT count(*) f,weekday(start_time) day from sessions group by weekday(date(start_time))) tmp2) as per_day,
(select json_arrayagg(json_object("month",month,"count",f)) from (SELECT count(*) f,month(start_time) month from sessions group by month(start_time)) tmp2) as per_month,
(select count(*) from sessions) as tot,(select count(*) from sessions where finish_time is null) as online`,
    function (err, result) {
      if (err) {
        console.log(err + "211");
      } else {
        res.send({ status: true, data: result });
        console.log(result);
      }
    }
  );
};
module.exports = user;
