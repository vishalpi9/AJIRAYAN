const router = require('express').Router();
const logger = require("log4js").getLogger(require("path").basename(__filename));
logger.level = "debug";
const RoverService = require("../../service/roverService")
const Rover = require("../../models/Rover-model").getInstance();

router.get("/status", [
    async function (req, res) {
        if (Rover.isAlive())
            return RoverService.roverStatus(req, res);
    }
]);
router.post("/configure", [
    async function (req, res) {
        if (Rover.isAlive())
            return RoverService.buildRover(req, res);
    }
]);

router.post("/move", [
    async function (req, res) {
        if (Rover.isAlive())
            return RoverService.move(req, res);
    }
]);
module.exports = router;
