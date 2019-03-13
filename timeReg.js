const moment = require('moment');
moment.locale('nl-be');

// Help page
if (process.argv[2] === '-h' || process.argv[2] === '--help') {
    console.log('Usage: timeReg [OPTIONS]');
    console.log('');
    console.log('Options:');
    console.log('   -s, --start-time        Starting time formatted as hh:mm (ex. 08:53)');
    console.log('                           (default: 08:00)');
    console.log('   -e, --end-time          End time formatted as hh:mm (see above)');
    console.log('                           (default: current time)');
    console.log('   -b, --break             Length of break in minutes');
    console.log('                           (default: 45)');
    process.exit(0);
}

// Constants
const STANDARD_TIME = 7.4; // hours
let LUNCH_BREAK = 45; // minutes
let startTime = ["08", "00"];
let endTime;

for (let index of process.argv.keys()) {
    switch(process.argv[index]){
        case '-s':
        case '--start-time':
            startTime = process.argv[index + 1].split(":");
            break;
        case '-e':
        case '--end-time':
            endTime = process.argv[index + 1].split(":");
            break;
        case '-b':
        case '--break':
            LUNCH_BREAK = process.argv[index + 1];
            break;
    }
}


// Read the startTime
const startHours = +startTime[0];
const startMinutes = +startTime[1];

// Read the endTime or use the current time if no endTime is passed
let endHours = moment().hours();
let endMinutes = moment().minutes();

if (endTime) {
    endHours = +endTime[0];
    endMinutes = +endTime[1];
}

let formatError;

if (endHours > 24 ||
    endHours < 0 ||
    startHours > 24 ||
    startHours < 0 ||
    endMinutes < 0 ||
    endMinutes > 59 ||
    startMinutes > 59 ||
    startMinutes > 59) {
    formatError = true;
}

if (formatError) {
    console.error('[!]   Badly formatted input --> check the help page for instructions "node timeReg.js --help"');
    process.exit(1);
}

// Error when no start time is given
if (startHours > endHours || (startHours === endHours && startMinutes > endMinutes)) {
    console.error('[!]   end-time < start-time --> check the help page for instructions "node timeReg.js --help"');
    process.exit(1);
}

// Helper functions
const getTime = (init, hours, minutes) => moment(init).add(hours, 'hour').add(minutes, 'minute');

const formatFlexTime = (flexTimeInMinutes) => {
    const sign = Math.abs(flexTimeInMinutes) / flexTimeInMinutes;

    let minutes = Math.abs(flexTimeInMinutes % 60);
    minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    let hours = Math.abs((sign*flexTimeInMinutes - minutes) / 60);
    hours = hours < 10 ? `0${hours}` : `${hours}`;

    const time = `${hours}:${minutes}`;
    return sign < 0 ? `-${time}` : time;
};

// All the different moments we need
const startOfDay = moment().startOf('day');
const startOfWorkingDay = getTime(startOfDay, startHours, startMinutes);
const endOfHalfWorkingDay = getTime(startOfWorkingDay, STANDARD_TIME/2, 0);
const endOfWorkingDay = getTime(startOfWorkingDay, STANDARD_TIME, LUNCH_BREAK);
const projectedEndTime = getTime(startOfDay, endHours, endMinutes);

// Calculate flexTime
const flexTime = moment(projectedEndTime)
    .subtract(STANDARD_TIME, 'hour')
    .subtract(LUNCH_BREAK, 'minute')
    .diff(startOfWorkingDay, 'minute');

// Print stuff
console.log('***********************************');
console.log('********** TIME MACHINE ***********');
console.log('***********************************');
console.log(`***   Full day:    ${STANDARD_TIME} hours    ***`);
console.log(`***   Break:      ${LUNCH_BREAK} minutes    ***`);
console.log('***********************************');
console.log(`***   Day started     @ ${startOfWorkingDay.format('LT')}   ***`);
console.log(`***   Half day ends   @ ${endOfHalfWorkingDay.format('LT')}   ***`);
console.log(`***   Full day ends   @ ${endOfWorkingDay.format('LT')}   ***`);
console.log('***********************************');
console.log(`***        End @ ${projectedEndTime.format('LT')}          ***`);
console.log(`***    -> Flex time == ${formatFlexTime(flexTime)}    ***`);
console.log('***********************************');
