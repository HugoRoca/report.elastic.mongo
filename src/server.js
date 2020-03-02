const Service = require("./service/service");
const argv = require('yargs').argv

// example exacute command
// node src/server.js --country=PE --campaign=202004,202005 option => --personalization=sr,opm,odd

// this discomment for debbuger
// argv = {
//     country: "PE",
//     campaign: "202004",
//     personalization: "sr"
// }

if (!argv.country || !argv.campaign) {
    console.log("Check if the country, personalization and campaign parameters exist");
} else {
    if (!argv.personalization) argv.personalization = "ODD,SR,OPM,OPT,LAN,LMG,HV,CAT,LIQ,REV";
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