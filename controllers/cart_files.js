var { con } = require("../db/db");
const utils = require("../utils/utils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { RSA_NO_PADDING } = require("constants");
const { result } = require("lodash");
const { query } = require("express");
// const {compact} = require('lodash');
var chart= {}

//getReport
 chart.getReport =function(req,res){
   console.log(req.query);
if(req.query.type=='gdpSudan'){
		 con.query(`SELECT  DISTINCT gdp_main.id as main_id ,gdp_main.title as main_title,
  (SELECT json_arrayagg(json_object('id',id,'title',title)) from gdp_sub WHERE gdp_main_id =main_id ) as sub,
  (SELECT json_arrayagg(json_object('years',cast(year as char),'total_gdp',tot_gdp)) from gdp_main_annual WHERE gdp_main_id =main_id
  )as years
  from gdp_main_annual 
  JOIN gdp_main on gdp_main.id = gdp_main_annual.gdp_main_id
`, function(err, result) {
    if (err) {
      console.log(err + "60");
    } else {
      utils.createGdpSudanChart(result).then(function(resp){
	      res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(resp);

	  })
    }
  })	
	}
	else if(req.query.type=='cpiSudanSections'){
		 con.query(`select id,standard_year,month, sum(urban_standard) as urban_standard,sum(urban_ongoing) as urban_ongoing,sum(rural_standard) as rural_standard,sum(rural_ongoing) as rural_ongoing,year from cpi_sudan_section group by year`, function(err, result) {
    if (err) {
      console.log(err + "67");
    } else {
      utils.createCpiSudanSectionChart(result).then(function(resp){
	      res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(resp);

	  })
    }
  })	
	}
	else if(req.query.type=='cpiSudanSections'){
		 con.query(`select id,standard_year,month, sum(urban_standard) as urban_standard,sum(urban_ongoing) as urban_ongoing,sum(rural_standard) as rural_standard,sum(rural_ongoing) as rural_ongoing,year from cpi_sudan_section group by year`, function(err, result) {
    if (err) {
      console.log(err + "67");
    } else {
      utils.createCpiSudanSectionChart(result).then(function(resp){ 
	      res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(resp);

	  })
    }
  })	
	}
	else if(req.query.type=='foriegnSudan'){
		 con.query(`select * from foriegn_trade`, function(err, result) {
    if (err) {
      console.log(err + "67");
    } else {
      utils.createForiegnTradeSudanChart(result).then(function(resp){
	      res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(resp);

	  })
    }
  })	
	}
}




module.exports=chart