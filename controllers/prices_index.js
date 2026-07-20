var { con } = require("../db/db");
const utils = require("../utils/utils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { RSA_NO_PADDING } = require("constants");
const { result } = require("lodash");
const { query } = require("express");
// const {compact} = require('lodash');
var pi = {}
// pi.getAllYears
pi.getAllYears = function (req, res) {
    console.log('getAllYears');
    con.query(`select * from cpi_years`, function (err, result) {
        if (err) {
            console.log(err + "25");
        } else {
            res.send({
                status: true,
                data: result
            })
        }
    })
}
// nsertCpiSudanSection post
pi.insertCpiSudanSection = function (req, res) {
    if(!req.body.Month){
        con.query(`insert into cpi_sudan_section (Month,year,standard_year,urban_standard,rural_standard,urban_ongoing,rural_ongoing) values ('0','${req.body.year}','${req.body.standard_year}','${req.body.urban_standard}','${req.body.rural_standard}','${req.body.urban_ongoing}','${req.body.rural_ongoing}')`, function (err, result) {
            if (err) {
                console.log(err + "15");
            } else {
                res.send({
                    status: true,
                    data: []
                })
            }
        })
    }else{
        con.query(`insert into cpi_sudan_section (Month,year,standard_year,urban_standard,rural_standard,urban_ongoing,rural_ongoing) values ('${req.body.Month}','${req.body.year}','${req.body.standard_year}','${req.body.urban_standard}','${req.body.rural_standard}','${req.body.urban_ongoing}','${req.body.rural_ongoing}')`, function (err, result) {
            if (err) {
                console.log(err + "15");
            } else {
                con.query(`select * from cpi_sudan_section where year ='${req.body.year}' and month = 0 `,function (err,rsult2) {
                   if(err){
                       console.log(err+"45");
                   }else{
                       if (rsult2.length > 0) {
                            res.send({status:true,data:[]})
                       } else {
                        con.query(`insert into cpi_sudan_section (Month,year) values ('0','${req.body.year}')`, function (err, result) {
                            if (err) {
                                console.log(err + "15");
                            } else {
                                res.send({
                                    status: true,
                                    data: []
                                })
                            }
                        })
                       }
                   }
                })
            }
        })
    }
    
}
// getAllYears get
pi.getCpiSudanSection = function (req, res) {
    con.query(`select id,standard_year,month, urban_standard as urban_standard,urban_ongoing as urban_ongoing,rural_standard as rural_standard,rural_ongoing as rural_ongoing,year from cpi_sudan_section  WHERE Month = 0 group by year `, function (err, result) {
        if (err) {
            console.log(err + "25");
        } else {
            res.send({
                status: true,
                data: result
            })
        }
    })
}
// post
pi.getCpiSudanSectionYear = function (req, res) {
    console.log("year " + req.body);
    con.query(`select * from cpi_sudan_section where Month != 0 and year= '${req.body.year}'`, function (err, result) {
        if (err) {
            console.log(err + "25");
        } else {
            res.send({
                status: true,
                data: result
            })
        }
    })
}

// updateCpiSudanSection
pi.updateCpiSudanSection = function (req, res) {
    console.log(req.body);
    con.query(`update cpi_sudan_section set year ='${req.body.year}',standard_year ='${req.body.standard_year}',urban_standard ='${req.body.urban_standard}',rural_standard ='${req.body.rural_standard}',urban_ongoing ='${req.body.urban_ongoing}',rural_ongoing = '${req.body.rural_ongoing}' where id = '${req.body.id}'`, function (err, result) {
        if (err) {
            console.log(err + "36");
        } else {
            res.send({
                status: true,
                data: []
            })
        }
    })
}
//deleteCpiSudanSection
pi.deleteCpiSudanSection = function (req, res) {
    con.query(`delete from cpi_sudan_section where id = '${req.body.id}' `, function (err, result) {
        if (err) {
            console.log(err + "46");
        } else {
            res.send({
                status: true,
                data: []
            })
        }
    })
}

// for (var x = 1959; x <= 2040; x++) {
//     console.log(x)
//     con.query(`insert into cpi_yeas (year) values ('${x}')`, function (err, result) {
//         if (err) {
//             console.log(er);
//         } else {
//             console.log(x);
//         }
//     })
// }

//post
pi.addCpiSudanCommunity = function (req, res) {
    if (!req.body.month) {
        con.query(`INSERT INTO cpi_sudan_community(month,year,standard_year,l1_standard,l2_standard,l3_standard,l4_standard,l5_standard, l1_ongoing,l2_ongoing,l3_ongoing,l4_ongoing,l5_ongoing) 
    VALUES ('0','${req.body.year}','${req.body.standard_year}','${req.body.l1_standard}','${req.body.l2_standard}','${req.body.l3_standard}','${req.body.l4_standard}','${req.body.l5_standard}', 
    '${req.body.l1_ongoing}','${req.body.l2_ongoing}','${req.body.l3_ongoing}','${req.body.l4_ongoing}','${req.body.l5_ongoing}')`, function (err, result) {
        if (err) {
            console.log(err + "92");
        } else {
            res.send({
                status: true
            })
        }
    })
    } else {
        con.query(`INSERT INTO cpi_sudan_community(month,year,standard_year,l1_standard,l2_standard,l3_standard,l4_standard,l5_standard, l1_ongoing,l2_ongoing,l3_ongoing,l4_ongoing,l5_ongoing) 
    VALUES ('${req.body.month}','${req.body.year}','${req.body.standard_year}','${req.body.l1_standard}','${req.body.l2_standard}','${req.body.l3_standard}','${req.body.l4_standard}','${req.body.l5_standard}', 
    '${req.body.l1_ongoing}','${req.body.l2_ongoing}','${req.body.l3_ongoing}','${req.body.l4_ongoing}','${req.body.l5_ongoing}')`, function (err, result) {
        if (err) {
            console.log(err + "92");
        } else {
            con.query(`select * from cpi_sudan_community where year = '${req.body.year}' and month = 0`,function (err,result2) {
             if (err) {
                 console.log(err+"158");
             } else {
                 if (result2.length > 0) {
                     res.send({status:true,data:[]})
                 } else {
                    con.query(`INSERT INTO cpi_sudan_community(month,year) VALUES ('0','${req.body.year}')`, function (err, result) {
                        if (err) {
                            console.log(err + "92");
                        } else {
                            res.send({
                                status: true
                            })
                        }
                    })
                 }
             }   
            })
        }
    })
    }
}
// get
pi.getCpiSudanCommunity = function (req, res) {
    con.query(`select id,year,standard_year,month, sum(l1_standard) as l1_standard,
    l2_standard as l2_standard,
    l3_standard as l3_standard,
    l4_standard as l4_standard,
    l5_standard as l5_standard,
    l1_ongoing as l1_ongoing,
    l2_ongoing as l2_ongoing,
    l3_ongoing as l3_ongoing,
    l4_ongoing as l4_ongoing,
    l5_ongoing as l5_ongoing
from cpi_sudan_community WHERE month = 0 GROUP by year`, function (err, result) {
        if (err) {
            console.log(err + "101");
        } else {
            res.send({
                status: true,
                data: result
            })
        }
    })
}
//post
pi.getCpiSudanCommunityYear = function (req, res) {
    con.query(`select * from cpi_sudan_community where year = '${req.body.year}' and month != 0 `, function (err, result) {
        if (err) {
            console.log(err + "101");
        } else {
            res.send({
                status: true,
                data: result
            })
        }
    })
}



pi.updateCpiSudanCommunity = function (req, res) {
    con.query(`update cpi_sudan_community set 
    year = '${req.body.year}',
    standard_year = '${req.body.standard_year}',
    l1_standard ='${req.body.l1_standard}',
    l2_standard  = '${req.body.l2_standard}',
    l3_standard = '${req.body.l3_standard}',
    l4_standard = '${req.body.l4_standard}',
    l5_standard = '${req.body.l5_standard}',
    l1_ongoing = '${req.body.l1_ongoing}',
    l2_ongoing = '${req.body.l2_ongoing}',
    l3_ongoing = '${req.body.l3_ongoing}',
    l4_ongoing = '${req.body.l4_ongoing}',
    l5_ongoing = '${req.body.l5_ongoing}' where id = '${req.body.id}'`, function (err, result) {
        if (err) {
            console.log(err + "92");
        } else {
            res.send({
                status: true
            })
        }
    })
}

pi.removeCpiSudanCommunity = function (req, res) {
    console.log(req.body);
    con.query(`delete from cpi_sudan_community where id = '${req.body.id}'`, function (err, result) {
        if (err) {
            console.log(err + "136");
        } else {
            res.send({
                status: true
            })
        }
    })
}

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

pi.getInflationSudanSection = function (req, res) {
    con.query(`select id,standard_year,month, sum(urban_standard) as urban_standard,sum(urban_ongoing) as urban_ongoing,sum(rural_standard) as rural_standard,sum(rural_ongoing) as rural_ongoing,year from inflation_sudan_section group by year`, function (err, result) {
        if (err) {
            console.log(err + "25");
        } else {
            res.send({
                status: true,
                data: result
            })
        }
    })
}

pi.insertInflationSudanSection = function (req, res) {
    con.query(`insert into inflation_sudan_section (Month,year,standard_year,urban_standard,rural_standard,urban_ongoing,rural_ongoing) values ('${req.body.Month}','${req.body.year}','${req.body.standard_year}','${req.body.urban_standard}','${req.body.rural_standard}','${req.body.urban_ongoing}','${req.body.rural_ongoing}')`, function (err, result) {
        if (err) {
            console.log(err + "15");
        } else {
            res.send({
                status: true,
                data: []
            })
        }
    })
}

pi.getInflationSudanSectionYear = function (req, res) {
    console.log("year " + req.body);
    con.query(`select * from inflation_sudan_section where year= '${req.body.year}'`, function (err, result) {
        if (err) {
            console.log(err + "25");
        } else {
            res.send({
                status: true,
                data: result
            })
        }
    })
}


pi.updateInflationSudanSection = function (req, res) {
    console.log(req.body);
    con.query(`update inflation_sudan_section set Month = '${req.body.month}',year ='${req.body.year}',standard_year ='${req.body.standard_year}',urban_standard ='${req.body.urban_standard}',rural_standard ='${req.body.rural_standard}',urban_ongoing ='${req.body.urban_ongoing}',rural_ongoing = '${req.body.rural_ongoing}' where id = '${req.body.id}'`, function (err, result) {
        if (err) {
            console.log(err + "36");
        } else {
            res.send({
                status: true,
                data: []
            })
        }
    })
}
//deleteCpiSudanSection
pi.deleteInflationSudanSection = function (req, res) {
    con.query(`delete from inflation_sudan_section where id = '${req.body.id}' `, function (err, result) {
        if (err) {
            console.log(err + "46");
        } else {
            res.send({
                status: true,
                data: []
            })
        }
    })
}


pi.addInflationSudanCommunity = function (req, res) {
    con.query(`INSERT INTO inflation_sudan_community(month,year,standard_year,l1_standard,l2_standard,l3_standard,l4_standard,l5_standard, l1_ongoing,l2_ongoing,l3_ongoing,l4_ongoing,l5_ongoing) 
    VALUES ('${req.body.month}','${req.body.year}','${req.body.standard_year}','${req.body.l1_standard}','${req.body.l2_standard}','${req.body.l3_standard}','${req.body.l4_standard}','${req.body.l5_standard}', 
    '${req.body.l1_ongoing}','${req.body.l2_ongoing}','${req.body.l3_ongoing}','${req.body.l4_ongoing}','${req.body.l5_ongoing}')`, function (err, result) {
        if (err) {
            console.log(err + "92");
        } else {
            res.send({
                status: true
            })
        }
    })
}
// get
pi.getInflationSudanCommunity = function (req, res) {
    con.query(`select id,year,standard_year,month, sum(l1_standard) as l1_standard,
    sum(l2_standard) as l2_standard,
    sum(l3_standard) as l3_standard,
    sum(l4_standard) as l4_standard,
    sum(l5_standard) as l5_standard,
    sum(l1_ongoing) as l1_ongoing,
    sum(l2_ongoing) as l2_ongoing,
    sum(l3_ongoing) as l3_ongoing,
    sum(l4_ongoing) as l4_ongoing,
    sum(l5_ongoing) as l5_ongoing
from inflation_sudan_community GROUP by year`, function (err, result) {
        if (err) {
            console.log(err + "101");
        } else {
            res.send({
                status: true,
                data: result
            })
        }
    })
}
//post
pi.getInflationSudanCommunityYear = function (req, res) {
    con.query(`select * from inflation_sudan_community where year = '${req.body.year}' `, function (err, result) {
        if (err) {
            console.log(err + "101");
        } else {
            res.send({
                status: true,
                data: result
            })
        }
    })
}



pi.updateInflationSudanCommunity = function (req, res) {
    con.query(`update inflation_sudan_community set 
    month = '${req.body.month}',
    year = '${req.body.year}',
    standard_year = '${req.body.standard_year}',
    l1_standard ='${req.body.l1_standard}',
    l2_standard  = '${req.body.l2_standard}',
    l3_standard = '${req.body.l3_standard}',
    l4_standard = '${req.body.l4_standard}',
    l5_standard = '${req.body.l5_standard}',
    l1_ongoing = '${req.body.l1_ongoing}',
    l2_ongoing = '${req.body.l2_ongoing}',
    l3_ongoing = '${req.body.l3_ongoing}',
    l4_ongoing = '${req.body.l4_ongoing}',
    l5_ongoing = '${req.body.l5_ongoing}' where id = '${req.body.id}'`, function (err, result) {
        if (err) {
            console.log(err + "92");
        } else {
            res.send({
                status: true
            })
        }
    })
}

pi.removeInflationSudanCommunity = function (req, res) {
    console.log(req.body);
    con.query(`delete from inflation_sudan_community where id = '${req.body.id}'`, function (err, result) {
        if (err) {
            console.log(err + "136");
        } else {
            res.send({
                status: true
            })
        }
    })
}

pi.insertCpiSudanExcel=function (req,res){
    req.body.forEach(function (row){
        con.query(`select count(*) as tot from cpi_sudan_section where year='${row.year}'`,function (err,result){
            if(result[0].tot){
                con.query(`update cpi_sudan_section set urban_standard=${row.urban_standard},rural_standard=${row.rural_standard},urban_ongoing=${row.urban_ongoing},rural_ongoing=${row.rural_ongoing} where year='${row.year}'`)
            }else{
                con.query(`insert into cpi_sudan_section (urban_standard,rural_standard,urban_ongoing,rural_ongoing,year) values(${row.urban_standard},${row.rural_standard},${row.urban_ongoing},${row.rural_ongoing},'${row.year}')`)
            }
        })
    })
    setTimeout(()=>{
        res.send({status:true})
    },400)
}


module.exports = pi