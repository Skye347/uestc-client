const InfoServer=require('./core/core-main.js');
const ipcMain = require('electron').ipcMain;
const BrowserWindow=require('electron').BrowserWindow;
var request = require('request').defaults({jar:true});
var GetSemList=require('./RequestCollection.js').GetSemList;
var GetExamList=require('./RequestCollection.js').GetExamList;
var GetClassTable=require('./RequestCollection.js').GetClassTable;
var PublicClassQuery=require('./RequestCollection.js').PublicClassQuery;
var fs=require("fs");

global.SemList=null;//Remeber to fill it
global.isLogged=false;
global.cookies=null;
var infoServer=new InfoServer();
var rmJson=JSON.parse(fs.readFileSync("rememberme.json"));
if(rmJson.rememberme==true){
    infoServer.login(rmJson.username,rmJson.password).then(async function(){
        if(global.isLogged==true){
            global.SemList=(await GetSemList())[1];
        }
    });
}

ipcMain.on('Login',async function(event, arg) {
    if(arg[2]==true){//rememberme on
        fs.writeFileSync("rememberme.json",JSON.stringify({
            rememberme:true,
            username:arg[0],
            password:arg[1]
        }));
    }
    else{
        fs.writeFileSync("rememberme.json",JSON.stringify({
            rememberme:false,
            username:"",
            password:""
        }));
    }
    var result=await infoServer.login(arg[0],arg[1]);
    console.log(result);
    event.sender.send('LoginFinished', [result]);
});

ipcMain.on('GetLogged',function(event,arg){
    // console.log('GetLogged');
    // console.log('Sending:'+global.isLogged);
    event.sender.send('GetLogged-reply',global.isLogged);
})

ipcMain.on('Logout',function(event,arg){
    infoServer.logout();
});

ipcMain.on('GetSemList',async function(event,arg){
    if(global.isLogged){
        var result=await GetSemList();
        event.sender.send('GetSemList-reply',result);
    }
    else{
        event.sender.send('GetSemList-reply',[2,null]);
    }
})

ipcMain.on('GetClassTable',async function(event,arg){
    if(global.isLogged){
        var result=await GetClassTable(arg[0],arg[1]);
        event.sender.send('GetClassTable-reply',result);
    }
    else{
        event.sender.send('GetSemList-reply',null);
    }
})

ipcMain.on('PublicQuery',async function(event,arg){
    if(global.isLogged){
        var result=await PublicClassQuery(arg);
        event.sender.send('PublicQuery-reply',result);
    }
    else{
        event.sender.send('PublicQuery-reply',null);
    }
})
