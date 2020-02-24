const Service = require("./service/service");
const argv = require('yargs').argv

// example exacute command
// node src/server.js --country=PE --campaign=202004,202005 --personalization=sr,opm,odd

// dthis discomment for debbuger
// argv = {
//     country: "CR",
//     campaign: "202004,202005",
//     personalization: "sr,opm,odd"
// }

if (!argv.country || !argv.campaign || !argv.personalization) {
    console.log("Check if the country, personalization and campaign parameters exist");
} else {
    const service = new Service();
    argv.country = argv.country.toUpperCase();
    argv.personalization = argv.personalization.toUpperCase();
    const params = {
        country: argv.country,
        campaign: argv.campaign.toString().split(","),
        personalization: argv.personalization.split(",")
    };

    (async () => {
        await service.execTask(params);
    })();
}