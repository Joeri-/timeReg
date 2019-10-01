#!/usr/bin/env node
'use strict';

const moment = require('moment');
moment.locale('nl-be');

const yargs = require('yargs');

const argv = yargs
    .usage('timeReg [--start-time 09:00] [--end-time 17:00] [--full-day 444] [--break 45] [--max-flextime 96]')

    // option: start-time
    .string('start-time')
    .alias('s', 'start-time')
    .describe('start-time', 'Starting time formatted as hh:mm (ex. 08:53). \n Default is 08:00')

    // option: end-time
    .string('end-time')
    .alias('f', 'end-time')
    .describe('end-time', 'End time formatted as hh:mm (see above). \n Default is the current time.')

    // option: full-day
    .number('full-day')
    .alias('f', 'full-day')
    .describe('break', 'Length of full day in minutes. \n Default is 444 minutes (= 7.4 hours).')

    // option: break
    .number('break')
    .alias('b', 'break')
    .describe('break', 'Length of lunch break in minutes. \n Default is 45 minutes.')

    // option: max-flextime
    .number('max-flextime')
    .alias('m', 'max-flextime')
    .describe('max-flextime', 'Length of the flex-time cap in minutes. \n Default is 96 minutes.')

    // flag: help
    .help('h')
	.alias('h','help')

    // flag: version
    .version()
	.alias('v', 'version')

    .argv;
    
// Constants
const STANDARD_TIME_IN_HOURS = (new Date(argv.f*60*1000)).getHours() - 1;
const STANDARD_TIME_IN_DECIMAL_HOURS = Math.round((new Date(argv.f*60*1000)).getMinutes() / 60*100) / 100;
const STANDARD_TIME = STANDARD_TIME_IN_HOURS + STANDARD_TIME_IN_DECIMAL_HOURS || 7.4;
const LUNCH_BREAK = argv.b || 45; // minutes
const FLEX_TIME_CAP = argv.m || 96; // minutes
const startTime = argv.s ? argv.s.split(":") : ["08", "00"];
const endTime = argv.e ? argv.e.split(":") : [moment().hours(), moment().minutes()];

// Split the startTime
const startHours = +startTime[0];
const startMinutes = +startTime[1];

// Split the endTime
const endHours = +endTime[0];
const endMinutes = +endTime[1];

let formatError;

if (endHours > 24 ||
    endHours < 0 ||
    startHours > 24 ||
    startHours < 0 ||
    endMinutes < 0 ||
    endMinutes > 59 ||
    startMinutes > 59 ||
    startMinutes > 59 ||
    LUNCH_BREAK < 0 ||
    FLEX_TIME_CAP < 0) {
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
console.log('');
console.log('*****************************************************');
console.log('******************* TIME MACHINE ********************');
console.log('*****************************************************');
console.log(`***            Full day:    ${STANDARD_TIME} hours             ***`);
console.log(`***            Break:      ${LUNCH_BREAK} minutes             ***`);
console.log('*****************************************************');
console.log(`***            Day started         @ ${startOfWorkingDay.format('LT')}        ***`);
console.log(`***            Half day ends       @ ${endOfHalfWorkingDay.format('LT')}        ***`);
console.log(`***            Full day ends       @ ${endOfWorkingDay.format('LT')}        ***`);
console.log('*****************************************************');
console.log('*****************************************************');
console.log(`***                 End @ ${projectedEndTime.format('LT')}                   ***`);
console.log(`***            -> Flex time == ${formatFlexTime(flexTime)}              ***`);
console.log('*****************************************************');
if (flexTime > FLEX_TIME_CAP) {
    console.log('');
    console.log('!!!!!!!!!!!!!!!!!!!!!!!  WARNING !!!!!!!!!!!!!!!!!!!!');
    console.log(`!!!      FlexTime addition is capped @ ${FLEX_TIME_CAP} min     !!!`);
    console.log(`!!!           Stop working already ;)             !!!`);
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
}
if (flexTime < -FLEX_TIME_CAP) {
    console.log('');
    console.log('!!!!!!!!!!!!!!!!!!!!!!!  WARNING !!!!!!!!!!!!!!!!!!!!');
    console.log(`!!!    FlexTime deduction is capped @ -${FLEX_TIME_CAP} min     !!!`);
    console.log(`!!! 1/2 day will be deducted from total Flextime  !!!`);
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
}

console.log('');
// console.log('***********************************');
// console.log(`*** ! A minimum of ! ***`);
// console.log('***********************************');
// console.log('***********************************');
