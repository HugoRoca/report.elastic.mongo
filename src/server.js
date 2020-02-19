const Service = require("./service/service");
const argv = require('yargs').argv
// node src/server.js --country=PE --campaign=202004,202005
if (!argv.country || !argv.campaign) {
    console.log("Check if the country and campaign parameters exist");
} else {
    const service = new Service();
    const params = {
        country: argv.country,
        campaign: argv.campaign
    };

    (async () => {
        await service.execTask(params);
    })();
}