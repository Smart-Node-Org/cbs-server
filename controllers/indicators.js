var { con } = require("./../db/db");
const utils = require("../utils/utils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { result } = require("lodash");
const { query } = require("express");
var indicators = {};

indicators.addIndicatorType = (req, res) => {
  console.log("addIndicatorType");
  console.log(req.body);
  con.query(
    `INSERT INTO indicator_types (title,title_ar,department_id) VALUES ('${req.body.title}','${req.body.title}','${req.body.department_id}')`,
    function (err, result) {
      if (err) {
        console.log(err + "17");
      } else {
        res.send({ status: true });
      }
    }
  );
};
indicators.getIndicatorTypes = (req, res) => {
  console.log("getIndicatorTypes");

  con.query(
    `SELECT indicator_types.id as id,indicator_types.title,indicator_types.title_ar ,department_id as department_id,cd.title as department_title
    FROM indicator_types
    INNER JOIN cbs_departments cd on cd.id = indicator_types.department_id
    
    `,
    function (err, result) {
      if (err) {
        console.log(err + "32");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};
indicators.updateIndicatorType = (req, res) => {
  console.log("updateIndicatorType");
  console.log(req.body);
  con.query(
    `UPDATE indicator_types SET  title = '${req.body.title}' , title_ar = '${req.body.title_ar}'  ,department_id = '${req.body.department_id}' WHERE id = '${req.body.id}'`,
    function (err, result) {
      if (err) {
        console.log(err + "49");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};
indicators.deleteIndicatorType = (req, res) => {
  console.log("deleteIndicatorType");
  console.log(req.body);
  con.query(
    `DELETE from indicator_types  WHERE id = '${req.body.id}'`,
    function (err, result) {
      if (err) {
        console.log(err + "67");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};
indicators.addIndicator = (req, res) => {
  console.log("addIndicator");
  console.log(req.body);
  if (!req.body.type_id) {
    req.body.type_id = "NULL";
  }
  con.query(
    `INSERT INTO indicators (title,title_ar,icon,unit,unit_ar,cycle_type,type_id,department_id,shown) VALUES ('${req.body.title}','${req.body.title_ar}','${req.body.icon}','${req.body.unit}','${req.body.unit_ar}',${req.body.cycle_type},${req.body.type_id},'${req.body.department_id}','${req.body.shown}')`,
    function (err, result) {
      if (err) {
        console.log(err + "17");
      } else {
        res.send({ status: true });
      }
    }
  );
};
indicators.addIndicatorsFromExcel = async (req, res) => {
    if(req.body.data && req.body.data.length>0){
        let indicatorsId=[]
        for(key in req.body.data[0]){
            if(key.toLowerCase() != 'year' || key.toLowerCase() != 'month' || key.toLowerCase() != 'day' || key.toLowerCase() != 'quarter' || key.toLowerCase() != 'half-quarter' || key.toLowerCase() != 'week' ){
                var id = await checkIndicator(key,req.body.department_id,req.body.group_id)
                indicatorsId.push(id)
            }
       }
        console.log(indicatorsId)
        var queries=[]
        req.body.data.forEach(function (record){
            let index=0
            for(let key in record){
                if(key.toLowerCase() == 'year' || key.toLowerCase() == 'month' || key.toLowerCase() == 'day' || key.toLowerCase() == 'quarter' || key.toLowerCase() == 'half' || key.toLowerCase() == 'week'){
                    record[key.toLowerCase()]=record[key]
                    delete record[key]
                }
            }
            for(let key in record){
                if(!(key.toLowerCase() == 'year' || key.toLowerCase() == 'month' || key.toLowerCase() == 'day' || key.toLowerCase() == 'quarter' || key.toLowerCase() == 'half' || key.toLowerCase() == 'week')){
                    var query=`insert into indicators_cycles(indicator_id,value,cycle) values('${indicatorsId[index]}','${record[key]}','${record['year'] | record['month'] | record['day'] | record['quarter'] | record['half'] | record['week']}')`
                    queries.push(query)
                    index++
                }
            }
        })
        console.log(queries)
        console.log(req.body.data)
        queries.forEach(function (query){
            con.query(query,function (err,result){
                
            })
        })
        res.send({status:true})

        function checkIndicator(title,department_id,group_id){
            return new Promise(function (resolve, reject){
                con.query(`select count(*) as total,id from indicators where title='${title}'`,function (err,result){
                    if(result[0].total==0){
                        con.query(`insert into indicators(title,cycle_type,icon,department_id,type_id) values('${title}','5','fas fa-angle-double-up',${department_id},${group_id?group_id:'null'})`,function (err,result){
                            con.query(`select id from indicators where title='${title}'`,function (err,result){
                                resolve(result[0].id)
                            })
                        })
                    }
                    else resolve(result[0].id)
                })
            })
        }
    }

};
indicators.getIndicators = (req, res) => {
  console.log("getIndicators");
  console.log(req.body);
  con.query(
    `SELECT indicators.id,indicators.title,indicators.title_ar,icon,unit,unit_ar,cycle_type,type_id,shown,it.title as type_title,indicators.department_id,cd.title as department_title, indicators.created, indicators.updated,shown_in_home FROM indicators INNER JOIN cbs_departments cd on cd.id = indicators.department_id LEFT JOIN indicator_types it on it.id =indicators.type_id
    WHERE indicators.department_id = '${req.body.department_id}'
    `,
    function (err, result) {
      if (err) {
        console.log(err + "95");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};
indicators.updateIndicator = (req, res) => {
  console.log("updateIndicator");
  console.log(req.body);
  if (!req.body.type_id) {
    req.body.type_id = "NULL";
  }
  con.query(
    `UPDATE indicators SET title='${req.body.title}',title_ar='${req.body.title_ar}',icon='${req.body.icon}',unit='${req.body.unit}',unit_ar='${req.body.unit_ar}',cycle_type='${req.body.cycle_type}',type_id=${req.body.type_id},department_id='${req.body.department_id}' WHERE id = '${req.body.id}'`,
    function (err, result) {
      if (err) {
        console.log(err + "106");
      } else {
        res.send({ status: true });
      }
    }
  );
};
indicators.deleteIndicator = (req, res) => {
  console.log("deleteIndicator");
  console.log(req.body);
  con.query(
    `DELETE from indicators  WHERE id = '${req.body.id}'`,
    function (err, result) {
      if (err) {
        console.log(err + "67");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};
indicators.addCycle = (req, res) => {
  console.log("addCycle");
  console.log(req.body);
  con.query(
    `INSERT INTO indicators_cycles (indicator_id,value,cycle) VALUES ('${req.body.indicator_id}','${req.body.value}','${req.body.cycle}')`,
    function (err, result) {
      if (err) {
        console.log(err + "17");
      } else {
        res.send({ status: true });
      }
    }
  );
};
indicators.getCycles = (req, res) => {
  console.log("getCycles");
  console.log(req.body);

  con.query(
    `SELECT  indicators_cycles.id , indicator_id  ,value,cycle ,i.title as indicator_title,i.title_ar as indicator_title_ar
  FROM indicators_cycles
  
  INNER JOIN indicators i ON i.id = indicators_cycles.indicator_id 
  WHERE indicator_id = '${req.body.indicator_id}'
  `,
    function (err, result) {
      if (err) {
        console.log(err + "154");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};
indicators.deleteCycle = (req, res) => {
  console.log("deleteCycle");
  console.log(req.body);

  con.query(
    `DELETE FROM indicators_cycles WHERE id = '${req.body.id}'`,
    function (err, result) {
      if (err) {
        console.log(err + "173");
      } else {
        res.send({ status: true });
      }
    }
  );
};

indicators.updateCycle = (req, res) => {
  console.log("updateCycle");

  console.log(req.body);

  con.query(
    `UPDATE indicators_cycles SET value='${req.body.value}',cycle='${req.body.cycle}' WHERE id = '${req.body.id}'`,
    function (err, result) {
      if (err) {
        console.log(err + "190");
      } else {
        res.send({ status: true });
      }
    }
  );
};

indicators.getIndicatorsForType = (req, res) => {
  console.log("getIndicatorsForType");
  console.log(req.body);
  con.query(
    `SELECT indicators.id,indicators.title,indicators.title_ar,icon,unit,unit_ar,cycle_type,type_id,it.title as type_title,indicators.department_id,cd.title as department_title, indicators.created, indicators.updated,shown_in_home FROM indicators INNER JOIN cbs_departments cd on cd.id = indicators.department_id LEFT JOIN indicator_types it on it.id =indicators.type_id
    WHERE indicators.type_id = '${req.body.type_id}'
    `,
    function (err, result) {
      if (err) {
        console.log(err + "95");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};

indicators.getLastIndicators=function (req,res) {
    con.query("select id,department_id,title,title_ar,icon,value from (select id,department_id,title,title_ar,icon,(select value from indicators_cycles where indicator_id=indicators.id order by id desc limit 1) value from indicators where shown=1) tmp where value is not null",function (err,result) {
        if(err){
            console.log("431 "+err)
            return res.send({status:false,msg:"A problem occured during processing the request 432"})
        }
        res.send({status:true,data:result})
    })
}
indicators.getWebsiteIndicatorGroups=function (req,res) {
    con.query(` SELECT * FROM indicator_types `,function (err,result) {
        if(err){
            console.log("431 "+err)
            return res.send({status:false,msg:"A problem occured during processing the request 432"})
        }
        res.send({status:true,data:result[0].data})
    })
}
indicators.getTopIndicators=function (req,res) {
    con.query("select id,title,title_ar,icon,value from (select id,title,title_ar,icon,(select value from indicators_cycles where indicator_id=indicators.id order by id desc limit 1) value from indicators where shown_in_home=1 limit 5) tmp where value is not null",function (err,result) {
        if(err){
            console.log("431 "+err)
            return res.send({status:false,msg:"A problem occured during processing the request 432"})
        }
        res.send({status:true,data:result})
    })
}
indicators.getHomeIndicators=function (req,res) {
    con.query("select id,cycle_type,title,title_ar,icon,value from (select id,cycle_type,title,title_ar,icon,(select json_object('value',value,'cycle',cycle) from indicators_cycles where indicator_id=indicators.id order by id desc limit 1) value from indicators where shown_in_home=1 limit 5) tmp where value is not null",function (err,result) {
        if(err){
            console.log("431 "+err)
            return res.send({status:false,msg:"A problem occured during processing the request 432"})
        }
        res.send({status:true,data:result})
    })
}
indicators.getHomeTopIndicators=function (req,res){
    con.query("select id,title,title_ar,icon,value from (select id,title,title_ar,icon,(select value from indicators_cycles where indicator_id=indicators.id order by id desc limit 1) value from indicators where shown_in_home=1 limit 5) tmp",function (err,result) {
        if(err){
            console.log("431 "+err)
            return res.send({status:false,msg:"A problem occured during processing the request 432"})
        }
        res.send({status:true,data:result})
    })
}

indicators.changeIndicatorShown=function(req,res){
    con.query(`update indicators set shown=${req.body.shown} where id=${req.body.id}`,function (err,result) {
        if(err){
            console.log("262 "+err)
            return res.send({status:false,msg:"Unable to change shown state 263"})
        }
        res.send({status:true,data:[]})
    })
}
indicators.addHomeIndicator=function(req,res){
    con.query(`update indicators set shown_in_home=1 where id = ${req.body.id}`,function (err,result) {
        if(err){
            console.log("271 "+err)
            return res.send({status:false,msg:"Failed to add home indicator"})
        }
        res.send({status:true,data:[]})
    })
}

indicators.removeHomeIndicator=function(req,res){
    con.query(`update indicators set shown_in_home=0 where id=${req.body.id}`,function (err,result) {
        if(err){
            console.log("281 "+err)
            return res.send({status:false,msg:"Failed to remove the indicator from home list"})
        }
        res.send({status:true,data:[]})
    })
}

module.exports = indicators;
