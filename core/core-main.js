'use strict';
var request=require('request').defaults({jar:true})
require("babel-polyfill");
require("babel-core/register");
const BrowserWindow=require('electron').BrowserWindow
const ipcMain = require('electron').ipcMain;

class InfoServer{
    constructor(){
        global.isLogged=false;
        this.name="null";
        this.goCookie=false;
    };
    getInfo(){

    };
    logout(){
        global.isLogged=false;
        global.cookies=null;
    };
    login(username,password){
        if(global.isLogged==true){
            this.logout();
        }
        return new Promise((resolve,reject)=>{
            var executeStr='document.getElementById("username").value="'+username+'";document.getElementById("password").value="'+password+'";document.getElementById("casLoginForm").submit();'
            var win=new BrowserWindow();
            win.loadURL("http://idas.uestc.edu.cn/authserver/login?service=http%3A%2F%2Fportal.uestc.edu.cn%2F");
            var webContents=win.webContents;
            webContents.executeJavaScript(
                executeStr
            );
            var errorFlag=0;
            webContents.on('did-get-response-details',function(event,status,newURL,originURL,httpResponseCode,requestMethod,referrer,headers){
                if(httpResponseCode==200){
                    if(newURL=="http://portal.uestc.edu.cn/"){
                        global.isLogged=true;
                        win.loadURL("http://portal.uestc.edu.cn/index.portal?.pn=p346");
                    }
                    else{
                        if(newURL=="http://eams.uestc.edu.cn/eams/home.action"){
                            this.goCookie=true;
                        }
                        else if(newURL=="http://idas.uestc.edu.cn/authserver/login"){
                            console.log('http://idas.uestc.edu.cn/authserver/login:'+errorFlag);
                            if(errorFlag==1){
                                win.close();
                                resolve(reject);
                            }
                            else{
                                errorFlag=1;
                            }
                        }
                    }
                    if(this.goCookie==true&&global.cookies==null){
                        // console.log('Getting cookies');
                        webContents.session.cookies.get({},function(err,cookies){
                            global.cookies=cookies;
                            win.close();
                            resolve(true);
                        });
                    }
                    //get infomation
                }
            });
            // webContents.on('did-finish-load',function(event, arg){
            //     console.log(arg);
            //     console.log('did-finish-load');
            //     if(this.goCookie==true&&global.cookies==null){
            //         console.log('Getting cookies');
            //         webContents.session.cookies.get({},function(err,cookies){
            //             global.cookies=cookies;
            //             win.close();
            //             resolve(true);
            //         });
            //     }
            // });
        });
    };//login function end
};

module.exports=InfoServer;
