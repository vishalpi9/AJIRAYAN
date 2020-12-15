const express = require("express");
const logger = require("log4js").getLogger(require("path").basename(__filename));
logger.level = "debug";
const config = require("./config");

const app = express()

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//:: TODO ::
//SWAGGER
//SCHEMA Validation using AJV
//********


// Will be used for HealthCheck in Orchestration tool.
app.get("/api/health", (req, res) => {
  logger.info("Health check!!")
  res.send("Ajirayan is UP.!!!");
});

const environment = require("./routes/v1/environment");
app.use("/api/environment", environment);

const rover = require("./routes/v1/rover");
app.use("/api/rover", rover);


//404 should be last
app.use('*', function(req, res){
  res.status(404).send(`SORRY: Rover isn't configurade for that request.`);
});

app.listen(config.app.PORT, () => {
  logger.info(`Running Ajirayan on port ${config.app.PORT}`);
});

module.exports = app;