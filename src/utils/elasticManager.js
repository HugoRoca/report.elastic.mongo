const esClient = require("elasticsearch");
const yenv = require('yenv');
const env = yenv();

module.exports = class ElasticManager {

    getIndexName(country, campaign) {
        return `${env.ELASTICSEARCH.INDEX_NAME}_${country.toLowerCase()}_${campaign}`;
    }

    getClient(country) {
        const host = this.getCluster(country).ENDPOINT;
        const requestTimeout = env.ELASTICSEARCH.REQUEST_TIMEOUT ? parseInt(env.ELASTICSEARCH.REQUEST_TIMEOUT) : 30000;
        return new esClient.Client({
            host,
            requestTimeout: requestTimeout
        });
    }

    getCluster(country) {
        return env.ELASTICSEARCH.CLUSTERS.find((item) => {
            return item.COUNTRIES.some((x) => {
                return x.toUpperCase() === country.toUpperCase();
            });
        });
    }
}