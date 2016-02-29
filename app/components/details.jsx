var React=require('react');
var SelectField=require('material-ui/lib/select-field');
var MenuItem=require('material-ui/lib/menus/menu-item');
var ArrowForwardIcon=require('material-ui/lib/svg-icons/navigation/arrow-forward');
var IconButton=require('material-ui/lib/icon-button');

class Details extends React.Component{
    constructor(){
        super();
        this.state={
            ready:false,
            error:false,
            examTypeID:'...'
        }
        this.data=null;
        this.setData=this.setData.bind(this);
        this.handleExamTypeChange=this.handleExamTypeChange.bind(this);
        this.handleReset=this.handleReset.bind(this);
    };
    async setData(){
        var data=await this.props.info.getInfo('PublicQuery',[{
                lessonProjID:1,
                lessonNo:this.props.classid,
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
                examTypeID:this.state.examTypeID,
                lessonSemesterID:'undefined',
                pageNo:1
            },this.props.semester]
        );
        if(data[0]==1){
            this.setState({error:true});
        }
        else{
            this.data=data[1].QueryList;
            this.setState({ready:true});
        }
    };
    handleExamTypeChange(event,index,value){
        this.setState({ready:false,examTypeID:value});
    };
    handleReset(){
        this.setState({
            ready:false,
            error:false,
            examTypeID:'...'
        });
    };
    render(){
        if(this.state.error){
            return(
                <div>No Query Result
                    <IconButton id="reset" onClick={this.handleReset}>
                        <ArrowForwardIcon hidden={true} />
                    </IconButton>
                </div>
            );
        }
        else if(this.state.ready){
            console.log(this.data);
            return(
                <div>
                    <SelectField value={this.state.examTypeID} onChange={this.handleExamTypeChange}>
                        <MenuItem value={1} primaryText="期末考试"/>
                        <MenuItem value={2} primaryText="期中考试"/>
                        <MenuItem value={3} primaryText="补考"/>
                        <MenuItem value={4} primaryText="缓考"/>
                    </SelectField>
                </div>
            )
        }
        else{
            this.setData();
            return(
                <div>
                    {this.props.classid}
                </div>
            );
        }
    }
}

module.exports=Details;
