const Mongo = require("mongodb").MongoClient;
const yenv = require('yenv');
const env = yenv();

module.exports = class MongodbManager {
    getCluster(country) {
        for (let i = 0; i < env.MONGODB.CLUSTERS.length; i++) {
            const item = env.MONGODB.CLUSTERS[i];
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
}