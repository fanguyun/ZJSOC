/**
 * Created by lenovo on 2015/11/28.
 */
//路由控制页面视图
var myApp = angular.module("myApp", ['ngRoute']);
myApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/cellmain', {//小区监控
                templateUrl: 'template/village.html',
                controller:'cellMonitoring'
            }).
            when('/fmSerDetail', {//区域告警趋势
                templateUrl: 'template/oneDetail.html',
                controller:'fmSerDetail'
            }).
            when('/cellGridint', {//小区告警分析
                templateUrl: 'template/reason.html',
                controller:'cellGridint'
            }).
            when('/cellGridShow', {//小区告警趋势
                templateUrl: 'template/fmSerDetail.html',
                controller:'cellGridShow'
            }).
            when('/cellfmGridint', {//FM告警详情
                templateUrl: 'template/fmDetail.html',
                controller:'cellfmGridint'
            }).
            when('/spmain', {//SP监控首页
                templateUrl: 'template/spmain.html',
                controller: 'spMonitoring'
            }).
            when('/spGridlink', {//SP告警根因钻取
                templateUrl: 'template/reasonSp.html',
                controller: 'reasonSp'
            }).
            when('/usermain', {//用户首页
                templateUrl: 'template/userMon.html',
                controller: 'userMonitoring'
            }).
            when('/userlink', {//用户钻取
                templateUrl: 'template/userDrill.html',
                controller: 'userDrill'
            }).
            when('/userGridlink', {//用户根源钻取
                templateUrl: 'template/userSource.html',
                controller: 'userSource'
            }).
            otherwise({//默认
                redirectTo: '/cellmain'
            });
    }
]);