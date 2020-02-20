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
    }
};

module.exports = config;