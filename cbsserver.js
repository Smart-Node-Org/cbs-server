const bcrypt = require("bcryptjs");
const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
var multiparty = require("multiparty");
const path = require("path");
const jwt = require("jsonwebtoken");
var atob = require("atob");
const handlebars = require("express-handlebars");

// A native NodeJS API for the GeoLite data from MaxMind.\
var geoip = require("geoip-lite");

const socketIO = require("socket.io");
var { con, smart } = require("./db/db.js");
const utils = require("./utils/utils");
var gdp = require("./controllers/gdp");
var about = require("./controllers/about");
var contact = require("./controllers/contact");
var foriegn_trade = require("./controllers/foriegn_trade");
var pub = require("./controllers/publications");
var slide = require("./controllers/slides");
var news = require("./controllers/news");
var pop = require("./controllers/populations");
var sector = require("./controllers/sectors");
var user = require("./controllers/user");
var pi = require("./controllers/prices_index");
var pis = require("./controllers/prices_index_states");
var pip = require("./controllers/prices_index_product");
const WhichBrowser = require("which-browser");

var chart = require("./controllers/chart");

var indicators = require("./controllers/indicators");

const axios = require("axios");
const uuidv1 = require("uuid/v1");
const https = require("https");
global.navigator = { appName: "nodejs" }; // fake the navigator object
global.window = {}; // fake the window object
const JSEncrypt = require("jsencrypt").default;
var requestCountry = require("request-country");
const exec = require("child_process").exec;
const cors = require("cors");
const fs = require("fs");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

var server = app.listen(7077, function () {
  console.log("server started");
});
var io = socketIO.listen(server, { log: true, origins: "*:*" });
io.origins("*:*");
// SOCKET IO PART ''''''''''''''''''''''''''''''''''''''''''''
io.on("connection", function (socket) {
  console.log("New user connected", socket.id);
  socket.on("connectUser", function (user_id, info) {
    console.log("hi " + user_id);
    console.log(info);
    var ip = socket.request.connection.remoteAddress;
    var geo = geoip.lookup(ip);
    // console.log(geo.timezone);
    var country = geo && geo.country ? geo.country : 'Sudan';
    // socket_id = socket.id;

    utils.start_session(user_id, socket, ip,country, info);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected ", socket.id);
    socket_id = socket.id;

    utils.end_session(socket_id);
  });
});
// END OF THE SOCKET IO PART '''''''''''''''''''''''''''

app.use(express.static("public"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars({
    layoutsDir: __dirname + "/views",
    extname: "hbs",
    // defaultLayout: 'planB',
    // partialsDir: __dirname + '/views/partials/'
  })
);

app.use(bodyParser({ limit: "50mb" }));

app.use(bodyParser.json());
setInterval(function () {
  console.log("Cbs");
}, 15000);





app.get("/api/getGdpTotal", gdp.getGdpTotal);
app.get("/api/getAllStates", gdp.getAllStates);
app.get("/api/GDPYears", gdp.GDPYears);


app.post("/api/addGdpDepartment", gdp.addGdpDepartment);
app.post("/api/addGdpYear", gdp.addGdpYear);
app.post("/api/getGdbYearMain", gdp.getGdbYearMain);
app.post("/api/deleteGdbAnnual", gdp.deleteGdbAnnual);
app.post("/api/AddState", gdp.AddState);
app.post("/api/updateState", gdp.updateState);
app.post("/api/removeState", gdp.removeState);
app.post("/api/removeGdbTotal", gdp.removeGdbTotal);
app.post("/api/addNewYearGdp", gdp.addNewYearGdp);

app.post("/api/updateGdpValue", gdp.updateGdpValue);
app.post("/api/updateGDPState", gdp.updateGDPState);


//Foriegn Trade apis
app.get("/api/getAllForiegnTrade", foriegn_trade.getAllForiegnTrade);
app.get("/api/getAllForiengTradeYear", foriegn_trade.getAllForiengTradeYear);
app.get("/api/getAllForiProducts", foriegn_trade.getAllForiProducts);
app.get("/api/getAllForiProdAnnual", foriegn_trade.getAllForiProdAnnual);
app.get("/api/getCountriesYears", foriegn_trade.getCountriesYears);
app.post("/api/AddForiegnTrade", foriegn_trade.AddForiegnTrade);
app.post("/api/updateForiegnTrade", foriegn_trade.updateForiegnTrade);
app.post("/api/removeForiegnTrade", foriegn_trade.removeForiegnTrade);
app.post("/api/AddForiengTradeYear", foriegn_trade.AddForiengTradeYear);
app.post("/api/removeForiengTradeYear", foriegn_trade.removeForiengTradeYear);
app.post("/api/updatedForiengTradeYear", foriegn_trade.updatedForiengTradeYear);
app.post("/api/getForiCountriesForYear", foriegn_trade.getForiCountriesForYear);
app.post("/api/removeForiCountriesForYear",foriegn_trade.removeForiCountriesForYear);
app.post("/api/updatedForiCountriesForYear",foriegn_trade.updatedForiCountriesForYear);
app.post("/api/AddForiProduct", foriegn_trade.AddForiProduct);
app.post("/api/removeForiProduct", foriegn_trade.removeForiProduct);
app.post("/api/AddForiengTradeCountries", foriegn_trade.AddForiengTradeCountries);
app.post("/api/updatedForiProduct", foriegn_trade.updatedForiProduct);
app.post("/api/AddForiProdAnnual", foriegn_trade.AddForiProdAnnual);
app.post("/api/removeForiProdAnnual", foriegn_trade.removeForiProdAnnual);
app.post("/api/APIsupdatedForiProdAnnual", foriegn_trade.APIsupdatedForiProdAnnual);
app.post("/api/insertForeignTradeYears", foriegn_trade.insertForeignTradeYears);
app.post("/api/insertForeignTradeCountries", foriegn_trade.insertForeignTradeCountries);
app.post("/api/insertForeignTradeProductsFromExcel", foriegn_trade.insertForeignTradeProductsFromExcel);

// Publications appendFileSync

app.get("/api/getAllPublications", pub.getAllPublications);
app.get("/api/getAllDepartments", pub.getAllDepartments);
app.get("/api/getAllDownloadedPublications", pub.getAllDownloadedPublications);


app.post("/api/AddPublication", pub.AddPublication);
app.post("/api/removePublication", pub.removePublication);
app.post("/api/updatePublicationFile", pub.updatePublicationFile);
app.post("/api/updatePublicationImg", pub.updatePublicationImg);
app.post("/api/updatePublicationData", pub.updatePublicationData);
app.post("/api/AddDepartmentPublication", pub.AddDepartmentPublication);
app.post("/api/deleteDepartment", pub.deleteDepartment);
app.post("/api/downloadPublication", pub.downloadPublication);



// slides apis
app.get("/api/getAllSlides", slide.getAllSlides);

app.post("/api/AddSlide", slide.AddSlide);
app.post("/api/updateSlide", slide.updateSlide);
app.post("/api/removeSlide", slide.removeSlide);
app.post("/api/ShowSlide", slide.ShowSlide);

// pop apis
app.get("/api/getyearPOP", pop.getyearPOP);
app.get("/api/getAgeGroup", pop.getAgeGroup);
app.get("/api/getPopulationData", pop.getPopulationData);
app.get("/api/getYearsForPop", pop.getYearsForPop);

app.post("/api/AddyearPOP", pop.AddyearPOP);
app.post("/api/removeyearPOP", pop.removeyearPOP);
app.post("/api/updateyearPOP", pop.updateyearPOP);
app.post("/api/addPopulation", pop.addPopulation);
app.post("/api/addPopulationData", pop.addPopulationData);
app.post("/api/updatePopulationData", pop.updatePopulationData);
app.post("/api/deletePopulationData", pop.deletePopulationData);
app.post("/api/getPopulation", pop.getPopulation);
app.post("/api/updatePopulation", pop.updatePopulation);
app.get("/api/getAllAgesGroups", pop.getAllAgesGroups);
app.post("/api/addAgeGroup", pop.addAgeGroup);
app.post("/api/editAgeGroup", pop.editAgeGroup);
app.post("/api/removeAgeGroup", pop.removeAgeGroup);
app.post("/api/insertPopulationFromExcel", pop.insertPopulationFromExcel);

// news apis
app.get("/api/getAllNews", news.getAllNews);

app.post("/api/AddNews", news.AddNews);
app.post("/api/updateNews", news.updateNews);
app.post("/api/removeNews", news.removeNews);
app.post("/api/ShowNews", news.ShowNews);
app.post("/api/getOneNews", news.getOneNews);


//sector apis

app.get("/api/getAllSectors", sector.getAllSectors);
app.get("/api/getAllProductSector", sector.getAllProductSector);
app.get("/api/getYears", sector.getYears);

// app.get("/api/addYear",sector.addYear)

app.post("/api/AddSectors", sector.AddSectors);
app.post("/api/AddProductSector", sector.AddProductSector);
app.post("/api/AddSectorsAnnual", sector.AddSectorsAnnual);
app.post("/api/updateSector", sector.updateSector);
app.post("/api/deleteSector", sector.deleteSector);
app.post("/api/getYearSectorsAnnual", sector.getYearSectorsAnnual);
app.post("/api/getAllyearsforSector", sector.getAllyearsforSector);
app.post("/api/AddproductAnnualforState", sector.AddproductAnnualforState);
app.post("/api/getproductAnnualforState", sector.getproductAnnualforState);
app.post("/api/getSectorProduct", sector.getSectorProduct);
app.post("/api/deleteProductSector", sector.deleteProductSector);
app.post("/api/updateProductSector", sector.updateProductSector);
app.post("/api/updateSectorsAnnualYear", sector.updateSectorsAnnualYear);
app.get("/api/getSectorsAnnualYear", sector.getSectorsAnnualYear);
app.post("/api/deleteSectorsAnnualYear", sector.deleteSectorsAnnualYear);
app.post("/api/updateProductAnnualForState", sector.updateProductAnnualForState);

//contact

app.get("/api/getContact", contact.getContact);

app.post("/api/insertContactUs", contact.insertContactUs);
//about
app.get("/api/getOrganiztionChart", about.getOrganiztionChart);
app.get("/api/getOurMission", about.getOurMission);
app.get("/api/getOurVision", about.getOurVision);
app.get("/api/getOurGoal", about.getOurGoal);
app.get("/api/getDepartments", about.getDepartments);
app.get("/api/getPermissions", about.getPermissions);

app.post("/api/updateOurMission", about.updateOurMission);
app.post("/api/updateOurGoal", about.updateOurGoal);
app.post("/api/updateOurVision", about.updateOurVision);
app.post("/api/addOrganiztionChart", about.addOrganiztionChart);
app.post("/api/updateOrganiztionChart", about.updateOrganiztionChart);
app.post("/api/updateOrganiztionChartWithImage", about.updateOrganiztionChartWithImage);

// user
app.post("/api/insertNewUser", user.insertNewUser);
app.get("/api/getAllUsers", user.getAllUsers);
app.post("/api/deleteUser", user.deleteUser);
app.post("/api/editUser", user.editUser);
app.post("/api/login", user.login);
app.get("/api/getuserinfo", user.getuserinfo);
app.get("/api/getVisitorsInfo", user.getVisitorsInfo);

// indecators apis

app.get("/api/getIndicatorTypes", indicators.getIndicatorTypes);
app.post("/api/getIndicators", indicators.getIndicators);
app.post("/api/getIndicatorsForType", indicators.getIndicatorsForType);

app.post("/api/addIndicatorType", indicators.addIndicatorType);
app.post("/api/updateIndicatorType", indicators.updateIndicatorType);
app.post("/api/deleteIndicatorType", indicators.deleteIndicatorType);
app.post("/api/addIndicator", indicators.addIndicator);
app.post("/api/updateIndicator", indicators.updateIndicator);
app.post("/api/deleteIndicator", indicators.deleteIndicator);
app.post("/api/addCycle", indicators.addCycle);
app.post("/api/getCycles", indicators.getCycles);
app.post("/api/deleteCycle", indicators.deleteCycle);
app.post("/api/updateCycle", indicators.updateCycle);
app.post("/api/addIndicatorsFromExcel",indicators.addIndicatorsFromExcel)

// cart files apis




//app.get("/api/getReport", chart.getReport);

// prices sudan index apis
app.get("/api/getCpiSudanSection", pi.getCpiSudanSection);
app.get("/api/getAllYears", pi.getAllYears);
app.get("/api/getCpiSudanCommunity", pi.getCpiSudanCommunity);

app.post("/api/insertCpiSudanSection", pi.insertCpiSudanSection);
app.post("/api/updateCpiSudanSection", pi.updateCpiSudanSection);
app.post("/api/deleteCpiSudanSection", pi.deleteCpiSudanSection);
app.post("/api/getCpiSudanSectionYear", pi.getCpiSudanSectionYear); 
app.post("/api/removeCpiSudanCommunity", pi.removeCpiSudanCommunity); 
app.post("/api/addCpiSudanCommunity", pi.addCpiSudanCommunity); 
app.post("/api/getCpiSudanCommunityYear", pi.getCpiSudanCommunityYear); 
app.post("/api/updateCpiSudanCommunity", pi.updateCpiSudanCommunity); 

app.get("/api/getInflationSudanSection", pi.getInflationSudanSection);
app.get("/api/getInflationSudanCommunity", pi.getInflationSudanCommunity);

app.post("/api/addInflationSudanCommunity", pi.addInflationSudanCommunity);

app.post("/api/insertInflationSudanSection", pi.insertInflationSudanSection);
app.post("/api/updateInflationSudanSection", pi.updateInflationSudanSection);
app.post("/api/deleteInflationSudanSection", pi.deleteInflationSudanSection);
app.post("/api/getInflationSudanSectionYear", pi.getInflationSudanSectionYear);
app.post("/api/addCpiStateCommunity", pis.addCpiStateCommunity);
app.post("/api/getCpiStateCommunityYear", pis.getCpiStateCommunityYear);
app.post("/api/updateCpiStateCommunity", pis.updateCpiStateCommunity);
app.post("/api/removeCpiStateCommunity", pis.removeCpiStateCommunity);

app.post("/api/addInflationSudanCommunity", pi.addInflationSudanCommunity);
app.post(
  "/api/updateInflationSudanCommunity",
  pi.updateInflationSudanCommunity
);
app.post(
  "/api/removeInflationSudanCommunity",
  pi.removeInflationSudanCommunity
);
app.post(
  "/api/getInflationSudanCommunityYear",
  pi.getInflationSudanCommunityYear
);
/////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

// prices states index
app.get("/api/getCpiStatesSection", pis.getCpiStatesSection);
app.get("/api/getCpiStateCommunity", pis.getCpiStateCommunity);

app.post("/api/insertCpiStatesSection", pis.insertCpiStatesSection);
app.post("/api/getCpiStatesSectionYear", pis.getCpiStatesSectionYear);
app.post("/api/updateCpiStatesSection", pis.updateCpiStatesSection);
app.post("/api/deleteCpiStatesSection", pis.deleteCpiStatesSection);

app.post("/api/addCpiStateCommunity", pis.addCpiStateCommunity);
app.post("/api/getCpiStateCommunityYear", pis.getCpiStateCommunityYear);
app.post("/api/updateCpiStateCommunity", pis.updateCpiStateCommunity);
app.post("/api/removeCpiStateCommunity", pis.removeCpiStateCommunity);
// inflation states sections
app.get("/api/getInflationStateSection", pis.getInflationStateSection);

app.post("/api/insertInflationStateSection", pis.insertInflationStateSection);
app.post("/api/getInflationStateSectionYear", pis.getInflationStateSectionYear);
app.post("/api/updateInflationStateSection", pis.updateInflationStateSection);
app.post("/api/deleteInflationStateSection", pis.deleteInflationStateSection);

// inflation states comunity
app.get("/api/getInflationStateCommunity", pis.getInflationStateCommunity);

app.post("/api/addInflationStateCommunity", pis.addInflationStateCommunity);
app.post(
  "/api/getInflationStateCommunityYear",
  pis.getInflationStateCommunityYear
);
app.post(
  "/api/updateInflationStateCommunity",
  pis.updateInflationStateCommunity
);
app.post(
  "/api/removeInflationStateCommunity",
  pis.removeInflationStateCommunity
);
//////////////////////////////////////
/////////////////////////////////////
app.get("/api/getCpiProductSection", pip.getCpiProductSection);
app.get("/api/getCpiProductCommunity", pip.getCpiProductCommunity);
app.get("/api/getAllProducts", pip.getAllProducts);
app.get("/api/getInflationProductSection", pip.getInflationProductSection);
app.get("/api/getInflationProductCommunity", pip.getInflationProductCommunity);
app.post("/api/insertCpiProductSection", pip.insertCpiProductSection);
app.post("/api/getCpiProductSectionYear", pip.getCpiProductSectionYear);
app.post("/api/updateCpiProductSection", pip.updateCpiProductSection);
app.post("/api/deleteCpiProductSection", pip.deleteCpiProductSection);
app.post("/api/addCpiProductCommunity", pip.addCpiProductCommunity);
app.post("/api/addCpiProduct", pip.addCpiProduct);
app.post("/api/getCpiProductCommunityYear", pip.getCpiProductCommunityYear);
app.post("/api/updateCpiProductCommunity", pip.updateCpiProductCommunity);
app.post("/api/removeCpiProductCommunity", pip.removeCpiProductCommunity);
app.post("/api/updateCpiProduct", pip.updateCpiProduct);
app.post("/api/deleteCpiProduct", pip.deleteCpiProduct);
app.post("/api/insertInflationProductSection",pip.insertInflationProductSection);
app.post("/api/getInflationProductSectionYear",pip.getInflationProductSectionYear);
app.post("/api/updateInflationProductSection",pip.updateInflationProductSection);
app.post("/api/deleteInflationProductSection", pip.deleteInflationProductSection);
app.post("/api/addInflationProductCommunity", pip.addInflationProductCommunity);
app.post("/api/getInflationProductCommunityYear",pip.getInflationProductCommunityYear);
app.post("/api/updateInflationProductCommunity",pip.updateInflationProductCommunity);
app.post("/api/removeInflationProductCommunity", pip.removeInflationProductCommunity);
app.get("/api/getEconomicParams",chart.getEconomicParams)
app.get("/api/getSocialParams",chart.getSocialParams)
app.get("/api/gdpInteractive",chart.gdpInteractive)
app.get("/api/ExportInteractiveSectorial",chart.ExportInteractiveSectorial)
app.get("/api/ExportInteractiveForiegn",chart.ExportInteractiveForiegn)
app.get("/api/ExportInteractiveGdp",chart.ExportInteractiveGdp)
app.get("/api/ExportInteractiveCpi",chart.ExportInteractiveCpi)
app.get("/api/getReport",chart.getReport)
app.get("/api/getLastIndicators",indicators.getLastIndicators)
app.get("/api/getTopIndicators",indicators.getTopIndicators)
app.get("/api/getHomeTopIndicators",indicators.getHomeTopIndicators)
app.get("/api/getHomeIndicators",indicators.getHomeIndicators)
app.get("/api/getWebsiteIndicatorGroups",indicators.getWebsiteIndicatorGroups)
app.post("/api/changeIndicatorShown",indicators.changeIndicatorShown)
app.post("/api/addHomeIndicator",indicators.addHomeIndicator)
app.post("/api/removeHomeIndicator",indicators.removeHomeIndicator)


app.post("/api/convertForiegnProductsToJson",utils.convertForiegnProductsToJson)
app.post("/api/convertPopulationToJson",utils.convertPopulationToJson)
app.post("/api/convertCpiInflationSudanToJson",utils.convertCpiInflationSudanToJson)


utils.setIo(io);

module.exports = { app };
