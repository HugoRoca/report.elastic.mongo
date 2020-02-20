module.exports = class ElasticsearchQuery {
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