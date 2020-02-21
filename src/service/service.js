const ElasticManager = require("../utils/elasticManager");
const MongodbManager = require("../utils/mongodbManager");
const MongoQuerys = require("../scripts/mongoQuerys");
const ElasticsearchQuerys = require("../scripts/elasticsearchQuerys");

module.exports = class Service {
    constructor() {
        this.elasticManager = new ElasticManager();
        this.mongodbManager = new MongodbManager();
    }

    async execTask(params) {
        const data = await this.getDataMongoElasticsearch(params.country, params.campaign, params.personalization);
        const mongo = this.joinData(params.campaign, params.personalization, data);
    }

    joinData(campaign, personalization, data) {
        for (let c = 0; c < campaign.length; c++) {
            const cam = campaign[c];
            let paintConsole = [];
            for (let p = 0; p < personalization.length; p++) {
                const per = personalization[p];
                let arrPersonalization = this.getArrayFromData(data.personalization, cam, per);
                let arrStrategy = this.getArrayFromData(data.strategy, cam, per);
                let arrElasticsearch = this.getArrayFromData(data.elasticSearch, cam, per, true);

                let totalPersonalization = 0;
                for (let arrPer = 0; arrPer < arrPersonalization.data.length; arrPer++) {
                    const personalizationObj = arrPersonalization.data[arrPer];
                    totalPersonalization += arrStrategy.data.some(x => x.CUV2 === personalizationObj._id.cuv) ? 0 : personalizationObj.count;
                }

                let difference = this.numberWithCommas((totalPersonalization - (arrElasticsearch ? arrElasticsearch.doc_count : 0)));

                paintConsole.push({
                    campaign: cam,
                    personalization: per,
                    mongoCount: this.numberWithCommas(totalPersonalization),
                    elasticCount: this.numberWithCommas((arrElasticsearch ? arrElasticsearch.doc_count : 0)),
                    difference: difference
                });
            }
            console.table(paintConsole);
        }
        return true;
    }

    getArrayFromData(data, campaign, personalization, isElastic = false) {
        let result;
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (isElastic && item.campaign === campaign) {
                for (let e = 0; e < item.data.aggregations.personalizaciones.buckets.length; e++) {
                    const bucket = item.data.aggregations.personalizaciones.buckets[e];
                    if (bucket.key === personalization.toUpperCase()) {
                        result = bucket;
                    }
                }
                break;
            } else if (item.campaign === campaign && item.personalization === personalization.toUpperCase()) {
                result = item;
                break;
            }
        }
        return result;
    }

    async getDataMongoElasticsearch(country, campaign, personalization) {
        let promisesPersonalization = [];
        let promisesStrategy = [];
        let promisesSearchES = [];
        const cluster = this.mongodbManager.getCluster(country);
        const client = await this.mongodbManager.getClient(country);
        const db = client.db(cluster.dataBase);

        for (let i = 0; i < campaign.length; i++) {
            const cam = campaign[i];
            for (let j = 0; j < personalization.length; j++) {
                const per = personalization[j];
                const queryAggsPersonalization = MongoQuerys.aggregatePersonalization(cam, per);
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
            const querySearch = ElasticsearchQuerys.search();
            promisesSearchES.push(this.elasticManager.search(country, cam, querySearch).then(res => {
                return {
                    campaign: cam,
                    data: res
                }
            }));
        }
        let data = {};
        data.elasticSearch = await Promise.all(promisesSearchES);
        data.personalization = await Promise.all(promisesPersonalization);
        data.strategy = await Promise.all(promisesStrategy);
        return data;
    }

    numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
}