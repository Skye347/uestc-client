var React=require('react');
var Table=require('material-ui/lib/table/table');
var TableHeaderColumn=require('material-ui/lib/table/table-header-column');
var TableRow=require('material-ui/lib/table/table-row');
var TableHeader=require('material-ui/lib/table/table-header');
var TableRowColumn=require('material-ui/lib/table/table-row-column');
var TableBody=require('material-ui/lib/table/table-body');
var TableFooter=require('material-ui/lib/table/table-footer');
var SelectField=require('material-ui/lib/select-field');
var MenuItem=require('material-ui/lib/menus/menu-item');
var ReactDOM=require('react-dom');
var Toolbar=require('material-ui/lib/toolbar/toolbar');
var ToolbarGroup=require('material-ui/lib/toolbar/toolbar-group');
var ToolbarSeparator=require('material-ui/lib/toolbar/toolbar-separator');
var ToolbarTitle=require('material-ui/lib/toolbar/toolbar-title');
var DropDownMenu=require('material-ui/lib/DropDownMenu');
var FontIcon=require('material-ui/lib/font-icon');
var IconMenu=require('material-ui/lib/menus/icon-menu');
var IconButton=require('material-ui/lib/icon-button');
var NavigationExpandMoreIcon=require('material-ui/lib/svg-icons/navigation/expand-more');
var RaisedButton=require('material-ui/lib/raised-button');
var ClearIcon=require('material-ui/lib/svg-icons/content/clear');
var Slider=require('material-ui/lib/slider');
var GoogleCalSyncView=require('../../../experiments/google-cal-sync/google-cal-sync.js').GoogleCalSyncView;
var Dialog=require('material-ui/lib/dialog');
var ArrowForwardIcon=require('material-ui/lib/svg-icons/navigation/arrow-forward');
var DetailsView=require('../../../app/components/details.jsx');

class ClassTableView extends React.Component{
    constructor(){
        super();
        this.data=null;
        this.SemList=null;
        this.handleSemChange=this.handleSemChange.bind(this);
        this.handleCancel=this.handleCancel.bind(this);
        this.handleWeekChange=this.handleWeekChange.bind(this);
        this.setData=this.setData.bind(this);
        this.handleDialogOpen=this.handleDialogOpen.bind(this);
        this.handleDialogClose=this.handleDialogClose.bind(this);
        this.handleDetailsClose=this.handleDetailsClose.bind(this);
        this.toolbarfix=-1;
        this.currentSemID=0;
        this.currentWek=1;
        this.state={
            DialogOpen:false,
            prepareing:false,
            details:false
        };
        this.tmpStr=null;
        this.tmpData=null;
        this.handleDetails=this.handleDetails.bind(this);
    };
    handleDetails(){
        this.setState({details:true})
    };
    handleDialogClose(){
        this.setState({DialogOpen:false});
    };
    handleCellHover(index){
        if(this.toolbarfix==-1){
            document.getElementById('tb-cinfo').innerText=this.data[index][3]+","+this.data[index][5]+","+this.data[index][1]+","+this.data[index][7];
        }
    };
    handleCellHoverExit(index){
        if(this.toolbarfix==-1){
            document.getElementById('tb-cinfo').innerText="Class infomation";
        }
    };
    handleWeekChange(event,value){
        this.currentWek=value;
        this.setData(this.currentSemID);
    };
    handleCellClick(index){
        this.toolbarfix=index;
    };
    handleSemChange(event, index, value){
        this.currentSemID=value;
        this.setData(value);
    };
    componentDidMount(){
        this.setData();
    };
    async handleDialogOpen(){
        if(this.SemList==null) return;
        this.tmpData=[];
        this.setState({DialogOpen:false,prepareing:true})
        for(var wek=1;wek<=20;wek++){
            // console.log(wek);
            var dataTmp=await this.props.route.info.getInfo('ClassTable',[this.currentSemID,wek]);
            if(dataTmp[0]==1) return;
            this.tmpData.push([dataTmp[1],wek]);
        }
        this.setState({DialogOpen:true,prepareing:false});
    }
    async setData(id){
        this.toolbarfix=-1;
        if(this.SemList==null){
            var result=await this.props.route.info.getInfo('SemList');
            if(result[0]==0){
                this.SemList=result[1];
                id=this.SemList[0][0];
                this.currentSemID=id;
            }
            else if(result[0]==1){
                this.props.route.info.reloginflag=true;
                this._reactInternalInstance._context.history.push('/login');
                return;
            }
        }
        else{
            this.currentSemID=id;
        }
        var dataTmp=await this.props.route.info.getInfo('ClassTable',[this.currentSemID,this.currentWek]);
        if(dataTmp[0]==1){
            this.props.route.info.reloginflag=true;
            this._reactInternalInstance._context.history.push('/login');
            return;
        }
        this.data=dataTmp[1];
        for(var i=1;i<=12;i++){
            for(var j=1;j<=7;j++){
                var tmp=document.getElementById('t'+i+'-'+j);
                tmp.textContent="";
                tmp.style.backgroundColor='';
                tmp.onclick=null;
                tmp.onmouseover=null;
                tmp.onmouseout=null;
            }
        }
        for(var i in this.data){
            var className=this.data[i][3];
            var classLocation=this.data[i][5];
            var time=this.data[i][8];
            for(var j in time){
                var day=time[j][0];
                var sec=time[j][1];
                var tmp=document.getElementById('t'+(sec+1)+'-'+(day+1));
                if(j==0){
                    tmp.textContent=className;
                }
                else if(j==1){
                    tmp.textContent=classLocation;
                }
                tmp.style.backgroundColor='#F0FFFF';
                tmp.onclick=this.handleCellClick.bind(this,i);
                tmp.onmouseover=this.handleCellHover.bind(this,i);
                tmp.onmouseout=this.handleCellHoverExit.bind(this,i);
            }
        };

        this.forceUpdate();
    };
    handleDetailsClose(){
        this.setState({details:false});
    }
    handleCancel(){
        this.toolbarfix=-1;
        document.getElementById('tb-cinfo').innerText="Class infomation";
    }
    render(){
        if(this.SemList==null){
            var tmp=null;
            var label="Select";
        }
        else{
            var tmp=this.SemList.map(function(item,index){
                var name=item[1]+"第"+item[2]+"学期";
                var val=item[0];
                return <MenuItem key={val} primaryText={name} value={val}/>;
            })
            var label;
            if(this.currentSemID!=0){
                for(var i=0;i<this.SemList.length;i++){
                    if(this.currentSemID==this.SemList[i][0]){
                        label=i;
                        break;
                    }
                }
                label=this.SemList[label][1]+"第"+this.SemList[label][2]+"学期";
            }
            else{
                label="Select";
            }
        }
        if(this.toolbarfix!=-1){
            var classid=this.data[this.toolbarfix][7];
        }
        else{
            var classid=null;
        }
        return(
            <div id='tc' style={{overflow:'auto',height:'100%'}}>
                <Toolbar>
                    <ToolbarGroup firstChild={true} float="left">
                        <ToolbarTitle id="tb-cinfo" style={{marginLeft:10}} text="Class infomation" />
                    </ToolbarGroup>
                    <ToolbarGroup float="right">
                        <IconButton id="go-details" style={{position:'absolute',marginLeft:-90,marginTop:4}} onClick={this.handleDetails}>
                            <ArrowForwardIcon hidden={true} />
                        </IconButton>
                        <IconButton id="cancel-b" style={{position:'absolute',marginLeft:-50,marginTop:4}} onClick={this.handleCancel}>
                            <ClearIcon hidden={true} />
                        </IconButton>
                        <ToolbarSeparator />
                            <SelectField style={{marginLeft:10,marginTop:-20}} id="SemListSelect" floatingLabelText={label} onChange={this.handleSemChange}>
                                {
                                    tmp
                                }
                            </SelectField>
                    </ToolbarGroup>
                </Toolbar>
                <Slider id='week-slider' style={{marginBottom:'0px'}} max={20} min={1} step={1} value={1} onChange={this.handleWeekChange}/>
                <Table wrapperStyle={{overflow:'visible'}} selectable={false}>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>Week</TableHeaderColumn>
                                <TableHeaderColumn>1</TableHeaderColumn>
                                <TableHeaderColumn>2</TableHeaderColumn>
                                <TableHeaderColumn>3</TableHeaderColumn>
                                <TableHeaderColumn>4</TableHeaderColumn>
                                <TableHeaderColumn>5</TableHeaderColumn>
                                <TableHeaderColumn>6</TableHeaderColumn>
                                <TableHeaderColumn>7</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow >
                            <TableRowColumn>8:30 - 9:15</TableRowColumn>
                                <TableRowColumn id='t1-1'></TableRowColumn>
                                <TableRowColumn id='t1-2'></TableRowColumn>
                                <TableRowColumn id='t1-3'></TableRowColumn>
                                <TableRowColumn id='t1-4'></TableRowColumn>
                                <TableRowColumn id='t1-5'></TableRowColumn>
                                <TableRowColumn id='t1-6'></TableRowColumn>
                                <TableRowColumn id='t1-7'></TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>9:20 - 10:05</TableRowColumn>
                                <TableRowColumn id='t2-1'></TableRowColumn>
                                <TableRowColumn id='t2-2'></TableRowColumn>
                                <TableRowColumn id='t2-3'></TableRowColumn>
                                <TableRowColumn id='t2-4'></TableRowColumn>
                                <TableRowColumn id='t2-5'></TableRowColumn>
                                <TableRowColumn id='t2-6'></TableRowColumn>
                                <TableRowColumn id='t2-7'></TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>10:20 - 11:05</TableRowColumn>
                                <TableRowColumn id='t3-1'></TableRowColumn>
                                <TableRowColumn id='t3-2'></TableRowColumn>
                                <TableRowColumn id='t3-3'></TableRowColumn>
                                <TableRowColumn id='t3-4'></TableRowColumn>
                                <TableRowColumn id='t3-5'></TableRowColumn>
                                <TableRowColumn id='t3-6'></TableRowColumn>
                                <TableRowColumn id='t3-7'></TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>4</TableRowColumn>
                                <TableRowColumn id='t4-1'></TableRowColumn>
                                <TableRowColumn id='t4-2'></TableRowColumn>
                                <TableRowColumn id='t4-3'></TableRowColumn>
                                <TableRowColumn id='t4-4'></TableRowColumn>
                                <TableRowColumn id='t4-5'></TableRowColumn>
                                <TableRowColumn id='t4-6'></TableRowColumn>
                                <TableRowColumn id='t4-7'></TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>5</TableRowColumn>
                                <TableRowColumn id='t5-1'></TableRowColumn>
                                <TableRowColumn id='t5-2'></TableRowColumn>
                                <TableRowColumn id='t5-3'></TableRowColumn>
                                <TableRowColumn id='t5-4'></TableRowColumn>
                                <TableRowColumn id='t5-5'></TableRowColumn>
                                <TableRowColumn id='t5-6'></TableRowColumn>
                                <TableRowColumn id='t5-7'></TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>6</TableRowColumn>
                                <TableRowColumn id='t6-1'></TableRowColumn>
                                <TableRowColumn id='t6-2'></TableRowColumn>
                                <TableRowColumn id='t6-3'></TableRowColumn>
                                <TableRowColumn id='t6-4'></TableRowColumn>
                                <TableRowColumn id='t6-5'></TableRowColumn>
                                <TableRowColumn id='t6-6'></TableRowColumn>
                                <TableRowColumn id='t6-7'></TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>7</TableRowColumn>
                                <TableRowColumn id='t7-1'></TableRowColumn>
                                <TableRowColumn id='t7-2'></TableRowColumn>
                                <TableRowColumn id='t7-3'></TableRowColumn>
                                <TableRowColumn id='t7-4'></TableRowColumn>
                                <TableRowColumn id='t7-5'></TableRowColumn>
                                <TableRowColumn id='t7-6'></TableRowColumn>
                                <TableRowColumn id='t7-7'></TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>8</TableRowColumn>
                                <TableRowColumn id='t8-1'></TableRowColumn>
                                <TableRowColumn id='t8-2'></TableRowColumn>
                                <TableRowColumn id='t8-3'></TableRowColumn>
                                <TableRowColumn id='t8-4'></TableRowColumn>
                                <TableRowColumn id='t8-5'></TableRowColumn>
                                <TableRowColumn id='t8-6'></TableRowColumn>
                                <TableRowColumn id='t8-7'></TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>9</TableRowColumn>
                                <TableRowColumn id='t9-1'></TableRowColumn>
                                <TableRowColumn id='t9-2'></TableRowColumn>
                                <TableRowColumn id='t9-3'></TableRowColumn>
                                <TableRowColumn id='t9-4'></TableRowColumn>
                                <TableRowColumn id='t9-5'></TableRowColumn>
                                <TableRowColumn id='t9-6'></TableRowColumn>
                                <TableRowColumn id='t9-7'></TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>10</TableRowColumn>
                                <TableRowColumn id='t10-1'></TableRowColumn>
                                <TableRowColumn id='t10-2'></TableRowColumn>
                                <TableRowColumn id='t10-3'></TableRowColumn>
                                <TableRowColumn id='t10-4'></TableRowColumn>
                                <TableRowColumn id='t10-5'></TableRowColumn>
                                <TableRowColumn id='t10-6'></TableRowColumn>
                                <TableRowColumn id='t10-7'></TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>11</TableRowColumn>
                                <TableRowColumn id='t11-1'></TableRowColumn>
                                <TableRowColumn id='t11-2'></TableRowColumn>
                                <TableRowColumn id='t11-3'></TableRowColumn>
                                <TableRowColumn id='t11-4'></TableRowColumn>
                                <TableRowColumn id='t11-5'></TableRowColumn>
                                <TableRowColumn id='t11-6'></TableRowColumn>
                                <TableRowColumn id='t11-7'></TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>12</TableRowColumn>
                                <TableRowColumn id='t12-1'></TableRowColumn>
                                <TableRowColumn id='t12-2'></TableRowColumn>
                                <TableRowColumn id='t12-3'></TableRowColumn>
                                <TableRowColumn id='t12-4'></TableRowColumn>
                                <TableRowColumn id='t12-5'></TableRowColumn>
                                <TableRowColumn id='t12-6'></TableRowColumn>
                                <TableRowColumn id='t12-7'></TableRowColumn>
                        </TableRow>
                    </TableBody>
                    <TableFooter>
                        <div>
                            <RaisedButton label="Default" onClick={this.handleDialogOpen} />
                            {this.state.prepareing?'Preparing':''}
                            <Dialog actions={[<RaisedButton label="Close" onClick={this.handleDialogClose}/>]} open={this.state.DialogOpen} onRequestClose={this.handleDialogClose}>
                                <GoogleCalSyncView data={this.tmpData}></GoogleCalSyncView>
                            </Dialog>
                            <Dialog open={this.state.details} onRequestClose={this.handleDetailsClose}>
                                <DetailsView info={this.props.route.info} classid={classid} semester={this.currentSemID}></DetailsView>
                            </Dialog>
                        </div>
                    </TableFooter>
                </Table>
            </div>
        );
    }
}

module.exports=ClassTableView;
