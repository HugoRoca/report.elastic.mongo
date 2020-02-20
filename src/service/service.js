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
        const cluster = this.mongodbManager.getCluster(country);
        const client = await this.mongodbManager.getClient(country);
        const db = client.db(cluster.dataBase);
        
        const collection = db.collection("OfertaPersonalizada");
        
    }
}