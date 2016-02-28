var request = require('request').defaults({jar:true});
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var ParsePublicQuery=require('./ParseCollection.js').ParsePublicQuery;
var ParseClassTable=require('./ParseCollection.js').ParseClassTable;
var ParseExamList=require('./ParseCollection.js').ParseExamList;
var ParseSemList=require('./ParseCollection.js').ParseSemList;
var fs=require('fs');

function GetSemList(){
    return new Promise((resolve,reject)=>{
        if(global.SemList!=null){
            resolve([0,global.SemList]);
        }
        else{
            var j = request.jar();
            for (var index in global.cookies) {
                var cookie=global.cookies[index];
                j._jar.setCookieSync(request.cookie(cookie.name+"="+cookie.value),"http://"+cookie.domain);
            }
            var s0={
                url:'http://eams.uestc.edu.cn/eams/stdExamTable.action?_=141',
                headers:{
                    'Host':'eams.uestc.edu.cn',
                    'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.80 Safari/537.36',
                    'Accept-Encoding':'gzip, deflate, sdch',
                    'Accept-Language':'zh-CN,zh;q=0.8',
                    'Referer': 'http://eams.uestc.edu.cn/eams/home!childmenus.action?menu.id=844',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'text/plain, */*; q=0.01',
                    'Origin': 'http://eams.uestc.edu.cn',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                jar:j,
                gzip:true
            };
            request.get(
                s0,
                function(error,response,body){
                    // console.log(body);
                    try{
                        var $=cheerio.load(body);
                        var id=$('div')['0']['attribs']['id'].substr(7);
                        var s1={
                            url:'http://eams.uestc.edu.cn/eams/dataQuery.action',
                            headers:{
                                'Host':'eams.uestc.edu.cn',
                                'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.80 Safari/537.36',
                                'Accept-Encoding':'gzip, deflate, sdch',
                                'Accept-Language':'zh-CN,zh;q=0.8',
                                'Referer': 'http://eams.uestc.edu.cn/eams/home!childmenus.action?menu.id=844',
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Accept': 'text/plain, */*; q=0.01',
                                'Origin': 'http://eams.uestc.edu.cn',
                                'X-Requested-With': 'XMLHttpRequest'
                            },
                            jar:j,
                            // proxy:"http://127.0.0.1:8090",
                            form:{
                                tagId:"projectUI"+id+"Semester",
                                dataType:"semesterCalendar",
                                value:84,
                                empty:"false"
                            },
                            gzip:true
                        };
                        request.post(s1,function(err,response){
                            if(err){
                                console.log(err);
                                reject(err);
                            }
                            var ret=ParseSemList(response.body);
                            resolve(ret);
                        })
                    }catch(err){
                        resolve([1,null]);
                    }
                }
            );
        }
    });
};

function GetExamList(SemID){
    return new Promise((resolve,reject)=>{
        var j = request.jar();
        for (var index in global.cookies) {
            var cookie=global.cookies[index];
            j._jar.setCookieSync(request.cookie(cookie.name+"="+cookie.value),"http://"+cookie.domain);
        }
        var s0={
            url:'http://eams.uestc.edu.cn/eams/stdExamTable!examTable.action?semester.id='+SemID.toString()+'&examType.id=1&_=141',
            headers:{
                'Host':'eams.uestc.edu.cn',
                'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.80 Safari/537.36',
                'Accept-Encoding':'gzip, deflate, sdch',
                'Accept-Language':'zh-CN,zh;q=0.8',
                'Referer': 'http://eams.uestc.edu.cn/eams/home!childmenus.action?menu.id=844',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'text/plain, */*; q=0.01',
                'Origin': 'http://eams.uestc.edu.cn',
                'X-Requested-With': 'XMLHttpRequest'
            },
            jar:j,
            // proxy:"http://127.0.0.1:8090",
            gzip:true
        };
        request.get(
            s0,
            function(error,response,body){
                if(error){
                    reject(error);
                }
                else{
                    resolve(ParseExamList(body));
                }
            }
        );
    });
};

function GetClassTable(SemID,StartWek){
    return new Promise((resolve,reject)=>{
        var j = request.jar();
        for (var index in global.cookies) {
            var cookie=global.cookies[index];
            j._jar.setCookieSync(request.cookie(cookie.name+"="+cookie.value),"http://"+cookie.domain);
        }
        var s0={
            url:'http://eams.uestc.edu.cn/eams/courseTableForStd!courseTable.action',
            headers:{
                'Host':'eams.uestc.edu.cn',
                'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.80 Safari/537.36',
                'Accept-Encoding':'gzip, deflate, sdch',
                'Accept-Language':'zh-CN,zh;q=0.8',
                'Referer': 'http://eams.uestc.edu.cn/eams/home!childmenus.action?menu.id=844',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'text/plain, */*; q=0.01',
                'Origin': 'http://eams.uestc.edu.cn',
                'X-Requested-With': 'XMLHttpRequest'
            },
            jar:j,
            // proxy:"http://127.0.0.1:8090",
            form:{
                ignoreHead:1,
                'setting.kind':'std',
                startWeek:StartWek,
                'semester.id':SemID,
                ids:131977
            },
            gzip:true
        };
        request.post(
            s0,
            function(error,response){
                if(error){
                    console.log(error);
                    reject(error);
                }
                else{
                    resolve(ParseClassTable(response.body));
                }
            }
        );
    });
};

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
function PublicClassQuery(QueryParamsList){
    return new Promise((resolve,reject)=>{
        var j = request.jar();
        for (var index in global.cookies) {
            var cookie=global.cookies[index];
            if(cookie.name=='semester.id'){
                j._jar.setCookieSync(request.cookie(cookie.name+"="+QueryParamsList[1]),"http://"+cookie.domain);
                continue;
            }
            j._jar.setCookieSync(request.cookie(cookie.name+"="+cookie.value),"http://"+cookie.domain);
        }
        var QueryParams=QueryParamsList[0];
        var s0={
            url:'http://eams.uestc.edu.cn/eams/publicSearch!search.action',
            headers:{
                'Host':'eams.uestc.edu.cn',
                'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.80 Safari/537.36',
                'Accept-Encoding':'gzip, deflate, sdch',
                'Accept-Language':'zh-CN,zh;q=0.8',
                'Referer': 'http://eams.uestc.edu.cn/eams/home!childmenus.action?menu.id=844',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'text/plain, */*; q=0.01',
                'Origin': 'http://eams.uestc.edu.cn',
                'X-Requested-With': 'XMLHttpRequest'
            },
            jar:j,
            // proxy:"http://127.0.0.1:8090",
            form:{
                'lesson.project.id':QueryParams.lessonProjID,
                'lesson.no':QueryParams.lessonNo,
                'lesson.course.name':QueryParams.lessonName,
                'lesson.teachDepart.id':QueryParams.lessonTeachDepartID,
                'limitGroup.depart.id':QueryParams.limitGroupDepartID,
                'teacher.name':QueryParams.teacherName,
                'fake.teacher.null':QueryParams.fakeTeacherNull,
                'limitGroup.grade':QueryParams.limitGroupGrade,
                'fake.weeks':QueryParams.fakeWeeks,
                'startWeekSchedule':QueryParams.startWeekSchedule,
                'endWeekSchedule':QueryParams.endWeekSchedule,
                'fake.time.weekday':QueryParams.fakeTimeWeekday,
                'fake.time.unit':QueryParams.fakeTimeUnit,
                'lesson.campus.id':QueryParams.lessonCampusID,
                'lesson.courseType.id':QueryParams.lessonCourseTypeID,
                'examType.id':QueryParams.examTypeID,
                'lesson.semester.id':QueryParams.lessonSemesterID,
                'pageNo':QueryParams.pageNo
            },
            gzip:true
        };
        request.post(
            s0,
            function(error,response){
                if(error){
                   reject(error);
                }
                else{
                    var result=ParsePublicQuery(response.body);
                    result[1].QueryParams=QueryParams;
                    resolve(result);
                }
            }
        );
    });
};

module.exports.GetSemList=GetSemList;
module.exports.GetExamList=GetExamList;
module.exports.GetClassTable=GetClassTable;
module.exports.PublicClassQuery=PublicClassQuery;
