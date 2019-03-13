# TimeRegistration

Just a small tool to check flexTime balance before checking out.

## Install
```bash
$ npm install
```

## Example use

Check the `--help` pages for all the options.


```bash
# Normal usage 
$ node ./timeReg.js --start-time 07:45
# or equivalent
$ node ./timeReg.js -s 07:45

# Possible to supply endTime to check flexTime balance
$ node ./timeReg.js --start-time 07:45 --end-time 16:30
# or equivalent
$ node ./timeReg.js -s 07:45 -e 16:30
```

## Example output
```bash
$ node timeReg.js -s 07:30 -e 16:55
***********************************
********** TIME MACHINE ***********
***********************************
***   Full day:    7.4 hours    ***
***   Break:      45 minutes    ***
***********************************
***   Day started     @ 07:30   ***
***   Half day ends   @ 11:12   ***
***   Full day ends   @ 15:39   ***
***********************************
***        End @ 16:55          ***
***    -> Flex time == 01:16    ***
***********************************
```

