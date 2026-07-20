var { con } = require("../db/db");
const utils = require("../utils/utils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { RSA_NO_PADDING } = require("constants");
const { result } = require("lodash");
const { query } = require("express");
// const {compact} = require('lodash');
var pis = {}

pis.insertCpiStatesSection = function (req, res) {
    if (!req.body.Month) {
        con.query(`insert into cpi_states_section (state_id,Month,year,standard_year,urban_standard,rural_standard,urban_ongoing,rural_ongoing) values ('${req.body.state}','0','${req.body.year}','${req.body.standard_year}','${req.body.urban_standard}','${req.body.rural_standard}','${req.body.urban_ongoing}','${req.body.rural_ongoing}')`, function (err, result) {
            if (err) {
                console.log(err + "15");
            } else {
                res.send({
                    status: true,
                    data: []
                })
            }
        })
    } else {
        con.query(`insert into cpi_states_section (state_id,Month,year,standard_year,urban_standard,rural_standard,urban_ongoing,rural_ongoing) values ('${req.body.state}','${req.body.Month}','${req.body.year}','${req.body.standard_year}','${req.body.urban_standard}','${req.body.rural_standard}','${req.body.urban_ongoing}','${req.body.rural_ongoing}')`, function (err, result) {
            if (err) {
                console.log(err + "15");
            } else {
                con.query(`select * from cpi_states_section where month = 0 and year = '${req.body.year}'`,function (err,result2) {
                    if (err) {
                        console.log(err+"31");
                    } else {
                        if (result2.length > 0) {
                            res.send({status:true,data:[]})
                        } else {
                            con.query(`insert into cpi_states_section (state_id,Month,year) values ('${req.body.state}','0','${req.body.year}')`, function (err, result) {
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
pis.getCpiStatesSection = function (req, res) {
    con.query(`select cpi_states_section.id,standard_year,month,state_id,states.name,
    urban_standard as urban_standard, urban_ongoing as urban_ongoing,
    rural_standard as rural_standard, rural_ongoing as rural_ongoing,
   year from cpi_states_section
   join states on states.id = cpi_states_section.state_id
   WHERE Month = 0
   group by year,states.name  `, function (err, result) {
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


pis.getCpiStatesSectionYear = function (req, res) {
    console.log("year " + req.body);
    con.query(`select cpi_states_section.*,states.name from cpi_states_section join states on states.id = cpi_states_section.state_id where year= '${req.body.year}' and Month !=0  and states.id = '${req.body.state_id}'`, function (err, result) {
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

pis.updateCpiStatesSection = function (req, res) {
    console.log(req.body);
    con.query(`update cpi_states_section set state_id = '${req.body.state_id}', year ='${req.body.year}',standard_year ='${req.body.standard_year}',urban_standard ='${req.body.urban_standard}',rural_standard ='${req.body.rural_standard}',urban_ongoing ='${req.body.urban_ongoing}',rural_ongoing = '${req.body.rural_ongoing}' where id = '${req.body.id}'`, function (err, result) {
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
pis.deleteCpiStatesSection = function (req, res) {
    con.query(`delete from cpi_states_section where id = '${req.body.id}' `, function (err, result) {
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


/////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

pis.addCpiStateCommunity = function (req, res) {
    if (!req.body.month) {
        con.query(`INSERT INTO cpi_states_community(state_id,month,year,standard_year,l1_standard,l2_standard,l3_standard,l4_standard,l5_standard, l1_ongoing,l2_ongoing,l3_ongoing,l4_ongoing,l5_ongoing) 
    VALUES ('${req.body.state}','0','${req.body.year}','${req.body.standard_year}','${req.body.l1_standard}','${req.body.l2_standard}','${req.body.l3_standard}','${req.body.l4_standard}','${req.body.l5_standard}', 
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
        con.query(`INSERT INTO cpi_states_community(state_id,month,year,standard_year,l1_standard,l2_standard,l3_standard,l4_standard,l5_standard, l1_ongoing,l2_ongoing,l3_ongoing,l4_ongoing,l5_ongoing) 
    VALUES ('${req.body.state}','${req.body.month}','${req.body.year}','${req.body.standard_year}','${req.body.l1_standard}','${req.body.l2_standard}','${req.body.l3_standard}','${req.body.l4_standard}','${req.body.l5_standard}', 
    '${req.body.l1_ongoing}','${req.body.l2_ongoing}','${req.body.l3_ongoing}','${req.body.l4_ongoing}','${req.body.l5_ongoing}')`, function (err, result) {
        if (err) {
            console.log(err + "92");
        } else {
            con.query(`select * from cpi_states_community where year = '${req.body.year}' and month = 0 `,function (err,result2) {
             if (err) {
                 console.log(err+"141");
             } else {
                 if (result2.length > 0) {
                     res.send({status:true,data:[]})
                 } else {
                    con.query(`INSERT INTO cpi_states_community(state_id,month,year) 
                    VALUES ('${req.body.state}','0','${req.body.year}')`, function (err, result) {
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
pis.getCpiStateCommunity = function (req, res) {
    con.query(`select cpi_states_community.id,year,state_id ,states.name,standard_year,month, sum(l1_standard) as l1_standard,
    l2_standard as l2_standard,
    l3_standard as l3_standard,
    l4_standard as l4_standard,
    l5_standard as l5_standard,
    l1_ongoing as l1_ongoing,
    l2_ongoing as l2_ongoing,
    l3_ongoing as l3_ongoing,
    l4_ongoing as l4_ongoing,
    l5_ongoing as l5_ongoing
from cpi_states_community
join states on states.id = cpi_states_community.state_id 
WHERE month = 0
GROUP by year,states.id`, function (err, result) {
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
pis.getCpiStateCommunityYear = function (req, res) {
    con.query(`select cpi_states_community.*,states.name from cpi_states_community join states on states.id = cpi_states_community.state_id where year = '${req.body.year}' and month != 0 and states.id = '${req.body.state_id}' `, function (err, result) {
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


pis.updateCpiStateCommunity = function (req, res) {
    con.query(`update cpi_states_community set state_id = '${req.body.state_id}', 
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

pis.removeCpiStateCommunity = function (req, res) {
    console.log(req.body);
    con.query(`delete from cpi_states_community where id = '${req.body.id}'`, function (err, result) {
        if (err) {
            console.log(err + "136");
        } else {
            res.send({
                status: true
            })
        }
    })
}




pis.getInflationStateSection = function (req, res) {
    con.query(`select inflation_states_section.id,inflation_states_section.state_id,standard_year,month,states.name, sum(urban_standard) as urban_standard,sum(urban_ongoing) as urban_ongoing,sum(rural_standard) as rural_standard,sum(rural_ongoing) as rural_ongoing,year from inflation_states_section join states on states.id = inflation_states_section.state_id group by year,states.name`, function (err, result) {
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

pis.insertInflationStateSection = function (req, res) {
    con.query(`insert into inflation_states_section (Month,state_id,year,standard_year,urban_standard,rural_standard,urban_ongoing,rural_ongoing) values ('${req.body.Month}','${req.body.state}','${req.body.year}','${req.body.standard_year}','${req.body.urban_standard}','${req.body.rural_standard}','${req.body.urban_ongoing}','${req.body.rural_ongoing}')`, function (err, result) {
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

pis.getInflationStateSectionYear = function (req, res) {
    console.log(req.body);
    con.query(`select inflation_states_section.*,states.name from inflation_states_section join states on states.id = inflation_states_section.state_id where year= '${req.body.year}' and states.id = '${req.body.state_id}'`, function (err, result) {
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


pis.updateInflationStateSection = function (req, res) {
    console.log(req.body);
    con.query(`update inflation_states_section set Month = '${req.body.month}',year ='${req.body.year}',standard_year ='${req.body.standard_year}',urban_standard ='${req.body.urban_standard}',rural_standard ='${req.body.rural_standard}',urban_ongoing ='${req.body.urban_ongoing}',rural_ongoing = '${req.body.rural_ongoing}' where id = '${req.body.id}'`, function (err, result) {
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
pis.deleteInflationStateSection = function (req, res) {
    con.query(`delete from inflation_states_section where id = '${req.body.id}' `, function (err, result) {
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

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
pis.addInflationStateCommunity = function (req, res) {
    con.query(`INSERT INTO inflation_states_community(state_id,month,year,standard_year,l1_standard,l2_standard,l3_standard,l4_standard,l5_standard, l1_ongoing,l2_ongoing,l3_ongoing,l4_ongoing,l5_ongoing) 
    VALUES ('${req.body.state}','${req.body.month}','${req.body.year}','${req.body.standard_year}','${req.body.l1_standard}','${req.body.l2_standard}','${req.body.l3_standard}','${req.body.l4_standard}','${req.body.l5_standard}', 
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
pis.getInflationStateCommunity = function (req, res) {
    con.query(`select inflation_states_community.id,year,state_id ,states.name,standard_year,month, sum(l1_standard) as l1_standard,
    sum(l2_standard) as l2_standard,
    sum(l3_standard) as l3_standard,
    sum(l4_standard) as l4_standard,
    sum(l5_standard) as l5_standard,
    sum(l1_ongoing) as l1_ongoing,
    sum(l2_ongoing) as l2_ongoing,
    sum(l3_ongoing) as l3_ongoing,
    sum(l4_ongoing) as l4_ongoing,
    sum(l5_ongoing) as l5_ongoing
from inflation_states_community
join states on states.id = inflation_states_community.state_id GROUP by year,states.id`, function (err, result) {
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
pis.getInflationStateCommunityYear = function (req, res) {
    con.query(`select inflation_states_community.*,states.name from inflation_states_community join states on states.id = inflation_states_community.state_id where year = '${req.body.year}' and states.id= '${req.body.state_id}'`, function (err, result) {
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



pis.updateInflationStateCommunity = function (req, res) {
    con.query(`update inflation_states_community set state_id = '${req.body.state_id}', 
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

pis.removeInflationStateCommunity = function (req, res) {
    console.log(req.body);
    con.query(`delete from inflation_states_community where id = '${req.body.id}'`, function (err, result) {
        if (err) {
            console.log(err + "136");
        } else {
            res.send({
                status: true
            })
        }
    })
}


module.exports = pis