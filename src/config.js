const config = {
    MONGODB: {
        CLUSTERS: [
            {
                ENDPOINT: "...",
                COUNTRIES: {
                    CO: "BelcorpColombia",
                    BO: "BelcorpBolivia",
                    SV: "BelcorpSalvador",
                    PR: "BelcorpPuertoRico",
                }
            },
            {
                ENDPOINT: "...",
                COUNTRIES: {
                    PE: "BelcorpPeru",
                    CL: "BelcorpChile",
                    GT: "BelcorpGuatemala",
                    PA: "BelcorpPanama"
                }
            },
            {
                ENDPOINT: "...",
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
                ENDPOINT: "...",
                COUNTRIES: ["PE", "CL", "CR", "GT"]
            },
            {
                ENDPOINT: "...",
                COUNTRIES: ["CO", "PA", "DO", "SV"]
            },
            {
                ENDPOINT: "...",
                COUNTRIES: ["MX", "EC", "BO", "PR"]
            }
        ]
    }
};

module.exports = config;