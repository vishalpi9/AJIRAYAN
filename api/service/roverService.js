const e = require("express");
const { reverse } = require("lodash");
const _ = require("lodash")
const logger = require("log4js").getLogger(require("path").basename(__filename));
logger.level = "debug";
const Rover = require("../models/Rover-model").getInstance();
const constants = require("../constants");
class RoverService {

    static buildRover(req, res) {
        Rover.setBattery(req.body["initial-battery"]);
        Rover.setScenarios(req.body.scenarios);
        Rover.setStates(req.body.states);
        Rover.setLocation(req.body["deploy-point"]);
        Rover.setInventory(req.body["inventory"]);
        this.setTerrain(req.body["deploy-point"])
        res.status(200).send(req.body)
    }

    static setTerrain(location) {
        global.environment.terrain = global.environment["area-map"][location.row][location.column];
    }

    static roverStatus(req, res) {
        if (_.isEmpty(Rover.getState()))
            return res.status(400).send({ "error": "Please configure rover first" })
        let env = JSON.parse(JSON.stringify(global.environment));
        let roverState = JSON.parse(JSON.stringify(Rover.getState()));
        roverState.battery = Rover.getBattery();
        roverState.inventory = roverState.inventory.items;
        delete env["area-map"];
        let response = {
            rover: roverState,
            environment: env
        }
        return res.status(200).send(response);
    }

    static collectSample(item) {
        item.quantity = item.qty;
        item.priority = constants.INVENTRORY_PRIORITY[item.type];
        delete item.qty;
        Rover.inventory.push(item);
    }

    static useItemFromInventory(item) {
        logger.info(`useItemFromInventory: ${JSON.stringify(item)}`)
        let res = Rover.state.inventory.utilize(item["item-usage"]);
        if (!res) {
            logger.error(`Rover died due to ${JSON.stringify(item)} unavailable in inventory!!`)
            Rover.dead();
        }
    }

    static move(req, res) {
        if (_.isEmpty(Rover.getState()))
            return res.status(400).send({ "error": "Please configure rover first" })
        if (!Rover.canMove())
            return res.status(428).send({ "message": "Cannot move during a storm" });
        let tempLocation = Object.assign(Rover.state.location, {});
        switch (req.body.direction) {
            case "up":
                tempLocation.row -= 1; break;
            case "down":
                tempLocation.row += 1; break;
            case "left":
                tempLocation.column -= 1; break;
            case "righ":
                tempLocation.column += 1; break;
        }
        logger.info(`New Location: ${JSON.stringify(tempLocation)}`);
        if (!this.varifyMapboundary(tempLocation.row, tempLocation.column)) {
            return res.status(428).send({ "message": "Can move only within mapped area" });
        }
        Rover.setLocation(tempLocation);
        Rover.move(1);
        this.setTerrain(Rover.getLocation())
        this.sanityCheck();
        if (Rover.isAlive())
            return res.status(200).send();
    }

    static varifyMapboundary(row, column) {
        if (row >= 0 && column >= 0 && row <= global.environment["area-map"].length && column <= global.environment["area-map"][row].length)
            return true;
        return false;
    }

    static sanityCheck() {
        logger.info(`SanityCheck: ${JSON.stringify(Rover.getState())}`);
        if (!Rover.getState()) return;
        for (let scenario of Rover.getScenarios()) {
            let result = false;
            let itr = 0;
            for (let cond of scenario.conditions) {
                console.log(cond);
                let obj = cond["type"] == "rover" ? Rover : global.environment;
                if (itr > 1 && !result) break;
                switch (cond["operator"]) {
                    case "eq":
                        (obj[cond["property"]] === cond["value"]) ? result = true : result = false; break;
                    case "ne":
                        (obj[cond["property"]] !== cond["value"]) ? result = true : result = false; break;
                    case "lte":
                        (obj[cond["property"]] <= cond["value"]) ? result = true : result = false; break;
                    case "gte":
                        (obj[cond["property"]] >= cond["value"]) ? result = true : result = false; break;
                    case "lt":
                        (obj[cond["property"]] < cond["value"]) ? result = true : result = false; break;
                    case "gt":
                        (obj[cond["property"]] > cond["value"]) ? result = true : result = false; break;
                }
                itr += 1;
            }
            if (result) {
                for (let roverAction of scenario["rover"]) {
                    if (roverAction["performs"]) {
                        if (roverAction["performs"]["collect-samples"])
                            RoverService.collectSample(roverAction["performs"]);
                        if (roverAction["performs"]["item-usage"])
                            RoverService.useItemFromInventory(roverAction["performs"]); break;
                    }
                    if (roverAction["is"]) {
                        this.is = roverAction["is"];
                    }
                }
            }
        }
    }
}
module.exports = RoverService