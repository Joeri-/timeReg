const moment = require('moment');
moment.locale('nl-be');

// Man-page
if (process.argv[2] === '-h' || process.argv[2] === '--help') {
    console.log('Usage: timeReg [OPTIONS]');
    console.log('');
    console.log('Options:');
    console.log('   -b, --begin-time        Starting time formatted as hh:mm (ex. 08:53)');
    console.log('   -e, --end-time          End time formatted as hh:mm (see above)');
    process.exit(0);
}

let startTime, endTime;

for (let index of process.argv.keys()) {
    switch(process.argv[index]){
        case '-b':
        case '--begin-time':
            startTime = process.argv[index + 1].split(":");
            break;
        case '-e':
        case '--end-time':
            endTime = process.argv[index + 1].split(":");
            break;
    }
}

if (!startTime) {
    console.error('[!]   No start time given --> see the help page "node timeReg.js --help"');
    process.exit(1);
}

// Read the start time
const startHours = +startTime[0];
const startMinutes = +startTime[1];

// Read the end time or use the current time
let endHours = moment().hours();
let endMinutes = moment().minutes();

if (endTime) {
    endHours = +endTime[0] || moment().hours();
    endMinutes = +endTime[1] || moment().minutes();
}

const standardTime = 7.4; // hours
const lunchBreak = 45; // minutes

const startOfDay = moment().startOf('day');
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

const startOfWorkingDay = getTime(startOfDay, startHours, startMinutes);
const endOfHalfWorkingDay = getTime(startOfWorkingDay, standardTime/2, 0);
const endOfWorkingDay = getTime(startOfWorkingDay, standardTime, 45);
const projectedEndTime = getTime(startOfDay, endHours, endMinutes);

const flexTime = moment(projectedEndTime)
    .subtract(standardTime, 'hour')
    .subtract(lunchBreak, 'minute')
    .diff(startOfWorkingDay, 'minute');


console.log('***********************************');
console.log('******** KBC TIME MACHINE *********');
console.log('***********************************');
console.log(`***   Day started     @ ${startOfWorkingDay.format('LT')}   ***`);
console.log(`***   Half day ends   @ ${endOfHalfWorkingDay.format('LT')}   ***`);
console.log(`***   Full day ends   @ ${endOfWorkingDay.format('LT')}   ***`);
console.log('***********************************');
console.log(`***        End @ ${projectedEndTime.format('LT')}          ***`);
console.log(`***    -> Flex time == ${formatFlexTime(flexTime)}    ***`);
console.log('***********************************');
