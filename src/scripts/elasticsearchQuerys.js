module.exports = class ElasticsearchQuerys {
    static search() {
        return {
            "size": 0,
            "query":{
                "term":{
                    "activo": true
                }
            },
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