'use strict';

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
require('date-utils');

class GoogleCalSync{
    constructor(){
        this.saveAuth=this.saveAuth.bind(this);
        this.authPapre=this.authPapre.bind(this);
        this.auth=null;
        this.mainProcess=this.mainProcess.bind(this);
    };
    authPapre(callback){
    };
    saveAuth(auth){
        this.auth=auth;
    };
    mainProcess(event){
        if(this.auth==null){
            return;
        }
        else{
            google.options({ proxy: 'http://127.0.0.1:8118'});
            var calendar = google.calendar('v3');
            calendar.events.insert({
              auth: this.auth,
              calendarId: 'primary',
              resource: event,
            }, function(err, event) {
              if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                return;
              }
              console.log('Event created: %s', event.htmlLink);
            });
        }
    }
}

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
    if(auth==null){
        console.log(null);
        return;
    }
    else{
        console.log(auth);
    }
    google.options({ proxy: 'http://127.0.0.1:8118',auth:auth});
    var calendar = google.calendar('v3');
    var event = {
  'summary': 'Google Calendar Test',
  'location': '800 Howard St., San Francisco, CA 94103',
  'start': {
    'dateTime': '2016-02-28T09:00:00',
    'timeZone': 'Asia/Shanghai'
  },
  'end': {
    'dateTime': '2016-02-28T17:00:00',
    'timeZone': 'Asia/Shanghai'
  },
  'recurrence': [
    'RRULE:FREQ=DAILY;COUNT=2'
  ],
  'attendees': [
    {'email': 'lpage@example.com'},
    {'email': 'sbrin@example.com'},
  ],
  'reminders': {
    'useDefault': false,
    'overrides': [
      {'method': 'email', 'minutes': 24 * 60},
      {'method': 'popup', 'minutes': 10},
    ],
  },
};

calendar.events.insert({
  auth: auth,
  calendarId: 'primary',
  resource: event,
}, function(err, event) {
  if (err) {
    console.log('There was an error contacting the Calendar service: ' + err);
    return;
  }
  console.log('Event created: %s', event.htmlLink);
});
  // calendar.events.list({
  //   calendarId: 'primary',
  //   timeMin: (new Date()).toISOString(),
  //   maxResults: 10,
  //   singleEvents: true,
  //   orderBy: 'startTime'
  // }, function(err, response) {
  //   if (err) {
  //     console.log('The API returned an error: ' + err);
  //     return;
  //   }
  //   var events = response.items;
  //   if (events.length == 0) {
  //     console.log('No upcoming events found.');
  //   } else {
  //     console.log('Upcoming 10 events:');
  //     for (var i = 0; i < events.length; i++) {
  //       var event = events[i];
  //       var start = event.start.dateTime || event.start.date;
  //       console.log('%s - %s', start, event.summary);
  //     }
  //   }
  // });
}

function mainProcess(event){
    if(global.Auth==null){
        return;
    }
    if(event==null){
        return;
    }
    else{
        console.log('inserting');
        google.options({ proxy: 'http://127.0.0.1:8118'});
        var calendar = google.calendar('v3');
        calendar.events.insert({
          auth: global.Auth,
          calendarId: 'primary',
          resource: event,
        }, function(err, event) {
          if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            console.log(event);
            return;
          }
          console.log('insert success');
        });
    }
}

global.Auth=null;
var timeList={
    0:['08:30','09:15'],
    1:['09:20','10:05'],
    2:['10:20','11:05'],
    3:['11:10','11:55'],
    4:['14:30','15:15'],
    5:['15:20','16:05'],
    6:['16:20','17:05'],
    7:['17:10','17:55'],
    8:['19:30','20:15'],
    9:['20:20','21:05'],
    10:['21:10','21:55'],
    11:['22:00','22:45']
};
var d=new Date();
d.setFullYear(2016);
d.setMonth(1);
d.setDate(22);
fs.readFile(__dirname+'/client_secret_164402223173-692hnnmav0lv58ms3jgbccd5tmcs73bd.apps.googleusercontent.com.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  authorize(JSON.parse(content), function(auth){
      global.Auth=auth;
  });
});
function main(weekData,week){
    var i=0;
    function loop(){
        setTimeout(function(){
            if(weekData==[]) return;
            try{
                var start=d.clone().addDays((week-1)*7+weekData[i][8][0][0]).toFormat('YYYY-MM-DD')+'T';
                start+=timeList[weekData[i][8][0][1]][0]+':00';
                var end=d.clone().addDays((week-1)*7+weekData[i][8][0][0]).toFormat('YYYY-MM-DD')+'T';
                end+=timeList[weekData[i][8][weekData[i][8].length-1][1]][1]+':00';
                var event = {
                    'summary': weekData[i][3],
                    'location': weekData[i][5],
                    'description': '['+weekData[i][7]+']'+weekData[i][1],
                    'start': {
                        'dateTime': start,
                        'timeZone': 'Asia/Shanghai'
                    },
                    'end': {
                        'dateTime': end,
                        'timeZone': 'Asia/Shanghai'
                    },
                    'reminders': {
                        'useDefault': false,
                        'overrides': [
                            {'method': 'popup', 'minutes': 30},
                        ],
                    },
                };
            }catch(err){
                console.log(err);
                console.log(weekData);
            }
            setTimeout(mainProcess,10000,event);
            i++;
            if(i<weekData.length){
                loop();
            }
        },15000);
    };
    loop();
}

module.exports.main=main;
module.exports.GoogleCalSync=GoogleCalSync;
