var React=require('react');
var Paper=require('material-ui/lib/paper');
var TextField=require('material-ui/lib/text-field');
var Checkbox=require('material-ui/lib/checkbox');
var Divider=require('material-ui/lib/divider');
var RaisedButton=require('material-ui/lib/raised-button');
var Toggle=require('material-ui/lib/toggle');

class SettingsView extends React.Component{
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
                    <div style={{position:'relative',left:'34%',top:'20%',width:'50%'}}>
                        <Toggle id='devtools' style={{marginTop:7,marginLeft:-2,width:'80%'}} onToggle={this.props.route.set.toggleDevtools} label="Toggle Devtools"/>
                    </div>
                </Paper>
            </div>
        )
    }
}

module.exports=SettingsView;
