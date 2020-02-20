const Service = require("./service/service");
//const argv = require('yargs').argv
// node src/server.js --country=PE --campaign=202004,202005 --personalization=sr,opm,odd
argv = {
    country: "PE",
    campaign: "202004,202005",
    personalization: "LMG,HV,SR"
}
if (!argv.country || !argv.campaign || !argv.personalization) {
    console.log("Check if the country, personalization and campaign parameters exist");
} else {
    const service = new Service();
    const params = {
        country: argv.country,
        campaign: argv.campaign.split(","),
        personalization: argv.personalization.split(",")
    };

    (async () => {
        await service.execTask(params);
    })();
}