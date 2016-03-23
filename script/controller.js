/**
 * Created by lenovo on 2015/11/28.
 */
/*控制器*/
//小区监控
myApp.controller('cellMonitoring', function() {
    setTimeout(function(){
        cellMonitoring.init();
    },200)
});
//区域告警趋势
myApp.controller('fmSerDetail', function() {
    setTimeout(function(){
        cellMonitoring.fmSerDetailInt();
    },200)
});
//小区告警分析
myApp.controller('cellGridShow', function() {
    setTimeout(function(){
        cellMonitoring.cellGridShow();
    },200)
});
//小区告警趋势
myApp.controller('cellGridint', function() {
    setTimeout(function(){
        cellMonitoring.cellGridShowInt();
    },200)
});
//FM告警详情
myApp.controller('cellfmGridint', function() {
    setTimeout(function(){
        cellMonitoring.cellfmGridShowint();
    },200)
});
//SP监控
myApp.controller('spMonitoring', function() {
    setTimeout(function(){
        spMonitoring.init();
    },200)
});
myApp.controller('reasonSp', function() {
    setTimeout(function(){
        spMonitoring.spGridShowInt();
    },200)
});
//用户首页
myApp.controller('userMonitoring', function() {
    setTimeout(function(){
        userMonitoring.init();
    },200)
});
//用户钻取
myApp.controller('userDrill', function() {
    setTimeout(function(){
        userMonitoring.userLinkInt();
    },200)
});
//用户根源钻取
myApp.controller('userSource', function() {
    setTimeout(function(){
        userMonitoring.userGridLinkInt();
    },200)
});