const esClient = require("elasticsearch");
const config = require("../config");

module.exports = class ElasticManager {

    getIndexName(country, campaign) {
        return `${config.ELASTICSEARCH.INDEX_NAME}_${country.toLowerCase()}_${campaign}`;
    }

    getClient(country) {
        const host = this.getCluster(country).ENDPOINT;
        const requestTimeout = config.ELASTICSEARCH.REQUEST_TIMEOUT ? parseInt(config.ELASTICSEARCH.REQUEST_TIMEOUT) : 30000;
        return new esClient.Client({
            host,
            requestTimeout: requestTimeout
        });
    }

    getCluster(country) {
        return config.ELASTICSEARCH.CLUSTERS.find((item) => {
            return item.COUNTRIES.some((x) => {
                return x.toUpperCase() === country.toUpperCase();
            });
        });
    }

    async search(country, campaign, query){
        const elasticClient = this.getClient(country);
        const indexName = this.getIndexName(country, campaign);
        const data = await elasticClient.search({
            index: indexName,
            body: query
        });
        return data;
    }
}