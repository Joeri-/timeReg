# TimeRegistration

Just a small tool to check flexTime balance before checking out.

## Install

```bash
$ npm install
$ ./timeReg.js || node timeReg.js || npm start
```

## Example use

Check the `--help` pages for all the options.


```bash
# Normal usage 
$ ./timeReg.js --start-time 07:45
# or equivalent
$ ./timeReg.js -s 07:45

# Possible to supply endTime to check flexTime balance
$ ./timeReg.js --start-time 07:45 --end-time 16:30
# or equivalent
$ ./timeReg.js -s 07:45 -e 16:30
```

## Example output

```bash
$ ./timeReg.js -s 07:30 -e 16:55

     *************************************************
     **************** TIME MACHINE *******************
     *************************************************
     ***        Full day:        7.4 hours         ***
     ***        Break:           45 minutes        ***
     ***        Flex time cap:   96 minutes        ***
     *************************************************

     *************************************************
     ***        Day started         @ 07:30        ***
     ***        Day ended           @ 16:55        ***
     ***       -----------------------------       ***
     ***        Half day ends       @ 11:12        ***
     ***        MIN  day ends       @ 14:03        ***
     ***    ->  Neutral day ends    @ 15:39 <-     ***
     ***        MAX  day ends       @ 17:15        ***
     *************************************************

     *************************************************
     ***   Resulting Flex time ==  01:16 (76 min)  ***
     *************************************************

```

## Example output with warning
```bash
$ ./timeReg.js -s 07:30 -e 13:30

     *************************************************
     **************** TIME MACHINE *******************
     *************************************************
     ***        Full day:        7.4 hours         ***
     ***        Break:           45 minutes        ***
     ***        Flex time cap:   96 minutes        ***
     *************************************************

     *************************************************
     ***        Day started         @ 07:30        ***
     ***        Day ended           @ 13:30        ***
     ***       -----------------------------       ***
     ***        Half day ends       @ 11:12        ***
     ***        MIN  day ends       @ 14:03        ***
     ***    ->  Neutral day ends    @ 15:39 <-     ***
     ***        MAX  day ends       @ 17:15        ***
     *************************************************

     *************************************************
     ***  Resulting Flex time == -02:09 (-129 min) ***
     *************************************************

 !!!!!!!!!!!!!!!!!!!!!!! WARNING !!!!!!!!!!!!!!!!!!!!!!!!!
 !!!      FlexTime deduction is capped @ -96 min       !!!
 !!!     -----------------------------------------     !!!
 !!!                                                   !!!
 !!!  If you do decide to sign out now, 1/2 day will   !!!
 !!! be deducted from your flextime compensation days  !!!
 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

```

## Help menu
```bash
$ ./timeReg.js --help
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

