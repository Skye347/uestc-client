'use strict';
var Router=require('react-router').Router;
var Navigation=require('react-router').Navigation;
var Route=require('react-router').Route;
var Link=require('react-router').Link;
var React=require('react');
var Paper=require('material-ui/lib/paper');
var TextField=require('material-ui/lib/text-field');
var Checkbox=require('material-ui/lib/checkbox');
var Divider=require('material-ui/lib/divider');
var RaisedButton=require('material-ui/lib/raised-button');
var CircularProgess=require('material-ui/lib/circular-progress');

class ProfileView extends React.Component{
    constructor(){
        super();
    };
    render(){
        return(
            <div>

            </div>
        );
    }
}

//use props:this.props.route.***
class LoginView extends React.Component{
    constructor(){
        super();
        this.handleSubmit=this.handleSubmit.bind(this);
        this.state={
            log:0
        };
        this.handleLogout=this.handleLogout.bind(this);
    };
    async handleSubmit(e){
        this.setState({log:1});
        var username=document.getElementById('un').value;
        var password=document.getElementById('pd').value;
        var remeberme=document.getElementById('rm').checked;
        var ret=await this.props.route.info.login(username,password,remeberme);
        if(ret[0]==true){
            this._reactInternalInstance._context.history.push('/logged');
        }
    };
    componentDidMount(){
        if(this.props.route.info.reloginflag==true){
            this.props.route.info.relogin();
        }
    }
    componentWillMount(){
        if(this.props.route.info.logged==true){
            this.setState({log:2});
        }
        else{

        }
    };
    handleLogout(){
        this.props.route.info.logout();
        this.setState({log:0});
    };
    render(){
        var paperStyle={
            position:'absolute',
            width:'100%',
            height:'100%',
        }
        if(this.state.log==0){
            return(
                <div>
                    <Paper style={paperStyle}>
                        <div style={{position:'relative',left:'34%',top:'20%',width:'50%'}}>
                            <TextField id="un" hintText="Username" /><br></br>
                            <TextField id="pd" hintText="Password" /><br></br>
                            <Checkbox id='rm' style={{marginTop:7,marginLeft:-2}} label="Remember me"/>
                            <RaisedButton style={{marginTop:8}} onClick={this.handleSubmit} label="Login"/>
                            <Divider style={{backgroundColor:'#6262FF',transform:'rotate(90deg)',marginTop:-85,width:200,marginLeft:-120}}></Divider>
                        </div>
                    </Paper>
                </div>
            );
        }
        else if(this.state.log==1){
            return(
                <div>
                    <Paper style={paperStyle}>
                        <div style={{position:'relative',left:'34%',top:'20%',width:'50%'}}>
                            <CircularProgess size={2}/>
                        </div>
                    </Paper>
                </div>
            );
        }
        else{
            return(
                <div>
                    <Paper style={paperStyle}>
                        <div style={{position:'relative',left:'34%',top:'20%',width:'50%'}}>
                            You have logged.
                            <RaisedButton style={{marginTop:8}} onClick={this.handleLogout} label="Logout"/>
                        </div>
                    </Paper>
                </div>
            );
        }
    }
}

class PlainPaper extends React.Component{
    constructor(){
        super();
    };
    render(){
        var paperStyle={
            position:'absolute',
            width:'100%',
            height:'100%',
        }
        return(
            <div>
                <Paper style={paperStyle}>
                    {this.props.children}
                </Paper>
            </div>
        );
    }
}

module.exports.LoginView=LoginView;
module.exports.ProfileView=ProfileView;
module.exports.PlainPaper=PlainPaper;
//            // <Divider style={{backgroundColor:'#6262FF',transform:'rotate(90deg)',marginTop:-50,width:200,marginLeft:170}}></Divider>
