const e = require("express");
const _ = require("lodash")
const RoverService = require("./roverService");
const logger = require("log4js").getLogger(require("path").basename(__filename));
logger.level = "debug";
const Rover = require("../models/Rover-model").getInstance();

class EnvironmentService{

    static updateEnvironment(req, res) {
        logger.info(`Updating up Environment for:${JSON.stringify(req.body)}`);
        if (!global.environment)
            return res.status(400).send({ "error": "Please configure environment first" });
        let change = false;
        for (let attr of Object.keys(req.body)) {
            if(global.environment[attr] !== req.body[attr]){
                global.environment[attr] = req.body[attr];
                change = true;
            }
        }
        if (change && !_.isEmpty(Rover.getState())) RoverService.sanityCheck(global.environment);
        logger.info(`Updated Environment for:${JSON.stringify(global.environment)}`);
        if (Rover.isAlive())
            res.status(200).send(global.environment)

    }

}
module.exports = EnvironmentService