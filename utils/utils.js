var XLSXChart = require("xlsx-chart");

var { con } = require("./../db/db");
const fs = require("fs");
var pdf = require("pdf-creator-node");
const axios = require("axios");
const spawn = require("child_process").spawn;
const https = require("https");
//const { PDFNet } = require('@pdftron/pdfnet-node');
const PDFMerger = require("pdf-merger-js");
const exec = require("child_process").exec;
var btoa = require("btoa");
var atob = require("atob");
var multiparty = require("multiparty");
var moment = require("moment");
global.navigator = { appName: "nodejs" }; // fake the navigator object
global.window = {}; // fake the window object
const JSEncrypt = require("jsencrypt").default;
const uuidv1 = require("uuid/v1");

var IO;
var maxRetries = 5;

var utils = {};
utils.sendSms = function (tel, body) {
  return new Promise(function (resolve, reject) {
    axios({
      method: "post",
      url: "http://196.1.217.85:7070/bulk_client/api/send_sms.php",
      data: {
        sender_name: "ATC",
        phones: tel,
        username: "smartnode",
        password: "12258407",
        message: body,
      },
    })
      .then(function (response) {
        resolve(true);
      })
      .catch(function (e) {
        console.log(e);
        resolve(false);
      });
  });
};
utils.makeid = function () {
  var text = "";
  var possible = "0123456789";
  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};
function msToString(y) {
  y = parseInt(y);
  var h = "00";
  if (y >= 3600000) h = Math.floor(y / 3600000);
  if (h < 10) h = "0" + h;
  y = y % 3600000;
  var m = "00";
  if (y >= 60000) m = Math.floor(y / 60000);
  if (m < 10) m = "0" + m;
  y = y % 60000;
  var s = "00";
  if (y >= 1000) s = Math.floor(y / 1000);
  if (s < 10) s = "0" + s;
  y = y % 1000;
  return `${h}:${m}:${s}.${y}`;
}
function timeConverter(x) {
  var arr = x.split(":");
  var h = parseInt(arr[0]);
  var m = parseInt(arr[1]);
  var s = parseInt(arr[2].substr(0, arr[2].indexOf(".")));
  var ms = arr[2].substring(arr[2].indexOf(".") + 1);
  if (ms.length == 1) ms = ms + "00";
  else if (ms.length == 2) ms = ms + "0";

  ms = parseInt(ms);
  return ms + s * 1000 + m * 60000 + h * 3600000;
}
function findTime(path_id) {
  return new Promise(function (resolve, reject) {
    console.log("/var/www/atc-edu.com/html/video/" + path_id + "/video.mp4");
    var start = spawn("mp4info", [
      "/var/www/atc-edu.com/html/video/" + path_id + "/video.mp4",
    ]);
    start.stdout.on("data", (data) => {
      var duIndex = data.indexOf("duration");
      console.log(
        parseInt(data.toString().substring(duIndex + 12, duIndex + 18))
      );
      resolve(parseInt(data.toString().substring(duIndex + 12, duIndex + 18)));
    });
    start.stderr.on("data", (data) => {
      console.log("mp4info has error. " + data);
    });
  });
}
utils.$on = function (socket, event, callback) {
  socket.on(event, function () {
    callback();
    socket.emit(event + "_ack");
  });
};
utils.$emit = function (socket, event, data, callback) {
  var tries = 0;
  var timer;
  function temp() {
    socket.emit(event, data);
    socket.once(event + "_ack", function (data) {
      clearTimeout(timer);
      if (callback) callback(data);
    });
    timer = setTimeout(function () {
      if (tries < maxRetries) {
        ++tries;
        temp();
      }
    }, 3000);
  }
};
utils.escape_str = function (str) {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
    switch (char) {
      case "\0":
        return "\\0";
      case "\x08":
        return "\\b";
      case "\x09":
        return "\\t";
      case "\x1a":
        return "\\z";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case '"':
      case "'":
      case "\\":
      case "%":
        return "\\" + char;
    }
  });
};

utils.start_session = function (user_id, socket, ip, country, info) {
  console.log("info from utils");
  console.log(info.data);
  con.query(
    `INSERT INTO  sessions (socket_id , user_id, ip ,location ,client_os_name,client_os_version,client_browser_name,client_browser_version,client_device)  VALUES ('${socket.id}','${user_id}' , '${ip}' ,'${country}','${info.data.os_name}','${info.data.os_version}','${info.data.browser_name}','${info.data.browser_version}','${info.data.device}') `,
    function (err, result) {
      if (err) {
        console.log("154 " + err);
      } else {
        console.log("session created");
        con.query(`select id from sessions where socket_id = '${socket.id}' order by id desc limit 1`,function(err,result){
          if(err){
            console.log(err = "159");
          }else{
            session_id = result[0].id;
            console.log("162 visit_id sent")
            socket.emit("visit_id",{session_id:session_id})
          }
        })
      }
    }
  );
};

utils.end_session = function (socket_id) {
  con.query(
    `update sessions set finish_time= CURRENT_TIMESTAMP where socket_id='${socket_id}'`,
    function (err, result) {
      if (err) console.log("327 " + err);
    }
  );
};
utils.get_session_ids = function (user_id) {
  return new Promise(function (resolve, reject) {
    con.query(
      `select socket_id from sessions where user_id=${user_id} and finish_time is null`,
      function (err, result) {
        if (err) {
          console.log("334 " + err);
          resolve(false);
        }
        if (result.length == 0) resolve(false);
        else resolve(result);
      }
    );
  });
};
utils.setIo = function (io) {
  IO = io;
};
utils.getIo = function () {
  return IO;
};
utils.saveMulti = function (req, filesField, path_start) {
  return new Promise(function (resolve, reject) {
    var locs = [];
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
      utils.proccessReqBody(req, fields);
      if (err) return console.log("472 " + err);
      var pathes = [];
      if (files[filesField] && files[filesField].length > 0) {
        files[filesField].forEach(function (file, index) {
          pathes.push(
            `/var/www/smart-node.net/html/data/cbs/${path_start}_${Date.now() + index}`
          );
        });
        files[filesField].forEach(function (file, index) {
          try {
            fs.renameSync(
              file.path,
              pathes[index] + file.path.substring(file.path.lastIndexOf("."))
            );
            locs.push(
              pathes[index].substring(
                pathes[index].includes("/")
                  ? pathes[index].lastIndexOf("/") + 1
                  : 0
              ) + file.path.substring(file.path.lastIndexOf("."))
            );
          } catch (e) {
            console.log("483 " + e);
            resolve(false);
          }
        });
        resolve(locs);
      } else resolve([]);
    });
  });
};
// utils.saveSingle=function(req,fileField,path,doNotRename){
// 	return new Promise(function (resolve,reject) {
// 		var form = new multiparty.Form()
// 		form.parse(req, function(err, fields, files) {
// 		    console.log(fields)
//             console.log(files)
// 			utils.proccessReqBody(req,fields)
// 			var loc
// 			var file=files[fileField][0]
// 			if(err) return console.log("489 "+err)
// 			try{
// 			    if(!doNotRename) {
//                     fs.renameSync(file.path, path + file.path.substring(file.path.lastIndexOf(".")))
//                     loc = path.substring(path.includes('/') ? path.lastIndexOf("/") + 1 : 0) + file.path.substring(file.path.lastIndexOf("."))
//                 }
// 			    else {
//                     fs.renameSync(file.path, path + file.path.substring(file.path.lastIndexOf("/")))
//                     loc = file.path.substring(file.path.lastIndexOf("/"))
//                 }

// 			}catch (e) {
// 				console.log("494 "+e)
// 				resolve(false)
// 			}
// 			resolve(loc)
// 		})
// 	})
// }
utils.saveSingle=function(req,fileField,path,doNotRename){
  console.log("path",path)
  return new Promise(function (resolve,reject) {
    var form = new multiparty.Form()
    form.parse(req, function(err, fields, files) {
      console.log(fields)
      console.log(files)
      utils.proccessReqBody(req,fields)
      var loc
      var file=files[fileField][0]
      if(err) return console.log("489 "+err)
      try{
        if(!doNotRename) {
          fs.renameSync(file.path, path + file.path.substring(file.path.lastIndexOf(".")))
          loc = path.substring(path.includes('/') ? path.lastIndexOf("/") + 1 : 0) + file.path.substring(file.path.lastIndexOf("."))
        }
        else {
          fs.renameSync(file.path, path + file.path.substring(file.path.lastIndexOf("/")))
          loc = file.path.substring(file.path.lastIndexOf("/"))
        }

      }catch (e) {
        console.log("494 "+e)
        resolve(false)
      }
      resolve(loc)
    })
  })
}
utils.proccessReqBody = function (req, fields) {
  req.body = {};
  for (key in fields) req.body[key] = fields[key][0];
};
utils.uploadParts = function (req, res, table, path) {
  return new Promise(function (resolve, reject) {
    if (req.body) {
      con.query(
        `select hash,total_parts,completed_parts from ${table} where id=${req.body.id}`,
        function (err, result) {
          if (err) {
            console.log("523 " + err);
            res.send({
              status: false,
              msg: "Unexpected error occurred during the process",
            });
            reject(false);
          } else {
            if (result.length == 0) {
              res.send({
                status: false,
                msg: "Please start the proccess again",
              });
              reject(false);
            } else if (result[0].hash == req.body.hash) {
              res.send({
                status: true,
                completed_parts: result[0].completed_parts,
              });
              resolve("check");
            } else {
              res.send({
                status: false,
                msg: "File does not match the old one",
              });
              reject(false);
            }
          }
        }
      );
    } else {
      utils.saveSingle(req, "file", path + Date.now()).then(function (loc) {
        fs.renameSync(
          path + loc,
          `${path}${req.body.id}_part${req.body.part_num}`
        );
        con.query(
          `update ${table} set completed_parts=${req.body.part_num}+1 where id=${req.body.id}`,
          function (err, result) {
            if (err) {
              console.log("550 " + err);
              res.send({ status: false, msg: "Failed to upload part 550" });
              reject(false);
            }
            console.log(req.body.part_num, req.body.total_parts);
            if (req.body.part_num >= req.body.total_parts - 1) {
              console.log("assembling ...");
              var newLoc = Date.now();
              fs.writeFileSync(
                `${path}${req.body.id}_${newLoc}${loc.substring(
                  loc.lastIndexOf(".")
                )}`,
                ""
              );
              for (let i = 0; i < req.body.total_parts; i++) {
                // Append Write to File
                fs.appendFileSync(
                  `${path}${req.body.id}_${newLoc}${loc.substring(
                    loc.lastIndexOf(".")
                  )}`,
                  fs.readFileSync(
                    `/var/www/html/data/${req.body.video_path_id}/part${i}`
                  )
                );
                // Delete chunk used this time
                console.log("Done is " + i);
                try {
                  fs.unlinkSync(`${path}${req.body.id}_part${i}`);
                } catch (e) {
                  console.log("566 " + e);
                }
              }
              res.send({ status: true, data: [] });
              resolve("finished");
            } else {
              res.send({ status: true, data: [] });
              resolve("part");
            }
          }
        );
      });
    }
  });
};

utils.createCpiSudanSectionChart = function (x) {
  console.log("hi");
  var xlsxChart = new XLSXChart();
  console.log(x);
  return new Promise(function (resolve, reject) {
    var data = {
      urban_standard: {},
      urban_ongoing: {},
      rural_standard: {},
      rural_ongoing: {},
    };
    var fields = [];
    x.forEach(function (i) {
      fields.push(i.year);
      data.urban_standard[i.year] = i.urban_standard;
      data.urban_ongoing[i.year] = i.urban_ongoing;
      data.rural_standard[i.year] = i.rural_standard;
      data.rural_ongoing[i.year] = i.rural_ongoing;
    });
    //var path=Date.now()
    var opts = {
      //file: path+".xlsx",
      chart: "column",
      titles: [
        "urban_standard",
        "urban_ongoing",
        "rural_standard",
        "rural_ongoing",
      ],
      fields: fields,
      data: data,
    };
    xlsxChart.generate(opts, function (err, data) {
      if (err) resolve(false);
      else resolve(data);
    });
  });
};

utils.createGdpSudanChart = function (x) {
  var xlsxChart = new XLSXChart();

  return new Promise(function (resolve, reject) {
    var titles = [];
    var years = {};
    x.forEach(function (i) {
      titles.push(i.main_title);

      i.years = JSON.parse(i.years);
      years[i.main_title] = { chart: "line" };
      i.years.forEach(function (j) {
        years[i.main_title][j.years] = j.total_gdp;
      });
    });
    var fields = [];
    x[0].years.forEach(function (i) {
      fields.push(i.years);
    });
    // var path=Date.now()
    var opts = {
      titles: titles,
      fields: fields,
      data: years,
      // file: path+".xlsx"
    };
    xlsxChart.generate(opts, function (err, data) {
      if (err) resolve(false);
      else resolve(data);
    });
  });
};

utils.createForiegnTradeSudanChart = function (x) {
  var xlsxChart = new XLSXChart();

  return new Promise(function (resolve, reject) {
    var data = { export: {}, import: {}, re_export: {} };
    var fields = [];
    x.forEach(function (i) {
      fields.push(i.year);
      data.export[i.year] = i.export;
      data.import[i.year] = i.import;
      data.re_export[i.year] = i.re_export;
    });
    //var path=Date.now()
    var opts = {
      //file: path+".xlsx",
      chart: "column",
      titles: ["export", "re_export", "import"],
      fields: fields,
      data: data,
    };
    xlsxChart.generate(opts, function (err, data) {
      if (err) resolve(false);
      else resolve(data);
    });
  });
};

utils.convertForiegnProductsToJson=function (req,res){
  utils.saveSingle(req, 'file', "/var/www/smart-node.net/html/data/cbs/convert/" + Date.now()).then(function (loc) {
     exec(`python convertForiegnProductsToJson.py /var/www/smart-node.net/html/data/cbs/convert/${loc}`,
         function (error, stdout, stderr){
              fs.unlinkSync("/var/www/smart-node.net/html/data/cbs/convert/"+loc)
              if(error){
                console.log("498 "+err)
                console.log("498 "+stderr.toString())
                return res.send({status:false,msg:"Try another file"})
              }
              res.send({status:true,data:JSON.parse(stdout.toString())})
         })
  })
}
utils.convertPopulationToJson=function (req,res){
  utils.saveSingle(req, 'file', "/var/www/smart-node.net/html/data/cbs/convert/" + Date.now()).then(function (loc) {
     exec(`python convertPopulationToJson.py /var/www/smart-node.net/html/data/cbs/convert/${loc}`,
         function (error, stdout, stderr){
              fs.unlinkSync("/var/www/smart-node.net/html/data/cbs/convert/"+loc)
              if(error){
                console.log("498 "+err)
                console.log("498 "+stderr.toString())
                return res.send({status:false,msg:"Try another file"})
              }
              res.send({status:true,data:JSON.parse(stdout.toString())})
         })
  })
}
utils.convertCpiInflationSudanToJson=function (req,res){
  utils.saveSingle(req, 'file', "/var/www/smart-node.net/html/data/cbs/convert/" + Date.now()).then(function (loc) {
     exec(`python convertCpiInflationSudanToJson.py /var/www/smart-node.net/html/data/cbs/convert/${loc}`,
         function (error, stdout, stderr){
              fs.unlinkSync("/var/www/smart-node.net/html/data/cbs/convert/"+loc)
              if(error){
                console.log("498 "+err)
                console.log("498 "+stderr.toString())
                return res.send({status:false,msg:"Try another file"})
              }
              res.send({status:true,data:JSON.parse(stdout.toString())})
         })
  })
}
module.exports = utils;
