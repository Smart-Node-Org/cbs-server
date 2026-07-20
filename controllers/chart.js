var { con } = require("../db/db");
const utils = require("../utils/utils");
const jwt = require("jsonwebtoken");
const libre = require('libreoffice-convert');
const path = require('path');
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { RSA_NO_PADDING } = require("constants");
const { result } = require("lodash");
const { query } = require("express");
const spawn = require('child_process').spawn

// const {compact} = require('lodash');
var chart= {}

//getReport

chart.getReport =function(req,res){
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
                utils.createCpiSectionChart(result).then(function(resp){
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
chart.getEconomicParams=function(req,res){
    con.query(`select (SELECT  json_arrayagg(cast(year as char)) from (select  DISTINCT year  from gdp_main_annual order by year) tmp) as years,
(select json_arrayagg(json_object("id",id,"title",title,"sub",(select json_arrayagg(json_object("id",id,"title",title)) from gdp_sub where gdp_main_id=gdp_main.id))) from gdp_main) as gdp_main`, function(err, gdp) {
        if (err) {
            console.log(err + "49");
            res.send({status:false,msg:"Failed to get economic parameters 1"})
        } else {
            con.query(`select (SELECT json_arrayagg(country) from (select DISTINCT country from foriegn_trade_countries) tmp1) countries,
(SELECT json_arrayagg(cast(year as char)) from (select DISTINCT year from foriegn_trade_countries) tmp11) countries_years,
(SELECT json_arrayagg(title) from (select DISTINCT title from foriegn_trade_products) tmp2) products,
(SELECT json_arrayagg(cast(year as char)) from (select DISTINCT year from foriegn_trade_products_annual order by year) tmp22) products_years,
(SELECT json_arrayagg(cast(year as char)) from (select DISTINCT year from foriegn_trade_years order by year) tmp3) general_years`, function(err, foriegn) {
                if (err) {
                    console.log(err + "53");
                    res.send({status:false,msg:"Failed to get economic parameters 2"})
                } else {
                    con.query(`select (SELECT json_arrayagg(json_object("year",cast(year as char),"months",(select json_arrayagg(month) from cpi_sudan_section where year=tmp1.year and rural_standard is not null))) from (SELECT DISTINCT year from cpi_sudan_section order by year) tmp1) as cpi_sudan_sections_years,
(SELECT json_arrayagg(json_object("year",cast(year as char),"months",(select json_arrayagg(month) from cpi_sudan_community where year=tmp2.year and l1_standard is not null))) from (SELECT DISTINCT year from cpi_sudan_community order by year) tmp2) as cpi_sudan_community_years,
(SELECT json_arrayagg(json_object("year",cast(year as char),"months",(select json_arrayagg(month) from inflation_sudan_section where year=tmp3.year))) from (SELECT DISTINCT year from inflation_sudan_section order by year) tmp3) as inflation_sudan_section_years,
(SELECT json_arrayagg(json_object("year",cast(year as char),"months",(select json_arrayagg(month) from inflation_sudan_community where year=tmp4.year))) from (SELECT DISTINCT year from inflation_sudan_community order by year) tmp4) as inflation_sudan_community_years,

(SELECT json_arrayagg(json_object("year",cast(year as char),"months",(select json_arrayagg(month) from cpi_states_section where year=tmp5.year and rural_standard is not null))) from (SELECT DISTINCT year from cpi_states_section order by year) tmp5) as cpi_states_sections_years,
(SELECT json_arrayagg(json_object("year",cast(year as char),"months",(select json_arrayagg(month) from cpi_states_community where year=tmp6.year and l1_standard is not null))) from (SELECT DISTINCT year from cpi_states_community order by year) tmp6) as cpi_states_community_years,
(SELECT json_arrayagg(json_object("year",cast(year as char),"months",(select json_arrayagg(month) from inflation_states_section where year=tmp7.year))) from (SELECT DISTINCT year from inflation_states_section order by year) tmp7) as inflation_states_section_years,
(SELECT json_arrayagg(json_object("year",cast(year as char),"months",(select json_arrayagg(month) from inflation_states_community where year=tmp8.year))) from (SELECT DISTINCT year from inflation_states_community order by year) tmp8) as inflation_states_community_years,

(SELECT json_arrayagg(json_object("year",cast(year as char),"months",(select json_arrayagg(month) from cpi_product_section where year=tmp9.year and rural_standard is not null))) from (SELECT DISTINCT year from cpi_product_section order by year) tmp9) as cpi_product_sections_years,
(SELECT json_arrayagg(json_object("year",cast(year as char),"months",(select json_arrayagg(month) from cpi_product_community where year=tmp10.year and l1_standard is not null))) from (SELECT DISTINCT year from cpi_product_community order by year) tmp10) as cpi_product_community_years,
(SELECT json_arrayagg(json_object("year",cast(year as char),"months",(select json_arrayagg(month) from inflation_product_section where year=tmp11.year))) from (SELECT DISTINCT year from inflation_product_section order by year) tmp11) as inflation_product_section_years,
(SELECT json_arrayagg(json_object("year",cast(year as char),"months",(select json_arrayagg(month) from inflation_product_community where year=tmp12.year))) from (SELECT DISTINCT year from inflation_product_community order by year) tmp12) as inflation_product_community_years,

(select json_arrayagg(name) from cpi_products) cpi_products
`, function(err, cpi) {
                        if (err) {
                            console.log(err + "81");
                            res.send({status:false,msg:"Failed to get economic parameters 3"})
                        } else {
                            con.query(`select (SELECT json_arrayagg(json_object("title",title,"products",(SELECT json_arrayagg(json_object("id",products.id,"title",title,"main_valueTitle",main_valueTitle,"sub_valueTiltle",sub_valueTiltle)) from products where sector_id=sectors.id))) from sectors) sectors,
(SELECT json_arrayagg(cast(year as char)) from (select DISTINCT year from sectors_annual order by year) tmp1) sectors_annual_years,
(SELECT json_arrayagg(cast(year as char)) from (select DISTINCT year from product_annual order by year) tmp2) product_annual_years`, function(err, sectors) {
                                if (err) {
                                    console.log(err + "89");
                                    res.send({status:false,msg:"Failed to get economic parameters 4"})
                                } else {
                                    con.query(`SELECT json_arrayagg(json_object("id",id,"name",name)) states from states`, function(err, states) {
                                        if (err) {
                                            console.log(err + "94");
                                            res.send({status:false,msg:"Failed to get economic parameters 5"})
                                        } else {
                                            res.send({status:true,sectors:sectors,cpi:cpi,foriegn:foriegn,gdp:gdp,states:states[0].states})
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}
chart.getSocialParams=function(req,res){
    con.query(`SELECT (SELECT json_arrayagg(cast(year as char)) from (select DISTINCT year from population) tmp1) population_years,
(SELECT json_arrayagg(cast(year as char)) from (select DISTINCT year from population_data) tmp2) population_data_years,
(select json_arrayagg(json_object("id",id,"title",title)) from age_group) age_groups,
(SELECT json_arrayagg(json_object("id",id,"name",name)) from states) states`, function(err, pop) {
        if (err) {
            console.log(err + "89");
            res.send({status:false,msg:"Failed to get economic parameters 1"})
        } else {
            if(pop.length>0)
                res.send({status:true,pop:pop[0]})
            else
                res.send({status:true,pop:{}})
        }
    })
}
chart.gdpInteractive=function(req,res){
    if(req.body.type=='sudan'){
        var years="('"+req.body.years.join("','")+"')"
        con.query(`SELECT  DISTINCT gdp_main.id as main_id ,gdp_main.title as main_title,
  (SELECT json_arrayagg(json_object('id',id,'title',title)) from gdp_sub WHERE gdp_main_id =main_id ) as sub,
  (SELECT json_arrayagg(json_object('years',cast(year as char),'total_gdp',tot_gdp)) from gdp_main_annual WHERE gdp_main_id =main_id
  )as years
  from gdp_main_annual 
  JOIN gdp_main on gdp_main.id = gdp_main_annual.gdp_main_id where year in ${years}
`, function(err, result) {
            if (err) {
                console.log(err + "60");
            } else {
                res.send({
                    status: true,
                    data: result
                })
            }
        })

    }
    else if(req.body.type=='states'){

    }
}
chart.ExportInteractiveSectorial=function(req,res){
    console.log(req.query)
    var products
    var states
    var years="('"+JSON.parse(req.query.selectedYears).join("','")+"')"

    if(req.query.selectedProducts!='[]')
        products="('"+req.query.selectedProducts.join("','")+"')"
    if(req.query.selectedStates!='[]')
        var states="('"+JSON.parse(req.query.selectedStates).join("','")+"')"
    if(!products){
        con.query(`select json_arrayagg(json_object("year",cast(year as char),"rates",(select json_arrayagg(json_object("sector",(select title from sectors where id=sector_id),"Contribution_rate",Contribution_rate)) from sectors_annual where year=outerT.year))) data from (select DISTINCT year from sectors_annual where year in ${years}) outerT`,function (err,result) {
            if (err) {
                console.log(err + "60");
            } else {
                console.log(result[0])
                var import_id=Math.random()*10000
                var py=spawn('python',['sectorialYears.py',result[0].data,import_id],{
                    stdio: 'pipe'
                })
                py.on('exit', () => {
                    if(req.query.type=="Excel") {
                        var data = fs.readFileSync(import_id + ".xlsx")
                        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(data);
                        fs.unlinkSync(import_id + ".xlsx")
                    }
                    else if(req.query.type=='PDF'){
                        const file = fs.readFileSync(import_id + ".xlsx");
                        libre.convert(file, '.pdf', undefined, (err, done) => {
                            if (err) {
                                console.log(`Error converting file: ${err}`);
                            }
                            res.set('Content-Type', 'application/pdf').send(done);
                            fs.unlinkSync(import_id + ".xslx")
                        });

                    }
                })

            }
        })
    }
    else if(products && !states){
        con.query(`select (SELECT  json_arrayagg(json_object("year",cast(year as char),"products",get_sectoral_products(tmp.year))) from (select  DISTINCT year  from  product_annual where year in ${years}) tmp) as data `,function (err,result) {
            if (err) {
                console.log(err + "60");
            } else {
                var import_id=Math.random()*10000
                var py=spawn('python',['sectorial_products.py',result[0].data,import_id],{
                    stdio: 'pipe'
                })
                py.on('exit', () => {
                    var data=fs.readFileSync(import_id+".xlsx")
                    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(data);
                    fs.unlinkSync(import_id+".xlsx")
                })
            }
        })
    }
    else if(products && states){
        var promises=states.map(function (state) {
            return new Promise(function (resolve,reject) {
                con.query(`select (SELECT  json_arrayagg(json_object("year",cast(year as char),"products",get_sectoral_products_states(tmp.year,${state}))) data from (select  DISTINCT year  from  product_annual where year in ${years}) tmp) as years,(select name from states where id=${state}) state`,function (err,result) {
                    if (err) {
                        console.log(err + "60");
                    } else {
                        resolve({state:result[0].state,years:result[0].years})
                    }
                })
            })
        })
        Promise.all(promises).then(function (data) {
            var import_id=Math.random()*10000
            var py=spawn('python',['sectorial_products_states.py',data,import_id],{
                stdio: 'pipe'
            })
            py.on('exit', () => {
                var data=fs.readFileSync(import_id+".xlsx")
                res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(data);
                fs.unlinkSync(import_id+".xlsx")
            })
        })

    }

}
chart.ExportInteractiveForiegn=function(req,res){
    console.log(req.body)
    var countries
    var products
    var years="('"+req.query.selectedYears.join("','")+"')"
    if(req.query.selectedCountries)
        countries="('"+req.query.selectedCountries.join("','")+"')"
    if(req.query.selectedProducts)
        products=req.query.selectedProducts.join(",")

    if(!countries)
        con.query(`select json_arrayagg(json_object("export",export,"import",import,"re_export",re_export,"year",cast(year as char))) data from foriegn_trade_years where year in ${years}`,function (err,result) {
            if (err) {
                console.log(err + "60");
            } else {
                var import_id=Math.random()*10000
                var py=spawn('python',['foriegnYears.py',result[0].data,import_id],{
                    stdio: 'pipe'
                })
                py.on('exit', () => {
                    var data=fs.readFileSync(import_id+".xlsx")
                    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(data);
                    fs.unlinkSync(import_id+".xlsx")
                })
            }
        })
    else if(countries){
        con.query(`SELECT json_arrayagg(json_object("country",country,"trade",(select json_arrayagg(json_object("export",COALESCE(export, 0),"import",COALESCE(import, 0),"re_export",COALESCE(re_export, 0),"year",cast(year as char))) from foriegn_trade_countries where year in ${years} and country=tmp1.country))) data from (select DISTINCT country from foriegn_trade_countries where country in ${countries}) tmp1`,function (err,result) {
            if (err) {
                console.log(err + "60");
            } else {
                var import_id=Math.random()*10000
                var py=spawn('python',['foriegnYearsCountries.py',result[0].data,import_id],{
                    stdio: 'pipe'
                })
                py.on('exit', () => {
                    var data=fs.readFileSync(import_id+".xlsx")
                    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(data);
                    fs.unlinkSync(import_id+".xlsx")
                })
            }
        })
    }
    else if(products){
        con.query(`select json_arrayagg(json_object("year",cast(year as char),"products",get_foriegn_products(year,'${products}'))) data from (SELECT DISTINCT year from foriegn_trade_products_annual where year in ${years} order by year) tmp1`,function (err,result) {
            if (err) {
                console.log(err + "60");
            } else {
                var import_id=Math.random()*10000
                var py=spawn('python',['foriegnYearsProducts.py',result[0].data,import_id],{
                    stdio: 'pipe'
                })
                py.on('exit', () => {
                    var data=fs.readFileSync(import_id+".xlsx")
                    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(data);
                    fs.unlinkSync(import_id+".xlsx")
                })
            }
        })
    }

}
chart.ExportInteractiveGdp=function(req,res){
    console.log(req.body)
    var mainId=req.query.selectedGdpMain
    var states
    var sub
    var years="('"+req.query.selectedYears.join("','")+"')"
    if(req.query.states)
        states="('"+req.query.selectedStates.join("','")+"')"

    if(req.query.selectedGdpSub)
        sub=req.query.selectedGdpSub.join(",")
    if(!sub){
        con.query(``,function (err,result) {
            if (err) {
                console.log(err + "60");
            } else {
                var x=5
                utils.createSectorAnnualChart(result).then(function(resp){
                    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(resp);
                })
            }
        })
    }
    else if(products && states){
        var promises=states.map(function (state) {
            return new Promise(function (resolve,reject) {
                con.query(`select (SELECT  json_arrayagg(json_object("year",cast(year as char),"products",get_sectoral_products_states(tmp.year,${state}))) from (select  DISTINCT year  from  product_annual where year in ${years}) tmp) as years,(select name from states where id=${state}) state`,function (err,result) {
                    if (err) {
                        console.log(err + "60");
                    } else {
                        resolve({state:result[0].state,years:result[0].years})
                    }
                })
            })
        })
        Promise.all(promises).then(function (resps) {
            utils.createSectorAnnualChart(resps).then(function(resp){
                res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(resp);

            })
        })

    }
    else{
        con.query(`select json_arrayagg(json_object("state",name,"years",(select json_arrayagg(json_object("year",cast(year as char),"sub",get_gdp_states(states.id,year,${sub})  )) from (select DISTINCT year from gdp_annual where year in ${years}) tmp ) )) from states where id in ${states} `,function (err,result) {
            if (err) {
                console.log(err + "60");
            } else {
                utils.createSectorAnnualChart(result).then(function(resp){
                    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(resp);

                })
            }
        })
    }


}
chart.ExportInteractiveCpi=function(req,res){
    console.log(req.query)
    console.log(req.query.time_base)
    /*

    section:sudan,states,products
    level:sections,community
    time_base:years,months,
    selectedMonths:$scope.deprtData.selectedMonths,
    states:$scope.selectedStates

     */
    if(req.query.time_base=='years')
       var years="('"+req.query.selectedYears.join("','")+"')"
    else {
        var year = req.query.selectedYear
        var months="('"+req.query.selectedMonths.join("','")+"')"

    }
    if(req.query.states && req.query.states!=[])
        var states="('"+req.query.states.join("','")+"')"
    if(req.query.section=='sudan' && req.query.time_base=='years'){
        con.query(`select * from cpi_sudan_${req.query.level=='sections'?'section':'community'} where year in ${years} and month=0`,function (err,result) {
            if (err) {
                console.log(err + "60");
            } else {
                console.log(result[0])
                var import_id=Math.random()*10000
                var py=spawn('python',['cpi_sudan_years.py',JSON.stringify(result),import_id,req.query.level],{
                    stdio: 'pipe'
                })
                py.on('exit', () => {
                    if(req.query.type=="Excel") {
                        var data = fs.readFileSync(import_id + ".xlsx")
                        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(data);
                        fs.unlinkSync(import_id + ".xlsx")
                    }
                    else if(req.query.type=='PDF'){
                        const file = fs.readFileSync(import_id + ".xlsx");
                        libre.convert(file, '.pdf', undefined, (err, done) => {
                            if (err) {
                                console.log(`Error converting file: ${err}`);
                            }
                            res.set('Content-Type', 'application/pdf').send(data);
                            fs.unlinkSync(import_id + ".pdf")
                        });

                    }
                })

            }
        })
    }
    else if(req.query.section=='sudan' && req.query.time_base=='months'){
        con.query(`select * from cpi_sudan_${req.query.level=='sections'?'section':'community'} where year='${year}' and month in ${months}`,function (err,result) {
            if (err) {
                console.log(err + "60");
            } else {
                console.log(result[0])
                var import_id=Math.random()*10000
                var py=spawn('python',['cpi_sudan_months.py',JSON.stringify(result),import_id,req.query.level,req.query.selectedYear],{
                    stdio: 'pipe'
                })
                py.on('exit', () => {
                    if(req.query.type=="Excel") {
                        var data = fs.readFileSync(import_id + ".xlsx")
                        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(data);
                        fs.unlinkSync(import_id + ".xlsx")
                    }
                    else if(req.query.type=='PDF'){
                        const file = fs.readFileSync(import_id + ".xlsx");
                        libre.convert(file, '.pdf', undefined, (err, done) => {
                            if (err) {
                                console.log(`Error converting file: ${err}`);
                            }
                            res.set('Content-Type', 'application/pdf').send(data);
                            fs.unlinkSync(import_id + ".pdf")
                        });

                    }
                })

            }
        })
    }
    else if(req.query.section=='states' && req.query.time_base=='years'){
        console.log(states)
        con.query(`select id,name from states where id in ${states}`,function (err,result) {
            var promises=result.map(function (state) {
                return new Promise(function (resolve, reject) {

                    con.query(`select * from cpi_states_${req.query.level=='sections'?'section':'community'} where year in ${years} and month=0 and state_id=${state.id}`,function (err,result) {
                        if (err) {
                            console.log(err + "60");
                            reject(err)
                        } else {
                            resolve({state:state.name,data:result})
                        }
                    })

                })
            })
            Promise.all(promises).then(function (states) {
                var import_id=Math.random()*10000
                console.log(JSON.stringify(states),import_id,req.query.level)
                var py=spawn('python',['cpi_states_years.py',JSON.stringify(states),import_id,req.query.level],{
                    stdio: 'pipe'
                })
                py.on('exit', () => {
                    if(req.query.type=="Excel") {
                        var data = fs.readFileSync(import_id + ".xlsx")
                        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(data);
                        fs.unlinkSync(import_id + ".xlsx")
                    }
                    else if(req.query.type=='PDF'){
                        const file = fs.readFileSync(import_id + ".xlsx");
                        libre.convert(file, '.pdf', undefined, (err, done) => {
                            if (err) {
                                console.log(`Error converting file: ${err}`);
                            }
                            res.set('Content-Type', 'application/pdf').send(data);
                            fs.unlinkSync(import_id + ".pdf")
                        });

                    }
                })

            })
        })

    }
    else if(req.query.section=='states' && req.query.time_base=='months'){
        console.log(states)
        con.query(`select id,name from states where id in ${states}`,function (err,result) {
            var promises=result.map(function (state) {
                return new Promise(function (resolve, reject) {

                    con.query(`select * from cpi_states_${req.query.level=='sections'?'section':'community'} where year='${year}' and month in ${months} and state_id=${state.id}`,function (err,result) {
                        if (err) {
                            console.log(err + "60");
                            reject(err)
                        } else {
                            resolve({state:state.name,data:result})
                        }
                    })

                })
            })
            Promise.all(promises).then(function (states) {
                var import_id=Math.random()*10000
                console.log(JSON.stringify(states),import_id,req.query.level)
                var py=spawn('python',['cpi_states_months.py',JSON.stringify(states),import_id,req.query.level,req.query.selectedYear],{
                    stdio: 'pipe'
                })
                py.stderr.on("data",function (data) {
                    console.log(data.toString())
                })
                py.on('exit', () => {
                    if(req.query.type=="Excel") {
                        var data = fs.readFileSync(import_id + ".xlsx")
                        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(data);
                        fs.unlinkSync(import_id + ".xlsx")
                    }
                    else if(req.query.type=='PDF'){
                        const file = fs.readFileSync(import_id + ".xlsx");
                        libre.convert(file, '.pdf', undefined, (err, done) => {
                            if (err) {
                                console.log(`Error converting file: ${err}`);
                            }
                            res.set('Content-Type', 'application/pdf').send(data);
                            fs.unlinkSync(import_id + ".pdf")
                        });

                    }
                })

            })
        })

    }
    else if(req.query.section=='products' && req.query.time_base=='years'){
        console.log(states)
        con.query(`select id,name from cpi_products where id in ${states}`,function (err,result) {
            var promises=result.map(function (state) {
                return new Promise(function (resolve, reject) {

                    con.query(`select * from cpi_states_${req.query.level=='sections'?'section':'community'} where year in ${years} and month=0 and state_id=${state.id}`,function (err,result) {
                        if (err) {
                            console.log(err + "60");
                            reject(err)
                        } else {
                            resolve({state:state.name,data:result})
                        }
                    })

                })
            })
            Promise.all(promises).then(function (states) {
                var import_id=Math.random()*10000
                console.log(JSON.stringify(states),import_id,req.query.level)
                var py=spawn('python',['cpi_states_years.py',JSON.stringify(states),import_id,req.query.level],{
                    stdio: 'pipe'
                })
                py.on('exit', () => {
                    if(req.query.type=="Excel") {
                        var data = fs.readFileSync(import_id + ".xlsx")
                        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(data);
                        fs.unlinkSync(import_id + ".xlsx")
                    }
                    else if(req.query.type=='PDF'){
                        const file = fs.readFileSync(import_id + ".xlsx");
                        libre.convert(file, '.pdf', undefined, (err, done) => {
                            if (err) {
                                console.log(`Error converting file: ${err}`);
                            }
                            res.set('Content-Type', 'application/pdf').send(data);
                            fs.unlinkSync(import_id + ".pdf")
                        });

                    }
                })

            })
        })

    }
    else if(req.query.section=='products' && req.query.time_base=='months'){
        console.log(states)
        con.query(`select id,name from states where id in ${states}`,function (err,result) {
            var promises=result.map(function (state) {
                return new Promise(function (resolve, reject) {

                    con.query(`select * from cpi_states_${req.query.level=='sections'?'section':'community'} where year='${year}' and month in ${months} and state_id=${state.id}`,function (err,result) {
                        if (err) {
                            console.log(err + "60");
                            reject(err)
                        } else {
                            resolve({state:state.name,data:result})
                        }
                    })

                })
            })
            Promise.all(promises).then(function (states) {
                var import_id=Math.random()*10000
                console.log(JSON.stringify(states),import_id,req.query.level)
                var py=spawn('python',['cpi_states_months.py',JSON.stringify(states),import_id,req.query.level,req.query.selectedYear],{
                    stdio: 'pipe'
                })
                py.stderr.on("data",function (data) {
                    console.log(data.toString())
                })
                py.on('exit', () => {
                    if(req.query.type=="Excel") {
                        var data = fs.readFileSync(import_id + ".xlsx")
                        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(data);
                        fs.unlinkSync(import_id + ".xlsx")
                    }
                    else if(req.query.type=='PDF'){
                        const file = fs.readFileSync(import_id + ".xlsx");
                        libre.convert(file, '.pdf', undefined, (err, done) => {
                            if (err) {
                                console.log(`Error converting file: ${err}`);
                            }
                            res.set('Content-Type', 'application/pdf').send(data);
                            fs.unlinkSync(import_id + ".pdf")
                        });

                    }
                })

            })
        })

    }

}




module.exports=chart