var cheerio=require('cheerio');

function ParseSemList(body){
    try{
        var matchS1=body.match(/\{.*?\}/g);
        var ret=[];
        for(var x in matchS1){
            var id=matchS1[x].match(/id:\d{1,3}/g)[0].replace('id:','');
            var years=matchS1[x].match(/\d{4}-\d{4}/g)[0];
            var name=matchS1[x].match(/"\d"/g)[0].replace(/"/g,'');
            ret.push([id,years,name]);
        }
        var retData=[];
        retData[0]=0;
        retData[1]=ret;
        return retData;
    }catch(err){
        var retData=[];
        retData[0]=1;
        retData[1]=null;
        return retData;
    }
}

function ParseExamList(body){
    var $=cheerio.load(body,{decodeEntities: false});
    var ret=[];
    $('table').children().each(function(index,item){
        var array=[];
        if(item.name=='tr'){
            $(this).children().map(function(i,t){
                array.push($(this).text());
            });
        }
        array.pop();
        ret.push(array);
    })
    return ret;
}

//-----------
//ret[x][0] teacher id
//ret[x][1] teacher name
//ret[x][2] unknown
//ret[x][3] class name
//ret[x][4] unknown
//ret[x][5] location
//ret[x][6] unknown
//ret[x][7] class code
//ret[x][8] Array.time
//ret[x][9][y] day,time(start with 0)
//-----------
function ParseClassTable(body){
    try{
        var $=cheerio.load(body,{decodeEntities: false});
        var script=$('script').text();
        if(script==""){
            throw "relogin";
        }
        var ret=new Array();
        var matchResultS1=script.match(/TaskActivity\(.+\)([\s\S]*?)new/g);
        for (var x in matchResultS1){//table data
            var matchResultTmp=matchResultS1[x].match(/".*?"/g);
            for (var y in matchResultTmp){
                matchResultTmp[y]=matchResultTmp[y].replace(/"/g,'').replace(/'/g,"");
            }
            matchResultTmp[2]=matchResultTmp[2].replace(/\(\S+\)/g,'');
            matchResultTmp.push(matchResultTmp[3].match(/\(\S+\)/g)[0].replace('(','').replace(')',""));
            matchResultTmp[3]=matchResultTmp[3].replace(/\(\S+\)/g,'');
            var matchTimeTmp=matchResultS1[x].match(/\d\*unitCount\+\d{1,2}/g);//time
            for (var j in matchTimeTmp){
                var timeTmp=matchTimeTmp[j].match(/\d{1,2}/g);
                timeTmp[0]=parseInt(timeTmp[0]);
                timeTmp[1]=parseInt(timeTmp[1]);
                matchTimeTmp[j]=timeTmp;
            }
            matchResultTmp.push(matchTimeTmp);
            ret.push(matchResultTmp);
        }
        var retData=[];
        retData[0]=0;
        retData[1]=ret;
        return retData;
    }catch(err){
        var retData=[];
        retData[0]=1;
        retData[1]=null;
        return retData;
    }
}

function ParsePublicQuery(body){
    try{
        var $=cheerio.load(body,{decodeEntities: false});
        var result={
            QueryParams:null,
            QueryList:$('tbody').children().map(function(index,item){
                var classInfoRaw=$(this).children().map(function(index,item){
                    if(item.name=='td'){
                        return $(this).text().replace(/\s{1,}/g,"").replace(/\r\n*/,"");
                    }
                })
                classInfoRaw[5]=classInfoRaw[5].substr(0,classInfoRaw[5].length-2);
                classInfoRaw[8]=ParsePublicQueryDate(classInfoRaw[8]);
                return classInfoRaw;
            })
        };
        if(result.QueryList.length==0){
            throw "relogin";
        }
        else{
            var retData=[];
            retData[0]=0;
            retData[1]=result;
            return retData;
        }
    }catch(err){
        var retData=[];
        retData[0]=1;
        retData[1]={
            QueryParams:null,
            QueryList:null
        };
        return retData;
    }
}

function ParsePublicQueryDate(str){
    var retAryS1=str.split("]");
    var retAryS2=new Array();
    var retJson={NumPerWeek:0,data:[]};
    for (var x in retAryS1){
        retAryS2.push(retAryS1[x].split("["));
    }
    retAryS2.pop();
    retJson.NumPerWeek=retAryS2.length;
    for (var x in retAryS2){
        var tmp_time=sb_substr(retAryS2[x][0],3,4).split("-");
        tmp_time[0]=parseInt(tmp_time[0]);
        tmp_time[1]=parseInt(tmp_time[1]);
        var tmp_week=retAryS2[x][1].split("-");
        tmp_week[0]=parseInt(tmp_week[0]);
        var extra=tmp_week[1].match(/[^\x00-\xff]/g);
        tmp_week[1]=parseInt(tmp_week[1]);
        if(extra==null){
            tmp_week.push(0);
        }
        else if(extra[0]=="单"){
            tmp_week.push(1);
        }
        else if(extra[0]=="双"){
            tmp_week.push(2);
        }
        retJson.data[x]={
            day:SimchToInt(sb_substr(retAryS2[x][0],3,4)),
            time:tmp_time,
            week:tmp_week
        };
    }
    return retJson;
}

function SimchToInt(word){
    var ret;
    switch (word) {
        case "一":
            ret=1;
            break;
        case "二":
            ret=2;
            break;
        case "三":
            ret=3;
            break;
        case "四":
            ret=4;
            break;
        case "五":
            ret=5;
            break;
        case "六":
            ret=6;
            break;
        case "天":
            ret=7;
            break;
        case "日":
            ret=7;
            break;
        default:
            ret=null;
    }
    return ret;
}

function getChars(str) {
 var i = 0;
 var c = 0.0;
 var unicode = 0;
 var len = 0;
 if (str == null || str == "") {
  return 0;
 }
 len = str.length;
 for(i = 0; i < len; i++) {
   unicode = str.charCodeAt(i);
  if (unicode < 127) {
   c += 1;
  } else {
   c += 2;
  }
 }
 return c;
}
function sb_strlen(str) {
    return getChars(str);
}
function sb_substr(str, startp, endp) {
    var i=0;
    var c = 0;
    var unicode=0;
    var rstr = '';
    var len = str.length;
    var sblen = sb_strlen(str);
    if (startp < 0) {
        startp = sblen + startp;
    }
    if (endp < 1) {
        endp = sblen + endp;
    }
    for(i = 0; i < len; i++) {
        if (c >= startp) {
            break;
        }
     var unicode = str.charCodeAt(i);
  if (unicode < 127) {
   c += 1;
  } else {
   c += 2;
  }
 }
 for(i = i; i < len; i++) {
     var unicode = str.charCodeAt(i);
  if (unicode < 127) {
   c += 1;
  } else {
   c += 2;
  }
  rstr += str.charAt(i);
  if (c >= endp) {
      break;
  }
 }
 return rstr;
}

module.exports.ParsePublicQuery=ParsePublicQuery;
module.exports.ParseClassTable=ParseClassTable;
module.exports.ParseExamList=ParseExamList;
module.exports.ParseSemList=ParseSemList;
