# TimeRegistration

Just a small tool to check flexTime balance before checking out.

## Install

```bash
$ npm install
$ ./timeReg.js or node timeReg.js
```

You could even use npm start, but that way it's not very convenient to pass commandline parameters.

## Example use

Check the `--help` pages for all the options.


```bash
# Normal usage 
$ npm start --start-time 07:45
# or equivalent
$ npm start -s 07:45

# Possible to supply endTime to check flexTime balance
$ npm start --start-time 07:45 --end-time 16:30
# or equivalent
$ npm start -s 07:45 -e 16:30
```

## Example output

```bash
$ npm start -s 07:30 -e 16:55

*****************************************************
******************* TIME MACHINE ********************
*****************************************************
***            Full day:    7.4 hours             ***
***            Break:      45 minutes             ***
*****************************************************
***            Day started         @ 07:30        ***
***            Half day ends       @ 11:12        ***
***            Full day ends       @ 15:39        ***
*****************************************************
*****************************************************
***                 End @ 16:55                   ***
***            -> Flex time == 01:16              ***
*****************************************************

```

## Example output with warning
```bash
$ npm start -s 07:30 -e 13:55

*****************************************************
******************* TIME MACHINE ********************
*****************************************************
***            Full day:    7.4 hours             ***
***            Break:      45 minutes             ***
*****************************************************
***            Day started         @ 07:30        ***
***            Half day ends       @ 11:12        ***
***            Full day ends       @ 15:39        ***
*****************************************************
*****************************************************
***                 End @ 13:55                   ***
***            -> Flex time == -01:44              ***
*****************************************************

!!!!!!!!!!!!!!!!!!!!  WARNING !!!!!!!!!!!!!!!!!!!!!!!
!!!    FlexTime deduction is capped @ -96 min     !!!
!!! 1/2 day will be deducted from total Flextime  !!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

```

## Help menu
```bash
$ npm start --help
Usage: timeReg [OPTIONS]

Options:
  -h, --help          Show help                                        [boolean]
  -s, --start-time    Starting time formatted as hh:mm (ex. 08:53).
                      Default is 08:00                                  [string]
  -e, --end-time      End time formatted as hh:mm (see above).
                      Default is the current time.                      [string]
  -f, --full-day      Length of full day in minutes.
                      Default is 444 minutes (= 7.4 hours).             [number]
  -b, --break         Length of lunch break in minutes.
                      Default is 45 minutes.                            [number]
  -m, --max-flextime  Length of the flex-time cap in minutes.
                      Default is 96 minutes.                            [number]
  -v, --version       Show version number                              [boolean]
```

