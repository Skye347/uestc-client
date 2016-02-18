var React=require('react');
var AppBar=require('material-ui/lib/app-bar');
var IconButton=require('material-ui/lib/icon-button');
var NavigationClose=require('material-ui/lib/svg-icons/navigation/close');
var NavigationMenu=require('material-ui/lib/svg-icons/navigation/menu');
var List =require('material-ui/lib/lists/list');
var ListItem =require('material-ui/lib/lists/list-item');
var Divider =require('material-ui/lib/divider');
var Colors=require('material-ui/lib/styles/colors');
var Mini=require('material-ui/lib/svg-icons/content/remove');
var Fullexit=require('material-ui/lib/svg-icons/navigation/fullscreen-exit');
var Full=require('material-ui/lib/svg-icons/navigation/fullscreen');
var LeftNav=require('material-ui/lib/left-nav');
var MenuItem=require('material-ui/lib/menus/menu-item');
const ipcRenderer = require('electron').ipcRenderer;

class MainTabBar extends React.Component{
    constructor(){
        super();
    };
    handleMini(){
        ipcRenderer.send('Main-Minimize',null);
    };
    handleClose(){
        ipcRenderer.send('Main-Quit',null);
    };
    render(){
        var buttonStyle={
            margin:7,
            marginRight:-10,
            backgroundColor: 'transparent',
            WebkitAppRegion:'no-drag'
        }
        var title=this.props.params.path;
        if(title==null){
            title='Hi';
        }
        return(
            <div>
                <AppBar
                    title={title}
                    showMenuIconButton={false}
                >
                    <IconButton style={buttonStyle} onClick={this.handleMini}>
                        <Mini color={Colors.white}/>
                    </IconButton>
                    <IconButton style={buttonStyle} onClick={this.handleClose}>
                        <NavigationClose color={Colors.white}/>
                    </IconButton>
                </AppBar>
            </div>
        )
    }
}

class MainSideMenu extends React.Component{
    constructor(){
        super();
        this.state={
            height:document.body.clientHeight,
            logged:0
        };
        this.handleResize=this.handleResize.bind(this);
        this.componentDidMount=this.componentDidMount.bind(this);
    };
    handleResize(){
        this.setState({height:document.body.clientHeight});
    }
    componentDidMount(){
        if(this.props.route.info.logged==true&&this.state.logged==0){
            this.setState({logged:this.state.logged+1});
        }
        window.addEventListener('resize', this.handleResize);
    };
    componentWillUnmount(){
        window.removeEventListener('resize', this.handleResize);
    };
    componentWillUpdate(){
        if(this.props.route.info.logged==true&&this.state.logged==0){
            this.setState({logged:this.state.logged+1});
        }
    };
    render(){
        const divStyle={
            float: 'left',
            marginRight: 24,
            width: 220,
            position:'relative',
            height:'100%',
            overflow:'auto'
        }
        var secondListHeight=this.state.height-176+'px';
        if(this.state.logged==0){
            return(
                <div style={divStyle}>
                    <List>
                        <ListItem href="#/login" primaryText="Log"/>
                        <ListItem href="#/settings" primaryText="Settings"/>
                    </List>
                    <Divider/>
                    <div id='listadjust' style={{position:'absolute',top:112,width:220,bottom:0}}>
                        <List style={{position:'relative',height:'100%'}}>
                        </List>
                    </div>
                </div>
            );
        }
        else{
            return(
                <div style={divStyle}>
                    <List>
                        <ListItem href="#/login" primaryText="Log"/>
                        <ListItem href="#/settings" primaryText="Settings"/>
                    </List>
                    <Divider/>
                    <div id='listadjust' style={{position:'absolute',top:112,width:220,bottom:0}}>
                        <List style={{position:'relative',height:'100%'}}>
                            <ListItem href="#/profile" primaryText="Profile"/>
                            <ListItem primaryText="Actions" nestedItems={[
                                    <ListItem key={1} href="#/actions/classtable" primaryText="GetClassTable"/>,
                                    <ListItem key={2} primaryText="GetExamList"/>,
                                    <ListItem key={3} href="#/actions/publicquery" primaryText="PublicClassQuery"/>
                                ]}
                            />
                    </List>
                    </div>
                </div>
            );
        }
    }
}

module.exports.MainTabBar=MainTabBar;
module.exports.MainSideMenu=MainSideMenu;
