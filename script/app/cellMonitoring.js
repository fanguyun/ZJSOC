/**
 * Created by Mrfan-123 on 2015/12/21.
 */
var cellMonitoring={
    init:function(){
        var scope=this;
        scope.selectMenu();//选中导航
        scope.cellTrendBlockInt();//24小时告警趋势图
        scope.ceelMapInt();//杭州区域地图
        scope.cellTotalInt();//小区监控总览
        scope.cellTableListInt(1);//表格列表
    },
    selectMenu:function(){
        var menu=$("#menu");
        menu.find("li").children("a").removeClass("active");
        menu.find("li").eq(0).children("a").addClass("active");
    },
    //小区告警分析钻取
    cellGridInt:function(){
        var cellTbody=$("#cellTbody");
        var qyCellGrid=$("#qyCellGrid");
        cellTbody.children("tr").each(function(){
            $(this).click(function(){
                window.location.href=window.location.origin+window.location.pathname+"#/cellGridint?cellName="+encodeURIComponent($(this).attr("trName"));
            });
        });
        qyCellGrid.children("tr").each(function(){
            $(this).click(function(){
                window.location.href=window.location.origin+window.location.pathname+"#/cellGridint?cellName="+encodeURIComponent($(this).attr("trName"));
            });
        });
    },
    //小区监控总览
    cellTotalInt:function(){
        $("#handRefresh").click(function(){
            window.location.reload();
        });
        var url="data/cell/celltotal.json";
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            contentType:"application/json",
            success: function(data){
                $("#cellmNum").text(data.cellTotal);
                $("#cellsNum").text(data.cellError);
                $("#cellnNum").text(data.cellNormal);
                $("#refreshDate").text(new Date().toLocaleString());
            },
            error:function(){
                console.log("error-小区监控总览");
            }
        });
    },
    //24小时告警趋势图
    cellTrendBlockInt:function(){
        // 路径配置
        require.config({
            paths: {
                echarts: 'script/echart'
            }
        });
        var url="data/cell/24trend.json";
        var timeData=conmon.getTimeData();
        var nameData=[];
        var valueData=[];
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            contentType:"application/json",
            success: function(data){
                if(data){
                   for(var i=0;i<data.length;i++){
                       nameData.push(data[i].name);
                       valueData.push(data[i].value);
                   }
                    var option = {
                        title:{
                            text:'严重告警24小时趋势图',
                            textStyle:{
                                color:'#8d8e8f'
                            }
                        },
                        tooltip : {
                            trigger: 'axis',
                            formatter: "{a}: {c}",
                        },
                        legend: {
                            show:false,
                            data:['严重告警']
                        },
                        grid:{
                            x:15,
                            y:36,
                            x2:18,
                            y2:25,
                            borderWidth:0
                        },
                        toolbox: {
                            show : false
                        },
                        calculable : true,
                        xAxis : [
                            {
                                show:true,
                                type : 'category',
                                data:timeData,
                                boundaryGap : false,
                                splitLine:{
                                    show:true,
                                    lineStyle:{
                                        color:"#333"
                                    }
                                },//网格
                                axisLine:{//轴线
                                    show:false
                                },
                                axisLabel:{
                                    textStyle:{
                                        color:"#999"
                                    },
                                    /*formatter:function(value){
                                        var backValue = '';
                                        if(value<10) {
                                            backValue = '0'+value+':00'
                                        }else{
                                            backValue = value+':00'
                                        }
                                        return backValue
                                    }*/
                                }

                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                show:false
                            }
                        ],
                        series : [
                            {
                                name:'严重告警',
                                type:'line',
                                stack: '总量',
                                data:valueData,
                                itemStyle:{
                                    normal:{
                                        color:'#ff5757'
                                    },
                                    emphasis:{}
                                }
                            }
                        ]
                    };
                    //...使用
                    require(
                        [
                            'echarts',
                            'echarts/chart/line' // ʹ配置所需图片类型插件
                        ],
                        //加载图表
                        function(ec){
                            //图表渲染的容器对象
                            var chartContainer = document.getElementById("cellTrendBlock");
                            //加载图表
                            var myChart = ec.init(chartContainer);
                            myChart.setOption(option);
                        }
                    );
                }
            },
            error:function(){
                console.log("error-24小时告警趋势图");
            }
        });

    },
    //翻页
    pageLinkInt:function(){
        var scope=this;
        var tFooterRight=$("#tFooterRight");
        tFooterRight.children("span[type='yema']").each(function(){
            $(this).unbind();
            $(this).click(function(){
                var pageNum=parseInt($(this).text());
                tFooterRight.children("span[type='yema']").removeClass("pageActive");
                $(this).addClass("pageActive");
                scope.cellTableListInt(pageNum);
            })
        })
    },
    //杭州区域地图
    ceelMapInt:function(){
        var width  = 1200;
        var height = 460;
        var svg = d3.select("#mapBlock").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(0,0)");
        var projection = d3.geo.mercator()
            .center([120.2,30.12])
            .scale(2000*14)
            .translate([width/2, height/2]);
        var path = d3.geo.path()
            .projection(projection);
        //var color = d3.scale.category20();
        var color=['#c1e1f6',"#b5def0","#b5def0","#b5def0","#95ccea","#66b8de","#ddeefa","#95ccea","#3792c7"];
        d3.json("data/cell/hangzhou.geojson", function(error, root) {
            if (error)
                return console.error(error);
                var hanzhou=svg.selectAll("path")
                .data(root.features )
                .enter()
                .append("path")
                .attr("stroke","#fff")
                .attr("stroke-width",1)
                .attr("d", path );
            d3.json("data/cell/tourism.json", function(error, valuedata){

                //将读取到的数据存到数组values，令其索引号为各省的名称
                var thisHeight=60/3;
                var values = [];
                for(var i=0; i<valuedata.length; i++){
                    var name = valuedata[i].name;
                    var error=valuedata[i].children[0].error;
                    var normal=valuedata[i].children[0].normal;
                    var value = valuedata[i].value;
                    values[name] = value;
                    switch (name){
                        case "萧山区":
                            svg.append("text").attr("x",730).attr("y",180).attr("fill","#000").text(name);
                            if(error!=0){
                                svg.append("rect").attr("x",730).attr("y",165-error*thisHeight).attr("width",20).attr("height",error*thisHeight).style("fill","#d02626");
                                svg.append("text").attr("x",730).attr("y",163-error*thisHeight).attr("fill","#333").text(error);
                            }
                            if(normal!=0){
                                svg.append("rect").attr("x",753).attr("y",165-normal*thisHeight).attr("width",20).attr("height",normal*thisHeight).style("fill","#f29a43");
                                svg.append("text").attr("x",753).attr("y",163-normal*thisHeight).attr("fill","#333").text(normal);
                            }
                            break;
                        case "余杭区":
                            svg.append("text").attr("x",440).attr("y",150).attr("fill","#000").text(name);
                            if(error!=0){
                                svg.append("rect").attr("x",440).attr("y",135-error*thisHeight).attr("width",20).attr("height",error*thisHeight).style("fill","#d02626");
                                svg.append("text").attr("x",440).attr("y",133-error*thisHeight).attr("fill","#333").text(error);
                            }
                            if(normal!=0){
                                svg.append("rect").attr("x",463).attr("y",135-normal*thisHeight).attr("width",20).attr("height",normal*thisHeight).style("fill","#f29a43");
                                svg.append("text").attr("x",463).attr("y",133-normal*thisHeight).attr("fill","#333").text(normal);
                            }
                            break;
                        case "西湖区":
                            svg.append("text").attr("x",515).attr("y",220).attr("fill","#000").text(name);
                            if(error!=0){
                                svg.append("rect").attr("x",515).attr("y",205-error*thisHeight).attr("width",20).attr("height",error*thisHeight).style("fill","#d02626");
                                svg.append("text").attr("x",515).attr("y",203-error*thisHeight).attr("fill","#333").text(error);
                            }
                            if(normal!=0){
                                svg.append("rect").attr("x",538).attr("y",205-normal*thisHeight).attr("width",20).attr("height",normal*thisHeight).style("fill","#f29a43");
                                svg.append("text").attr("x",538).attr("y",203-normal*thisHeight).attr("fill","#333").text(normal);
                            }
                            break;
                        case "江干区":
                            svg.append("text").attr("x",625).attr("y",130).attr("fill","#000").text(name);
                            if(error!=0){
                                svg.append("rect").attr("x",625).attr("y",115-error*thisHeight).attr("width",20).attr("height",error*thisHeight).style("fill","#d02626");
                                svg.append("text").attr("x",625).attr("y",113-error*thisHeight).attr("fill","#333").text(error);
                            }
                            if(normal!=0){
                                svg.append("rect").attr("x",648).attr("y",115-normal*thisHeight).attr("width",20).attr("height",normal*thisHeight).style("fill","#f29a43");
                                svg.append("text").attr("x",648).attr("y",113-normal*thisHeight).attr("fill","#333").text(normal);
                            }
                            break;
                        case "拱墅区":
                            svg.append("text").attr("x",545).attr("y",115).attr("fill","#000").text(name);
                            if(error!=0){
                                svg.append("rect").attr("x",545).attr("y",100-error*thisHeight).attr("width",20).attr("height",error*thisHeight).style("fill","#d02626");
                                svg.append("text").attr("x",545).attr("y",98-error*thisHeight).attr("fill","#333").text(error);
                            }
                            if(normal!=0){
                                svg.append("rect").attr("x",568).attr("y",100-normal*thisHeight).attr("width",20).attr("height",normal*thisHeight).style("fill","#f29a43");
                                svg.append("text").attr("x",568).attr("y",98-normal*thisHeight).attr("fill","#333").text(normal);
                            }
                            break;
                        case "下城区":
                            svg.append("text").attr("x",950).attr("y",225).attr("fill","#fff").text(name)
                            svg.append("circle").attr("cx",583).attr("fill","#fff").attr("cy",130).attr("r",4);
                            svg.append("path").attr("d","M585 135 l110 85 M695 220 l250 0").attr("stroke","#fff").attr("stroke-width",0.5).attr("fill","none");
                            if(error!=0){
                                svg.append("rect").attr("x",950).attr("y",210-error*thisHeight).attr("width",20).attr("height",error*thisHeight).style("fill","#d02626");
                                svg.append("text").attr("x",950).attr("y",208-error*thisHeight).attr("fill","#fff").text(error);
                            }
                            if(normal!=0){
                                svg.append("rect").attr("x",973).attr("y",210-normal*thisHeight).attr("width",20).attr("height",normal*thisHeight).style("fill","#f29a43");
                                svg.append("text").attr("x",973).attr("y",208-normal*thisHeight).attr("fill","#fff").text(normal);
                            }
                            break;
                        case "上城区":
                            svg.append("text").attr("x",230).attr("y",175).attr("fill","#fff").text(name)
                            svg.append("circle").attr("cx",585).attr("fill","#fff").attr("cy",170).attr("r",4);
                            svg.append("path").attr("d","M585 170 l-306 0").attr("stroke","#fff").attr("stroke-width",0.5).attr("fill","none");
                            if(error!=0){
                                svg.append("rect").attr("x",230).attr("y",160-error*thisHeight).attr("width",20).attr("height",error*thisHeight).style("fill","#d02626");
                                svg.append("text").attr("x",230).attr("y",158-error*thisHeight).attr("fill","#fff").text(error);
                            }
                            if(normal!=0){
                                svg.append("rect").attr("x",253).attr("y",160-normal*thisHeight).attr("width",20).attr("height",normal*thisHeight).style("fill","#f29a43");
                                svg.append("text").attr("x",253).attr("y",158-normal*thisHeight).attr("fill","#fff").text(normal);
                            }
                            break;
                        case "滨江区":
                            svg.append("text").attr("x",820).attr("y",355).attr("fill","#fff").text(name)
                            svg.append("circle").attr("cx",585).attr("fill","#fff").attr("cy",200).attr("r",4);
                            svg.append("path").attr("d","M585 200 l90 150 M675 350 l140 0").attr("stroke","#fff").attr("stroke-width",0.5).attr("fill","none");
                            if(error!=0){
                                svg.append("rect").attr("x",820).attr("y",340-error*thisHeight).attr("width",20).attr("height",error*thisHeight).style("fill","#d02626");
                                svg.append("text").attr("x",820).attr("y",338-error*thisHeight).attr("fill","#fff").text(error);
                            }
                            if(normal!=0){
                                svg.append("rect").attr("x",843).attr("y",340-normal*thisHeight).attr("width",20).attr("height",normal*thisHeight).style("fill","#f29a43");
                                svg.append("text").attr("x",843).attr("y",338-normal*thisHeight).attr("fill","#fff").text(normal);
                            }
                            break;
                        case "富阳区":
                            svg.append("text").attr("x",430).attr("y",350).attr("fill","#000").text(name);
                            if(error!=0){
                                svg.append("rect").attr("x",430).attr("y",335-error*thisHeight).attr("width",20).attr("height",error*thisHeight).style("fill","#d02626");
                                svg.append("text").attr("x",430).attr("y",333-error*thisHeight).attr("fill","#333").text(error);
                            }
                            if(normal!=0){
                                svg.append("rect").attr("x",453).attr("y",335-normal*thisHeight).attr("width",20).attr("height",normal*thisHeight).style("fill","#f29a43");
                                svg.append("text").attr("x",453).attr("y",333-normal*thisHeight).attr("fill","#333").text(normal);
                            }
                            break;
                    }

                }
                //求最大值和最小值
                var maxvalue = d3.max(valuedata, function(d){ return d.value; });
                var minvalue = 0;

                //定义一个线性比例尺，将最小值和最大值之间的值映射到[0, 1]
                var linear = d3.scale.linear()
                    .domain([minvalue, maxvalue])
                    .range([0, 1]);

                //定义最小值和最大值对应的颜色
                var a = d3.rgb(221,238,250);//蓝色
                var b = d3.rgb(55,146,199);	//浅色

                //颜色插值函数
                var computeColor = d3.interpolate(a,b);

                //设定各省份的填充色
                hanzhou.attr("fill", function(d,i){
                    var t = linear( values[d.properties.name]);
                    var color = computeColor(t);
                    return color.toString();
                }).on("mouseover",function(d,i){
                    d3.select(this)
                        .attr("fill","#0e61d7");
                })
                .on("mouseout",function(d,i){
                    d3.select(this)
                        .attr("fill",function(d,i){
                            var t = linear( values[d.properties.name] );
                            var color = computeColor(t);
                            return color.toString();
                        });
                }).on("click",function(d){
                        var areaName=d.properties.name;
                        window.location.href=window.location.origin+window.location.pathname+"#/fmSerDetail?areaName="+encodeURIComponent(areaName);
                 });

                //定义一个线性渐变
                var defs = svg.append("defs");

                var linearGradient = defs.append("linearGradient")
                    .attr("id","linearColor")
                    .attr("x1","0%")
                    .attr("y1","0%")
                    .attr("x2","100%")
                    .attr("y2","0%");

                var stop1 = linearGradient.append("stop")
                    .attr("offset","0%")
                    .style("stop-color",a.toString());

                var stop2 = linearGradient.append("stop")
                    .attr("offset","100%")
                    .style("stop-color",b.toString());

                //添加一个矩形，并应用线性渐变
                var colorRect = svg.append("rect")
                    .attr("x", 900)
                    .attr("y", 400)
                    .attr("width", 140)
                    .attr("height", 30)
                    .style("fill","url(#" + linearGradient.attr("id") + ")");

                //添加文字
                var minValueText = svg.append("text")
                    .attr("class","valueText")
                    .attr("x", 900)
                    .attr("y", 400)
                    .attr("dy", "-0.3em")
                    .attr("fill","#fff")
                    .text(function(){
                        return minvalue;
                    });

                var maxValueText = svg.append("text")
                    .attr("class","valueText")
                    .attr("x", 1040)
                    .attr("y", 400)
                    .attr("fill","#fff")
                    .attr("dy", "-0.3em")
                    .text(function(){
                        return maxvalue;
                    });
            })

        });
    },
    //小区表格列表
    cellTableListInt:function(pageNum){
        var scope=this;
        var url="data/cell/celllist.json";
        var strNum=(pageNum-1)*10;
        var endNum=pageNum*10;
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            contentType:"application/json",
            success: function(data){
                var cellTbody=$("#cellTbody");
                var cellTbodyHtml="";
                for(var i=strNum;i<endNum;i++){
                    var gaojingClass="";
                    if(data[i].alarmlevel==1){
                        gaojingClass="eTdIcon";
                    }else{
                        gaojingClass="wTdIcon";
                    }
                    cellTbodyHtml+="<tr trName="+data[i].cellid+"&nbsp;"+data[i].cellname+"><td>"+data[i].cellid+"</td><td align='left'>"+data[i].cellname+"</td><td>"+data[i].area+"</td><td><span class="+gaojingClass+"></span></td><td>"+data[i].begintime+"</td><td>"+data[i].continuetime+"</td><td><span class='eTd'>"+data[i].webresponse+"</span></td><td>"+data[i].impactuser+"</td><td>"+data[i].traffic+"</td><td>"+data[i].bussiness+"</td><td>"+data[i].hisalarm+"</td><td><span class='analButton'>分析</span></td></tr>";
                }
                $("#cellTotalPage").text("共"+data.length+"条");
                cellTbody.html(cellTbodyHtml);
                scope.cellGridInt();//小区告警分析
                scope.pageLinkInt();
            },
            error:function(){
                console.log("error-小区表格列表");
            }
        });
    },
    /*告警趋势详情*/
    cellGridShow:function(){
        var scope=this;
        //scope.selectMenu();//选中导航
        scope.cellGridListShow("day");
        scope.daySelectTabInt();//日周月切换
        var thisThead=$("#thisThead");
        var urlData=conmon.getUrlData(urlData);
        var thisData="";
        if(urlData){
            thisData=urlData[1].split("=")[1];
        }
        if(thisData=="cell"){
            $("#thisSelelctName").text("小区监控 >");
            thisThead.html('<td class="tdPadding">ID</td><td>小区名称</td><td>行政区</td><td>告警级别</td><td>告警起始时间</td><td>告警持续时长(H)</td><td>Web业务响应时延(S)</td><td>影响用户数</td><td>流量（GB）</td><td>业务量（次）</td><td>历史告警次数</td><td class="tdPadding">操作</td>');
            scope.cellTableListInt(1);
        }else if(thisData=="sp"){
            $("#thisSelelctName").text("SP监控 >");
            thisThead.html('<td class="tdPadding">序号</td><td>Host</td><td>事务级HTTP成功率(%)</td><td>告警级别</td><td>告警起始时间</td><td>告警持续时长(H)</td><td>影响用户数</td><td>流量（GB）</td><td>业务量（次）</td><td>历史告警次数</td><td class="tdPadding">操作</td>');
            spMonitoring.spTableListInt();
        }else{
            $("#thisSelelctName").text("用户监控 >");
            thisThead.html('<td class="tdPadding">IMEI/终端</td><td>CellID</td><td>GridID</td><td>APN</td><td>SGW_IP</td><td>PGW_IP</td><td>SP_IP</td><td>异常用户数</td><td class="tdPadding">异常用户比例</td>');
            userMonitoring.userTbaleListInt();
        }
    },
    //日周月切换
    daySelectTabInt:function(){
        var scope=this;
        var xianxiqs=$("#xianxiqs");
        xianxiqs.children("li").each(function(){
            var index=$(this).index();
            $(this).click(function(){
                xianxiqs.children("li").removeClass("dactive");
                $(this).addClass("dactive");
                if(index==0){//ri
                    scope.cellGridListShow("day");//日周月切换
                }else if(index==1){//zhou
                    scope.cellGridListShow("week");//日周月切换
                }else{//yue
                    scope.cellGridListShow("month");//日周月切换
                }
            })
        })
    },
    cellGridListShow:function(data){
        // 路径配置
        require.config({
            paths: {
                echarts: 'script/echart'
            }
        });
        var type=data;
        var url="data/cell/cellqslist.json";
        var timeData=[];
        var erorData=[];
        var normalData=[];
        var dataValue;
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            contentType:"application/json",
            success: function(data){
                if(data){
                    if(type=="day"){
                        dataValue=data.day;
                    }else if(type=="week"){
                        dataValue=data.week;
                    }else{
                        dataValue=data.month;
                    }
                    for(var di=0;di<dataValue.length;di++){
                        timeData.push(dataValue[di].name);
                        erorData.push(dataValue[di].value);
                        normalData.push(dataValue[di].normal);
                    }
                    var option = {
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            y:30,
                            data:['严重告警','普通告警'],
                            textStyle:{color:'#949599'}
                        },
                        grid:{
                            x:80,
                            y:70,
                            height:200,
                            borderColor:'#4d5461'
                        },
                        toolbox: {
                            show : false,
                        },
                        calculable : true,
                        xAxis : [
                            {
                                type : 'category',
                                boundaryGap : true,
                                data : timeData,
                                axisLabel:{
                                    interval:0,
                                    rotate:62,
                                    textStyle:{color:'#949599'}
                                },
                                splitLine:{
                                    show:false
                                }
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                axisLabel:{
                                    textStyle:{color:'#949599'}
                                },
                                splitLine:{
                                    lineStyle:{
                                        color:'#4d5461'
                                    }
                                }
                            }
                        ],
                        series : [
                            {
                                name:'严重告警',
                                type:'line',
                                stack: '总量',
                                itemStyle:{
                                    normal:{
                                        color:"#ed3d4e"
                                    }
                                },
                                data:erorData
                            },
                            {
                                name:'普通告警',
                                type:'line',
                                stack: '总量',
                                itemStyle:{
                                    normal:{
                                        color:"#e88f26"
                                    }
                                },
                                data:normalData
                            }
                        ]
                    };
                    //...使用
                    require(
                        [
                            'echarts',
                            'echarts/chart/line' // ʹ配置所需图片类型插件
                        ],
                        //加载图表
                        function(ec){
                            //图表渲染的容器对象
                            var chartContainer = document.getElementById("serMapBlock");
                            //加载图表
                            var myChart = ec.init(chartContainer);
                            myChart.setOption(option);
                        }
                    );
                }
            },
            error:function(){
                console.log("error-日周月切换");
            }
        });
    },
/*
* 区域告警分析
* */
    fmSerDetailInt:function(){
        var scope=this;
        scope.selectMenu();//选中导航
        scope.qycellTableListInt();
        scope.cellTotalInt();
    },
    //区域表格列表
    qycellTableListInt:function(){
        var scope=this;
        var url="data/cell/celllist.json";
        var urlData=conmon.getUrlData();
        var areaName="";
        if(urlData){
            areaName=decodeURIComponent(urlData[1].split("=")[1]);
        }
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            contentType:"application/json",
            success: function(data){
                var cellTbody=$("#qyCellGrid");
                var cellTbodyHtml="";
                var newCellData=[];
                for(var i=0;i<data.length;i++){
                    var gaojingClass="";
                    if(data[i].alarmlevel==1){
                        gaojingClass="eTdIcon";
                    }else{
                        gaojingClass="wTdIcon";
                    }
                    if(data[i].area==areaName){
                        newCellData.push(data[i]);
                        cellTbodyHtml+="<tr trName="+data[i].cellid+"&nbsp;"+data[i].cellname+"><td>"+data[i].cellid+"</td><td align='left'>"+data[i].cellname+"</td><td>"+data[i].area+"</td><td><span class="+gaojingClass+"></span></td><td>"+data[i].begintime+"</td><td>"+data[i].continuetime+"</td><td><span class='eTd'>"+data[i].webresponse+"</span></td><td>"+data[i].impactuser+"</td><td>"+data[i].traffic+"</td><td>"+data[i].bussiness+"</td><td>"+data[i].hisalarm+"</td><td><span class='analButton'>分析</span></td></tr>";
                    }
                }
                $("#cellTotalPage").text("共"+data.length+"条");
                cellTbody.html(cellTbodyHtml);
                scope.cellGridInt();//小区告警分析
                scope.cellMapInt(newCellData,areaName);
            },
            error:function(){
                console.log("error-小区表格列表");
            }
        });
    },
    //实时百度地图
    cellMapInt:function(data,areaName){
        var placeData=[];
        var map;
        switch (areaName){
            case "江干区":
                placeData.push({"lat":30.268568,"lng":120.200138});
                placeData.push({"lat":30.266322,"lng":120.220127});
                break;
            case "余杭区":
                placeData.push({"lat":30.420818,"lng":120.291453});
                break;
            case "富阳区":
                placeData.push({"lat":30.217307,"lng":120.012044});
                break;
            case "西湖区":
                placeData.push({"lat":30.285691,"lng":120.112654});
                placeData.push({"lat":30.277707,"lng":120.154048});
                placeData.push({"lat":30.267227,"lng":120.106905});
                placeData.push({"lat":30.273714,"lng":120.166121});
                break;
            case "下城区":
                placeData.push({"lat":30.301906,"lng":120.178769});
                placeData.push({"lat":30.302904,"lng":120.191992});
                break;
            case "上城区":
                placeData.push({"lat":30.298912,"lng":120.156923});
                placeData.push({"lat":30.311883,"lng":120.157497});
                placeData.push({"lat":30.288934,"lng":120.156923});
                placeData.push({"lat":30.306396,"lng":120.139675});
                break;
            case "滨江区":
                placeData.push({"lat":30.21506,"lng":120.21039});
                placeData.push({"lat":30.205073,"lng":120.217289});
                break;
            case "萧山区":
                placeData.push({"lat":30.213562,"lng":120.254658});
                placeData.push({"lat":30.206571,"lng":120.287428});
                placeData.push({"lat":30.194086,"lng":120.262707});
                break;

        }
        //创建和初始化地图函数：
        function initMap(){
            createMap();//创建地图
            setMapEvent();//设置地图事件
            addMapControl();//向地图添加控件
            addMapOverlay();//向地图添加覆盖物
        }
        function createMap(){
            map = new BMap.Map("baiduMapBlock");
            map.centerAndZoom(new BMap.Point(120.214953,30.306645),12);
        }
        function setMapEvent(){
            map.enableScrollWheelZoom();
            map.enableKeyboard();
        }
        function addClickHandler(target,window){
            target.addEventListener("click",function(){
                target.openInfoWindow(window);
            });
        }

        function addMapOverlay(){
            var markers = [];
            for(var di=0;di<data.length;di++){
                var thisWidth="",thisHeight="";
                if(data[di].alarmlevel==1){
                    thisWidth=-46;
                    thisHeight=-21;
                }else{
                    thisWidth=-69;
                    thisHeight=-21;
                }
                markers.push({content:"<div class='biaoji'><p>小区名称："+data[di].cellname+"</p><p>小区ID:"+data[di].cellid+"</p><p>告警指标：web业务响应时延</p><p>影响用户数："+data[di].impactuser+"</p><p>小区流量："+data[di].traffic+"T</p><p>业务次数："+data[di].bussiness+"</p></div>",title:"",imageOffset: {width:thisWidth,height:thisHeight},position:{lat:placeData[di].lat,lng:placeData[di].lng}});
            }
            for(var index = 0; index < markers.length; index++ ){
                var point = new BMap.Point(markers[index].position.lng,markers[index].position.lat);
                var marker = new BMap.Marker(point,{icon:new BMap.Icon("http://api.map.baidu.com/lbsapi/createmap/images/icon.png",new BMap.Size(20,25),{
                    imageOffset: new BMap.Size(markers[index].imageOffset.width,markers[index].imageOffset.height)
                })});
                var label = new BMap.Label(markers[index].title,{offset: new BMap.Size(25,5)});
                var opts = {
                    width: 235,
                    title: markers[index].title,
                    enableMessage: false
                };
                var infoWindow = new BMap.InfoWindow(markers[index].content,opts);
                marker.setLabel(label);
                addClickHandler(marker,infoWindow);
                map.addOverlay(marker);
            };
        }
        //向地图添加控件
        function addMapControl(){
            var scaleControl = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
            scaleControl.setUnit(BMAP_UNIT_IMPERIAL);
            map.addControl(scaleControl);
            var navControl = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
            map.addControl(navControl);
        }
        initMap();
    },
/*小区告警根因趋势*/
    cellGridShowInt:function(){
        var scope=this;
        var urlData=conmon.getUrlData();
        var cellName="";
        if(urlData){
            cellName=urlData[1].split("=")[1];
            $("#selectCellName").text(decodeURIComponent(cellName)+" >");
            $("#cellserNameHead").text(decodeURIComponent(cellName));
        }
        scope.thisCellListShowUp();
        scope.selectMenu();//选中导航
        scope.cellTabSelect();//FM&PM切换
    },
    //某个小区详请
    thisCellListShowUp:function(){
        var scope=this;
        var url="data/cell/celllistup.json";
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            contentType:"application/json",
            success: function(data){
                if(data){
                    var cellTbody=$("#cellListTbody");
                    var tuijianPM=$("#tuijianPM");
                    var tuijianFM=$("#tuijianFM");
                    var cellTbodyHtml="";
                    var thisCell=data.thisCell[0];
                    var pmData=data.tuijianPM;
                    var fmData=data.tuijianFM;
                    var gaojingClass="";
                    var pmHtml="";
                    var fmHtml="";
                    if(thisCell.alarmlevel==1){
                        gaojingClass="eTdIcon";
                    }else{
                        gaojingClass="wTdIcon";
                    }
                    cellTbodyHtml+="<tr trName="+thisCell.cellid+"&nbsp;"+thisCell.cellname+"><td>"+thisCell.area+"</td><td><span class="+gaojingClass+"></span></td><td>"+thisCell.begintime+"</td><td>"+thisCell.continuetime+"</td><td><span class='eTd'>"+thisCell.webresponse+"</span></td><td>"+thisCell.impactuser+"</td><td>"+thisCell.traffic+"</td><td>"+thisCell.bussiness+"</td><td>"+thisCell.hisalarm+"</td></tr>";
                    cellTbody.html(cellTbodyHtml);
                    scope.cellFmListInt();//FM告警详情钻取
                    for(var i=0;i<pmData.length;i++){
                        pmHtml+="<tr><td class='tdPadding'>"+pmData[i].indictor+"</td><td><span class='redTd'>"+pmData[i].value+"</span></td><td>"+pmData[i].confidence+"</td></tr>";
                    }
                    tuijianPM.html(pmHtml);
                    for(var i=0;i<fmData.length;i++){
                        fmHtml+="<tr><td class='tdPadding'>"+fmData[i].indictor+"</td><td><span class='redTd'>"+fmData[i].alarmlevel+"</span></td><td>"+fmData[i].confidence+"</td></tr>";
                    }
                    tuijianFM.html(fmHtml);
                }

            },
            error:function(){
                console.log("error-小区表格列表");
            }
        });
    },
    //FM&PM切换
    cellTabSelect:function(){
        var scope=this;
        var serReasonHead=$("#serReasonHead");
        var serReasonLeft=$("#serReasonLeft");
        var serReasonRight=$("#serReasonRight");
        serReasonHead.children("div").each(function(){
            $(this).click(function(){
                var index=$(this).index();
                var thisID=$(this).attr("id");
                serReasonHead.children("div").removeClass("serActive");
                $(this).addClass("serActive");
                serReasonRight.children("div").hide();
                serReasonRight.children("div").eq(index).show();
                serReasonLeft.children("div").hide();
                serReasonLeft.children("div").eq(index).show();
                scope.tabhtmlListInt(thisID);
                if(thisID=="pmBlock"){
                    scope.PMcellint1();//PM指标
                }else{
                    scope.cellReasonMInt();//WEB延时响应
                }

            })

        });
        serReasonHead.children("div").eq(0).trigger("click");
    },
    //tab标签列表信息
    tabhtmlListInt:function(thisID){
        var scope=this;
        var newData=[];
        var serReasonLeft=$("#serReasonLeft");
        if(thisID=="pmBlock"){
            newData=[
                {"time":"2015/12/1 13:00:00","liast":[
                    {"pmzb":"HS_Users_Cong_Num","zhibaio":"28","yuzhi":"20"},
                    {"pmzb":"Iub_DropPackage_Ratio","zhibaio":"12.9%","yuzhi":"10%"},
                    {"pmzb":"IubFail_Num","zhibaio":"19","yuzhi":"14"}
                ]},
                {"time":"2015/12/1 12:00:00","liast":[
                    {"pmzb":"HS_Users_Cong_Num","zhibaio":"28","yuzhi":"20"},
                    {"pmzb":"PS_Power_Cong_Num","zhibaio":"38","yuzhi":"20"},
                    {"pmzb":"UL_CE_Utilizing_Ratio","zhibaio":"76.36%","yuzhi":"76.36%/60%"}
                ]},
                {"time":"2015/12/1 00:00:00","liast":[
                    {"pmzb":"HS_Users_Cong_Num","zhibaio":"28","yuzhi":"20"},
                    {"pmzb":"Iub_DropPackage_Ratio","zhibaio":"12.9%","yuzhi":"10%"},
                    {"pmzb":"IubFail_Num","zhibaio":"19","yuzhi":"14"}
                ]},
                {"time":"2015/11/30 22:00:00","liast":[
                    {"pmzb":"HS_Users_Cong_Num","zhibaio":"28","yuzhi":"20"},
                    {"pmzb":"PS_Power_Cong_Num","zhibaio":"38","yuzhi":"20"},
                    {"pmzb":"UL_CE_Utilizing_Ratio","zhibaio":"76.36%","yuzhi":"76.36%/60%"}
                ]}

            ];
        }else{
            newData=[
                {"time":"2015/12/1 13:00:00","liast":[
                    {"pmzb":"用户面承载链路故障","zhibaio":"重要"}
                ]},
                {"time":"2015/12/1 12:00:00","liast":[
                    {"pmzb":"用户面承载链路故障","zhibaio":"重要"}
                ]}
            ];
        }
        serReasonLeftHtml="";
        serReasonLeftHtml+="<div id="+thisID+"obj>"
        for(var i=0;i<newData.length;i++){
            serReasonLeftHtml+="<div class='serCard'><div class='serCardTitle'>异常起始时间 "+newData[i].time+"</div><div class='serCardBody'><table>";
            if(thisID=="pmBlock"){
                serReasonLeftHtml+="<tr><td>PM告警</td><td>告警级别</td></tr>";
            }else{
                serReasonLeftHtml+="<tr><td>FM告警</td><td>告警级别</td></tr>";
            }
            for(var si=0;si<newData[i].liast.length;si++){
                if(thisID=="pmBlock"){
                    serReasonLeftHtml+="<tr><td>"+newData[i].liast[si].pmzb+"</td><td><span class='red'>"+newData[i].liast[si].zhibaio+"</span>/"+newData[i].liast[si].yuzhi+"</td></tr>";
                }else{
                    serReasonLeftHtml+="<tr><td>"+newData[i].liast[si].pmzb+"</td><td><span class='red'>"+newData[i].liast[si].zhibaio+"</span></td></tr>";
                }

            }
            serReasonLeftHtml+="</table></div></div>";
        }
        serReasonLeftHtml+="</div>";
        serReasonLeft.html(serReasonLeftHtml);
        var PMobj=$("#pmBlockobj");
        PMobj.children("div").each(function(){
            $(this).click(function(){
                var index=$(this).index();
                PMobj.children("div").removeClass("serCardActive");
                $(this).addClass("serCardActive");
                scope.PMcellint2(index);//PM指标
                scope.PMcellint3(index);//PM指标
                scope.PMcellint4(index);
            })
        });
        PMobj.children("div").eq(0).trigger("click");
        var FMobj=$("#fmBlockobj");
        FMobj.children("div").each(function(){
            $(this).click(function(){
                var index=$(this).index();
                FMobj.children("div").removeClass("serCardActive");
                $(this).addClass("serCardActive");
                scope.celluserReasonMInt(index);//用户面承载链路故障
            })
        });
        FMobj.children("div").eq(0).trigger("click");
    },
    //WEB延时响应
    cellReasonMInt:function(){
        var webData=[],yuzhiData=[],newData=[];
        var timeData=["2015/11/30 14:00","2015/11/30 15:00","2015/11/30 16:00","2015/11/30 17:00","2015/11/30 18:00","2015/11/30 19:00","2015/11/30 20:00","2015/11/30 21:00","2015/11/30 22:00","2015/11/30 23:00","2015/12/1 0:00","2015/12/1 1:00","2015/12/1 2:00","2015/12/1 3:00","2015/12/1 4:00","2015/12/1 5:00","2015/12/1 6:00","2015/12/1 7:00","2015/12/1 8:00","2015/12/1 9:00","2015/12/1 10:00","2015/12/1 11:00","2015/12/1 12:00","2015/12/1 13:00"];
        webData=[0.23,0.14,0.17,0.13,0.18,0.15,0.21,0.31,0.50,0.41,0.65,0.49,0.36,0.33,0.31,0.19,0.2,0.28,0.31,0.69,0.75,0.56,0.95,0.83];
        yuzhiData=[0.5,0.3,0.3,0.3,0.3,0.3,0.4,0.4,0.4,0.5,0.5,0.5,0.5,0.5,0.4,0.4,0.4,0.4,0.4,0.8,0.8,0.8,0.8,0.8];
        for(var i=0;i<webData.length;i++){
            if(webData[i]>yuzhiData[i]){
                newData.push({value:webData[i],symbol:"emptyCircle",symbolSize:4,itemStyle:{normal:{color:"#ff5757"}}});
            }else{
                newData.push(webData[i]);
            }
        }
        // 路径配置
        require.config({
            paths: {
                echarts: 'script/echart'
            }
        });
        var option = {
            backgroundColor:'#3c5592',
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['Web响应时延(s)','阈值'],
                textStyle:{color:'#949599'}
            },
            grid:{
                x:80,
                y:30,
                height:180,
                borderColor:'#4d5461'
            },
            toolbox: {
                show : false
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : true,
                    data : timeData,
                    axisLabel:{
                        interval:0,
                        rotate:62,
                        textStyle:{color:'#949599'}
                    },
                    splitLine:{
                        show:false
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel:{
                        textStyle:{color:'#949599'}
                    },
                    splitLine:{
                        lineStyle:{
                            color:'#4d5461'
                        }
                    }
                }
            ],
            series : [
                {
                    name:'Web响应时延(s)',
                    type:'line',
                    itemStyle:{
                        normal:{
                            color:'#5bc2dd',
                            lineStyle:{
                                color:"#5bc2dd"
                            }
                        }
                    },
                    data:newData/*[0.2, 0.8, 0.6,1.0,1.1,0.8,1.1,0.1,0.5,0.8,1.0,
                        0.2,0.3,0.6,0.1,0.7,0.8,
                        {value:1.2,symbol:"emptyCircle",symbolSize:4,itemStyle:{normal:{color:"#ff5757"}}}
                        ,0.2]*/
                },
                {
                    name:'阈值',
                    type:'line',
                    itemStyle:{
                        normal:{
                            color:'#d644df',
                            lineStyle:{
                                color:"#d644df",
                                width:1,
                                type:"dashed"
                            }
                        }
                    },
                    data:yuzhiData
                }
            ]
        };
        //...使用
        require(
            [
                'echarts',
                'echarts/chart/line' // ʹ配置所需图片类型插件
            ],
            //加载图表
            function(ec){
                //图表渲染的容器对象
                var chartContainer = document.getElementById("emCelllist1");
                //加载图表
                var myChart = ec.init(chartContainer);
                myChart.setOption(option);
            }
        );
    },
    //用户面承载链路故障
    celluserReasonMInt:function(index){
        var timeData=["2015/11/30 14:00","2015/11/30 15:00","2015/11/30 16:00","2015/11/30 17:00","2015/11/30 18:00","2015/11/30 19:00","2015/11/30 20:00","2015/11/30 21:00","2015/11/30 22:00","2015/11/30 23:00","2015/12/1 0:00","2015/12/1 1:00","2015/12/1 2:00","2015/12/1 3:00","2015/12/1 4:00","2015/12/1 5:00","2015/12/1 6:00","2015/12/1 7:00","2015/12/1 8:00","2015/12/1 9:00","2015/12/1 10:00","2015/12/1 11:00","2015/12/1 12:00","2015/12/1 13:00"];
        var newData=[];
        if(index==0){
            newData=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.99,0.99];
        }else{
            newData=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.99,0.99];
        }
        // 路径配置
        require.config({
            paths: {
                echarts: 'script/echart'
            }
        });
        var option = {
            backgroundColor:'#3f4655',
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['用户面承载链路故障'],
                textStyle:{color:'#949599'}
            },
            grid:{
                x:80,
                y:30,
                height:180,
                borderColor:'#4d5461'
            },
            toolbox: {
                show : false
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : true,
                    data : timeData,
                    axisLabel:{
                        interval:0,
                        rotate:62,
                        textStyle:{color:'#949599'}
                    },
                    splitLine:{
                        show:false
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel:{
                        textStyle:{color:'#949599'}
                    },
                    splitLine:{
                        lineStyle:{
                            color:'#4d5461'
                        }
                    }
                }
            ],
            series : [
                {
                    name:'用户面承载链路故障',
                    type:'bar',
                    stack: '总量',
                    data:newData
                }
            ]
        };
        //...使用
        require(
            [
                'echarts',
                'echarts/chart/bar' // ʹ配置所需图片类型插件
            ],
            //加载图表
            function(ec){
                //图表渲染的容器对象
                var chartContainer = document.getElementById("emCelllist2");
                //加载图表
                var myChart = ec.init(chartContainer);
                myChart.setOption(option);
            }
        );
    },
    //PM指标
    PMcellint1:function(){
        var webData=[],yuzhiData=[],newData=[];
        webData=[0.23,0.14,0.17,0.13,0.18,0.15,0.21,0.31,0.50,0.41,0.65,0.49,0.36,0.33,0.31,0.19,0.2,0.28,0.31,0.69,0.75,0.56,0.95,0.83];
        yuzhiData=[0.5,0.3,0.3,0.3,0.3,0.3,0.4,0.4,0.4,0.5,0.5,0.5,0.5,0.5,0.4,0.4,0.4,0.4,0.4,0.8,0.8,0.8,0.8,0.8];
        var timeData=["2015/11/30 14:00","2015/11/30 15:00","2015/11/30 16:00","2015/11/30 17:00","2015/11/30 18:00","2015/11/30 19:00","2015/11/30 20:00","2015/11/30 21:00","2015/11/30 22:00","2015/11/30 23:00","2015/12/1 0:00","2015/12/1 1:00","2015/12/1 2:00","2015/12/1 3:00","2015/12/1 4:00","2015/12/1 5:00","2015/12/1 6:00","2015/12/1 7:00","2015/12/1 8:00","2015/12/1 9:00","2015/12/1 10:00","2015/12/1 11:00","2015/12/1 12:00","2015/12/1 13:00"];
        for(var i=0;i<webData.length;i++){
            if(webData[i]>yuzhiData[i]){
                newData.push({value:webData[i],symbol:"emptyCircle",symbolSize:4,itemStyle:{normal:{color:"#ff5757"}}});
            }else{
                newData.push(webData[i]);
            }
        }
        // 路径配置
        require.config({
            paths: {
                echarts: 'script/echart'
            }
        });
        var option = {
            backgroundColor:'#3c5592',
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['Web响应时延(s)','阈值'],
                textStyle:{color:'#949599'}
            },
            grid:{
                x:80,
                y:30,
                height:180,
                borderColor:'#4d5461'
            },
            toolbox: {
                show : false
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : true,
                    data : timeData,
                    axisLabel:{
                        interval:0,
                        rotate:62,
                        textStyle:{color:'#949599'}
                    },
                    splitLine:{
                        show:false
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel:{
                        textStyle:{color:'#949599'}
                    },
                    splitLine:{
                        lineStyle:{
                            color:'#4d5461'
                        }
                    }
                }
            ],
            series : [
                {
                    name:'Web响应时延(s)',
                    type:'line',
                    itemStyle:{
                        normal:{
                            color:'#5bc2dd',
                            lineStyle:{
                                color:"#5bc2dd"
                            }
                        }
                    },
                    data:newData
                },
                {
                    name:'阈值',
                    type:'line',
                    itemStyle:{
                        normal:{
                            color:'#d644df',
                            lineStyle:{
                                color:"#d644df",
                                width:1,
                                type:"dashed"
                            }
                        }
                    },
                    data:yuzhiData
                }
            ]
        };
        //...使用
        require(
            [
                'echarts',
                'echarts/chart/line' // ʹ配置所需图片类型插件
            ],
            //加载图表
            function(ec){
                //图表渲染的容器对象
                var chartContainer = document.getElementById("pmCelllist1");
                //加载图标
                var myChart = ec.init(chartContainer);
                myChart.setOption(option);
            }
        );
    },
    PMcellint2:function(index){
        var timeData=["2015/11/30 14:00","2015/11/30 15:00","2015/11/30 16:00","2015/11/30 17:00","2015/11/30 18:00","2015/11/30 19:00","2015/11/30 20:00","2015/11/30 21:00","2015/11/30 22:00","2015/11/30 23:00","2015/12/1 0:00","2015/12/1 1:00","2015/12/1 2:00","2015/12/1 3:00","2015/12/1 4:00","2015/12/1 5:00","2015/12/1 6:00","2015/12/1 7:00","2015/12/1 8:00","2015/12/1 9:00","2015/12/1 10:00","2015/12/1 11:00","2015/12/1 12:00","2015/12/1 13:00"];
        var name,newData=[],yuzhi=[];
        if(index==0){
            name="HS_Users_Cong_Num";
            newData=[7,3,6,1,9,9,8,5,28,9,35,5,15,13,13,18,12,0,28,3,26,29,30,46];
            yuzhi=[30,10,10,10,10,10,15,20,20,30,30,30,35,35,30,30,30,30,30,35,38,40,45,40];
        }else{
            name="HS_Users_Cong_Num";
            newData=[8,2,6,25,7,3,6,5,35,9,43,5,5,9,3,9,8,8,15,25,15,15,29,38];
            yuzhi=[35, 30,30,30,30,30,25,28,29,30,40,30,10,10,10,10,10,15,20,20,30,48,30,35];
        }
        // 路径配置
        require.config({
            paths: {
                echarts: 'script/echart'
            }
        });
        var option = {
            backgroundColor:'#3f4655',
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:[name,'阈值'],
                textStyle:{color:'#949599'}
            },
            grid:{
                x:80,
                y:30,
                height:180,
                borderColor:'#4d5461'
            },
            toolbox: {
                show : false
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : true,
                    data : timeData,
                    axisLabel:{
                        interval:0,
                        rotate:62,
                        textStyle:{color:'#949599'}
                    },
                    splitLine:{
                        show:false
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel:{
                        textStyle:{color:'#949599'}
                    },
                    splitLine:{
                        lineStyle:{
                            color:'#4d5461'
                        }
                    }
                }
            ],
            series : [
                {
                    name:name,
                    type:'line',
                    itemStyle:{
                        normal:{
                            color:'#5bc2dd',
                            lineStyle:{
                                color:"#5bc2dd"
                            }
                        }
                    },
                    data:newData
                },
                {
                    name:'阈值',
                    type:'line',
                    itemStyle:{
                        normal:{
                            color:'#d644df',
                            lineStyle:{
                                color:"#d644df",
                                width:1,
                                type:"dashed"
                            }
                        }
                    },
                    data:yuzhi
                }
            ]
        };
        //...使用
        require(
            [
                'echarts',
                'echarts/chart/line' // ʹ配置所需图片类型插件
            ],
            //加载图表
            function(ec){
                //图表渲染的容器对象
                var chartContainer = document.getElementById("pmCelllist2");
                //加载图表
                var myChart = ec.init(chartContainer);
                myChart.setOption(option);
            }
        );
    },
    PMcellint3:function(index){
        var timeData=["2015/11/30 14:00","2015/11/30 15:00","2015/11/30 16:00","2015/11/30 17:00","2015/11/30 18:00","2015/11/30 19:00","2015/11/30 20:00","2015/11/30 21:00","2015/11/30 22:00","2015/11/30 23:00","2015/12/1 0:00","2015/12/1 1:00","2015/12/1 2:00","2015/12/1 3:00","2015/12/1 4:00","2015/12/1 5:00","2015/12/1 6:00","2015/12/1 7:00","2015/12/1 8:00","2015/12/1 9:00","2015/12/1 10:00","2015/12/1 11:00","2015/12/1 12:00","2015/12/1 13:00"];
        var name,newData=[],yuzhi=[];
        if(index==0){
            name="PS_Power_Cong_Num";
            newData=[5,5,5,3,3,8,2,0,48,17,35,16,11,9,19,18,15,28,9,13,35,48,30,45];
            yuzhi=[30,10,10,10,10,10,15,20,20,30,30,30,35,35, 30,30,30,30,30,50,50,50,50,40];
        }else{
            name="Iub_DropPackage_Ratio(%)";
            newData=[7,3,6,1,9,9,8,5,28,9,35,5,15,13,13,18,12,0,28,3,26,29,30,48];
            yuzhi=[30,10,10,10,10,10,15,20,20,30,30,30,35,35,30,30,30,30,30,35,38,40,45,40];
        }
        // 路径配置
        require.config({
            paths: {
                echarts: 'script/echart'
            }
        });
        var option = {
            backgroundColor:'#3f4655',
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:[name,'阈值'],
                textStyle:{color:'#949599'}
            },
            grid:{
                x:80,
                y:30,
                height:180,
                borderColor:'#4d5461'
            },
            toolbox: {
                show : false
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : true,
                    data : timeData,
                    axisLabel:{
                        interval:0,
                        rotate:62,
                        textStyle:{color:'#949599'}
                    },
                    splitLine:{
                        show:false
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel:{
                        textStyle:{color:'#949599'}
                    },
                    splitLine:{
                        lineStyle:{
                            color:'#4d5461'
                        }
                    }
                }
            ],
            series : [
                {
                    name:name,
                    type:'line',
                    itemStyle:{
                        normal:{
                            color:'#5bc2dd',
                            lineStyle:{
                                color:"#5bc2dd"
                            }
                        }
                    },
                    data:newData
                },
                {
                    name:'阈值',
                    type:'line',
                    itemStyle:{
                        normal:{
                            color:'#d644df',
                            lineStyle:{
                                color:"#d644df",
                                width:1,
                                type:"dashed"
                            }
                        }
                    },
                    data:yuzhi
                }
            ]
        };
        //...使用
        require(
            [
                'echarts',
                'echarts/chart/line' // ʹ配置所需图片类型插件
            ],
            //加载图表
            function(ec){
                //图表渲染的容器对象
                var chartContainer = document.getElementById("pmCelllist3");
                //加载图表
                var myChart = ec.init(chartContainer);
                myChart.setOption(option);
            }
        );
    },
    PMcellint4:function(index){
        var timeData=["2015/11/30 14:00","2015/11/30 15:00","2015/11/30 16:00","2015/11/30 17:00","2015/11/30 18:00","2015/11/30 19:00","2015/11/30 20:00","2015/11/30 21:00","2015/11/30 22:00","2015/11/30 23:00","2015/12/1 0:00","2015/12/1 1:00","2015/12/1 2:00","2015/12/1 3:00","2015/12/1 4:00","2015/12/1 5:00","2015/12/1 6:00","2015/12/1 7:00","2015/12/1 8:00","2015/12/1 9:00","2015/12/1 10:00","2015/12/1 11:00","2015/12/1 12:00","2015/12/1 13:00"];
        var name,newData=[],yuzhi=[];
        if(index==0){
            name="UL_CE_Utilizing_Ratio(%";
            newData=[8,2,6,25,7,3,6,5,35,9,43,5,5,9,3,9,8,8,15,15,25,35,29,38];
            yuzhi=[35, 30,30,30,30,30,25,28,29,30,40,30,10,10,10,10,10,15,20,20,30,48,30,35];
        }else{
            name="IubFail_Num";
            newData=[5,5,5,3,3,8,2,0,48,17,35,16,11,9,19,18,15,28,9,13,35,48,30,43];
            yuzhi=[30,10,10,10,10,10,15,20,20,30,30,30,35,35, 30,30,30,30,30,50,50,50,50,40];
        }
        // 路径配置
        require.config({
            paths: {
                echarts: 'script/echart'
            }
        });
        var option = {
            backgroundColor:'#3f4655',
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:[name,'阈值'],
                textStyle:{color:'#949599'}
            },
            grid:{
                x:80,
                y:30,
                height:180,
                borderColor:'#4d5461'
            },
            toolbox: {
                show : false
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : true,
                    data :timeData,
                    axisLabel:{
                        interval:0,
                        rotate:62,
                        textStyle:{color:'#949599'}
                    },
                    splitLine:{
                        show:false
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel:{
                        textStyle:{color:'#949599'}
                    },
                    splitLine:{
                        lineStyle:{
                            color:'#4d5461'
                        }
                    }
                }
            ],
            series : [
                {
                    name:name,
                    type:'line',
                    itemStyle:{
                        normal:{
                            color:'#5bc2dd',
                            lineStyle:{
                                color:"#5bc2dd"
                            }
                        }
                    },
                    data:newData
                },
                {
                    name:'阈值',
                    type:'line',
                    itemStyle:{
                        normal:{
                            color:'#d644df',
                            lineStyle:{
                                color:"#d644df",
                                width:1,
                                type:"dashed"
                            }
                        }
                    },
                    data:yuzhi
                }
            ]
        };
        //...使用
        require(
            [
                'echarts',
                'echarts/chart/line' // ʹ配置所需图片类型插件
            ],
            //加载图表
            function(ec){
                //图表渲染的容器对象
                var chartContainer = document.getElementById("pmCelllist4");
                //加载图表
                var myChart = ec.init(chartContainer);
                myChart.setOption(option);
            }
        );
    },
    //FM告警详情钻取
    cellFmListInt:function(){
        var cellListTbody=$("#cellListTbody");
        cellListTbody.children("tr").each(function(){
            $(this).click(function(){
                window.location.href=window.location.origin+window.location.pathname+"#/cellfmGridint";
            });
        });

    },
    /*
    *FM告警详情加载
    * */
    cellfmGridShowint:function(){
        var scope=this;
        scope.selectMenu();//选中导航
    }

}