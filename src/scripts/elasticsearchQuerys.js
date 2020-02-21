module.exports = class ElasticsearchQuerys {
    static search() {
        return {
            "size": 0,
            "aggs": {
                "personalizaciones": {
                    "terms": {
                        "field": "tipoPersonalizacion"
                    }
                }
            }
        }
    }
}