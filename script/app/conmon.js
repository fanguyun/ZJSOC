/**
 * Created by Mrfan-123 on 2015/12/27.
 */
var conmon={
    getUrlData:function(){
        var hash=window.location.hash;
        var urlData=hash.split("?");
        return urlData;
    },
    getTimeData:function(){
        var firstDate =parseInt(new Date().getHours().toLocaleString());//当前小时
        var dateArr=[];
        for(var i=0;i<24;i++){
            if(firstDate==0){
                firstDate=24;
            }
            firstDate--;
            dateArr.push(firstDate+":00");
        }
        dateArr.reverse();//数组倒序排列
        return dateArr;
    }
}