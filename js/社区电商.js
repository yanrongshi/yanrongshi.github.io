
var myChart = echarts.init(document.getElementById('amiddboxtbott1'));

var sqds_category = ['风速传感器', '倾角仪','支模重力传感器',
'塔吊重力传感器','高度传感器','幅度传感器','位移传感器'];

var data = 
    [
        [104, 77, 170909, '风速传感器', '2021年3月'],
        [163, 77.4, 24400, '倾角仪', '2021年3月'],
        [116, 68, 1605773, '支模重力传感器', '2021年3月'],
        [170, 74.7, 100802, '塔吊重力传感器', '2021年3月'],
        [199, 75, 498050, '高度传感器', '2021年3月'],
        [276, 77.1, 569499, '幅度传感器', '2021年3月'],
        [176, 75.4, 789237, '位移传感器', '2021年3月'],
      
    ]
;

option = {
    backgroundColor: 'rgba(4, 2, 77, 0.3)',
    grid: {
        left: 40,
        right: 50,
        top: 30,
        bottom: 25,
    },
    // title: {
    //     top: 5,
    //     left: 20,
    //     textStyle: {
    //         fontSize: 10,
    //         color: 'rgba(255,255,255,.6)'
    //     },
    //     text: '环比类型：日环比'
    // },

    xAxis: {
        name: '异常\n数量',
        axisLine: {
            lineStyle: {
                color: 'rgba(255,255,255,.2)'
            }
        },
        splitLine: {
            lineStyle: {
                color: 'rgba(255,255,255,.1)'
            }
        },
        axisLabel: {
            color: "rgba(255,255,255,.7)"
        }
    },
    yAxis: {
        name: '传感器数量',
        axisLine: {
            lineStyle: {
                color: 'rgba(255,255,255,.2)'
            }
        },
        splitLine: {
            lineStyle: {
                color: 'rgba(255,255,255,.1)'
            }
        },
        axisLabel: {
            color: "rgba(255,255,255,.7)"
        },
        scale: true
    },
    visualMap: [
        {
            show: false,
            dimension: 3,
            categories: sqds_category,
            calculable: true,
            precision: 0,
            textGap: 30,
            textStyle: {
                color: '#ccc'
            },
            inRange: {
                // color: ['#121122', 'rgba(3,4,5,0.4)', 'red'],
                color: (function () {
                    var colors = ['#bcd3bb', '#e88f70', '#edc1a5', '#9dc5c8', '#e1e8c8', '#7b7c68', '#e5b5b5', '#f0b489', '#928ea8', '#bda29a'];
                    return colors.concat(colors);
                })()
            }
        }
    ],
    series: [{
        name: '2021年3月',
        data: data,
        type: 'scatter',
        symbolSize: function(data) {
            // console.info(Math.sqrt(data[2]) / 5e1);
            return Math.sqrt(data[2]) / 2e1;
        },
        label: {
            show: true,
            position: 'right',
            formatter: function(param){
                if (Math.sqrt(param.data[2]) / 3e1 > 10) {
                    return param.data[3];
                } else {
                    return '';
                }
            },
            emphasis: {
                show: true,
                formatter: function(param) {
                    return param.data[3];
                },
                position: 'right'
            }
        },
        itemStyle: {
            opacity: 0.8,
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
        }
    }]
};
myChart.setOption(option);


