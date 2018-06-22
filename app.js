//TRANSLATOR KIK BOT made by xBeastMode

/**
 * Inlcudes
 */
const Bot = require('@kikinteractive/kik');
let http = require('http');
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const Filter = require('bad-words'), filter = new Filter({placeHolder: "x"});

/**
 * A list of country names
 * for use of query only
 *
 * @type {Array}
 */
let countries = [];
let countriesSearch = [];

request('https://www.globalfirepower.com/countries-listing.asp', function (error, response, html) {
    if (!error && response.statusCode === 200) {
        let $ = cheerio.load(html);
        $('a').each( function () {
            const link = $(this).attr('href');
            const split = link.split('=');
            if(split.length === 2){
                countries.push(split[1]);
                countriesSearch.push(split[1].toLowerCase().split(" ").join("-"));
            }
        });
    }
});

/**
 * A list of random user options
 *
 * @type {*[]}
 */
const randoms = [
    [
        'India vs China',
        'Russian vs United States Of America',
        'North Korea vs South Korea',
    ],
    [
        'United Kingdom vs France',
        'South Korea vs Japan',
    ],
    [
        'Egypt vs Iran',
        'Germany vs Brazil',
    ],
    [
        'Rank of Russia',
        'Power Index of Russia',
    ],
    [
        'Rank of Russia',
        'Power Index of Russia',
    ],
    [
        'China vs Russia vs India',
        'Rank of India',
    ],
    [
        'Top 10',
        'Top 20',
        'Top 30'
    ],
    [
        'Top 5',
        'Random Country',
        'In Rank 5',
    ],
    [
        'In Rank 5',
        'In Rank 25',
        'In Rank 100'
    ]
];

/**
 * Random value from array
 *
 * @param array
 *
 * @returns {*}
 */
function arrayRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Bot login information
 *
 * @type {*|Bot}
 */
let bot = new Bot({
    username: 'gfpbot',
    apiKey: '01255950-39fd-45d8-b245-141f0c78ad4e',
    baseUrl: 'http://military-bot.herokuapp.com/incoming',
    staticKeyboard: new Bot.ResponseKeyboard(arrayRandom(randoms))
});

/**
 * Update bot login information
 */
bot.updateBotConfiguration();


/**
 * define version of fs.writeFile() that will only write the file
 * if the file does not already exist and will do so without
 * possibility of race conditions (e.g. atomically)
 *
 * @param fname
 * @param contents
 * @param options
 * @param callback
 */
fs.writeFileIfNotExist = function(fname, contents, options, callback) {
    if (typeof options === "function") {
        // it appears that it was called without the options argument
        callback = options;
        options = {};
    }
    options = options || {};
    // force wx flag so file will be created only if it does not already exist
    options.flag = 'wx';
    fs.writeFile(fname, contents, options, function(err) {
        let existed = false;
        if (err && err.code === 'EEXIST') {
            // This just means the file already existed.  We
            // will not treat that as an error, so kill the error code
            err = null;
            existed = true;
        }
        if (typeof callback === "function") {
            callback(err, existed);
        }
    });
};

/**
 * @param str
 *
 * @returns {string}
 */
function upperCaseEveryFirstLetter(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(function (word) {
            return word[0].toUpperCase() + word.substr(1);
        })
        .join(' ');
}

const Population = 0;
const Aircraft = 1;
const Army = 2;
const Navy = 3;
const Petroleum = 4;
const Logistics = 5;
const Finance = 6;
const Geography = 7;

let lastCountry = null;

/**
 * @param type
 * @param from
 * @param channelId
 */
function countryInfo(type, from, channelId) {
    let time = Date.now();

    request('https://www.globalfirepower.com/country-military-strength-detail.asp?country_id=' + lastCountry, function (error, response, html) {

        if(response.statusCode === 400){
            console.log(error);

            return;
        }

        if (!error && response.statusCode === 200) {
            let $ = cheerio.load(html);
            const main = $('span.textLarger.textBold.textWhite');
            const all = $('span.textLarger.textBold');
            const data = $('span.textDkBlue.textBold');

            const country = $(data[0]).text();

            //total of everything
            const population = $(main[0]).text();
            const totalAircraftStrength = $(main[1]).text();
            const totalNavalAssets = $(main[2]).text();
            const oilConsumtion = $(main[3]).text(); //barrels per day
            const externalDebt = $(main[4]).text();
            const coastline = $(main[5]).text();
            const sharedBorders = $(main[6]).text();

            //population
            const manpower = $(all[6]).text();
            const fitForService = $(all[7]).text();
            const reachingMilitaryAge = $(all[8]).text();
            const totalMilitaryPersonnel = $(all[9]).text();
            const activePersonnel = $(all[10]).text();
            const reservePersonnel = $(all[11]).text();

            //aircraft
            const fighterAircraft = $(all[13]).text();
            const attackAircraft = $(all[14]).text();
            const transportAircraft = $(all[15]).text();
            const trainerAircraft = $(all[16]).text();
            const totalHelicopterStrength = $(all[17]).text();
            const attackHelicopters = $(all[18]).text();

            //army
            const combatTanks = $(all[19]).text();
            const armoredFightingVehicles = $(all[20]).text();
            const selfPropelledArtillery = $(all[21]).text();
            const towedArtillery = $(all[22]).text();
            const rocketProjectors = $(all[23]).text();

            //navy
            const aircraftCarriers = $(all[25]).text();
            const frigates = $(all[26]).text();
            const destroyers = $(all[27]).text();
            const corvettes = $(all[28]).text();
            const submarines = $(all[29]).text();
            const patrolCraft = $(all[30]).text();
            const mineWarfareVessels = $(all[31]).text();

            //petroleum
            const productionBarrels = $(all[32]).text();
            const provenReservesBarrels = $(all[34]).text();

            //logistics
            const laborForce = $(all[35]).text();
            const merchantMarineStrength = $(all[36]).text();
            const MajorPorts = $(all[37]).text();
            const roadwayCoverage = $(all[38]).text();
            const railwayCoverage = $(all[39]).text();
            const servicableAirports = $(all[40]).text();

            //finance
            const defenseBudget = $(all[41]).text();
            const foreignExchange = $(all[43]).text();
            const purchasingPowerParity = $(all[44]).text();

            //geography
            const squareLandArea = $(all[45]).text();
            const waterways = $(all[48]).text();


            const manpowerOutput =
                "Total Population \n➤ " + population + "\n\n"
                +
                "Manpower Available \n➤ " + manpower + "\n\n"
                +
                "Fit For Service \n➤ " + fitForService + "\n\n"
                +
                "Reaching Military Age \n➤ " + reachingMilitaryAge + "\n\n"
                +
                "Total Military Personnel \n➤ " + totalMilitaryPersonnel + "\n\n"
                +
                "Active Personnel \n➤ " + activePersonnel + "\n\n"
                +
                "Reserve Personnel \n➤ " + reservePersonnel + "\n\n"
            ;

            const airpowerOutput =
                "Total Aircraft Strength \n➤ " + totalAircraftStrength + "\n\n"
                +
                "Fighter Aircraft \n➤ " + fighterAircraft + "\n\n"
                +
                "Attack Aircraft \n➤ " + attackAircraft + "\n\n"
                +
                "Transport Aircraft \n➤ " + transportAircraft + "\n\n"
                +
                "Trainer Aircraft \n➤ " + trainerAircraft + "\n\n"
                +
                "Total Helicopter Strength \n➤ " + totalHelicopterStrength + "\n\n"
                +
                "Attack Helicopters \n➤ " + attackHelicopters + "\n\n"
            ;

            const armyStrengthOutput =
                "Combat Tanks \n➤ " + combatTanks + "\n\n"
                +
                "Armored Fighting Vehicles \n➤ " + armoredFightingVehicles + "\n\n"
                +
                "Self Propelled Artillery \n➤ " + selfPropelledArtillery + "\n\n"
                +
                "Towed Artillery \n➤ " + towedArtillery + "\n\n"
                +
                "Rocket Projectors \n➤ " + rocketProjectors + "\n\n"
            ;

            const navyStrengthOutput =
                "Total Naval Assets \n➤ " + totalNavalAssets + "\n\n"
                +
                "Aircraft Carriers \n➤ " + aircraftCarriers + "\n\n"
                +
                "Frigates \n➤ " + frigates + "\n\n"
                +
                "Destroyers \n➤ " + destroyers + "\n\n"
                +
                "Corvettes \n➤ " + corvettes + "\n\n"
                +
                "Submarines \n➤ " + submarines + "\n\n"
                +
                "Patrol Craft \n➤ " + patrolCraft + "\n\n"
                +
                "Mine Warfare Vessels \n➤ " + mineWarfareVessels + "\n\n"
            ;

            const naturalResourceOutput =
                "Production (Barrels Per Day) \n➤ " + productionBarrels + "\n\n"
                +
                "Consumption (Barrels Per Day) \n➤ " + oilConsumtion + "\n\n"
                +
                "Proven Reserves (Barrels) \n➤ " + provenReservesBarrels + "\n\n"
            ;

            const logisticsOutput =
                "Labor Force \n➤ " + laborForce + "\n\n"
                +
                "Merchant Marine Strength \n➤ " + merchantMarineStrength + "\n\n"
                +
                "Major Ports \n➤ " + MajorPorts + "\n\n"
                +
                "Roadway Coverage \n➤ " + roadwayCoverage + "\n\n"
                +
                "Railway Coverage \n➤ " + railwayCoverage + "\n\n"
                +
                "Serivecable Airports \n➤ " + servicableAirports + "\n\n"
            ;

            const financeOutput =
                "Defense Budget \n➤ " + defenseBudget + "\n\n"
                +
                "External Debt \n➤ " + externalDebt + "\n\n"
                +
                "Foreign Exchange \n➤ " + foreignExchange + "\n\n"
                +
                "Purchasing Power Parity \n➤ " + purchasingPowerParity + "\n\n"
            ;

            const geographyOutput =
                "Square Land Area (kilometers) \n➤ " + squareLandArea + "\n\n"
                +
                "Coastline (kilometers) \n➤ " + coastline + "\n\n"
                +
                "Shared Borders (kilometers) \n➤ " + sharedBorders + "\n\n"
                +
                "Waterways (kilometers) \n➤ " + waterways + "\n\n"
            ;

            time = Math.round(Date.now() - time);

            let text = Bot.Message.text();

            switch (type) {
                case Population:
                    text = Bot.Message.text("========================\nManpower Of " + country + "\n========================\n\n" + manpowerOutput);
                    bot.send([text.addResponseKeyboard(arrayRandom(randoms))], from, channelId);
                    break;
                case Aircraft:
                    text = Bot.Message.text("\n========================\nAir Power Of " + country + "\n========================\n\n" + airpowerOutput);
                    bot.send([text.addResponseKeyboard(arrayRandom(randoms))], from, channelId);
                    break;
                case Army:
                    text = Bot.Message.text("\n========================\nArmy Strength Of " + country + "\n========================\n\n" + armyStrengthOutput);
                    bot.send([text.addResponseKeyboard(arrayRandom(randoms))], from, channelId);
                    break;
                case Navy:
                    text = Bot.Message.text("\n========================\nNavy Strength Of " + country + "\n========================\n\n" + navyStrengthOutput);
                    bot.send([text.addResponseKeyboard(arrayRandom(randoms))], from, channelId);
                    break;
                case Petroleum:
                    text = Bot.Message.text("\n========================\nNatural Resources Of " + country + "\n========================\n\n" + naturalResourceOutput);
                    bot.send([text.addResponseKeyboard(arrayRandom(randoms))], from, channelId);
                    break;
                case Logistics:
                    text = Bot.Message.text("\n========================\nLogistics Of " + country + "\n========================\n\n" + logisticsOutput);
                    bot.send([text.addResponseKeyboard(arrayRandom(randoms))], from, channelId);
                    break;
                case Finance:
                    text = Bot.Message.text("\n========================\nFinance Of " + country + "\n========================\n\n" + financeOutput);
                    bot.send([text.addResponseKeyboard(arrayRandom(randoms))], from, channelId);
                    break;
                case Geography:
                    text = Bot.Message.text("\n========================\nGeography Of " + country + "\n========================\n\n" + geographyOutput);
                    bot.send([text.addResponseKeyboard(arrayRandom(randoms))], from, channelId);
                    break;
                default:
                    text = Bot.Message.text(
                        '========================\n'
                        + "➤ Unknown fragment. Please choose from the suggestions.\n"
                        + '========================\n'
                    );
                    bot.send([text.addResponseKeyboard(arrayRandom(randoms))], from, channelId);
                    break;
            }

        }else if (response.statusCode === 500) {
            let text = Bot.Message.text("Oops! Couldn't find that country it must be hiding really good.\nTry using the options below.");
            bot.send([text.addResponseKeyboard(arrayRandom(randoms))], from, channelId).catch((err) => console.log(err));
        }

    });
}

/**
 * Called when user sends starts chatting with bot
 */
bot.onStartChattingMessage(message => {
    /**
     * The id of the current chat
     *
     * @type {string}
     */
    let channelId = message.chatId;

    bot.getUserProfile(message.from).then(user => {

        console.log("\n\nNew User: " + user.username);

        let text = Bot.Message.text(
            `========================
             Hello, ${user.firstName}!
        \n\n➤ Are you interested in learning more about the military?
        \n➤ Tell me a country name or type "help" to get started.
        \n========================`);
        bot.send([text.addResponseKeyboard(arrayRandom(countries))], message.from, channelId);
    });
});

/**
 * Called when user sends message input
 */
bot.onTextMessage(message => {
    /**
     * The id of the current chat
     *
     * @type {string}
     */
    let channelId = message.chatId;
    const content = message.body;
    const parts = content.split(" ");
    const firstToLowercase = parts[0].toLowerCase();


    bot.getUserProfile(message.from).then(user => {
        console.log("\n\nMessage From: " + user.username);
        console.log("Message: " + content + "\n\n")
    });


    if(firstToLowercase === 'help'){
        let text = Bot.Message.text(
            '========================\n'
            + 'How to use\n' +
            '========================\n\n'
            +
            '➤ To get military information about a country just mention it\'s full name.\n\n'
            +
            '➤ To compare countries use "(country name) vs (country name)".\nYou can compare up to 4 in a single message.\n\n'
            +
            '➤ To get the rank of a country use "Rank of (country name)".\nThere is a max of 136 countries.\n\n'
            +
            '➤ To get the power index of a country use "Power Index of (country name)".\nA perfect power index is 0.0000.\n\n'
            +
            '➤ To get a top number of countries use "Top (number)".\nThere is a max of 136 countries.\n\n'
            +
            '➤ To get a country in a certain rank use "In Rank (number)".\nThere is a max of 136 countries.\n\n'
            +
            '➤ To get military information about a random country use "Random Country".\n\n'
            +
            '➤ More to be added in the future.'
        );
        bot.send([text.addResponseKeyboard(arrayRandom(randoms))], message.from, channelId).catch((err) => console.log(err));

        return;
    }

    if(content.toLowerCase().split(' vs ').length >= 2){
        const countries = content.toLowerCase().split(' vs ');
        const countryLength = countries.length;

        if (countryLength > 4){
            message.reply(
                '========================\n'
                + "➤ I can only compare 4 countries at once.\n\n"
                + "➤ Try sending in separate messages.\n"
                + '========================\n'
            );

            return;
        }

        let result = '';
        let time = Date.now();

        for(let i = 0; i < countryLength; ++i){

            request('https://www.globalfirepower.com/country-military-strength-detail.asp?country_id=' + countries[i].split(' ').join('-'), function (error, response, html) {


                if (!error && response.statusCode === 200) {
                    let $ = cheerio.load(html);

                    const data = $('span.textDkBlue.textBold');

                    const country = $(data[0]).text();
                    const rank = $(data[1]).text();
                    const index = $(data[2]).text();


                    result =
                        '========================\n'
                        + `${country}\n\n`
                        + `➤ Rank ${rank} out of 136\n`
                        + `➤ Power Index of ${index}\n`
                        + '========================\n\n';

                    message.reply(result);

                }else if (response.statusCode === 500) {

                    result =
                        '========================\n'
                        + "➤ Invalid country: " + countries[i] + "\n"
                        + '========================\n\n';

                    message.reply(result);

                }
            });
        }

        time = Math.round(Date.now() - time);

        setTimeout(() => {

            result = "Compared " + countryLength + " countries in " + time + " milliseconds.";

            let text = Bot.Message.text(result);
            bot.send([text.addResponseKeyboard(arrayRandom(randoms))], message.from, channelId).catch((err) => console.log(err));
        }, 1000);

        return;
    }

    if(content.toLowerCase().split('rank of ').length > 1){
        const parts = content.toLowerCase().split('rank of ');
        const country = parts[1];
        const rank = countries.indexOf(country.split(' ').join('-'));

        let result = '';

        if(rank === -1){
            result =
                '========================\n'
                + "➤ Invalid country: " + upperCaseEveryFirstLetter(country) + "\n\n"
                + "➤ Make sure to provide full country name."
                + '========================\n\n';

            let text = Bot.Message.text(result);
            bot.send([text.addResponseKeyboard(arrayRandom(randoms))], message.from, channelId).catch((err) => console.log(err));
        } else {
            result =
                '========================\n'
                + upperCaseEveryFirstLetter(country) + "\n\n"
                + `➤ Rank ${rank + 1} out of 136\n`
                + '========================\n\n';

            let text = Bot.Message.text(result);
            bot.send([text.addResponseKeyboard(arrayRandom(randoms))], message.from, channelId).catch((err) => console.log(err));
        }

        return;
    }

    if(content.toLowerCase().split('power index of ').length > 1){
        const parts = content.toLowerCase().split('power index of ');
        const country = parts[1].split(' ').join('-');

        let result = '';

        request('https://www.globalfirepower.com/country-military-strength-detail.asp?country_id=' + country, function (error, response, html) {


            if (!error && response.statusCode === 200) {
                let $ = cheerio.load(html);

                const data = $('span.textDkBlue.textBold');

                const country = $(data[0]).text();
                const index = $(data[2]).text();

                result =
                    '========================\n'
                    + country + "\n\n"
                    + `➤ Power Index of ${index}\n`
                    + '========================\n\n';

                let text = Bot.Message.text(result);
                bot.send([text.addResponseKeyboard(arrayRandom(randoms))], message.from, channelId).catch((err) => console.log(err));
            }else if (response.statusCode === 500) {

                result =
                    '========================\n'
                    + "➤ Invalid country: " + country + "\n"
                    + '========================\n\n';

                let text = Bot.Message.text(result);
                bot.send([text.addResponseKeyboard(arrayRandom(randoms))], message.from, channelId).catch((err) => console.log(err));

            }

        });

        return;
    }

    if(content.toLowerCase().split('top ').length > 1){
        const parts = content.toLowerCase().split('top ');
        let num = parts[1];

        let result = '========================\n';
        let split = false;

        if(!isNaN(num)){

            num = Number(num);

            if(num > 136 || num < 1){
                result =
                    '========================\n\n'
                    + "➤ There is a max of 136 countries.\n\n "
                    + '========================\n\n';

                let text = Bot.Message.text(result);
                bot.send([text.addResponseKeyboard(arrayRandom(randoms))], message.from, channelId).catch((err) => console.log(err));

                return;
            }

            result += "➤ Top " + num + "\n\n";

            for(let i = 0; i < num; ++i){
                let country = upperCaseEveryFirstLetter(countries[i].split('-').join(' '));

                result += "➤ " + (i + 1) + ". " + country + "\n";

                if (i >= 100 && !split){

                    message.reply(result).catch((err) => console.log(err));

                    result = '';

                    split = true;
                }

            }

            result += '\n========================\n';

            let text = Bot.Message.text(result);
            bot.send([text.addResponseKeyboard(arrayRandom(randoms))], message.from, channelId).catch((err) => console.log(err));
        }else{

            result =
                '========================\n'
                + "➤ Invalid number: " + num + "\n"
                + '========================\n\n';

            let text = Bot.Message.text(result);
            bot.send([text.addResponseKeyboard(arrayRandom(randoms))], message.from, channelId).catch((err) => console.log(err));
        }

        return;
    }

    if(content.toLowerCase().split('in rank ').length > 1){
        const parts = content.toLowerCase().split('in rank');
        let num = parts[1];

        let result = '';

        if(!isNaN(num)){

            num = Number(num);

            if(num > 136 || num < 1){
                result =
                    '========================\n\n'
                    + "➤ There is a max of 136 countries.\n\n "
                    + '========================\n\n';

                let text = Bot.Message.text(result);
                bot.send([text.addResponseKeyboard(arrayRandom(randoms))], message.from, channelId).catch((err) => console.log(err));

                return;
            }

            let country = countries[num - 1];
            country = upperCaseEveryFirstLetter(country.split('-').join(' '));

            result =
                '========================\n'
                + country + "\n\n"
                + `➤ In Rank ${num}\n`
                + '========================\n\n';

            let text = Bot.Message.text(result);
            bot.send([text.addResponseKeyboard(arrayRandom(randoms))], message.from, channelId).catch((err) => console.log(err));
        }else{
            result =
                '========================\n'
                + "➤ Invalid number: " + num + "\n"
                + '========================\n\n';

            let text = Bot.Message.text(result);
            bot.send([text.addResponseKeyboard(arrayRandom(randoms))], message.from, channelId).catch((err) => console.log(err));
        }

        return;

    }

    let m = content.toLowerCase().split(" ").join("-");

    switch (m){
        case "manpower":
            countryInfo(Population, message.from, channelId);
            break;
        case "air-power":
            countryInfo(Aircraft, message.from, channelId);
            break;
        case "army-strength":
            countryInfo(Army, message.from, channelId);
            break;
        case "navy-strength":
            countryInfo(Navy, message.from, channelId);
            break;
        case "natural-resources":
            countryInfo(Petroleum, message.from, channelId);
            break;
        case "logistics":
            countryInfo(Logistics, message.from, channelId);
            break;
        case "finance":
            countryInfo(Finance, message.from, channelId);
            break;
        case "geography":
            countryInfo(Geography, message.from, channelId);
            break;
        default:
            if(m === 'random-country'){
                m = arrayRandom(countries);
            }

            if (countriesSearch.indexOf(m) === -1) {
                let text = Bot.Message.text("Oops! Couldn't find that country it must be hiding really good.\nTry using the options below.");
                bot.send([text.addResponseKeyboard(arrayRandom(randoms))], message.from, channelId).catch((err) => console.log(err));
                return;
            }

            lastCountry = m;

            m = filter.clean(m);

            let text = Bot.Message.text(
                '========================\n'
                + "➤ Please choose what you want view for \"" + content + "\":\n"
                + '========================\n'
            );
            bot.send([text.addResponseKeyboard(["Manpower", "Air Power", "Army Strength", "Navy Strength", "Natural Resources", "Logistics", "Finance", "Geography"])], message.from, channelId).catch((err) => console.log(err));
            break
    }
});

bot.onLinkMessage(message => {
    /**
     * The id of the current chat
     *
     * @type {string}
     */
    let channelId = message.chatId;
    let text = Bot.Message.text("Oops! Couldn't find that country it must be hiding really good.\nTry using the options below.");
    bot.send([text.addResponseKeyboard(arrayRandom(randoms))], message.from, channelId).catch((err) => console.log(err));
});

bot.onPictureMessage(message => {
    /**
     * The id of the current chat
     *
     * @type {string}
     */
    let channelId = message.chatId;
    let text = Bot.Message.text("Oops! Couldn't find that country it must be hiding really good.\nTry using the options below.");
    bot.send([text.addResponseKeyboard(arrayRandom(randoms))], message.from, channelId).catch((err) => console.log(err));
});

bot.onVideoMessage(message => {
    /**
     * The id of the current chat
     *
     * @type {string}
     */
    let channelId = message.chatId;
    let text = Bot.Message.text("Oops! Couldn't find that country it must be hiding really good.\nTry using the options below.");
    bot.send([text.addResponseKeyboard(arrayRandom(randoms))], message.from, channelId).catch((err) => console.log(err));
});

bot.onScanDataMessage(message => {
    /**
     * The id of the current chat
     *
     * @type {string}
     */
    let channelId = message.chatId;
    let text = Bot.Message.text("Oops! Couldn't find that country it must be hiding really good.\nTry using the options below.");
    bot.send([text.addResponseKeyboard(arrayRandom(randoms))], message.from, channelId).catch((err) => console.log(err));
});

bot.onStickerMessage(message => {
    /**
     * The id of the current chat
     *
     * @type {string}
     */
    let channelId = message.chatId;
    let text = Bot.Message.text("Oops! Couldn't find that country it must be hiding really good.\nTry using the options below.");
    bot.send([text.addResponseKeyboard(arrayRandom(randoms))], message.from, channelId).catch((err) => console.log(err));
});

/**
 * The bots http request port
 */
const port = process.env.PORT || 8080;

/**
 * Start bot listening on port
 */
http
    .createServer(bot.incoming())
    .listen(port, (err) => {
        if (err) {
            return console.log('something bad happened: ', err);
        }
        console.log(`server is listening on ` + port);
    });