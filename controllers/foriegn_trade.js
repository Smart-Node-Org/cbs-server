var { con } = require("./../db/db");
const utils = require("../utils/utils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { RSA_NO_PADDING } = require("constants");
const { result } = require("lodash");
const { query } = require("express");
// const {compact} = require('lodash');
var foriegn_trade = {};

foriegn_trade.AddForiegnTrade = function (req, res) {
  con.query(
    `insert into foriegn_trade (export,import,re_export, export_qty_index, export_value_index, import_qty_index, import_value_index,year) values
    ('${req.body.export}','${req.body.import}','${req.body.re_export}', '${req.body.export_qty_index}', '${req.body.export_value_index}', '${req.body.import_qty_index}', '${req.body.import_value_index}','${req.body.year}')`,
    function (err, result) {
      if (err) {
        console.log(err + "14");
      } else {
        res.send({ status: true, data: [] });
      }
    }
  );
};

foriegn_trade.getAllForiegnTrade = function (req, res) {
  con.query(`select * from foriegn_trade`, function (err, result) {
    if (err) {
      console.log(err + "24");
    } else {
      res.send({ status: true, data: result });
    }
  });
};

foriegn_trade.updateForiegnTrade = function (req, res) {
  con.query(
    `update foriegn_trade set
            export='${req.body.export}',
            import='${req.body.import}',
            re_export='${req.body.re_export}',
            export_qty_index='${req.body.export_qty_index}',
            export_value_index='${req.body.export_value_index}',
            import_qty_index='${req.body.import_qty_index}',
            import_value_index='${req.body.import_value_index}',
            year ='${req.body.year}'`,
    function (err, result) {
      if (err) {
        $;
        console.log(err + "42");
      } else {
        res.send({ status: true, data: [] });
      }
    }
  );
};

foriegn_trade.removeForiegnTrade = function (req, res) {
  console.log(req.body);
  con.query(
    `DELETE FROM foriegn_trade_products WHERE id = ${req.body.id}`,
    function (err, result) {
      if (err) {
        console.log(err + "52");
      } else {
        console.log("delete");
        res.send({ status: true, data: [] });
      }
    }
  );
};

// post
foriegn_trade.AddForiengTradeYear = function (req, res) {
  con.query(
    `insert into foriegn_trade_years (year, export, import, re_export) values ('${req.body.year}', '${req.body.export}', '${req.body.import}' , '${req.body.re_export}')`,
    function (err, result) {
      if (err) {
        console.log(err + "67");
      } else {
        res.send({ status: true, data: [] });
      }
    });
};

// get
foriegn_trade.getAllForiengTradeYear = function (req, res) {
  con.query(`select * from foriegn_trade_years`, function (err, result) {
    if (err) {
      console.log(err + "78");
    } else {
      res.send({ status: true, data: result });
    }
  });
};

// post
foriegn_trade.removeForiengTradeYear = function (req, res) {
  con.query(
    `delete from foriegn_trade_years where id = '${req.body.id}'`,
    function (err, result) {
      if (err) {
        console.log(err + "78");
      } else {
        res.send({ status: true, data: [] });
      }
    }
  );
};

// post
foriegn_trade.updatedForiengTradeYear = function (req, res) {
  con.query(
    `update foriegn_trade_years set year = '${req.body.year}', export = '${req.body.export}', import = '${req.body.import}', re_export = '${req.body.re_export}' where id = '${req.body.id}'`,
    function (err, result) {
      if (err) {
        console.log(err + "67");
      } else {
        res.send({ status: true, data: [] });
      }
    }
  );
};

// post
foriegn_trade.AddForiengTradeCountries = function (req, res) {
  con.query(
    `insert into foriegn_trade_countries (country ,year, export, import , re_export) values ('${req.body.country}','${req.body.year}', '${req.body.export}', '${req.body.import}' , '${req.body.re_export}')`,
    function (err, result) {
      if (err) {
        console.log(err + "67");
      } else {
        res.send({ status: true, data: [] });
      }
    }
  );
};
//get
foriegn_trade.getCountriesYears = function (eq, res) {
  con.query(`SELECT year FROM foriegn_trade_countries`, function (err, result) {
    if (err) {
      console.log(err + "145");
    } else {
      res.send({ status: true, data: result });
    }
  });
};

// post
foriegn_trade.getForiCountriesForYear = function (req, res) {
  con.query(
    `select * from foriegn_trade_countries where year = '${req.body.year}'`,
    function (err, result) {
      if (err) {
        console.log(err + "78");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};

// post
foriegn_trade.removeForiCountriesForYear = function (req, res) {
  con.query(
    `delete from foriegn_trade_countries where id = '${req.body.id}' and year = '${req.body.year}'`,
    function (err, result) {
      if (err) {
        console.log(err + "78");
      } else {
        res.send({ status: true, data: [] });
      }
    }
  );
};

// post
foriegn_trade.updatedForiCountriesForYear = function (req, res) {
  con.query(
    `update foriegn_trade_countries set country = '${req.body.country}', year = '${req.body.year}', export = '${req.body.export}', import = '${req.body.import}', re_export = '${req.body.re_export}' where id = '${req.body.id}'`,
    function (err, result) {
      if (err) {
        console.log(err + "67");
      } else {
        res.send({ status: true, data: [] });
      }
    }
  );
};

// post
foriegn_trade.AddForiProduct = function (req, res) {
  con.query(
    `insert into foriegn_trade_products (title, export_import, unit) values ('${req.body.title}','${req.body.export_import}', '${req.body.unit}')`,
    function (err, result) {
      if (err) {
        console.log(err + "67");
      } else {
        res.send({ status: true, data: [] });
      }
    }
  );
};

// get
foriegn_trade.getAllForiProducts = function (req, res) {
  con.query(`select * from foriegn_trade_products `, function (err, result) {
    if (err) {
      console.log(err + "78");
    } else {
      res.send({ status: true, data: result });
    }
  });
};

// post
foriegn_trade.removeForiProduct = function (req, res) {
  con.query(
    `delete from foriegn_trade_products where id = '${req.body.id}'`,
    function (err, result) {
      if (err) {
        console.log(err + "78");
      } else {
        res.send({ status: true, data: [] });
      }
    }
  );
};

// post
foriegn_trade.updatedForiProduct = function (req, res) {
  con.query(
    `update foriegn_trade_products set export_import = '${req.body.export_import}', title = '${req.body.title}', unit = '${req.body.unit}' where id = '${req.body.id}'`,
    function (err, result) {
      if (err) {
        console.log(err + "67");
      } else {
        res.send({ status: true, data: [] });
      }
    }
  );
};

// post
foriegn_trade.AddForiProdAnnual = function (req, res) {
  console.log(req.body);
  con.query(
    `select * from foriegn_trade_products_annual where year = '${req.body.year}' and product_id = '${req.body.product_id}'`,
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        if (result.length > 0) {
          con.query(
            `update foriegn_trade_products_annual set value_unit = '${req.body.value_unit}', value_SDG = '${req.body.value_SDG}' where product_id = '${req.body.product_id}' and year = '${req.body.year}'`,
            function (err, result) {
              if (err) {
                console.log(err + "67");
              } else {
                res.send({ status: true, data: [] });
                console.log("update");
              }
            }
          );
        } else {
          con.query(
            `insert into foriegn_trade_products_annual (product_id, year, value_unit, value_SDG) values ('${req.body.product_id}','${req.body.year}', '${req.body.value_unit}','${req.body.value_SDG}')`,
            function (err, result) {
              if (err) {
                console.log(err + "67");
              } else {
                res.send({ status: true, data: [] });
                console.log("insert");
              }
            }
          );
        }
      }
    }
  );
};

// get
foriegn_trade.getAllForiProdAnnual = function (req, res) {
  con.query(
    `select ftpa.id,ftpa.product_id,ftp.export_import,ftpa.year,sum(ftpa.value_unit) as value_unit,sum(ftpa.value_SDG) as value_SDG,ftp.title,ftp.export_import,ftp.unit from foriegn_trade_products_annual ftpa inner join foriegn_trade_products ftp on ftp.id =   ftpa.product_id GROUP by ftpa.product_id,ftpa.year`,
    function (err, result) {
      if (err) {
        console.log(err + "78");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};

// post
foriegn_trade.removeForiProdAnnual = function (req, res) {
  con.query(
    `delete from foriegn_trade_products_annual where id = '${req.body.id}' and year = '${req.body.year}')`,
    function (err, result) {
      if (err) {
        console.log(err + "78");
      } else {
        res.send({ status: true, data: [] });
      }
    }
  );
};

// post
foriegn_trade.APIsupdatedForiProdAnnual = function (req, res) {
  console.log(req.body);
  con.query(
    `update foriegn_trade_products_annual set ${req.body.type} = '${req.body.value}' where id = '${req.body.id}' AND year ='${req.body.year}'`,
    function (err, result) {
      if (err) {
        console.log(err + "67");
      } else {
        res.send({ status: true, data: [] });
      }
    }
  );
};
foriegn_trade.insertForeignTradeYears = function (req, res) {
  console.log(req.body);
  req.body.forEach(function (record){
      con.query(`select count(*) as tot from foriegn_trade_years where year='${record["Year"]}'`,function (err,result){
          if(err){
             return console.log("330 "+err)
          }
          if(result[0].tot==0)
              var q=`insert into foriegn_trade_years (year, export, import, re_export) values ('${record["Year"]}', '${record["Export"]}', '${record["Import"]}' , '${record["Re Export"]}')`
          else
              var q=`update foriegn_trade_years set export='${record["Export"]}',import='${record["Import"]}',re_export='${record["Re Export"]}' where year='${record["Year"]}'`
          con.query(q,function (err, result) {
                  if (err)
                      console.log("338 "+err);

              });
      })

  })
    res.send({ status: true, data: [] });
};
foriegn_trade.insertForeignTradeCountries = function (req, res) {
  console.log(req.body);
  req.body.forEach(function (record){
      con.query(`select count(*) as tot from foriegn_trade_countries where year='${record["Year"]}' and country='${record["Country"]}'`,function (err,result){
          if(err){
              return console.log("330 "+err)
          }
          if(result[0].tot==0)
              var q=`insert into foriegn_trade_countries (country,year, export, import, re_export) values ('${record["Country"]}','${record["Year"]}', '${record["Export"]}', '${record["Import"]}' , '${record["Re Export"]}')`
          else
              var q=`update foriegn_trade_countries set export='${record["Export"]}',import='${record["Import"]}',re_export='${record["Re Export"]}' where year='${record["Year"]}' and country='${record["Country"]}'`
      con.query(q,function (err, result) {
              if (err)
                  console.log("360 "+err);

          });
  })
  })
    res.send({ status: true, data: [] });
};
foriegn_trade.insertForeignTradeProductsFromExcel = function (req, res) {
    console.log(req.body);
    req.body.forEach(function (product){
        con.query(`select count(*) as tot from foriegn_trade_products where title='${product.product}'`,function (err,result){
            function tmp(){
                product.years.forEach(function (product_year){
                    con.query(`select * from foriegn_trade_products_annual where year = '${product_year.year}' and product_id = (select id from foriegn_trade_products where title = '${product.product}' )`,function (err, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                if (result.length > 0) {
                                    con.query(`update foriegn_trade_products_annual set value_unit = '${product_year.unit}', value_SDG = '${product_year.value}' where product_id = (select id from foriegn_trade_products where title = '${product.product}' ) and year = ${product_year.year}`,function (err, result) {
                                            if (err) {
                                                console.log(err + "381");
                                            } else {
                                                console.log("update");
                                            }
                                        }
                                    );
                                } else {
                                    con.query(`insert into foriegn_trade_products_annual (product_id, year, value_unit, value_SDG) values ((select id from foriegn_trade_products where title = '${product.product}' ),'${product_year.year}', '${product_year.unit}','${product_year.value}')`,function (err, result) {
                                            if (err) {
                                                console.log(err + " 388");
                                            } else {
                                                console.log("insert");
                                            }
                                        }
                                    );
                                }
                            }
                        }
                    );
                })
            }
            if(result[0].tot>0){
                tmp()
            }
            else{
                con.query(`insert into foriegn_trade_products(title) values('${product.product}')`,tmp)
            }
        })
    })
    setTimeout(()=>{
        res.send({ status: true, data: [] });
    },400)
};

module.exports = foriegn_trade;
