var { con } = require("./../db/db");
const utils = require("../utils/utils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { RSA_NO_PADDING } = require("constants");
const { result } = require("lodash");
const { query } = require("express");
// const {compact} = require('lodash');
var sector = {};

sector.AddSectors = function (req, res) {
  con.query(
    `insert into sectors (title) values ('${req.body.title}')`,
    function (err, result) {
      if (err) {
        console.log(err + "15");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};

sector.updateSector = function (req, res) {
  console.log("UpdateSector");
  console.log(req.body);
  con.query(
    `UPDATE   sectors SET  title = '${req.body.title}' WHERE id = '${req.body.id}'`,
    function (err, result) {
      if (err) {
        console.log(err + "15");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};

sector.deleteSector = function (req, res) {
  console.log("DeleteSector");
  console.log(req.body);
  con.query(
    `DELETE FROM    sectors  WHERE id = '${req.body.id}'`,
    function (err, result) {
      if (err) {
        console.log(err + "15");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};

sector.AddProductSector = function (req, res) {
  console.log(req.body);
  con.query(
    `insert into products (sector_id,title,main_valueTitle,sub_valueTiltle,Unit,production) 
        values ('${req.body.sector_id}','${req.body.title}','${req.body.main_valueTitle}','${req.body.sub_valueTitle}','${req.body.unit}',${req.body.production})`,
    function (err, result) {
      if (err) {
        console.log(err + "36");
      } else {
        res.send({ status: true });
      }
    }
  );
};

sector.getAllSectors = function (req, res) {
  con.query(`select * from sectors`, function (err, result) {
    if (err) {
      console.log(err + "46");
    } else {
      res.send({ status: true, data: result });
    }
  });
};

sector.getAllProductSector = function (req, res) {
  con.query(
    `select products.*,products.title, sector_id , s.title as sector_title from products
  INNER JOIN sectors s ON  s.id = sector_id`,
    function (err, result) {
      if (err) {
        console.log(err + "56");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};

sector.updateProductSector = function (req, res) {
  console.log("updateProductSector");
  console.log(req.body);
  con.query(
    `UPDATE products SET sector_id='${req.body.sector_id}',title='${req.body.title}',main_valueTitle='${req.body.main_valueTitle}',sub_valueTiltle='${req.body.sub_valueTiltle}',unit='${req.body.unit}',production='${req.body.production}' WHERE id ='${req.body.id}'  `,
    function (err, result) {
      if (err) {
        console.log(err + "56");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};

sector.deleteProductSector = function (req, res) {
  console.log("deleteProductSector");
  console.log(req.body);
  con.query(
    `DELETE FROM products  WHERE id ='${req.body.id}'  `,
    function (err, result) {
      if (err) {
        console.log(err + "56");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};

sector.AddSectorsAnnual = function (req, res) {
  console.log("AddSectorsAnnual");
  console.log(req.body);
  con.query(
    ` insert into sectors_annual(sector_id,year,Contribution_rate,growth_rate)
    values('${req.body.sector_id}','${req.body.year}','${req.body.Contribution_rate}','${req.body.growth_rate}')`,
    function (err, result) {
      if (err) {
        console.log(err + "56");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};

sector.updateSectorsAnnualYear = function (req, res) {
  console.log("updateSectorsAnnualYear");
  console.log(req.body);
  con.query(
    ` UPDATE  sectors_annual SET sector_id='${req.body.sector_id}',year='${req.body.year}',Contribution_rate='${req.body.Contribution_rate}',growth_rate='${req.body.growth_rate}' WHERE id ='${req.body.id}'
    `,
    function (err, result) {
      if (err) {
        console.log(err + "56");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};

sector.deleteSectorsAnnualYear = function (req, res) {
  console.log("deleteSectorsAnnualYear");
  console.log(req.body);
  con.query(
    ` DELETE FROM   sectors_annual    WHERE id ='${req.body.id}'
    `,
    function (err, result) {
      if (err) {
        console.log(err + "56");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};

sector.updateSectorsAnnualSector = function (req, res) {
  console.log("updateSectorsAnnualSector");
  console.log(req.body);
  con.query(
    ` UPDATE  sectors_annual SET sector_id='${req.body.sector_id}',year='${req.body.year}',Contribution_rate='${req.body.Contribution_rate}',growth_rate='${req.body.growth_rate}' WHERE id ='${req.body.id}'
    `,
    function (err, result) {
      if (err) {
        console.log(err + "56");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};

sector.getSectorsAnnualYear = function (req, res) {
  console.log("getSectorsAnnualYear");
  console.log(req.body);
  con.query(
    `SELECT  year ,sector_id ,s.title FROM   sectors_annual 
    INNER JOIN sectors s on s.id = sector_id group by year
    `,
    function (err, result) {
      if (err) {
        console.log(err + "56");
      } else {
        res.send({ status: true, data: result });
        // console.log(result);
      }
    }
  );
};

sector.getYearSectorsAnnual = function (req, res) {
  con.query(
    `select sectors_annual.id,sector_id ,s.title,year,
    (select json_arrayagg(json_object('Contribution_rate',Contribution_rate,'growth_rate',growth_rate)) from sectors_annual WHERE year = '${req.body.year}') as value
    from sectors_annual     
        INNER JOIN sectors s on s.id = sector_id 
        where year = '${req.body.year}' GROUP by year 
    `,
    function (err, result) {
      if (err) {
        console.log(err + "56");
      } else {
        res.send({ status: true, data: result });
        console.log(result);
      }
    }
  );
};

sector.getAllyearsforSector = function (req, res) {
  con.query(
    `select * from sectors_annual where sector_id = '${req.body.sector_id}'`,
    function (err, result) {
      if (err) {
        console.log(err + "90");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};

sector.AddproductAnnualforState = function (req, res) {
  console.log("AddproductAnnualforState");
  con.query(
    `insert into product_annual (product_id,year,state_id,main_valueTitle,sub_valueTiltle,production, productivity)
     VALUES ('${req.body.product_id}','${req.body.year}','${req.body.state_id}',${req.body.main_valueTitle ? req.body.main_valueTitle : '0'},'${req.body.sub_valueTitle ? req.body.sub_valueTitle : '0'}','${req.body.production ? req.body.production : 0}', '${req.body.productivity ? req.body.productivity : 0}')`,
    function (err, result) {
      if (err) {
        console.log(err + "100");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};
sector.getYears = function (req, res) {
  con.query(`select DISTINCT year from product_annual`, function (err, result) {
    if (err) {
      console.log(err + "253");
    } else {
      res.send({ status: true, data: result })
    }
  })
}

sector.getproductAnnualforState = function (req, res) {
  con.query(
    `select product_annual.*  , s.name as state_name , p.title as product_title from product_annual
    INNER JOIN products p on p.id = product_annual.product_id
    INNER JOIN states s on s.id = product_annual.state_id
    where year = '${req.body.year}'    
    `,
    function (err, result) {
      if (err) {
        console.log(err + "90");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};

sector.getSectorProduct = function (req, res) {
  console.log(req.body);
  con.query(
    `select * products where sector_id = '${req.body.sector_id}'`,
    function (err, result) {
      if (err) {
        console.log(err + "111");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};

sector.updateProductAnnualForState = function (req, res) {
  console.log(req.body);
  con.query(`update product_annual set ${req.body.type} = ${req.body.newValue} where id = '${req.body.productAnnual_id}' `, function (err, result) {
    if (err) {
      console.log(err + "297");
    } else {
      res.send({ status: true, data: [] })
    }
  })

}
sector.insertSectorsAnnualYears = function (req, res) {
  console.log(req.body);
  req.body.forEach(function (record){
    con.query(
        ` insert into sectors_annual(sector_id,year,Contribution_rate,growth_rate)
    values('${req.body.sector_id}','${req.body.year}','${req.body.Contribution_rate}','${req.body.growth_rate}')`,
        function (err, result) {
          if (err) {
            console.log("332 "+err);
          } else {

          }
        });
  })
  res.send({ status: true, data: [] });

}

module.exports = sector;
