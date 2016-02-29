var Router=require('react-router').Router;
var Route=require('react-router').Route;
var Link=require('react-router').Link;
var Redirect=require('react-router').Redirect;
var React=require('react');
var ReactDOM=require('react-dom');
var injectTapEventPlugin=require('react-tap-event-plugin');
require("babel-core/register");
require("babel-polyfill");
var MainTabBar=require('../app/components/main.jsx').MainTabBar;
var IconButton=require('material-ui/lib/icon-button');
var NavigationClose=require('material-ui/lib/svg-icons/navigation/close');
var MainSideMenu=require('../app/components/main.jsx').MainSideMenu;
var LoginView=require('../app/components/contents.jsx').LoginView;
var InfoClient=require('../core/core-forview.js').InfoClient;
var SettingsCenter=require('../core/core-forview.js').SettingsCenter;
var SettingsView=require('../app/components/settings.jsx');
var ProfileView=require('../app/components/contents.jsx').ProfileView;
var PlainPaper=require('../app/components/contents.jsx').PlainPaper;
var ClassTableView=require('../app/components/content-view/ClassTableView.jsx');
var PublicClassQueryView=require('../app/components/content-view/PublicClassQueryView.jsx')
// var Router = require('react-router').Router
// var Route = require('react-router').Route
// var Link = require('react-router').Link
injectTapEventPlugin();

var InfoClientInsts=new InfoClient();
var SettingsInsts=new SettingsCenter();

var MainTabBarDOM=ReactDOM.render(
    <Router>
        <Route path="/(:path)*" info={InfoClientInsts} set={SettingsInsts} component={MainTabBar}>
        </Route>
    </Router>,
    document.getElementById('app')
);

var MainSideMenuDOM=ReactDOM.render(
    <Router>
        <Route path="/(:path)*" logged={false} info={InfoClientInsts} set={SettingsInsts} component={MainSideMenu}>
        </Route>
    </Router>,
    document.getElementById('menu')
);

ReactDOM.render(
    <Router>
        <Route path="/login" info={InfoClientInsts} set={SettingsInsts} component={LoginView}>
        </Route>
        <Route path="/settings" set={SettingsInsts} component={SettingsView}>
        </Route>
        <Route path="/profile" info={InfoClientInsts} set={SettingsInsts} component={ProfileView}>
        </Route>
        <Route path="/actions" component={PlainPaper}>
            <Route path="classtable" info={InfoClientInsts} set={SettingsInsts} component={ClassTableView}>
                <Route path=":params" info={InfoClientInsts} set={SettingsInsts} component={ClassTableView}/>
            </Route>
            <Route path="publicquery" info={InfoClientInsts} set={SettingsInsts} component={PublicClassQueryView}>
                <Route path=":params" info={InfoClientInsts} set={SettingsInsts} component={PublicClassQueryView}/>
            </Route>
        </Route>
        <Redirect from="/logged" to="/profile" />
    </Router>,
    document.getElementById('contents')
);
