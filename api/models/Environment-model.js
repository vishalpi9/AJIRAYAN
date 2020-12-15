
let envObj;
//Singltone class
class Environment {
    constructor() {
    }

    static getInstance() {
        if (!envObj)
            envObj = new Environment()
        return envObj;
    }

    static setEnvironment(obj) {
        this.environment = obj;
    }

    getEnvironment() {
        return this.environment;
    }

}

module.exports = Environment 