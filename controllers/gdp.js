var { con } = require("./../db/db");
const utils = require("../utils/utils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { RSA_NO_PADDING } = require("constants");
const { result } = require("lodash");
const { query } = require("express");
// const {compact} = require('lodash');
var gdp = {};
// {main_title:"Health",sub:["inter","hym","sdfsd"]}
gdp.addGdpDepartment = function (req, res) {
    console.log(req.body);
    con.query(
        `insert into gdp_main(title) values('${req.body.main_title}')`,
        function (err, result) {
            if (err) {
                console.log("9 " + err);
            } else {
                con.query(
                    `select id from gdp_main where title='${req.body.main_title}' GROUP BY(id) desc limit 1`,
                    function (err, result1) {
                        if (err) {
                            console.log("14 " + err);
                        } else {
                            req.id = result1[0].id;
                            console.log(req.id);
                            req.body.sub_titles.forEach(function (title) {
                                con.query(
                                    `insert into gdp_sub (gdp_main_id,title) values ('${req.id}','${title}')`,
                                    function (err, result) {
                                        if (err) {
                                            console.log(err + "31");
                                        } else {
                                            console.log("sucsess");
                                        }
                                    }
                                );
                            });
                            res.send({
                                status: true,
                                id: req.id,
                                title: req.body.main_title,
                            });
                        }
                    }
                );
            }
        }
    );
};

gdp.addNewYearGdp = function (req, res) {

    con.query(`select id from gdp_main_annual where year = '${req.body.year}' and gdp_main_id = '${req.body.gdp_main_id}' `, function (err, result) {

        if (err) {
            console.log(err + "58");
        } else {
            if (result.length > 0) {
                con.query(
                    `update gdp_main_annual set tot_gdp ='${req.body.tot_gdp}' where gdp_main_id = '${req.body.gdp_main_id}' and year = '${req.body.year}'`,
                    function (err, result) {
                        if (err) {
                            console.log(err + "42");
                        } else {
                            res.send({ status: true, data: [] });
                            console.log("update addNewYearGdp");
                        }
                    }
                );

            } else {
                con.query(
                    `insert into gdp_main_annual (gdp_main_id,tot_gdp,year) values ('${req.body.gdp_main_id}','${req.body.tot_gdp}','${req.body.year}')`,
                    function (err, result) {
                        if (err) {
                            console.log(err + "42");
                        } else {
                            res.send({ status: true, data: [] });
                            console.log("addNewYearGdp");
                        }
                    }
                );
            }
        }

    })

};

// gdp.getCities = function(req, res)  {
//   con.query(`select * from cities`, (err, result) => {
//     if (err) {
//       console.log(err + "44");
//     } else {
//       res.send({
//         status: true,
//         data: result
//       })
//     }
//   })
// }

gdp.addGdpYear = function (req, res) {
    con.query(`select year from gdp_annual where year = '${req.body.year}'`,function(err,result) {
        if(err){
            console.log(err+"108");
        }else{
            if(result.length>0){
                req.body.values.forEach(function (state) {
                    console.log(state);
                    state.Subs.forEach(function (sub) {
                        con.query(
                            `update gdp_annual set gdp_sub_id = ${sub.id},state = ${state.id},value = '${sub.value}' where year = '${req.body.year}' and gdp_sub_id = '${sub.id}' and state = '${state.id}'`,
                            function (err, result) {
                                if (err) {
                                    console.log(err + "120");
                                } else {
                                    console.log("sucsess update");
                                }
                            }
                        );
                    });
                });
            }else{
                req.body.values.forEach(function (state) {
                    console.log(state);
                    state.Subs.forEach(function (sub) {
                        con.query(
                            `insert into gdp_annual(gdp_sub_id,state,value,year) values(${sub.id},${state.id},${sub.value},'${req.body.year}')`,
                            function (err, result) {
                                if (err) {
                                    console.log(err + "134");
                                } else {
                                    console.log("sucsess insert");
                                }
                            }
                        );
                    });
                });
            }
        }
    })
    
    res.send({
        status: true,
        data: [],
    });
};

gdp.getGdpTotal = function (req, res) {
    con.query(
        `SELECT  DISTINCT gdp_main.id as main_id ,gdp_main.title as main_title,
  (SELECT json_arrayagg(json_object('id',id,'title',title)) from gdp_sub WHERE gdp_main_id =main_id ) as sub,
  (SELECT json_arrayagg(json_object('years',cast(year as char),'total_gdp',tot_gdp)) from gdp_main_annual WHERE gdp_main_id =main_id
  )as years
  from gdp_main_annual 
  JOIN gdp_main on gdp_main.id = gdp_main_annual.gdp_main_id
  
`,
        function (err, result) {
            if (err) {
                console.log(err + "60");
            } else {
                res.send({
                    status: true,
                    data: result,
                });
            }
        }
    );
};

gdp.AddState = function (req, res) {
    console.log(req.body);
    con.query(
        `INSERT INTO states(name,long_itude,lat_itude,address,tell,email) VALUES ('${req.body.name}' , ${req.body.long_itude},${req.body.lat_itude},'${req.body.address}','${req.body.tell}', '${req.body.email}')`,
        function (err, result) {
            if (err) {
                console.log(err + "90");
            } else {
                res.send({ status: true });
            }
        }
    );
};

gdp.getAllStates = function (req, res) {
    con.query(`select * from states`, function (err, result) {
        if (err) {
            console.log(err + "100");
        } else {
            res.send({ status: true, data: result });
        }
    });
};

gdp.updateState = function (req, res) {
    con.query(
        `update states set name='${req.body.name}', address='${req.body.address}'${req.body.long_itude?',long_itude='+req.body.long_itude:''}${req.body.lat_itude?',lat_itude='+req.body.lat_itude:''},tell='${req.body.tell}', email='${req.body.email}' where id='${req.body.id}'`,
        function (err, result) {
            if (err) {
                console.log(err + "111");
            } else {
                res.send({ status: true, data: [] });
            }
        }
    );
};

gdp.removeState = function (req, res) {
    con.query(
        `delete from states where id = '${req.body.id}'`,
        function (err, result) {
            if (err) {
                console.log(err + "120");
            } else {
                res.send({ status: true });
            }
        }
    );
};

gdp.getGdbYearMain = function (req, res) {
    console.log(req.body);
    con.query(
        `select  states.id as state_id,name as state,
    (select json_arrayagg(json_object("value",value,"gdb_annual_id",id,"gdp_sub_id",gdp_sub_id)) from gdp_annual where gdp_annual.year = '${req.body.year}' and state=state_id and gdp_sub_id in (select id from gdp_sub where gdp_main_id='${req.body.main_id}' )) as sub 
    from states
    inner JOIN gdp_annual on gdp_annual.state = states.id
    GROUP by states.id`,
        function (err, result) {
            if (err) {
                console.log(err + "60");
            } else {
                res.send({
                    status: true,
                    data: result,
                });
            }
        }
    );
};

gdp.deleteGdbAnnual = function (req, res) {
    console.log(req.body);
    con.query(
        `delete from gdp_annual where state = '${req.body.id}' `,
        function (err, result) {
            if (err) {
                console.log(err + "162");
            } else {
                res.send({ status: true, data: result });
            }
        }
    );
};

gdp.removeGdbTotal = function (req, res) {
    con.query(
        `delete from gdp_main where id = '${req.body.main_id}'`,
        function (err, result) {
            if (err) {
                console.log(err + "145");
            } else {
                res.send({ status: true, data: [] });
            }
        }
    );
};
gdp.updateGdpValue=function(req,res){
    console.log(req.body);
    con.query(`update gdp_main_annual set tot_gdp = '${req.body.total_gdp}'where gdp_main_id = '${req.body.main_id}' and year = '${req.body.years}'`,function (err,result) {
        if (err) {
            console.log(err+"250");
        } else {
            res.send({status:true,data:[]})
            console.log("updateGdpValue");
        }
    })
}
gdp.updateGDPState=function (req,res) {
    console.log(req.body)
    con.query(`update gdp_annual set value = '${req.body.value}' where gdp_sub_id = '${req.body.gdp_sub_id}' and id = '${req.body.gdb_annual_id}' and state= '${req.body.state_id}' and year = '${req.body.year}'`,function (err,result) {
      if (err) {
          console.log(err+"260");
      } else {
          res.send({status:true,data:[result]})
      }
    })
}
gdp.GDPYears=function (req,res) {
    con.query(`select DISTINCT year from gdp_annual`,function (err,result) {
        if (err) {
            console.log(err+"269");
        } else {
            res.send({status:true,data:result})
        }
    })
}
// dick to floor
module.exports = gdp;
