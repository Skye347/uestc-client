'use strict';
var request=require('request').defaults({jar:true})
const remote=require('electron').remote
var LogObj=remote.getGlobal('LogObjG');
const ipcRenderer = require('electron').ipcRenderer;

class SettingsCenter{
    constructor(){

    };
    toggleDevtools(){
        ipcRenderer.send('ToggleDevtools');
    };
}

class InfoClient{
    constructor(){
        this.reloginflag=false;
        this.callback=new Array();
        this.getInfo('Logged');
        this.logged=false;
        this.name="null";
        this.SemList=null;
        this.tmpStore=null;
        this.tmpType=null;
        this.username=null;
        this.password=null;
        this.rememberme=null;
    };
    setCallback(Obj){
        this.callback.push(Obj);
    };
    logout(){
        ipcRenderer.send('Logout');
        this.Logged=false;
        this.setLogState();
    };
    relogin(){
        this.relogin=false;
        return new Promise((resolve,reject)=>{
            ipcRenderer.send('Login', [this.username,this.password,this.rememberme]);
            ipcRenderer.on('LoginFinished', function(event, arg) {
                // obj.logged=arg[0];
                resolve(arg);
            });
        })
    };
    login(username,password,rememberme){
        var obj=this;
        this.username=username;
        this.password=password;
        this.rememberme=rememberme;
        return new Promise((resolve,reject)=>{
            ipcRenderer.send('Login', [username,password,rememberme]);
            ipcRenderer.on('LoginFinished', function(event, arg) {
                obj.logged=arg[0];
                resolve(arg);
            });
        })
    };
    async setLogState(){
        this.isLogged=await this.getInfo('Logged');
        for (var index in this.callback){
            this.callback[index].setState({logged:this.logged});
        }
    };
    //|-------------------------------------------
    //|Remeber to call infoClient.getInfo('').then
    //|or
    //|async await infoClient.getInfo
    //|-------------------------------------------
    getInfo(type,args){
        if(type=='Logged'){
            var obj=this;
            return new Promise((resolve,reject)=>{
                ipcRenderer.send('GetLogged',null);
                ipcRenderer.on('GetLogged-reply',function(event,arg){
                    // console.log('GetLogged-reply:'+arg);
                    obj.logged=arg;
                    resolve(arg);
                });
            })
        }
        else if (type=='SemList') {
            return new Promise((resolve,reject)=>{
                if(this.SemList!=null){
                    resolve(this.SemList);
                }
                else{
                    ipcRenderer.send('GetSemList',null);
                    ipcRenderer.on('GetSemList-reply',function(event,arg){
                        //console.log('GetSemList-reply:'+arg);
                        this.SemList=arg[1];
                        resolve(arg);
                    });
                }
            })
        }
        else if(type=='ClassTable'){
            return new Promise((resolve,reject)=>{
                ipcRenderer.send('GetClassTable',args);
                // console.log(args);
                ipcRenderer.removeAllListeners(['GetClassTable-reply']);
                ipcRenderer.on('GetClassTable-reply',function(event,arg){
                    resolve(arg);
                });
            })
        }
        else if(type=='PublicQuery'){
            return new Promise((resolve,reject)=>{
                ipcRenderer.send('PublicQuery',args);
                ipcRenderer.on('PublicQuery-reply',function(event,arg){
                    resolve(arg);
                });
            })
        }
    };
};

module.exports.InfoClient=InfoClient;
module.exports.SettingsCenter=SettingsCenter;
