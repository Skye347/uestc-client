const electron=require('electron');
require("babel-core/register");
require("babel-polyfill");
const app=electron.app;
const BrowserWindow=electron.BrowserWindow;
const LoginCenter=require('./core/core-main.js');
const ipcMain = require('electron').ipcMain;

var mainWindow=null;

app.on('window-all-closed',function(){
    app.quit();
});

app.on('ready',function(){

    require('./main-p2.js');
    mainWindow=new BrowserWindow({
        width:1200,
        height:600,
        frame: false,
        //resizable:false
    });

    mainWindow.webContents.openDevTools();

    mainWindow.loadURL('file://'+__dirname+'/www/index.html');

    mainWindow.on('closed',function(){
        mainWindow=null;
    });

    ipcMain.on('Main-Quit',function(){
        mainWindow.webContents.closeDevTools();
        app.quit();
    });

    ipcMain.on('Main-Minimize',function(){
        mainWindow.minimize();
    });

    ipcMain.on('ToggleDevtools',function(){
        mainWindow.webContents.toggleDevTools();
    })
});
