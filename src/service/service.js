const ElasticManager = require("../utils/elasticManager");
const MongodbManager = require("../utils/mongodbManager");
const MongoQuerys = require("../scripts/mongoQuerys");

module.exports = class Service {
    constructor() {
        this.elasticManager = new ElasticManager();
        this.mongodbManager = new MongodbManager();
    }

    async execTask(params) {
        const dataMongo = await this.readMongodb(params.country, params.campaign, params.personalization);
    }

    async joinData() {

    }

    async readElastic() {

    }

    async readMongodb(country, campaign, personalization) {
        let promisesPersonalization = [];
        let promisesStrategy = [];
        const cluster = this.mongodbManager.getCluster(country);
        const client = await this.mongodbManager.getClient(country);
        const db = client.db(cluster.dataBase);

        for (let i = 0; i < campaign.length; i++) {
            const cam = campaign[i];
            for (let j = 0; j < personalization.length; j++) {
                const per = personalization[j];
                const queryAggsPersonalization = MongoQuerys.aggreagatePersonalization(cam, per);
                promisesPersonalization.push(this.mongodbManager.executeQueryMongo(db, "OfertaPersonalizada", "aggregate", queryAggsPersonalization).then(res => {
                    return {
                        campaign: cam,
                        personalization: per,
                        data: res
                    }
                }));
                const queryFindStrategy = MongoQuerys.findStrategy(cam, per);
                promisesStrategy.push(this.mongodbManager.executeQueryMongo(db, "Estrategia", "find", queryFindStrategy).then(res => {
                    return {
                        campaign: cam,
                        personalization: per,
                        data: res
                    }
                }));
            }
        }
        let data = {};
        data.personalization = await Promise.all(promisesPersonalization);
        data.strategy = await Promise.all(promisesStrategy);
        return data;
    }
}