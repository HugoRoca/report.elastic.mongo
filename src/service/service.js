const ElasticManager = require("../utils/elasticManager");
const MongodbManager = require("../utils/mongodbManager");
const MongoQuerys = require("../scripts/mongoQuerys");

module.exports = class Service {
    constructor() {
        this.elasticManager = new ElasticManager();
        this.mongodbManager = new MongodbManager();
    }

    async execTask(params) {
        console.log(params);
        await this.readMongodb(params.country, params.campaign, params.personalization);
    }

    async joinData() {

    }

    async readElastic() {

    }

    async readMongodb(country, campaign, personalization) {
        const cluster = this.mongodbManager.getCluster(country);
        const client = await this.mongodbManager.getClient(country);
        const db = client.db(cluster.dataBase);
        const execQuery = (_collection, _typeAction, _query) => {
            return new Promise((resolve, reject) => {
                try {
                    let data = _typeAction === 'find' ?
                        db.collection(`${_collection}`)[_typeAction](_query).project({ CUV2: 1 }).toArray() :
                        db.collection(`${_collection}`)[_typeAction](_query).toArray();
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
        }
        let promises = [];
        for (let i = 0; i < campaign.length; i++) {
            const cam = campaign[i];
            for (let j = 0; j < personalization.length; j++) {
                const per = personalization[j];
                const queryAggsPersonalization = MongoQuerys.aggreagatePersonalization(cam, per);
                promises.push(execQuery("OfertaPersonalizada", "aggregate", queryAggsPersonalization).then(res => {
                    return {
                        campaign: cam,
                        personalization: per,
                        data: res
                    }
                }));
            }
        }
        const data = await Promise.all(promises);
        return data;
    }
}