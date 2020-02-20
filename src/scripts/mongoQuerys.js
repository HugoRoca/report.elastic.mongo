module.exports = class MongoQuerys {
    static aggregatePersonalization(campaign, personalization) {
        return [
            {
                $match: {
                    $and: [
                        { AnioCampanaVenta: `${campaign}` },
                        { TipoPersonalizacion: `${personalization.toUpperCase()}` }
                    ]
                }
            },
            {
                $group: {
                    _id: { cuv: "$CUV" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.personalization": 1, count: -1 } }
        ]
    }

    static findStrategy(campaign, personalization) {
        return {
            CodigoCampania: `${campaign}`,
            TipoPersonalizacion: `${personalization.toUpperCase()}`,
            Activo: false
        }
    }
}