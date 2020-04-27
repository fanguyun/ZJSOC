/**
 * Created by Mrfan-123 on 2015/12/21.
 */
var userMonitoring = {
  init: function () {
    var scope = this;
    scope.selectMenu(); //选中导航
    scope.userLink(); //用户钻取
    scope.userTbaleListInt(); //userTableList
    scope.userErrorTrendInt(); //24小时异常维度
  },
  selectMenu: function () {
    var menu = $("#menu");
    menu.find("li").children("a").removeClass("active");
    menu.find("li").eq(2).children("a").addClass("active");
  },
  //用户钻取
  userLink: function () {
    var userCard = $(".userCard");
    userCard.each(function () {
      $(this).click(function () {
        window.location.href =
          window.location.origin +
          window.location.pathname +
          "#/userlink?userName=" +
          encodeURIComponent($(this).attr("userName"));
      });
    });
  },
  //gird钻取
  gridLink: function () {
    var userGridTbody = $("#userGridTbody");
    userGridTbody.children("tr").each(function () {
      $(this).click(function () {
        window.location.href =
          window.location.origin +
          window.location.pathname +
          "#/userGridlink?imei=" +
          encodeURIComponent($(this).attr("imei"));
      });
    });
  },
  //userTableList
  userTbaleListInt: function () {
    var scope = this;
    var url = "data/user/usertablelist.json";
    $.ajax({
      type: "GET",
      url: url,
      dataType: "json",
      contentType: "application/json",
      success: function (data) {
        var cellTbody = $("#userGridTbody");
        var cellTbodyHtml = "";
        for (var i = 0; i < data.length; i++) {
          cellTbodyHtml +=
            "<tr imei=" +
            data[i].imei +
            "><td>" +
            data[i].imei +
            "</td><td>" +
            data[i].cellid +
            "</td><td>" +
            data[i].grid +
            "</td><td>" +
            data[i].apn +
            "</td><td>" +
            data[i].sgwip +
            "</td><td>" +
            data[i].pgwip +
            "</td><td>" +
            data[i].spip +
            "</td><td>" +
            data[i].errornum +
            "</td><td>" +
            data[i].errorbili +
            "</td></tr>";
        }
        $("#cellTotalPage").text("共" + data.length + "条");
        cellTbody.html(cellTbodyHtml);
        scope.gridLink(); //表格钻取
      },
      error: function () {
        console.log("error-小区表格列表");
      },
    });
  },
  //24小时异常维度
  userErrorTrendInt: function () {
    // 路径配置
    require.config({
      paths: {
        echarts: "script/echart",
      },
    });
    $("#handRefresh").click(function () {
      window.location.reload();
    });
    var timeData = conmon.getTimeData();
    var url = "data/user/usertotal.json";
    $.ajax({
      type: "GET",
      url: url,
      dataType: "json",
      contentType: "application/json",
      success: function (data) {
        $("#usermNum").text(data.userTotal);
        $("#usersNum").text(data.userError);
        $("#refreshDate").text(new Date().toLocaleString());
      },
      error: function () {
        console.log("error-小区监控总览");
      },
    });
    var url1 = "data/user/24trend.json";
    var nameData = [];
    var valueData = [];
    $.ajax({
      type: "GET",
      url: url1,
      dataType: "json",
      contentType: "application/json",
      success: function (data) {
        if (data) {
          for (var i = 0; i < data.length; i++) {
            nameData.push(data[i].name);
            valueData.push(data[i].value);
          }
          var option = {
            title: {
              text: "24小时异常维度",
              x: 15,
              y: 5,
              textStyle: {
                color: "#8d8e8f",
              },
            },
            tooltip: {
              trigger: "axis",
              formatter: "{a}: {c}",
            },
            legend: {
              show: false,
              data: ["异常用户"],
            },
            grid: {
              x: 30,
              y: 50,
              x2: 30,
              y2: 40,
              borderWidth: 0,
            },
            toolbox: {
              show: false,
            },
            calculable: true,
            xAxis: [
              {
                show: true,
                type: "category",
                data: timeData,
                boundaryGap: false,
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: "#333",
                  },
                }, //网格
                axisLine: {
                  //轴线
                  show: false,
                },
                axisLabel: {
                  textStyle: {
                    color: "#999",
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
                },
              },
            ],
            yAxis: [
              {
                type: "value",
                show: false,
              },
            ],
            series: [
              {
                name: "异常用户",
                type: "line",
                data: valueData,
                itemStyle: {
                  normal: {
                    color: "#60bad4",
                  },
                  emphasis: {},
                },
              },
            ],
          };
          //...使用
          require([
            "echarts",
            "echarts/chart/line", // ʹ配置所需图片类型插件
          ], function (ec) {
            //加载图表
            //图表渲染的容器对象
            var chartContainer = document.getElementById("errorTrend");
            //加载图表
            var myChart = ec.init(chartContainer);
            myChart.setOption(option);
          });
        }
      },
      error: function () {
        console.log("error-24小时告警趋势图");
      },
    });
  },
  /**
   * 用户钻取页加载
   * **/
  userLinkInt: function () {
    var scope = this;
    var urlData = conmon.getUrlData();
    var userName;
    if (urlData) {
      userName = urlData[1].split("=")[1];
      $("#drillName").text(decodeURIComponent(userName));
      $("#thisUserName").text(decodeURIComponent(userName) + "钻取页");
    }
    scope.selectMenu(); //选中导航
    scope.pieDrillInt(); //当前一小时情况统计
    scope.oneHourDrillInt(); //当前一小时业务异常情况
    scope.oneHourTiyanInt(); //当前一小时体验趋势图
    scope.twotiHourErorInt(); //用户24小时异常情况
    scope.userleftLIatInt();
  },
  //当前一小时情况统计
  pieDrillInt: function () {
    // 路径配置
    require.config({
      paths: {
        echarts: "script/echart",
      },
    });
    //参数
    var option = {
      title: {
        text: "当前1小时异常统计",
        x: "15",
        y: "15",
        textStyle: {
          color: "#ccc",
        },
      },
      backgroundColor: "#3f4655",
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {d}%)",
      },
      legend: {
        show: false,
        orient: "horizontal ",
        x: "right",
        y: "15",
        itemGrap: "10",
        data: [
          { name: "正常" + 80, textStyle: { color: "#86bb6e" } },
          { name: "差" + 18, textStyle: { color: "#f68f52" } },
          { name: "极差" + 12, textStyle: { color: "#ff5757" } },
        ],
      },
      series: [
        {
          name: "异常统计",
          type: "pie",
          radius: ["40%", "60%"],
          center: ["50%", "56%"], //饼状图的位置控制
          data: [
            {
              value: 80,
              name: "正常" + 80,
              itemStyle: {
                normal: {
                  color: "#86bb6e",
                  borderColor: "#86bb6e",
                  borderWidth: "3",
                  labelLine: {
                    lineStyle: { color: "#7f7f80" },
                  },
                },
              },
            },
            {
              value: 18,
              name: "差" + 18,
              itemStyle: { normal: { color: "#f68f52" } },
            },
            {
              value: 12,
              name: "极差" + 12,
              itemStyle: { normal: { color: "#ff5757" } },
            },
          ],
        },
      ],
    };
    //...使用
    require([
      "echarts",
      "echarts/chart/pie", // ʹ配置所需图片类型插件
    ], function (ec) {
      //加载图表
      //图表渲染的容器对象
      var chartContainer = document.getElementById("oneHourCount");
      //加载图表
      var myChart = ec.init(chartContainer);
      myChart.setOption(option);
    });
  },
  //当前一小时业务异常情况
  oneHourDrillInt: function () {
    // 路径配置
    require.config({
      paths: {
        echarts: "script/echart",
      },
    });
    //参数
    var option = {
      title: {
        text: "当前1小时业务异常情况",
        x: "15",
        y: "15",
        textStyle: {
          color: "#ccc",
        },
      },
      backgroundColor: "#3f4655",
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      legend: {
        x: "right",
        y: "bottom",
        data: ["正常", "差", "极差"],
        textStyle: { color: "#949599" },
      },
      grid: {
        borderWidth: 0,
        x: 50,
        y: 60,
        width: "240",
        height: "240",
      },
      toolbox: {
        show: false,
      },
      calculable: true,
      xAxis: [
        {
          type: "category",
          data: ["网页", "视频"],
          axisLabel: {
            textStyle: { color: "#949599" },
          },
          splitLine: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            textStyle: { color: "#949599" },
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: "极差",
          type: "bar",
          barWidth: 50,
          stack: "总量",
          itemStyle: {
            normal: {
              color: "#ff5757",
              label: { show: true, position: "insideBottom" },
            },
          },
          data: [8, 11],
        },
        {
          name: "差",
          type: "bar",
          barWidth: 50,
          stack: "总量",
          itemStyle: {
            normal: {
              color: "#f68f52",
              label: { show: true, position: "insideBottom" },
            },
          },
          data: [7, 15],
        },
        {
          name: "正常",
          type: "bar",
          barWidth: 50,
          stack: "总量",
          itemStyle: {
            normal: {
              color: "#86bb6e",
              label: { show: true, position: "insideBottom" },
            },
          },
          data: [26, 35],
        },
      ],
    };
    //...使用
    require([
      "echarts",
      "echarts/chart/bar", // ʹ配置所需图片类型插件
    ], function (ec) {
      //加载图表
      //图表渲染的容器对象
      var chartContainer = document.getElementById("oneHourError");
      //加载图表
      var myChart = ec.init(chartContainer);
      myChart.setOption(option);
    });
  },
  //当前一小时体验趋势图
  oneHourTiyanInt: function () {
    var svg = d3
      .select("#oneHourTrend")
      .append("svg")
      .attr("width", 539)
      .attr("height", 360)
      .append("g")
      .attr("transform", "translate(0,0)");
    svg
      .append("text")
      .attr("x", 10)
      .attr("y", 30)
      .attr("fill", "#ccc")
      .attr("font-size", 18)
      .attr("font-weight", "bold")
      .text("当前一小时体验趋势图");
    svg
      .append("path")
      .attr("d", "M40 300 l480 0")
      .attr("stroke", "#4488bb")
      .attr("stroke-width", 1)
      .attr("fill", "none");
    svg
      .append("path")
      .attr("d", "M40 300 l0 -240")
      .attr("stroke", "#4488bb")
      .attr("stroke-width", 1)
      .attr("fill", "none");
    svg
      .append("text")
      .attr("x", 5)
      .attr("y", 250)
      .attr("fill", "#999")
      .text("正常");
    svg
      .append("text")
      .attr("x", 17)
      .attr("y", 200)
      .attr("fill", "#999")
      .text("差");
    svg
      .append("text")
      .attr("x", 5)
      .attr("y", 150)
      .attr("fill", "#999")
      .text("极差");
    svg
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("x", 350)
      .attr("y", 338)
      .attr("fill", "#6fa734");
    svg
      .append("text")
      .attr("x", 365)
      .attr("y", 348)
      .attr("fill", "#fff")
      .text("正常");
    svg
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("x", 410)
      .attr("y", 338)
      .attr("fill", "#f68f52");
    svg
      .append("text")
      .attr("x", 425)
      .attr("y", 348)
      .attr("fill", "#fff")
      .text("差");
    svg
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("x", 452)
      .attr("y", 338)
      .attr("fill", "#ff5757");
    svg
      .append("text")
      .attr("x", 467)
      .attr("y", 348)
      .attr("fill", "#fff")
      .text("极差");
    var valueData = [
      {
        time: "17:30",
        children: ["range", "range", "range", "differ", "differ"],
      },
      {
        time: "17:35",
        children: ["normal", "normal", "normal", "normal", "normal"],
      },
      {
        time: "17:40",
        children: ["normal", "differ", "differ", "normal", "normal"],
      },
      {
        time: "17:45",
        children: ["normal", "differ", "differ", "differ", "differ"],
      },
      {
        time: "17:50",
        children: ["normal", "range", "range", "range", "differ"],
      },
      {
        time: "17:55",
        children: ["normal", "normal", "normal", "normal", "normal"],
      },
      {
        time: "18:00",
        children: ["normal", "normal", "normal", "normal", "normal"],
      },
      {
        time: "18:05",
        children: ["normal", "differ", "differ", "normal", "normal"],
      },
      {
        time: "18:10",
        children: ["normal", "normal", "normal", "normal", "normal"],
      },
      {
        time: "18:15",
        children: ["normal", "range", "range", "range", "differ"],
      },
      {
        time: "18:20",
        children: ["normal", "differ", "differ", "normal", "normal"],
      },
      {
        time: "18:25",
        children: ["range", "range", "range", "differ", "differ"],
      },
      { time: "18:30", children: [] },
    ];
    var x = 40;
    for (var vi = 0; vi < valueData.length; vi++) {
      svg
        .append("text")
        .attr("x", x)
        .attr("y", 320)
        .attr("fill", "#999")
        .attr("font-size", "9px")
        .attr("rotate", 2)
        .text(valueData[vi].time);
      if (valueData[vi].children) {
        var smallX = 0;
        for (var si = 0; si < valueData[vi].children.length; si++) {
          switch (valueData[vi].children[si]) {
            case "range":
              svg
                .append("path")
                .attr(
                  "d",
                  "M" +
                    (x + smallX + 18) +
                    " 150 L" +
                    (x + smallX) +
                    " 300 L" +
                    (x + smallX + 36) +
                    " 300 Z"
                )
                .attr("opacity", "0.2")
                .attr("fill", "#ff5757")
                .text("极差");
              break;
            case "differ":
              svg
                .append("path")
                .attr(
                  "d",
                  "M" +
                    (x + smallX + 18) +
                    " 200 L" +
                    (x + smallX) +
                    " 300 L" +
                    (x + smallX + 36) +
                    " 300 Z"
                )
                .attr("opacity", "0.2")
                .attr("fill", "#f68f52")
                .text("极差");
              break;
            case "normal":
              svg
                .append("path")
                .attr(
                  "d",
                  "M" +
                    (x + smallX + 18) +
                    " 250 L" +
                    (x + smallX) +
                    " 300 L" +
                    (x + smallX + 36) +
                    " 300 Z"
                )
                .attr("opacity", "0.2")
                .attr("fill", "#6fa734")
                .text("极差");
              break;
          }
          smallX += 7.2;
        }
      }
      x += 36;
    }
  },
  //用户24小时异常情况
  twotiHourErorInt: function () {
    var timeData = conmon.getTimeData();
    var data = [
      { time: "0:00", value: "differ" },
      { time: "1:00", value: "differ" },
      { time: "2:00", value: "differ" },
      { time: "3:00", value: "range" },
      { time: "4:00", value: "range" },
      { time: "5:00", value: "range" },
      { time: "6:00", value: "range" },
      { time: "7:00", value: "range" },
      { time: "8:00", value: "range" },
      { time: "9:00", value: "range" },
      { time: "10:00", value: "differ" },
      { time: "11:00", value: "normal" },
      { time: "12:00", value: "normal" },
      { time: "13:00", value: "normal" },
      { time: "14:00", value: "normal" },
      { time: "15:00", value: "normal" },
      { time: "16:00", value: "differ" },
      { time: "17:00", value: "differ" },
      { time: "18:00", value: "differ" },
      { time: "19:00", value: "differ" },
      { time: "20:00", value: "differ" },
      { time: "21:00", value: "range" },
      { time: "22:00", value: "range" },
      { time: "23:00", value: "range" },
    ];
    var svg = d3
      .select("#oneDayError")
      .append("svg")
      .attr("width", 1200)
      .attr("height", 190)
      .append("g")
      .attr("transform", "translate(0,0)");
    svg
      .append("path")
      .attr("d", "M10 65 l1170 0")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .attr("fill", "none");
    svg
      .append("text")
      .attr("x", 945)
      .attr("y", 165)
      .attr("fill", "#fff")
      .text("正常");
    svg
      .append("circle")
      .attr("cx", 930)
      .attr("fill", "#6fa734")
      .attr("cy", 160)
      .attr("r", 7);
    svg
      .append("text")
      .attr("x", 1010)
      .attr("y", 165)
      .attr("fill", "#fff")
      .text("差");
    svg
      .append("circle")
      .attr("cx", 995)
      .attr("fill", "#f68f52")
      .attr("cy", 160)
      .attr("r", 10);
    svg
      .append("text")
      .attr("x", 1072)
      .attr("y", 165)
      .attr("fill", "#fff")
      .text("极差");
    svg
      .append("circle")
      .attr("cx", 1052)
      .attr("fill", "#ff5757")
      .attr("cy", 160)
      .attr("r", 13);
    var x = 20,
      color,
      width;
    for (var i = 0; i < data.length; i++) {
      x += 45.5;
      switch (data[i].value) {
        case "normal":
          color = "#6fa734";
          width = 7;
          break;
        case "differ":
          color = "#f68f52";
          width = 10;
          break;
        case "range":
          color = "#ff5757";
          width = 13;
          break;
      }
      svg
        .append("circle")
        .attr("cx", x)
        .attr("fill", color)
        .attr("cy", 65)
        .attr("r", width);
      svg
        .append("text")
        .attr("x", x - 15)
        .attr("y", 98)
        .attr("fill", "#999")
        .text(timeData[i]);
    }
  },
  //趋势图右侧
  userleftLIatInt: function () {
    var scope = this;
    var url = "data/user/userdownlist.json";
    var singleLeft = $("#singleLeft");
    var thisHtml = "";
    $.ajax({
      type: "GET",
      url: url,
      dataType: "json",
      contentType: "application/json",
      success: function (data) {
        if (data) {
          for (var i = 0; i < data.length; i++) {
            thisHtml +=
              "<div class='singleCard' id=" +
              data[i].tuid +
              "><p class='singleCardTitle'>Time " +
              data[i].time +
              "</p><div class='singleCardCont cf'><div class='singleCLeft'><span class='singleSpan'>KQI指标</span><ul class='singleUL'><li>HTTP成功率(%)：" +
              data[i].https +
              "%</li><li>响应时延(s)：" +
              data[i].xianyiys +
              "</li><li>显示时延(s)：" +
              data[i].xiansys +
              "</li></ul></div><div class='singleCRight'><span class='singleSpan'>异常维度</span><ul class='singleUL'> <li>IMEI:" +
              data[i].imei +
              "</li><li>CellID:" +
              data[i].celled +
              "</li> <li>GridID:" +
              data[i].grid +
              "</li><li>APN:" +
              data[i].apn +
              "</li><li>SGW_IP:" +
              data[i].sgwip +
              "</li><li>PGW_IP:" +
              data[i].pgwip +
              "</li><li>SP_IP:" +
              data[i].spip +
              "</li></ul></div></div></div>";
          }
          singleLeft.html(thisHtml);
        }
        $(".singleCard").each(function () {
          $(this).click(function () {
            $(".singleCard").removeClass("activeCard");
            $(this).addClass("activeCard");
            var thisID = $(this).attr("id");
            scope.httpSuccessDrillInt(thisID); //HTTP执行成功率
            scope.callBackStateInt(thisID); //相应延时
            scope.displayBackStateInt(thisID); //显示延时
          });
        });
        $(".singleCard").eq(0).trigger("click");
      },
      error: function () {
        console.log("error-趋势图右侧");
      },
    });
  },
  //http成功率
  httpSuccessDrillInt: function (thisid) {
    var nameData, nowData, hisData;
    if (thisid == 1001) {
      nameData = [
        95,
        90,
        85,
        80,
        75,
        70,
        65,
        60,
        55,
        50,
        45,
        40,
        35,
        30,
        25,
        20,
        15,
        10,
        5,
        0,
      ];
      nowData = [
        0.02,
        0.06,
        0.1,
        0.13,
        0.17,
        0.23,
        0.29,
        0.35,
        0.46,
        0.52,
        0.6,
        0.63,
        0.65,
        0.72,
        0.78,
        0.84,
        0.88,
        0.93,
        0.98,
        0.99,
      ];
      hisData = [
        0.01,
        0.03,
        0.09,
        0.13,
        0.25,
        0.38,
        0.48,
        0.56,
        0.67,
        0.73,
        0.75,
        0.78,
        0.81,
        0.82,
        {
          value: 0.88,
          symbol: "emptyCircle",
          symbolSize: 4,
          itemStyle: { normal: { color: "#ff5757" } },
        },
        0.9,
        0.92,
        0.95,
        0.98,
        0.99,
      ];
    } else {
      nameData = [
        95,
        90,
        85,
        80,
        75,
        70,
        65,
        60,
        55,
        50,
        45,
        40,
        35,
        30,
        25,
        20,
        15,
        10,
        5,
        0,
      ];
      nowData = [
        0.02,
        0.06,
        0.1,
        0.13,
        0.17,
        0.23,
        0.29,
        0.35,
        0.46,
        0.52,
        0.6,
        0.63,
        0.65,
        0.72,
        0.78,
        0.84,
        0.88,
        0.93,
        0.98,
        0.99,
      ];
      hisData = [
        0.01,
        0.03,
        0.09,
        0.13,
        0.25,
        0.38,
        0.46,
        0.56,
        0.67,
        0.73,
        {
          value: 0.75,
          symbol: "emptyCircle",
          symbolSize: 4,
          itemStyle: { normal: { color: "#ff5757" } },
        },
        0.78,
        0.81,
        0.82,
        0.88,
        0.9,
        0.92,
        0.95,
        0.98,
        0.99,
      ];
    }
    // 路径配置
    require.config({
      paths: {
        echarts: "script/echart",
      },
    });
    //参数
    var option = {
      title: {
        text: "HTTP成功率",
        x: "15",
        y: "15",
        textStyle: {
          color: "#8d8e8f",
        },
      },
      backgroundColor: "#3f4655",
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["当前", "历史"],
        textStyle: { color: "#949599" },
        padding: 25,
      },
      grid: {
        x: 40,
        y: 55,
        width: 740,
        height: 180,
        borderColor: "#4d5461",
      },
      toolbox: {
        show: false,
      },
      calculable: true,
      xAxis: [
        {
          type: "category",
          boundaryGap: true,
          data: nameData,
          axisLabel: {
            interval: 0,
            rotate: 62,
            textStyle: { color: "#949599" },
            formatter: function (value) {
              var backValue = "";
              backValue = parseInt(value) + "%";
              return backValue;
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            lineStyle: {
              color: "#949599",
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            textStyle: { color: "#949599" },
          },
          splitLine: {
            lineStyle: {
              color: "#4d5461",
            },
          },
        },
      ],
      series: [
        {
          name: "当前",
          type: "line",
          itemStyle: {
            normal: {
              color: "#3be1d7",
              lineStyle: {
                color: "#3be1d7",
              },
            },
          },
          data: nowData,
        },
        {
          name: "历史",
          type: "line",
          itemStyle: {
            normal: {
              color: "#2196f3",
              lineStyle: {
                color: "#2196f3",
              },
            },
          },
          data: hisData,
        },
      ],
    };
    //...使用
    require([
      "echarts",
      "echarts/chart/line", // ʹ配置所需图片类型插件
    ], function (ec) {
      //加载图表
      //图表渲染的容器对象
      var chartContainer = document.getElementById("httpState");
      //加载图表
      var myChart = ec.init(chartContainer);
      myChart.setOption(option);
    });
  },
  //响应时延
  callBackStateInt: function (thisid) {
    var nameData, nowData, hisData;
    if (thisid == 1001) {
      nameData = [
        0.05,
        0.1,
        0.15,
        0.2,
        0.25,
        0.3,
        0.35,
        0.4,
        0.45,
        0.5,
        0.6,
        0.7,
        0.8,
        0.9,
        1,
        1.5,
        2,
        2.5,
        3,
        3.5,
      ];
      nowData = [
        0.02,
        0.06,
        0.1,
        0.13,
        0.17,
        0.23,
        0.29,
        0.35,
        0.46,
        0.52,
        0.6,
        0.63,
        0.65,
        0.72,
        0.78,
        0.84,
        0.88,
        0.93,
        0.98,
        0.99,
      ];
      hisData = [
        0.01,
        0.03,
        0.09,
        0.13,
        0.25,
        0.38,
        0.48,
        0.56,
        0.67,
        0.73,
        0.75,
        0.78,
        0.81,
        {
          value: 0.82,
          symbol: "emptyCircle",
          symbolSize: 4,
          itemStyle: { normal: { color: "#ff5757" } },
        },
        0.88,
        0.9,
        0.92,
        0.95,
        0.98,
        0.99,
      ];
    } else {
      nameData = [
        0.05,
        0.1,
        0.15,
        0.2,
        0.25,
        0.3,
        0.35,
        0.4,
        0.45,
        0.5,
        0.6,
        0.7,
        0.8,
        0.9,
        1,
        1.5,
        2,
        2.5,
        3,
        3.5,
      ];
      nowData = [
        0.02,
        0.06,
        0.1,
        0.13,
        0.17,
        0.23,
        0.29,
        0.35,
        0.46,
        0.52,
        0.6,
        0.63,
        0.65,
        0.72,
        0.78,
        0.84,
        0.88,
        0.93,
        0.98,
        0.99,
      ];
      hisData = [
        0.01,
        0.03,
        0.09,
        0.13,
        0.25,
        0.38,
        0.48,
        0.56,
        0.67,
        0.73,
        0.75,
        0.78,
        {
          value: 0.8,
          symbol: "emptyCircle",
          symbolSize: 4,
          itemStyle: { normal: { color: "#ff5757" } },
        },
        0.82,
        0.88,
        0.9,
        0.92,
        0.95,
        0.98,
        0.99,
      ];
    }
    // 路径配置
    require.config({
      paths: {
        echarts: "script/echart",
      },
    });
    //参数
    var option = {
      title: {
        text: "响应时延",
        x: "15",
        y: "15",
        textStyle: {
          color: "#8d8e8f",
        },
      },
      backgroundColor: "#3f4655",
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["当前", "历史"],
        textStyle: { color: "#949599" },
        padding: 25,
      },
      grid: {
        x: 40,
        y: 55,
        width: 740,
        height: 180,
        borderColor: "#4d5461",
      },
      toolbox: {
        show: false,
      },
      calculable: true,
      xAxis: [
        {
          type: "category",
          boundaryGap: true,
          data: nameData,
          axisLabel: {
            interval: 0,
            rotate: 62,
            textStyle: { color: "#949599" },
            formatter: function (value) {
              var backValue = "";
              backValue = value + "s";
              return backValue;
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            lineStyle: {
              color: "#949599",
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            textStyle: { color: "#949599" },
          },
          splitLine: {
            lineStyle: {
              color: "#4d5461",
            },
          },
        },
      ],
      series: [
        {
          name: "当前",
          type: "line",
          itemStyle: {
            normal: {
              color: "#3be1d7",
              lineStyle: {
                color: "#3be1d7",
              },
            },
          },
          data: nowData,
        },
        {
          name: "历史",
          type: "line",
          itemStyle: {
            normal: {
              color: "#2196f3",
              lineStyle: {
                color: "#2196f3",
              },
            },
          },
          data: hisData,
        },
      ],
    };
    //...使用
    require([
      "echarts",
      "echarts/chart/line", // ʹ配置所需图片类型插件
    ], function (ec) {
      //加载图表
      //图表渲染的容器对象
      var chartContainer = document.getElementById("callBackState");
      //加载图表
      var myChart = ec.init(chartContainer);
      myChart.setOption(option);
    });
  },
  //显示时延
  displayBackStateInt: function (thisid) {
    var nameData, nowData, hisData;
    if (thisid == 1001) {
      nameData = [
        0.1,
        0.2,
        0.3,
        0.4,
        0.5,
        0.6,
        0.7,
        0.8,
        0.9,
        1,
        1.2,
        1.4,
        1.6,
        1.8,
        2,
        2.5,
        3,
        3.5,
        4,
        4.5,
      ];
      nowData = [
        0.02,
        0.13,
        0.16,
        0.23,
        0.37,
        0.38,
        0.39,
        0.45,
        0.46,
        0.52,
        0.65,
        0.67,
        0.69,
        0.72,
        0.78,
        0.84,
        0.88,
        0.93,
        0.98,
        0.99,
      ];
      hisData = [
        0.05,
        0.1,
        0.19,
        0.22,
        0.25,
        0.28,
        {
          value: 0.48,
          symbol: "emptyCircle",
          symbolSize: 4,
          itemStyle: { normal: { color: "#ff5757" } },
        },
        0.56,
        0.67,
        0.73,
        0.85,
        0.88,
        0.89,
        0.92,
        0.92,
        0.94,
        0.96,
        0.97,
        0.99,
        0.99,
      ];
    } else {
      nameData = [
        0.1,
        0.2,
        0.3,
        0.4,
        0.5,
        0.6,
        0.7,
        0.8,
        0.9,
        1,
        1.2,
        1.4,
        1.6,
        1.8,
        2,
        2.5,
        3,
        3.5,
        4,
        4.5,
      ];
      nowData = [
        0.02,
        0.13,
        0.16,
        0.23,
        0.37,
        0.38,
        0.39,
        0.45,
        0.46,
        0.52,
        0.65,
        0.67,
        0.69,
        0.72,
        0.78,
        0.84,
        0.88,
        0.93,
        0.98,
        0.99,
      ];
      hisData = [
        0.05,
        0.1,
        0.19,
        0.22,
        0.25,
        0.28,
        0.48,
        {
          value: 0.56,
          symbol: "emptyCircle",
          symbolSize: 4,
          itemStyle: { normal: { color: "#ff5757" } },
        },
        0.67,
        0.73,
        0.85,
        0.88,
        0.89,
        0.92,
        0.92,
        0.94,
        0.96,
        0.97,
        0.99,
        0.99,
      ];
    }
    // 路径配置
    require.config({
      paths: {
        echarts: "script/echart",
      },
    });
    //参数
    var option = {
      title: {
        text: "显示时延",
        x: "15",
        y: "15",
        textStyle: {
          color: "#8d8e8f",
        },
      },
      backgroundColor: "#3f4655",
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["当前", "历史"],
        textStyle: { color: "#949599" },
        padding: 25,
      },
      grid: {
        x: 40,
        y: 55,
        width: 740,
        height: 180,
        borderColor: "#4d5461",
      },
      toolbox: {
        show: false,
      },
      calculable: true,
      xAxis: [
        {
          type: "category",
          boundaryGap: true,
          data: nameData,
          axisLabel: {
            interval: 0,
            rotate: 62,
            textStyle: { color: "#949599" },
            formatter: function (value) {
              var backValue = "";
              backValue = value + "s";
              return backValue;
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            lineStyle: {
              color: "#949599",
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            textStyle: { color: "#949599" },
          },
          splitLine: {
            lineStyle: {
              color: "#4d5461",
            },
          },
        },
      ],
      series: [
        {
          name: "当前",
          type: "line",
          itemStyle: {
            normal: {
              color: "#3be1d7",
              lineStyle: {
                color: "#3be1d7",
              },
            },
          },
          data: nowData,
        },
        {
          name: "历史",
          type: "line",
          itemStyle: {
            normal: {
              color: "#2196f3",
              lineStyle: {
                color: "#2196f3",
              },
            },
          },
          data: hisData,
        },
      ],
    };
    //...使用
    require([
      "echarts",
      "echarts/chart/line", // ʹ配置所需图片类型插件
    ], function (ec) {
      //加载图表
      //图表渲染的容器对象
      var chartContainer = document.getElementById("displayBackState");
      //加载图表
      var myChart = ec.init(chartContainer);
      myChart.setOption(option);
    });
  },
  /**
   * 用户钻取页加载
   * **/
  userGridLinkInt: function () {
    var scope = this;
    var urlData = conmon.getUrlData();
    var userName;
    if (urlData) {
      userName = urlData[1].split("=")[1];
      $("#mieiName").text(decodeURIComponent(userName) + "根源钻取页");
    }
    scope.selectMenu(); //选中导航
    scope.oneDayErrorUserInt(); //24小时异常用户数
    scope.oneDayErrorPerInt(); //24小时异常用户数比例
    scope.httpSourceStateInt(); //FTP成功率
    scope.callBackSourceInt(); //响应时延
    scope.displaySourceBackInt(); //显示时延
  },
  //24小时异常用户数
  oneDayErrorUserInt: function () {
    var timeData = conmon.getTimeData();
    var valueData = [
      673,
      529,
      945,
      1131,
      1303,
      1042,
      1275,
      585,
      1081,
      767,
      778,
      1284,
      1211,
      1297,
      963,
      957,
      722,
      645,
      1058,
      723,
      630,
      627,
      1498,
      2650,
    ];
    // 路径配置
    require.config({
      paths: {
        echarts: "script/echart",
      },
    });
    //参数
    var option = {
      title: {
        text: "24小时异常用户",
        x: "15",
        y: "15",
        textStyle: {
          color: "#8d8e8f",
        },
      },
      backgroundColor: "#3f4655",
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["异常用户数"],
        textStyle: { color: "#949599" },
        padding: 25,
      },
      grid: {
        x: 50,
        y: 55,
        width: 540,
        borderColor: "#4d5461",
      },
      toolbox: {
        show: false,
      },
      calculable: true,
      xAxis: [
        {
          type: "category",
          boundaryGap: true,
          data: timeData,
          axisLabel: {
            interval: 0,
            rotate: 62,
            textStyle: { color: "#949599" },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            lineStyle: {
              color: "#949599",
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            textStyle: { color: "#949599" },
          },
          splitLine: {
            lineStyle: {
              color: "#4d5461",
            },
          },
        },
      ],
      series: [
        {
          name: "异常用户数",
          type: "line",
          itemStyle: {
            normal: {
              color: "#59bad2",
              lineStyle: {
                color: "#59bad2",
              },
            },
          },
          data: valueData,
        },
      ],
    };
    //...使用
    require([
      "echarts",
      "echarts/chart/line", // ʹ配置所需图片类型插件
    ], function (ec) {
      //加载图表
      //图表渲染的容器对象
      var chartContainer = document.getElementById("oneDayErrorUser");
      //加载图表
      var myChart = ec.init(chartContainer);
      myChart.setOption(option);
    });
  },
  //24小时异常用户数比例
  oneDayErrorPerInt: function () {
    var timeData = conmon.getTimeData();
    var valueData = [
      23.0,
      26.02,
      21.51,
      27.9,
      28.28,
      21.91,
      29.23,
      28.3,
      27.05,
      21.27,
      25.97,
      26.27,
      24.94,
      21.14,
      21.48,
      21.88,
      27.47,
      29.79,
      23.57,
      22.43,
      22.43,
      21.38,
      20.61,
      61.38,
    ];
    // 路径配置
    require.config({
      paths: {
        echarts: "script/echart",
      },
    });
    //参数
    var option = {
      title: {
        text: "24小时异常用户比例",
        x: "15",
        y: "15",
        textStyle: {
          color: "#8d8e8f",
        },
      },
      backgroundColor: "#3f4655",
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["异常用户比例"],
        textStyle: { color: "#949599" },
        padding: 25,
      },
      grid: {
        x: 55,
        y: 55,
        width: 540,
        borderColor: "#4d5461",
      },
      toolbox: {
        show: false,
      },
      calculable: true,
      xAxis: [
        {
          type: "category",
          boundaryGap: true,
          data: timeData,
          axisLabel: {
            interval: 0,
            rotate: 62,
            textStyle: { color: "#949599" },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            lineStyle: {
              color: "#949599",
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            textStyle: { color: "#949599" },
            formatter: function (value) {
              var backValue = "";
              backValue = value.toFixed(2) + "%";
              return backValue;
            },
          },
          splitLine: {
            lineStyle: {
              color: "#4d5461",
            },
          },
        },
      ],
      series: [
        {
          name: "异常用户比例",
          type: "line",
          itemStyle: {
            normal: {
              color: "#59bad2",
              lineStyle: {
                color: "#59bad2",
              },
            },
          },
          data: valueData,
        },
      ],
    };
    //...使用
    require([
      "echarts",
      "echarts/chart/line", // ʹ配置所需图片类型插件
    ], function (ec) {
      //加载图表
      //图表渲染的容器对象
      var chartContainer = document.getElementById("oneDayErrorPer");
      //加载图表
      var myChart = ec.init(chartContainer);
      myChart.setOption(option);
    });
  },
  //fttp成功率
  httpSourceStateInt: function () {
    var nameData = [
      95,
      90,
      85,
      80,
      75,
      70,
      65,
      60,
      55,
      50,
      45,
      40,
      35,
      30,
      25,
      20,
      15,
      10,
      5,
      0,
    ];
    var nowData = [
      0.02,
      0.06,
      0.1,
      0.13,
      0.17,
      0.23,
      0.29,
      0.35,
      0.46,
      0.52,
      0.6,
      0.63,
      0.65,
      0.72,
      0.78,
      0.84,
      0.88,
      0.93,
      0.98,
      0.99,
    ];
    var hisData = [
      0.01,
      0.03,
      0.09,
      0.13,
      0.25,
      0.38,
      0.48,
      0.56,
      0.67,
      0.73,
      0.75,
      0.78,
      0.81,
      0.82,
      0.88,
      0.9,
      0.92,
      0.95,
      0.98,
      0.99,
    ];
    // 路径配置
    require.config({
      paths: {
        echarts: "script/echart",
      },
    });
    //参数
    var option = {
      title: {
        text: "HTTP成功率",
        x: "15",
        y: "15",
        textStyle: {
          color: "#8d8e8f",
        },
      },
      backgroundColor: "#3f4655",
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["当前", "历史"],
        textStyle: { color: "#949599" },
        padding: 25,
      },
      grid: {
        x: 40,
        y: 55,
        width: 540,
        height: 180,
        borderColor: "#4d5461",
      },
      toolbox: {
        show: false,
      },
      calculable: true,
      xAxis: [
        {
          type: "category",
          boundaryGap: true,
          data: nameData,
          axisLabel: {
            interval: 0,
            rotate: 62,
            textStyle: { color: "#949599" },
            formatter: function (value) {
              var backValue = "";
              backValue = parseInt(value) + "%";
              return backValue;
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            lineStyle: {
              color: "#949599",
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            textStyle: { color: "#949599" },
          },
          splitLine: {
            lineStyle: {
              color: "#4d5461",
            },
          },
        },
      ],
      series: [
        {
          name: "当前",
          type: "line",
          itemStyle: {
            normal: {
              color: "#59bad2",
              lineStyle: {
                color: "#59bad2",
              },
            },
          },
          data: nowData,
        },
        {
          name: "历史",
          type: "line",
          itemStyle: {
            normal: {
              color: "#2196f3",
              lineStyle: {
                color: "#2196f3",
              },
            },
          },
          data: hisData,
        },
      ],
    };
    //...使用
    require([
      "echarts",
      "echarts/chart/line", // ʹ配置所需图片类型插件
    ], function (ec) {
      //加载图表
      //图表渲染的容器对象
      var chartContainer = document.getElementById("httpSourceState");
      //加载图表
      var myChart = ec.init(chartContainer);
      myChart.setOption(option);
    });
  },
  //响应时延
  callBackSourceInt: function () {
    var nameData = [
      0.05,
      0.1,
      0.15,
      0.2,
      0.25,
      0.3,
      0.35,
      0.4,
      0.45,
      0.5,
      0.6,
      0.7,
      0.8,
      0.9,
      1,
      1.5,
      2,
      2.5,
      3,
      3.5,
    ];
    var nowData = [
      0.02,
      0.06,
      0.1,
      0.13,
      0.17,
      0.23,
      0.29,
      0.35,
      0.46,
      0.52,
      0.6,
      0.63,
      0.65,
      0.72,
      0.78,
      0.84,
      0.88,
      0.93,
      0.98,
      0.99,
    ];
    var hisData = [
      0.01,
      0.03,
      0.09,
      0.13,
      0.25,
      0.38,
      0.48,
      0.56,
      0.67,
      0.73,
      0.75,
      0.78,
      0.81,
      0.82,
      0.88,
      0.9,
      0.92,
      0.95,
      0.98,
      0.99,
    ];
    // 路径配置
    require.config({
      paths: {
        echarts: "script/echart",
      },
    });
    //参数
    var option = {
      title: {
        text: "响应时延",
        x: "15",
        y: "15",
        textStyle: {
          color: "#8d8e8f",
        },
      },
      backgroundColor: "#3f4655",
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["当前", "历史"],
        textStyle: { color: "#949599" },
        padding: 25,
      },
      grid: {
        x: 40,
        y: 55,
        width: 540,
        height: 180,
        borderColor: "#4d5461",
      },
      toolbox: {
        show: false,
      },
      calculable: true,
      xAxis: [
        {
          type: "category",
          boundaryGap: true,
          data: nameData,
          axisLabel: {
            interval: 0,
            rotate: 62,
            textStyle: { color: "#949599" },
            formatter: function (value) {
              var backValue = "";
              backValue = value + "s";
              return backValue;
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            lineStyle: {
              color: "#949599",
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            textStyle: { color: "#949599" },
          },
          splitLine: {
            lineStyle: {
              color: "#4d5461",
            },
          },
        },
      ],
      series: [
        {
          name: "当前",
          type: "line",
          itemStyle: {
            normal: {
              color: "#59bad2",
              lineStyle: {
                color: "#59bad2",
              },
            },
          },
          data: nowData,
        },
        {
          name: "历史",
          type: "line",
          itemStyle: {
            normal: {
              color: "#2196f3",
              lineStyle: {
                color: "#2196f3",
              },
            },
          },
          data: hisData,
        },
      ],
    };
    //...使用
    require([
      "echarts",
      "echarts/chart/line", // ʹ配置所需图片类型插件
    ], function (ec) {
      //加载图表
      //图表渲染的容器对象
      var chartContainer = document.getElementById("callBackSource");
      //加载图表
      var myChart = ec.init(chartContainer);
      myChart.setOption(option);
    });
  },
  //显示时延
  displaySourceBackInt: function () {
    var nameData = [
      0.1,
      0.2,
      0.3,
      0.4,
      0.5,
      0.6,
      0.7,
      0.8,
      0.9,
      1,
      1.2,
      1.4,
      1.6,
      1.8,
      2,
      2.5,
      3,
      3.5,
      4,
      4.5,
    ];
    var nowData = [
      0.02,
      0.13,
      0.16,
      0.23,
      0.37,
      0.38,
      0.39,
      0.45,
      0.46,
      0.52,
      0.65,
      0.67,
      0.69,
      0.72,
      0.78,
      0.84,
      0.88,
      0.93,
      0.98,
      0.99,
    ];
    var hisData = [
      0.05,
      0.1,
      0.19,
      0.22,
      0.25,
      0.28,
      0.48,
      0.56,
      0.67,
      0.73,
      0.85,
      0.88,
      0.89,
      0.92,
      0.92,
      0.94,
      0.96,
      0.97,
      0.99,
      0.99,
    ];
    // 路径配置
    require.config({
      paths: {
        echarts: "script/echart",
      },
    });
    //参数
    var option = {
      title: {
        text: "显示时延",
        x: "15",
        y: "15",
        textStyle: {
          color: "#8d8e8f",
        },
      },
      backgroundColor: "#3f4655",
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["当前", "历史"],
        textStyle: { color: "#949599" },
        padding: 25,
      },
      grid: {
        x: 40,
        y: 55,
        width: 540,
        height: 180,
        borderColor: "#4d5461",
      },
      toolbox: {
        show: false,
      },
      calculable: true,
      xAxis: [
        {
          type: "category",
          boundaryGap: true,
          data: nameData,
          axisLabel: {
            interval: 0,
            rotate: 62,
            textStyle: { color: "#949599" },
            formatter: function (value) {
              var backValue = "";
              backValue = value + "s";
              return backValue;
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            lineStyle: {
              color: "#949599",
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            textStyle: { color: "#949599" },
          },
          splitLine: {
            lineStyle: {
              color: "#4d5461",
            },
          },
        },
      ],
      series: [
        {
          name: "当前",
          type: "line",
          itemStyle: {
            normal: {
              color: "#59bad2",
              lineStyle: {
                color: "#59bad2",
              },
            },
          },
          data: nowData,
        },
        {
          name: "历史",
          type: "line",
          itemStyle: {
            normal: {
              color: "#2196f3",
              lineStyle: {
                color: "#2196f3",
              },
            },
          },
          data: hisData,
        },
      ],
    };
    //...使用
    require([
      "echarts",
      "echarts/chart/line", // ʹ配置所需图片类型插件
    ], function (ec) {
      //加载图表
      //图表渲染的容器对象
      var chartContainer = document.getElementById("displaySourceBack");
      //加载图表
      var myChart = ec.init(chartContainer);
      myChart.setOption(option);
    });
  },
};
