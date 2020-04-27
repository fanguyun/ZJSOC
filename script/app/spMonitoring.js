/**
 * Created by Mrfan-123 on 2015/12/21.
 */
var spMonitoring = {
  init: function () {
    var scope = this;
    scope.selectMenu(); //选中导航
    scope.spBarInt(); //sp监控首页的饼状图
    scope.spTrendInt(); //24小时告警趋势图
    scope.spTableListInt();
  },
  selectMenu: function () {
    var menu = $("#menu");
    menu.find("li").children("a").removeClass("active");
    menu.find("li").eq(1).children("a").addClass("active");
  },
  //SP告警根因钻取
  spGridLinkInt: function () {
    var spTbody = $("#spTbody");
    var spBlock = $(".spBlock");
    spTbody.children("tr").each(function () {
      $(this).click(function () {
        window.location.href =
          window.location.origin +
          window.location.pathname +
          "#/spGridlink?trHost=" +
          encodeURIComponent($(this).attr("trHost"));
      });
    });
    spBlock.each(function () {
      $(this).click(function () {
        window.location.href =
          window.location.origin +
          window.location.pathname +
          "#/spGridlink?trHost=" +
          encodeURIComponent($(this).attr("trHost"));
      });
    });
  },
  //sptable
  spTableListInt: function () {
    var scope = this;
    var url = "data/sp/sptablelist.json";
    $.ajax({
      type: "GET",
      url: url,
      dataType: "json",
      contentType: "application/json",
      success: function (data) {
        if (data) {
          var spTbody = $("#spTbody");
          var spTableHtml = "";
          for (var si = 0; si < data.length; si++) {
            var gaojingClass = "",
              textClass = "";
            if (data[si].arallev == 1) {
              gaojingClass = "eTdIcon";
              textClass = "eTd";
            } else {
              gaojingClass = "wTdIcon";
            }
            spTableHtml +=
              "<tr trHost=" +
              data[si].host +
              "><td>" +
              data[si].id +
              "</td><td>" +
              data[si].host +
              "</td><td><span class=" +
              textClass +
              ">" +
              data[si].http +
              "</span></td><td><span class=" +
              gaojingClass +
              "></span></td><td>" +
              data[si].stratTime +
              "</td><td>" +
              data[si].shichan +
              "</td><td>" +
              data[si].unum +
              "</td><td>" +
              data[si].liulian +
              "</td><td>" +
              data[si].ywulian +
              "</td><td>" +
              data[si].errortime +
              "</td><td><span class='analButton'>分析</span></td></tr>";
          }
          $("#cellTotalPage").text("共" + data.length + "条");
          spTbody.html(spTableHtml);
          scope.spGridLinkInt(); //SP告警根因钻取
        }
      },
      error: function () {
        console.log("error-sptable");
      },
    });
  },
  //sp监控首页的饼状图
  spBarInt: function () {
    // 路径配置
    require.config({
      paths: {
        echarts: "script/echart",
      },
    });
    $("#handRefresh").click(function () {
      window.location.reload();
    });
    var url = "data/sp/sptotal.json";
    $.ajax({
      type: "GET",
      url: url,
      dataType: "json",
      contentType: "application/json",
      success: function (data) {
        $("#spmNum").text(data.spTotal);
        $("#spsNum").text(data.spError);
        $("#spnNum").text(data.spWarn);
        $("#refreshDate").text(new Date().toLocaleString());
        //sp监控首页的饼状图
        var option = {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {d}%",
          },
          legend: {
            show: false,
            orient: "horizontal ",
            x: "right",
            y: "top",
            itemGrap: "10",
            data: [
              {
                name: "重点监控SP" + data.zdsp + "个",
                textStyle: { color: "#86bb6e" },
              },
              {
                name: "普通告警SP" + data.ptsp + "个",
                textStyle: { color: "#f68f52" },
              },
              {
                name: "严重告警SP" + data.ptsp + "个",
                textStyle: { color: "#ff5757" },
              },
            ],
          },
          series: [
            {
              name: "告警统计",
              type: "pie",
              radius: ["40%", "60%"],
              center: ["45%", "40%"],
              data: [
                {
                  value: data.zdsp,
                  name: "重点监控SP" + data.zdsp + "个",
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
                  value: data.ptsp,
                  name: "普通告警SP" + data.ptsp + "个",
                  itemStyle: { normal: { color: "#f68f52" } },
                },
                {
                  value: data.yzsp,
                  name: "严重告警SP" + data.ptsp + "个",
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
        ], //加载图表
        function (ec) {
          //图表渲染的容器对象
          var chartContainer = document.getElementById("spMoniLeft");
          //加载图表
          var myChart = ec.init(chartContainer);
          myChart.setOption(option);
        });
      },
      error: function () {
        console.log("error-小区监控总览");
      },
    });
  },
  //24小时告警趋势图
  spTrendInt: function () {
    // 路径配置
    require.config({
      paths: {
        echarts: "script/echart",
      },
    });
    var url = "data/sp/24trend.json";
    var timeData = conmon.getTimeData();
    var nameData = [];
    var valueData = [];
    $.ajax({
      type: "GET",
      url: url,
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
              text: "严重告警24小时趋势图",
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
              data: ["严重告警"],
            },
            grid: {
              x: 15,
              y: 36,
              x2: 20,
              y2: 27,
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
                name: "严重告警",
                type: "line",
                stack: "总量",
                data: valueData,
                itemStyle: {
                  normal: {
                    color: "#ff5757",
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
          ], //加载图表
          function (ec) {
            //图表渲染的容器对象
            var chartContainer = document.getElementById("trendBlock");
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
  /*
   * SP告警根因加载
   * */
  spGridShowInt: function () {
    var scope = this;
    var urlData = conmon.getUrlData();
    var hostName;
    if (urlData) {
      hostName = urlData[1].split("=")[1];
      $("#miaobaosp").text(decodeURIComponent(hostName) + " >");
      $("#thisSPhost").text(decodeURIComponent(hostName));
    }
    scope.selectMenu(); //选中导航
    scope.spYichangListInt();
    scope.qushiLefttabInt();
  },
  //异常点
  spYichangListInt: function () {
    var scope = this;
    var leftData = [
      { time: "2015/12/1 12:30:00", https: "65.23%", id: 1000 },
      { time: "2015/12/1 12:45:00", https: "71.55%", id: 1001 },
      { time: "2015/12/1 13:00:00", https: "63.27%", id: 1002 },
    ];
    var splistTbody = $("#splistTbody");
    var spHtml = "";
    for (var i = 0; i < leftData.length; i++) {
      spHtml +=
        "<tr id=" +
        leftData[i].id +
        "><td class='tdPadding'>" +
        leftData[i].time +
        "</td><td><span class='redTd'>" +
        leftData[i].https +
        "</span></td></tr>";
    }
    splistTbody.html(spHtml);
    splistTbody.children("tr").each(function () {
      $(this).click(function () {
        var thisID = $(this).attr("id");
        splistTbody.children("tr").removeClass("spActive");
        $(this).addClass("spActive");
        scope.rightYclist(thisID);
      });
    });
    splistTbody.children("tr").eq(0).trigger("click");
  },
  //右侧异常点详细列表
  rightYclist: function (id) {
    var listData;
    if (id == 1000) {
      listData = [
        {
          weidu: "PGW_IP 10.135.46.79",
          hissu: "96.23%",
          nowsu: "50.45%",
          yixdu: "63.32%",
        },
        {
          weidu: "PGW_IP 10.135.46.80",
          hissu: "91.23%",
          nowsu: "75.87%",
          yixdu: "13.12%",
        },
        {
          weidu: "APN CMHK",
          hissu: "96.76%",
          nowsu: "52.21%",
          yixdu: "83.25%",
        },
        {
          weidu: "SP_IP 132.123.56.68",
          hissu: "95.67%",
          nowsu: "32.62%",
          yixdu: "45.76%",
        },
        {
          weidu: "SP_IP 132.123.56.69",
          hissu: "89.88%",
          nowsu: "69.87%",
          yixdu: "28.99%",
        },
      ];
    } else if (id == 1001) {
      listData = [
        {
          weidu: "SP_IP 132.123.56.68",
          hissu: "95.67%",
          nowsu: "32.62%",
          yixdu: "45.76%",
        },
        {
          weidu: "SP_IP 132.123.56.69",
          hissu: "89.88%",
          nowsu: "69.87%",
          yixdu: "28.99%",
        },
        {
          weidu: "PGW_IP 10.135.46.79",
          hissu: "96.23%",
          nowsu: "50.45%",
          yixdu: "63.32%",
        },
        {
          weidu: "PGW_IP 10.135.46.80",
          hissu: "91.23%",
          nowsu: "75.87%",
          yixdu: "13.12%",
        },
        {
          weidu: "APN CMHK",
          hissu: "96.76%",
          nowsu: "52.21%",
          yixdu: "83.25%",
        },
      ];
    } else {
      listData = [
        {
          weidu: "APN CMHK",
          hissu: "96.76%",
          nowsu: "52.21%",
          yixdu: "83.25%",
        },
        {
          weidu: "SP_IP 132.123.56.68",
          hissu: "95.67%",
          nowsu: "32.62%",
          yixdu: "45.76%",
        },
        {
          weidu: "PGW_IP 10.135.46.79",
          hissu: "96.23%",
          nowsu: "50.45%",
          yixdu: "63.32%",
        },
        {
          weidu: "PGW_IP 10.135.46.80",
          hissu: "91.23%",
          nowsu: "75.87%",
          yixdu: "13.12%",
        },
        {
          weidu: "SP_IP 132.123.56.69",
          hissu: "89.88%",
          nowsu: "69.87%",
          yixdu: "28.99%",
        },
      ];
    }
    var fanistBody = $("#fanistBody");
    var thisHtml = "";
    for (var i = 0; i < listData.length; i++) {
      thisHtml +=
        "<tr><td class='tdPadding'>" +
        listData[i].weidu +
        "</td><td><span class='orangeTd'>" +
        listData[i].hissu +
        "</span></td><td>" +
        listData[i].nowsu +
        "</td><td>" +
        listData[i].yixdu +
        "</td></tr>";
    }
    fanistBody.html(thisHtml);
  },
  //趋势图TabList
  qushiLefttabInt: function () {
    var scope = this;
    var serReasonHead = $("#serReasonHead");
    var listData = [];
    serReasonHead.children("div").each(function () {
      $(this).click(function () {
        var thisID = $(this).attr("id");
        serReasonHead.children("div").removeClass("serActive");
        $(this).addClass("serActive");
        scope.qushiTabHtmlInt(thisID);
        scope.spReasonMInt(thisID); //WEB延时响应
      });
    });
    serReasonHead.children("div").eq(0).trigger("click");
    scope.spReasonMInt(serReasonHead.children("div").eq(0).attr("id")); //WEB延时响应
  },
  //htmljiazai
  qushiTabHtmlInt: function (thisID) {
    var scope = this;
    var nametype = $("#nametype");
    if (thisID == "pwgBlock") {
      nametype.text("IP");
      listData = [
        {
          ip: "10.135.46.79",
          hissu: "96.23%",
          nowsu: "50.45%",
          yiadu: "63.32%",
        },
        {
          ip: "10.135.46.80",
          hissu: "91.23%",
          nowsu: "75.87%",
          yiadu: "13.12%",
        },
      ];
    } else if (thisID == "apnBlock") {
      nametype.text("APN");
      listData = [
        { ip: "CMHK", hissu: "96.76%", nowsu: "52.21%", yiadu: "83.25%" },
        { ip: "CMDM", hissu: "97.11%", nowsu: "75.22%", yiadu: "1.34%" },
      ];
    } else {
      nametype.text("IP");
      listData = [
        {
          ip: "10.135.46.79",
          hissu: "96.23%",
          nowsu: "50.45%",
          yiadu: "63.32%",
        },
        {
          ip: "10.135.46.80",
          hissu: "98.55%",
          nowsu: "72.02%",
          yiadu: "2.71%",
        },
      ];
    }
    var spTabletbody = $("#spTabletbody");
    var thisHtml = "";
    for (var i = 0; i < listData.length; i++) {
      thisHtml +=
        "<tr><td>" +
        listData[i].ip +
        "</td><td>" +
        listData[i].hissu +
        "</td><td class='red'>" +
        listData[i].nowsu +
        "</td><td>" +
        listData[i].yiadu +
        "</td></tr>";
    }
    spTabletbody.html(thisHtml);
    spTabletbody.children("tr").each(function () {
      $(this).click(function () {
        var index = $(this).index();
        spTabletbody.children("tr").removeClass("spActive");
        $(this).addClass("spActive");
        scope.webAboutTableInt(index, thisID);
      });
    });
    spTabletbody.children("tr").eq(0).trigger("click");
  },
  //WEB延时响应
  spReasonMInt: function (thisID) {
    var newData = [];
    if (thisID == "pwgBlock") {
      newData = [
        97.04,
        93,
        92,
        88,
        89,
        90,
        92,
        94,
        96,
        98,
        98.52,
        98.49,
        98.48,
        95.39,
        97.15,
        93.0,
        89.78,
        80.39,
        70.59,
        60.36,
      ];
    } else if (thisID == "apnBlock") {
      newData = [
        97.04,
        93,
        92,
        88,
        89,
        90,
        92,
        94,
        96,
        98,
        98.52,
        98.49,
        98.48,
        95.39,
        97.15,
        93.0,
        89.78,
        80.39,
        70.59,
        60.36,
      ];
    } else {
      newData = [
        97.04,
        93,
        92,
        88,
        89,
        90,
        92,
        94,
        96,
        98,
        98.52,
        98.49,
        98.48,
        95.39,
        97.15,
        93.0,
        89.78,
        80.39,
        70.59,
        60.36,
      ];
    }
    // 路径配置
    require.config({
      paths: {
        echarts: "script/echart",
      },
    });
    var option = {
      backgroundColor: "#3c5592",
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["事物级HTTP成功率(%)", "阈值"],
        textStyle: { color: "#949599" },
      },
      grid: {
        x: 80,
        y: 30,
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
          data: [
            "2015/11/25 0:00",
            "2015/11/25 0:15",
            "2015/11/25 0:30",
            "2015/11/25 0:45",
            "2015/11/25 1:00",
            "2015/11/25 1:15",
            "2015/11/25 1:30",
            "2015/11/25 1:45",
            "2015/11/25 2:00",
            "2015/11/25 2:15",
            "2015/11/25 2:30",
            "2015/11/25 2:45",
            "2015/11/25 3:00",
            "2015/11/25 3:15",
            "2015/11/25 3:30",
            "2015/11/25 3:45",
            "2015/11/25 4:00",
            "2015/11/25 4:15",
            "2015/11/25 4:30",
            "2015/11/25 4:15",
          ],
          axisLabel: {
            interval: 0,
            rotate: 62,
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
            lineStyle: {
              color: "#4d5461",
            },
          },
        },
      ],
      series: [
        {
          name: "事物级HTTP成功率(%)",
          type: "line",
          itemStyle: {
            normal: {
              color: "#5bc2dd",
              lineStyle: {
                color: "#5bc2dd",
              },
            },
          },
          data: newData,
        },
        {
          name: "阈值",
          type: "line",
          itemStyle: {
            normal: {
              color: "#d644df",
              lineStyle: {
                color: "#d644df",
                width: 1,
                type: "dashed",
              },
            },
          },
          data: [
            98.08,
            98.52,
            98.49,
            90.88,
            97.37,
            93.0,
            96.78,
            96.39,
            90.59,
            93.36,
            97.04,
            96.89,
            96.29,
            86.18,
            84.82,
            78.72,
            70.42,
            64.63,
            63,
            59,
          ],
        },
      ],
    };
    //...使用
    require([
      "echarts",
      "echarts/chart/line", // ʹ配置所需图片类型插件
    ], //加载图表
    function (ec) {
      //图表渲染的容器对象
      var chartContainer = document.getElementById("spRCanvas1");
      //加载图表
      var myChart = ec.init(chartContainer);
      myChart.setOption(option);
    });
  },
  webAboutTableInt: function (index, thisID) {
    var newData = [],
      nameVlue;
    if (index == 0) {
      newData = [
        97.04,
        93,
        92,
        88,
        89,
        90,
        92,
        94,
        96,
        98,
        98.52,
        98.49,
        98.48,
        95.39,
        97.15,
        93.0,
        89.78,
        80.39,
        70.59,
        60.36,
      ];
    } else {
      newData = [
        96,
        98,
        98.52,
        98.49,
        98.48,
        95.39,
        97.15,
        97.04,
        93,
        92,
        88,
        89,
        90,
        92,
        94,
        93.0,
        89.78,
        80.39,
        70.59,
        60.36,
      ];
    }
    if (thisID == "pwgBlock") {
      nameVlue = "PGW_IP";
    } else if (thisID == "apnBlock") {
      nameVlue = "APN";
    } else {
      nameVlue = "SP_IP";
    }
    // 路径配置
    require.config({
      paths: {
        echarts: "script/echart",
      },
    });
    var option = {
      backgroundColor: "#3f4655",
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: [nameVlue],
        textStyle: { color: "#949599" },
      },
      grid: {
        x: 80,
        y: 30,
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
          data: [
            "2015/11/25 0:00",
            "2015/11/25 0:15",
            "2015/11/25 0:30",
            "2015/11/25 0:45",
            "2015/11/25 1:00",
            "2015/11/25 1:15",
            "2015/11/25 1:30",
            "2015/11/25 1:45",
            "2015/11/25 2:00",
            "2015/11/25 2:15",
            "2015/11/25 2:30",
            "2015/11/25 2:45",
            "2015/11/25 3:00",
            "2015/11/25 3:15",
            "2015/11/25 3:30",
            "2015/11/25 3:45",
            "2015/11/25 4:00",
            "2015/11/25 4:15",
            "2015/11/25 4:30",
            "2015/11/25 4:15",
          ],
          axisLabel: {
            interval: 0,
            rotate: 62,
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
            lineStyle: {
              color: "#4d5461",
            },
          },
        },
      ],
      series: [
        {
          name: nameVlue,
          type: "line",
          itemStyle: {
            normal: {
              color: "#5bc2dd",
              lineStyle: {
                color: "#5bc2dd",
              },
            },
          },
          data: newData,
        },
      ],
    };
    //...使用
    require([
      "echarts",
      "echarts/chart/line", // ʹ配置所需图片类型插件
    ], //加载图表
    function (ec) {
      //图表渲染的容器对象
      var chartContainer = document.getElementById("spRCanvas2");
      //加载图表
      var myChart = ec.init(chartContainer);
      myChart.setOption(option);
    });
  },
};
