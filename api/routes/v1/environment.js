const router = require('express').Router();
const logger = require("log4js").getLogger(require("path").basename(__filename));
logger.level = "debug";
const EnvironmentService = require("../../service/environmentService")
const Rover = require("../../models/Rover-model").getInstance();
//For DEV: REMOVE
global.environment = { "temperature": 60, "humidity": 65, "solar-flare": false, "storm": false, "area-map": [["dirt", "dirt", "dirt", "water", "dirt"], ["dirt", "dirt", "water", "water", "water"], ["dirt", "dirt", "dirt", "water", "dirt"], ["dirt", "dirt", "dirt", "dirt", "dirt"], ["dirt", "dirt", "dirt", "dirt", "dirt"]] };

router.get("/", [
    async function (req, res) {
        res.status(200).send(global.environment)
    }
]);

router.post("/configure", [
    async function (req, res) {
        logger.info(`Setting up Environment: ${JSON.stringify(req.body)}`)
        global.environment = req.body
        res.status(200).send(global.environment)
    }
]);

router.patch("/", [
    async function (req, res) {
        return EnvironmentService.updateEnvironment(req, res);
    }
]);

module.exports = router;
