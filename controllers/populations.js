var { con } = require("./../db/db");
const utils = require("../utils/utils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { RSA_NO_PADDING } = require("constants");
const { result } = require("lodash");
const { query } = require("express");
// const {compact} = require('lodash');
var pop = {};

pop.AddyearPOP = function (req, res) {
  con.query(
    `insert into population (year, gender, age_group_id, state_id, value) values ('${req.body.year}', '${req.body.gender}', '${req.body.age_group_id}', '${req.body.state_id}', '${req.body.value}') `,
    function (err, _result) {
      if (err) {
        console.log(err + "15");
      } else {
        res.send({ status: true });
      }
    }
  );
};

pop.getyearPOP = function (_req, res) {
  con.query(
    `select population.*,age_group.id as group_id,age_group.title from population inner join age_group on age_group.id = population.age_group_id `,
    function (err, result) {
      if (err) {
        console.log(err + "25");
      } else {
        res.send({ status: true, data: result });
      }
    }
  );
};

pop.getAgeGroup = function (_req, res) {
  console.log("get ag");
  con.query(`select * from age_group `, function (err, result) {
    if (err) {
      console.log(err + "25");
    } else {
      res.send({ status: true, data: result });
      console.log("get ag");
    }
  });
};

pop.removeyearPOP = function (req, res) {
  con.query(
    `delete from population where id = '${req.body.id}' `,
    function (err, _result) {
      if (err) {
        console.log(err + "35");
      } else {
        res.send({ status: true });
      }
    }
  );
};

pop.updateyearPOP = function (req, _res) {
  con.query(
    `update population set year = '${req.body.year}' , gender = '${req.body.gender}', age_group_id = '${req.body.age_group_id}', state_id = '${req.body.state_id}', value = '${req.body.value}' where id = '${req.body.id}'  `,
    function (_req, res) {
      if (err) {
        console.log(err + "35");
      } else {
        res.send({ status: true });
      }
    }
  );
};

pop.addPopulation = (req, res) => {
  console.log("addPopulation");
  console.log(req.body);
  console.log("///////////////");
  console.log(req.body[0].ageGroups);
  req.body.forEach(function(state,_stateIndex){  
	  state.ageGroups.forEach(function(age){
		  con.query(`INSERT INTO population (state_id,age_group_id,year,rural_male_value,rural_female_value,urban_male_value,urban_female_value) VALUES ('${state.id}','${age.id}','${age.year}','${age.rural_male_value}','${age.rural_female_value}','${age.urban_male_value}','${age.urban_female_value}')`,function(err,_result){
			  if(err){
				  console.log(err +'89')
			  }else{
				  console.log("success ..")
			  }
		  })
	  }) 
  })
    res.send({ status: true });
  /*con.query(``, function (err, result) {
    if (err) {
      console.log(err + "81");
    } else {
      res.send({ status: true });
    }
  });*/
  
};

pop.getPopulation = function(req, res){
	console.log("getPopulation");
	console.log(req.body);
	console.log("////////");
	con.query(`select pop.*,age.title,st.name from age_group age left join population pop on pop.age_group_id = age.id right join states st on pop.state_id = st.id where year = '${req.body.year}'`,function(err,result){
		if(err){
			console.log(err+"109");
		}else{
			console.log("success")
			res.send({status:true,data:result});
		}
	})
}


pop.updatePopulation =function(req,res){
  console.log("updatePopulation");
  console.log(req.body);
  con.query(`select count(*) as tot from population where state_id=${req.body.state_id} and age_group_id=${req.body.age_group_id} and year=${req.body.year}`,function (err,result){
      if(err){
          console.log("123 "+err)
          return res.send({status:false,msg:"Unexpected Error Occur"})
      }
      console.log("Found",result[0].tot)
      if(result[0].tot>0)
          var q = `update population set ${req.body.type} = ${req.body.value} where id = ${req.body.population_id}`
      else
          var q = `insert into population(state_id,age_group_id,year,${req.body.type}) values(${req.body.state_id},${req.body.age_group_id},${req.body.year},${req.body.value})`
      console.log(q)
      con.query(q,function(err,result){
          if(err){
              res.send({status:false,msg:result})
              console.log(err);
          }else{
              res.send({status:true,data:result})
          }
      })
  })

}



pop.getYearsForPop = function(req,res){
	console.log("getYearsForPop");
	console.log(req.body);
	console.log("////////");
	con.query(`select year from population group by year`,function(err,result){
		if(err){
			console.log(err+"116")
		}else{
			res.send({status:true,data:result})
		}
	})
}
pop.getAllAgesGroups = function(req,res){
	con.query(`select * from age_group`,function(err,result){
		if(err){
			console.log(err+" 148")
		}else{
			res.send({status:true,data:result})
		}
	})
}

pop.addPopulationData=function (req,res) {
  con.query(`insert into population_data (state_id,year,growth_rate,life_excp,cbr,cdr,literacy_male,literacy_female,dr,un_emp,mics,imr,tfr) values ('${req.body.state_id}','${req.body.year}','${req.body.growth_rate}','${req.body.life_excp}','${req.body.cbr}','${req.body.cdr}','${req.body.literacy_male}','${req.body.literacy_female}','${req.body.dr}','${req.body.un_emp}','${req.body.mics}','${req.body.imr}','${req.body.tfr}')`,function(err,_result){
    if (err) {
      console.log(err+"133");
    } else {
      res.send({status:true})
    }
  })
}
pop.addAgeGroup=function (req,res) {
  con.query(`insert into age_group(title) values ('${req.body.title.split('-')[0].trim()} - ${req.body.title.split('-')[1].trim()}')`,function(err,result){
    if (err) {
      console.log(err+" 167");
    } else {
      res.send({status:true})
    }
  })
}
pop.editAgeGroup=function (req,res) {
  con.query(`update age_group set title='${req.body.title.split('-')[0].trim()} - ${req.body.title.split('-')[1].trim()}' where id = ${req.body.id}`,function(err,result){
    if (err) {
      console.log(err+" 176");
    } else {
      res.send({status:true})
    }
  })
}
pop.removeAgeGroup=function (req,res) {
  con.query(`delete from age_group where id = ${req.body.id}`,function(err,result){
    if (err) {
      console.log(err+" 185");
    } else {
      res.send({status:true})
    }
  })
}

pop.getPopulationData=function (req,res) {
  con.query(`select population_data.* ,states.name from population_data  join states on states.id = population_data.state_id`,function(err,result){
    if (err) {
      console.log(err);
    }else{
      res.send({status:true,data:result})
    }
  })
}

pop.updatePopulationData=function (req,res) {
  console.log(req.body);
  con.query(`UPDATE population_data set 
              state_id = ${req.body.state_id},
              year = '${req.body.year}',
              growth_rate = ${req.body.growth_rate},
              life_excp = ${req.body.life_excp},
              cbr = ${req.body.cbr},
              cdr = ${req.body.cdr},
              literacy_male = ${req.body.literacy_male},
              literacy_female = ${req.body.literacy_female},
              dr = ${req.body.dr},
              un_emp = ${req.body.un_emp},
              mics = ${req.body.mics},
              imr = ${req.body.imr},
              tfr = ${req.body.tfr} where id ='${req.body.id}'`,function(err,result){
    if (err) {
      console.log(err+"165");
    } else {
      res.send({status:true})
    }
  })
}

pop.deletePopulationData=function (req,res) {
  con.query(`delete from population_data where id = '${req.body.id}'`,function(err,result){
    if (err) {
      console.log(err+"165");
    } else {
      res.send({status:true})
    }
    })
}

pop.insertPopulationFromExcel = function (req,res) {
    console.log(req.body);
    req.body.data.forEach(function (state){
        state.population.forEach(function (age_group){
            con.query(`INSERT into age_group(title) SELECT '${age_group.group.split('-')[0].trim()} - ${age_group.group.split('-')[1].trim()}' where (SELECT count(*) from age_group WHERE title='${age_group.group.split('-')[0].trim()} - ${age_group.group.split('-')[1].trim()}')=0 `,function (){
                con.query(`select * from population where state_id = (select id from states where name='${state.state}') and age_group_id = (select id from age_group where title = '${age_group.group.split('-')[0].trim()} - ${age_group.group.split('-')[1].trim()}' ) and year=${req.body.year}`,function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (result.length > 0) {
                            con.query(`update population set rural_male_value = '${age_group.rural_male_value}', rural_female_value = '${age_group.rural_female_value}', urban_male_value = '${age_group.urban_male_value}', urban_female_value = '${age_group.urban_female_value}' where id=${result[0].id}`,function (err, result) {
                                    if (err) {
                                        console.log(err + "260");
                                    } else {
                                        console.log("update");
                                    }
                                }
                            );
                        } else {
                            con.query(`insert into population (state_id,age_group_id,year, rural_male_value, rural_female_value,urban_male_value,urban_female_value) values ((select id from states where name = '${state.state}'),(select id from age_group where title = '${age_group.group.split('-')[0].trim()} - ${age_group.group.split('-')[1].trim()}' ),'${req.body.year}','${age_group.rural_male_value}','${age_group.rural_female_value}','${age_group.urban_male_value}','${age_group.urban_female_value}')`,function (err, result) {
                                    if (err) {
                                        console.log(err + " 270");
                                    } else {
                                        console.log("insert");
                                    }
                                }
                            );
                        }
                    }
                });

            })
        })

    })
    setTimeout(()=>{
        res.send({ status: true, data: [] });
    },1400)
};


module.exports = pop;