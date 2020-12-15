const Inventory = require("./Inventory")

let roverObj;
//Singltone class
class Rover {
  constructor() {
    this.alive = true;
    this.state = {};
    this.steps = 0;
  }

  static getInstance() {
    if (!roverObj)
      roverObj = new Rover()
    return roverObj;
  }

  setScenarios(scenarios) {
    this.scenarios = scenarios;
  }
  getScenarios() {
    return this.scenarios;
  }
  setStates(states) {
    this.states = states;
  }

  setBattery(battery) {
    this.battery = battery;
  }

  getBattery() {
    return this.battery;
  }


  setLocation(location) {
    this.state.location = location;
  }

  getLocation(location) {
    return this.state.location;

  }

  setInventory(inventories) {
    this.state.inventory = new Inventory(10); //new Inventory (10) specifies the Invenory space size as 10
    for (let item of inventories) {
      this.state.inventory.push(item);
    }
  }

  setState() {
    this.state = {};
  }
  getState() {
    return this.state;
  }

  canMove() {
    return this.is !== "immobile";
  }

  move(steps) {
    this.battery -= steps;
    this.steps+=steps;
  }

  isAlive(){
    return this.alive;
  }

  dead(){
    this.alive = false;
  }

}

module.exports = Rover 