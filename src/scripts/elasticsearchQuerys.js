module.exports = class ElasticsearchQuerys {
    static search(active) {
        return {
            "size": 0,
            "query":{
                "term":{
                    "activo": active
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