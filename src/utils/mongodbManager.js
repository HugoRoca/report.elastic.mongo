const Mongo = require("mongodb").MongoClient;
const config = require("../config");

module.exports = class MongodbManager {
    getCluster(country) {
        console.log(config.MONGODB);
        for (let i = 0; i < config.MONGODB.CLUSTERS.length; i++) {
            const item = config.MONGODB.CLUSTERS[i];
            let keys = Object.keys(item.COUNTRIES);
            if (keys.some((x) => x === country)) {
                return {
                    endpoint: item.ENDPOINT,
                    country,
                    dataBase: item.COUNTRIES[country]
                }
            }
        }
    }

    async getClient(country) {
        const cluster = this.getCluster(country);
        return await Mongo.connect(cluster.endpoint, { useUnifiedTopology: true, useNewUrlParser: true });
    }

    async executeQueryMongo(mongoClient, collection, typeAction, query) {
        return new Promise((resolve, reject) => {
            try {
                let data = typeAction === 'find' ?
                    mongoClient.collection(`${collection}`)[typeAction](query).project({ CUV2: 1 }).toArray() :
                    mongoClient.collection(`${collection}`)[typeAction](query).toArray();
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
}