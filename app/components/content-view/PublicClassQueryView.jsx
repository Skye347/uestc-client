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

// PublicClassQuery({
//     lessonProjID:1,
//     lessonNo:'',
//     lessonName:'',
//     lessonTeachDepartID:'...',
//     limitGroupDepartID:'...',
//     teacherName:'',
//     fakeTeacherNull:'...',
//     limitGroupGrade:'',
//     fakeWeeks:'',
//     startWeekSchedule:'',
//     endWeekSchedule:'',
//     fakeTimeWeekday:'...',
//     fakeTimeUnit:'',
//     lessonCampusID:'...',
//     lessonCourseTypeID:'...',
//     examTypeID:'...',
//     lessonSemesterID:'undefined',
//     pageNo:1
// });
class PublicClassQueryView extends React.Component{
    constructor(){
        super();
        this.SemList=null;
        this.tableRawdata=null;
        this.state={currentSemID:0};
        this.handleSemChange=this.handleSemChange.bind(this);
        this.parseTableData=this.parseTableData.bind(this);
    }
    handleCellHover(index,dataI){
        console.log(this.tableRawdata.QueryList[toString(index)]);
    }
    async getData(){
        if(this.SemList==null){
            var result=await this.props.route.info.getInfo('SemList');
            if(result[0]==0){
                this.SemList=result[1];
                var id=this.SemList[0][0];
            }
            else if(result[0]==1){
                this.props.route.info.reloginflag=true;
                this._reactInternalInstance._context.history.push('/login');
                return;
            }
        }
        var tmp=await this.props.route.info.getInfo('PublicQuery',[{
            lessonProjID:1,
            lessonNo:'',
            lessonName:'',
            lessonTeachDepartID:'...',
            limitGroupDepartID:'...',
            teacherName:'',
            fakeTeacherNull:'...',
            limitGroupGrade:'',
            fakeWeeks:'',
            startWeekSchedule:'',
            endWeekSchedule:'',
            fakeTimeWeekday:'...',
            fakeTimeUnit:'',
            lessonCampusID:'...',
            lessonCourseTypeID:'...',
            examTypeID:'...',
            lessonSemesterID:'undefined',
            pageNo:1
        },84]);
        if(tmp[0]==1){
            this.props.route.info.reloginflag=true;
            this._reactInternalInstance._context.history.push('/login');
            return;
        }
        this.tableRawdata=tmp[1];
        this.forceUpdate();
    };
    parseTableData(raw,index){
        var date=null;
        for(var i=0;i<raw[8].NumPerWeek;i++){
            var tmpDay='D'+raw[8].data[i].day;
            tmpDay+=' '+raw[8].data[i].time[0]+'-'+raw[8].data[i].time[1];
            tmpDay+=' ['+raw[8].data[i].week[0]+'-'+raw[8].data[i].week[1]+']';
            date=tmpDay;
        }
        return(
            <TableRow>
                <TableRowColumn onCellClick={this.handleCellHover.bind(this,index,1)}>{raw[1]}</TableRowColumn>
                <TableRowColumn onCellClick={this.handleCellHover.bind(this,index,2)}>{raw[2]}</TableRowColumn>
                <TableRowColumn onCellClick={this.handleCellHover.bind(this,index,3)}>{raw[3]}</TableRowColumn>
                <TableRowColumn onCellClick={this.handleCellHover.bind(this,index,4)}>{raw[4]}</TableRowColumn>
                <TableRowColumn onCellClick={this.handleCellHover.bind(this,index,5)}>{raw[5]}</TableRowColumn>
                <TableRowColumn onCellClick={this.handleCellHover.bind(this,index,6)}>{raw[6]}</TableRowColumn>
                <TableRowColumn onCellClick={this.handleCellHover.bind(this,index,7)}>{raw[7]}</TableRowColumn>
                <TableRowColumn onCellClick={this.handleCellHover.bind(this,index,8)}>{date}</TableRowColumn>
                <TableRowColumn onCellClick={this.handleCellHover.bind(this,index,9)}>{raw[9]}</TableRowColumn>
                <TableRowColumn onCellClick={this.handleCellHover.bind(this,index,10)}>{raw[10]}</TableRowColumn>
                <TableRowColumn onCellClick={this.handleCellHover.bind(this,index,11)}>{raw[11]}</TableRowColumn>
            </TableRow>
        );
    };
    componentDidMount(){
        this.getData();
    };
    handleSemChange(event, index, value){
        this.setState({currentSemID:value});
    };
    render(){
        var tmp;
        var label;
        var tabletmp;
        if(this.SemList==null){
            tmp=null;
            label="Select";
        }
        else{
            var tmp=this.SemList.map(function(item,index){
                var name=item[1]+"第"+item[2]+"学期";
                var val=item[0];
                return <MenuItem key={val} primaryText={name} value={val}/>;
            })
            if(this.state.currentSemID!=0){
                for(var i=0;i<this.SemList.length;i++){
                    if(this.state.currentSemID==this.SemList[i][0]){
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
        if(this.tableRawdata==null){
            tabletmp=null;
        }
        else{
            tabletmp=new Array();
            for(var i=0;i<this.tableRawdata.QueryList['length'];i++){
                tabletmp.push(this.parseTableData(this.tableRawdata.QueryList[i],i));
            }
        }
        return(
            <div style={{overflow:'auto',height:'100%'}}>
                <Toolbar>
                    <ToolbarGroup firstChild={true} float="left">
                        <ToolbarTitle id="tb-cinfo" style={{marginLeft:10}} text="Class infomation" />
                    </ToolbarGroup>
                    <ToolbarGroup float="right">
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
                <Table wrapperStyle={{overflow:'visible'}}>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>lesseonID</TableHeaderColumn>
                            <TableHeaderColumn>className</TableHeaderColumn>
                            <TableHeaderColumn>lessonCourseTypeID</TableHeaderColumn>
                            <TableHeaderColumn>lessonCampusID</TableHeaderColumn>
                            <TableHeaderColumn>teacherName</TableHeaderColumn>
                            <TableHeaderColumn>teachDepart</TableHeaderColumn>
                            <TableHeaderColumn>grade</TableHeaderColumn>
                            <TableHeaderColumn>time</TableHeaderColumn>
                            <TableHeaderColumn>location</TableHeaderColumn>
                            <TableHeaderColumn>examtime</TableHeaderColumn>
                            <TableHeaderColumn>school</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tabletmp}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

module.exports=PublicClassQueryView;
