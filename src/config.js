const config = {
    MONGODB: {
        CLUSTERS: [
            {
                ENDPOINT: "mongodb://usrmongotdapp:Mongo2018@PersonalizacionPRD01-shard-00-00-7arob.mongodb.net:27017,PersonalizacionPRD01-shard-00-01-7arob.mongodb.net:27017,PersonalizacionPRD01-shard-00-02-7arob.mongodb.net:27017/admin?ssl=true&replicaSet=PersonalizacionPRD01-shard-0&authSource=admin",
                COUNTRIES: {
                    CO: "BelcorpColombia",
                    BO: "BelcorpBolivia",
                    SV: "BelcorpSalvador",
                    PR: "BelcorpPuertoRico",
                }
            },
            {
                ENDPOINT: "mongodb://usrmongotdapp:Mongo2018@PersonalizacionPRD02-shard-00-00-7arob.mongodb.net:27017,PersonalizacionPRD02-shard-00-01-7arob.mongodb.net:27017,PersonalizacionPRD02-shard-00-02-7arob.mongodb.net:27017/admin?ssl=true&replicaSet=PersonalizacionPRD02-shard-0&authSource=admin",
                COUNTRIES: {
                    PE: "BelcorpPeru",
                    CL: "BelcorpChile",
                    GT: "BelcorpGuatemala",
                    PA: "BelcorpPanama"
                }
            },
            {
                ENDPOINT: "mongodb://usrmongotdapp:Mongo2018@PersonalizacionPRD03-shard-00-00-7arob.mongodb.net:27017,PersonalizacionPRD03-shard-00-01-7arob.mongodb.net:27017,PersonalizacionPRD03-shard-00-02-7arob.mongodb.net:27017/admin?ssl=true&replicaSet=PersonalizacionPRD03-shard-0&authSource=admin",
                COUNTRIES: {
                    MX: "BelcorpMexico",
                    EC: "BelcorpEcuador",
                    DO: "BelcorpDominicana",
                    CR: "BelcorpCostaRica"
                }
            }
        ]
    },
    ELASTICSEARCH: {
        REQUEST_TIMEOUT: 60000,
        INDEX_NAME: "producto_v2",
        INDEX_TYPE: "_doc",
        CLUSTERS: [
            {
                ENDPOINT: "https://vpc-es-sbsearch-prd-a5xq7pyb6cvphjra33ojtejvwa.us-east-1.es.amazonaws.com",
                COUNTRIES: ["PE", "CL", "CR", "GT"]
            },
            {
                ENDPOINT: "https://vpc-es-sbsearch2-prd-zy7ytdwgfleiwpive3meis5lzy.us-east-1.es.amazonaws.com",
                COUNTRIES: ["CO", "PA", "DO", "SV"]
            },
            {
                ENDPOINT: "https://vpc-es-sbsearch3-prd-x6yhgte2h3opuz5lyog56xwtla.us-east-1.es.amazonaws.com",
                COUNTRIES: ["MX", "EC", "BO", "PR"]
            }
        ]
    }
};

module.exports = config;