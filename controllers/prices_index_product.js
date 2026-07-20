var { con } = require("../db/db");
const utils = require("../utils/utils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { RSA_NO_PADDING } = require("constants");
const { result } = require("lodash");
const { query } = require("express");
// const {compact} = require('lodash');
var pip = {}


pip.getAllProducts=function (req,res) {
    // console.log("hi");
    con.query(`select * from cpi_products`,function (err,result) {
        if (err) {
            console.log(err+"16");
        } else {
            // console.log(result);
            res.send({status:true,data:result})
        }
    })
}


pip.addCpiProduct=function (req,res) {
    console.log(req.body);
    con.query(`insert into cpi_products (name,unit) values ('${req.body.name}','${req.body.unit}')`,function (err,result) {
        if (err) {
            console.log(err+"27");
        } else {
            res.send({status:true})
        }
    })
}


pip.updateCpiProduct=function (req,res) {
    console.log(req.body);
    con.query(`update cpi_products set name = '${req.body.name}',unit = '${req.body.unit}' where id = '${req.body.id}' `,function(err,result) {
        if (err) {
            console.log(err+"27");
        } else {
            res.send({status:true})
        }
    })
}


pip.deleteCpiProduct=function (req,res) {
    console.log(req.body);
    con.query(`delete from cpi_products where id = '${req.body.id}' `,function(err,result) {
        if (err) {
            console.log(err+"27");
        } else {
            res.send({status:true})
        }
    })
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

pip.insertCpiProductSection = function (req, res) {
    if (!req.body.Month) {
        con.query(`insert into cpi_product_section (product_id,month,year,standard_year,urban_standard,rural_standard,urban_ongoing,rural_ongoing) values ('${req.body.product}','0','${req.body.year}','${req.body.standard_year}','${req.body.urban_standard}','${req.body.rural_standard}','${req.body.urban_ongoing}','${req.body.rural_ongoing}')`, function (err, result) {
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
        con.query(`insert into cpi_product_section (product_id,month,year,standard_year,urban_standard,rural_standard,urban_ongoing,rural_ongoing) values ('${req.body.product}','${req.body.Month}','${req.body.year}','${req.body.standard_year}','${req.body.urban_standard}','${req.body.rural_standard}','${req.body.urban_ongoing}','${req.body.rural_ongoing}')`, function (err, result) {
            if (err) {
                console.log(err + "15");
            } else {
                con.query(`select * from cpi_product_section where month = 0 and year = '${req.body.year}'`,function (err,result2) {
                    if (err) {
                        console.log(err+"83");
                    } else {
                        if (result2.length > 0) {
                            res.send({status:true,data:[]})
                        } else {
                            con.query(`insert into cpi_product_section (product_id,month,year) values ('${req.body.product}','0','${req.body.year}')`, function (err, result) {
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
pip.getCpiProductSection = function (req, res) {
    con.query(`select cpi_product_section.id,standard_year,month,product_id,cpi_products.name,cpi_products.unit,
    urban_standard as urban_standard,urban_ongoing as urban_ongoing,
    rural_standard as rural_standard,rural_ongoing as rural_ongoing,
    year from cpi_product_section
    join cpi_products on cpi_products.id = cpi_product_section.product_id
    WHERE month = 0
    group by year,cpi_products.name`, function (err, result) {
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

pip.getCpiProductSectionYear = function (req, res) {
    console.log(req.body);
    con.query(`select cpi_product_section.*,cpi_products.name,cpi_products.unit from cpi_product_section join cpi_products on cpi_products.id = cpi_product_section.product_id where year= '${req.body.year}' and month !=0 and cpi_products.id = '${req.body.product_id}'`, function (err, result) {
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

pip.updateCpiProductSection = function (req, res) {
    console.log(req.body);
    con.query(`update cpi_product_section set product_id = '${req.body.product_id}', year ='${req.body.year}',standard_year ='${req.body.standard_year}',urban_standard ='${req.body.urban_standard}',rural_standard ='${req.body.rural_standard}',urban_ongoing ='${req.body.urban_ongoing}',rural_ongoing = '${req.body.rural_ongoing}' where id = '${req.body.id}'`, function (err, result) {
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
pip.deleteCpiProductSection = function (req, res) {
    console.log(req.body);
    con.query(`delete from cpi_product_section where id = '${req.body.id}' `, function (err, result) {
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

pip.addCpiProductCommunity = function (req, res) {
    if (!req.body.month) {
        con.query(`INSERT INTO cpi_product_community(product_id,month,year,standard_year,l1_standard,l2_standard,l3_standard,l4_standard,l5_standard, l1_ongoing,l2_ongoing,l3_ongoing,l4_ongoing,l5_ongoing) 
    VALUES ('${req.body.product}','0','${req.body.year}','${req.body.standard_year}','${req.body.l1_standard}','${req.body.l2_standard}','${req.body.l3_standard}','${req.body.l4_standard}','${req.body.l5_standard}', 
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
        con.query(`INSERT INTO cpi_product_community(product_id,month,year,standard_year,l1_standard,l2_standard,l3_standard,l4_standard,l5_standard, l1_ongoing,l2_ongoing,l3_ongoing,l4_ongoing,l5_ongoing) 
    VALUES ('${req.body.product}','${req.body.month}','${req.body.year}','${req.body.standard_year}','${req.body.l1_standard}','${req.body.l2_standard}','${req.body.l3_standard}','${req.body.l4_standard}','${req.body.l5_standard}', 
    '${req.body.l1_ongoing}','${req.body.l2_ongoing}','${req.body.l3_ongoing}','${req.body.l4_ongoing}','${req.body.l5_ongoing}')`, function (err, result) {
        if (err) {
            console.log(err + "92");
        } else {
            con.query(`select * from cpi_product_community where year = '${req.body.year}' and month = 0 `,function (err,result2) {
                if (err) {
                    console.log(err+"193");
                } else {
                    if (result2.length > 0) {
                        res.send({status:true,data:[]})
                    } else {
                        con.query(`INSERT INTO cpi_product_community(product_id,month,year,standard_year,l1_standard,l2_standard,l3_standard,l4_standard,l5_standard, l1_ongoing,l2_ongoing,l3_ongoing,l4_ongoing,l5_ongoing) 
                        VALUES ('${req.body.product}','0','${req.body.year}','${req.body.standard_year}','${req.body.l1_standard}','${req.body.l2_standard}','${req.body.l3_standard}','${req.body.l4_standard}','${req.body.l5_standard}', 
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
                }
            })
        }
    })
    }
}

// get
pip.getCpiProductCommunity = function (req, res) {
    con.query(`select cpi_product_community.id,year,product_id ,cpi_products.name,cpi_products.unit,standard_year,month, l1_standard as l1_standard,
    l2_standard as l2_standard,
    l3_standard as l3_standard,
    l4_standard as l4_standard,
    l5_standard as l5_standard,
    l1_ongoing as l1_ongoing,
    l2_ongoing as l2_ongoing,
    l3_ongoing as l3_ongoing,
    l4_ongoing as l4_ongoing,
    l5_ongoing as l5_ongoing
from cpi_product_community
join cpi_products on cpi_products.id = cpi_product_community.product_id WHERE month = 0 GROUP by year,cpi_products.name 
`, function (err, result) {
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
pip.getCpiProductCommunityYear = function (req, res) {
    con.query(`select cpi_product_community.*,cpi_products.name,cpi_products.unit from cpi_product_community join cpi_products on cpi_products.id = cpi_product_community.product_id where year = '${req.body.year}' and month !=0 and  cpi_products.id = '${req.body.product_id}' `, function (err, result) {
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


pip.updateCpiProductCommunity = function (req, res) {
    con.query(`update cpi_product_community set 
    product_id = '${req.body.product_id}', 
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

pip.removeCpiProductCommunity = function (req, res) {
    console.log(req.body);
    con.query(`delete from cpi_product_community where id = '${req.body.id}'`, function (err, result) {
        if (err) {
            console.log(err + "136");
        } else {
            res.send({
                status: true
            })
        }
    })
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

pip.insertInflationProductSection = function (req, res) {
    con.query(`insert into inflation_product_section (product_id,month,year,standard_year,urban_standard,rural_standard,urban_ongoing,rural_ongoing) values ('${req.body.product}','${req.body.Month}','${req.body.year}','${req.body.standard_year}','${req.body.urban_standard}','${req.body.rural_standard}','${req.body.urban_ongoing}','${req.body.rural_ongoing}')`, function (err, result) {
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
// getAllYears get
pip.getInflationProductSection = function (req, res) {
    con.query(`select inflation_product_section.id,standard_year,month,product_id,cpi_products.name,cpi_products.unit,
     sum(urban_standard) as urban_standard,sum(urban_ongoing) as urban_ongoing,
     sum(rural_standard) as rural_standard,sum(rural_ongoing) as rural_ongoing,
     year from inflation_product_section
     join cpi_products on cpi_products.id = inflation_product_section.product_id
     group by year,cpi_products.name `, function (err, result) {
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

pip.getInflationProductSectionYear = function (req, res) {
    console.log("year " + req.body);
    con.query(`select inflation_product_section.*,cpi_products.name,cpi_products.unit from inflation_product_section join cpi_products on cpi_products.id = inflation_product_section.product_id where year= '${req.body.year}' and cpi_products.id = '${req.body.product_id}'`, function (err, result) {
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

pip.updateInflationProductSection = function (req, res) {
    console.log(req.body);
    con.query(`update inflation_product_section set product_id = '${req.body.product_id}', Month = '${req.body.month}',year ='${req.body.year}',standard_year ='${req.body.standard_year}',urban_standard ='${req.body.urban_standard}',rural_standard ='${req.body.rural_standard}',urban_ongoing ='${req.body.urban_ongoing}',rural_ongoing = '${req.body.rural_ongoing}' where id = '${req.body.id}'`, function (err, result) {
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
pip.deleteInflationProductSection = function (req, res) {
    console.log(req.body);
    con.query(`delete from inflation_product_section where id = '${req.body.id}' `, function (err, result) {
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
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

pip.addInflationProductCommunity = function (req, res) {
    con.query(`INSERT INTO inflation_product_community(product_id,month,year,standard_year,l1_standard,l2_standard,l3_standard,l4_standard,l5_standard, l1_ongoing,l2_ongoing,l3_ongoing,l4_ongoing,l5_ongoing) 
    VALUES ('${req.body.product}','${req.body.month}','${req.body.year}','${req.body.standard_year}','${req.body.l1_standard}','${req.body.l2_standard}','${req.body.l3_standard}','${req.body.l4_standard}','${req.body.l5_standard}', 
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
pip.getInflationProductCommunity = function (req, res) {
    con.query(`select inflation_product_community.id,year,product_id ,cpi_products.name,cpi_products.unit,standard_year,month, sum(l1_standard) as l1_standard,
    sum(l2_standard) as l2_standard,
    sum(l3_standard) as l3_standard,
    sum(l4_standard) as l4_standard,
    sum(l5_standard) as l5_standard,
    sum(l1_ongoing) as l1_ongoing,
    sum(l2_ongoing) as l2_ongoing,
    sum(l3_ongoing) as l3_ongoing,
    sum(l4_ongoing) as l4_ongoing,
    sum(l5_ongoing) as l5_ongoing
from inflation_product_community
join cpi_products on cpi_products.id = inflation_product_community.product_id GROUP by year,cpi_products.name`, function (err, result) {
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
pip.getInflationProductCommunityYear = function (req, res) {
    con.query(`select inflation_product_community.*,cpi_products.name,cpi_products.unit from inflation_product_community join cpi_products on cpi_products.id = inflation_product_community.product_id where year = '${req.body.year}' and cpi_products.id = '${req.body.product_id}'`, function (err, result) {
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


pip.updateInflationProductCommunity = function (req, res) {
    con.query(`update inflation_product_community set 
    product_id = '${req.body.product_id}', 
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

pip.removeInflationProductCommunity = function (req, res) {
    console.log(req.body);
    con.query(`delete from inflation_product_community where id = '${req.body.id}'`, function (err, result) {
        if (err) {
            console.log(err + "136");
        } else {
            res.send({
                status: true
            })
        }
    })
}
module.exports = pip