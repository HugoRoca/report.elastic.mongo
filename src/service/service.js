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
            let paintConsoleNotActive = [];
            for (let p = 0; p < personalization.length; p++) {
                const per = personalization[p];
                let arrPersonalization = this.getArrayFromData(data.personalization, cam, per);
                let arrStrategy = this.getArrayFromData(data.strategy, cam, per);
                let arrElasticsearch = this.getArrayFromData(data.elasticSearch, cam, per, true);
                let arrElasticsearchNotActive = this.getArrayFromData(data.elasticSearchNotActive, cam, per, true);

                let totalPersonalization = 0;
                let totalCuvsActive = 0;
                let totalPersonalizationNotActive = 0;
                let totalCuvsNotActive = 0;

                for (let arrPer = 0; arrPer < arrPersonalization.data.length; arrPer++) {
                    const personalizationObj = arrPersonalization.data[arrPer];

                    if (arrStrategy.data.find(x => x.Activo === true && x.CUV2 === personalizationObj._id.cuv)) {
                        totalPersonalization += personalizationObj.count;
                        totalCuvsActive++;
                    } else {
                        totalPersonalizationNotActive += personalizationObj.count;
                        totalCuvsNotActive++;
                    }
                    //totalPersonalization += arrStrategy.data.find(x => x.CUV2 === personalizationObj._id.cuv) ? 0 : personalizationObj.count;
                }

                let difference = this.numberWithCommas(totalPersonalization > 0 ?
                    (totalPersonalization - (arrElasticsearch ? arrElasticsearch.doc_count : 0)) :
                    (arrElasticsearch ? arrElasticsearch.doc_count : 0)
                );

                paintConsole.push({
                    CAMPAIGN: cam,
                    PERSONALIZATION: per,
                    CUVS: totalCuvsActive,
                    MONGO: totalPersonalization,
                    ELASTIC: (arrElasticsearch ? arrElasticsearch.doc_count : 0),
                    DIFF: difference
                });

                paintConsoleNotActive.push({
                    CAMPAIGN: cam,
                    PERSONALIZATION: per,
                    CUVS: totalCuvsNotActive,
                    MONGO: totalPersonalizationNotActive,
                    ELASTIC: (arrElasticsearchNotActive ? arrElasticsearchNotActive.doc_count : 0)
                });
            }
            console.log("==========================================================");
            console.log("====================== CUVS ACTIVOS ======================");
            console.table(paintConsole);
            console.log("");
            console.log("==========================================================");
            console.log("==================== CUVS NO ACTIVOS =====================");
            console.table(paintConsoleNotActive);
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
        let promisesSearchESActive = [];
        let promisesSearchESNotActive = [];

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
            const querySearchOne = ElasticsearchQuerys.search(true);
            promisesSearchESActive.push(this.elasticManager.search(country, cam, querySearchOne).then(res => {
                return this.returnDataElastic(cam, res);
            }));

            const querySearchTwo = ElasticsearchQuerys.search(false);
            promisesSearchESNotActive.push(this.elasticManager.search(country, cam, querySearchTwo).then(res => {
                return this.returnDataElastic(cam, res);
            }))
        }
        let data = {};
        data.elasticSearchNotActive = await Promise.all(promisesSearchESNotActive);
        data.elasticSearch = await Promise.all(promisesSearchESActive);
        data.personalization = await Promise.all(promisesPersonalization);
        data.strategy = await Promise.all(promisesStrategy);
        return data;
    }

    numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    returnDataElastic(campaign, data) {
        return {
            campaign,
            data: data
        }
    }
}