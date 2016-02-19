'use strict';

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var React=require('react');
var TextField=require('material-ui/lib/text-field');
var RaisedButton=require('material-ui/lib/raised-button');
require('date-utils');

class GoogleCalSyncView extends React.Component{
    constructor(){
        super();
        this.handleAuthCode=this.handleAuthCode.bind(this);
        this.handleSync=this.handleSync.bind(this);
        this.state={
            auth:false,
            sync:false,
            done:false,
            error:false
        }
    };
    handleAuthCode(){
        global.authCode=this.refs.AuthCode.getValue();
        var view=this;
        global.oauth2Client.getToken(global.authCode, function(err, token) {
          if (err) {
              view.setState({error:'Error while trying to retrieve access token'+err})
              return;
          }
          global.oauth2Client.credentials = token;
          global.Auth=global.oauth2Client;
          view.setState({auth:true});
        });
    }
    handleSync(){
        this.setState({sync:true});
        for(var i=0;i<this.props.data.length;i++){
            //ClasstableSync(this.props.data[i][0],this.props.data[i][1]);
        }
        this.setState({done:true});
    }
    render(){
        if(this.state.error){
            return(
                <div>
                    {this.state.error}
                </div>
            )
        }
        if(!this.state.auth){
            return(
                <div>
                    Authorize this app by visiting this url:{global.authUrl}
                    <TextField ref='AuthCode' hintText='AuthCode:'></TextField>
                    <RaisedButton label='Next' onClick={this.handleAuthCode}/>
                </div>
            )
        }
        else if(!this.state.sync){
            return(
                <div>
                    Click to sync your ClassTable
                    <RaisedButton label='Next' onClick={this.handleSync}/>
                </div>
            )
        }
        else if(!this.state.done){
            return(
                <div>
                    Syncing
                </div>
            )
        }
        else{
            return(
                <div>
                    Done!
                </div>
            )
        }
    };
}

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar'];

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
  global.oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  saveAuthUrl(global.oauth2Client);
}

function saveAuthUrl(oauth2Client) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  global.authUrl=authUrl;
}

function ClasstableSyncMain(event){
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

global.authCode=null;
global.oauth2Client=null;
global.authUrl=null;
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
  authorize(JSON.parse(content));
});
function ClasstableSync(weekData,week){
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
            setTimeout(ClasstableSyncMain,10000,event);
            i++;
            if(i<weekData.length){
                loop();
            }
        },15000);
    };
    loop();
}

module.exports.GoogleCalSyncView=GoogleCalSyncView;
