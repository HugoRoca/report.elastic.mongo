const ElasticManager = require("../utils/elasticManager");
const MongodbManager = require("../utils/mongodbManager");

module.exports = class Service {
    constructor(){
        this.elasticManager = new ElasticManager();
        this.mongodbManager = new MongodbManager();
    }

    async execTask(params){
        console.log(params);
    }

    async joinData(){

    }

    async readElastic(country, campaign){

    }

    async readMongodb(country, campaign){

    }
}