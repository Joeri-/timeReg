# TimeRegistration

Just a small tool to check flexTime balance before checking out.

## Install
```bash
$ npm install
```

## Example use
```bash
# Normal usage (always supply beginTime)
$ node ./timeReg.js --begin-time 07:45
# or equivalent
$ node ./timeReg.js -b 07:45

# Possible to supply endTime to check flexTime balance
$ node ./timeReg.js --begin-time 07:45 --end-time 16:30
# or equivalent
$ node ./timeReg.js -b 07:45 -e 16:30
```

## Example output
```bash
$ node timeReg.js -b 07:30 -e 16:55
***********************************
******** KBC TIME MACHINE *********
***********************************
***   Day started     @ 07:30   ***
***   Half day ends   @ 11:12   ***
***   Full day ends   @ 15:39   ***
***********************************
***        End @ 16:55          ***
***    -> Flex time == 01:16    ***
***********************************
```

