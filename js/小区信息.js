
var myChart = echarts.init(document.getElementById('arightboxbott'));

option = {
    color: [{
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
            offset: 0,
            color: '#2C8179' // 0% 处的颜色
        }, {
            offset: 1,
            color: '#18C4B9' // 100% 处的颜色
        }],
        global: false // 缺省为 false
    }, {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
            offset: 0,
            color: '#ACBF95' // 0% 处的颜色
        }, {
            offset: 1,
            color: '#7CBF2B' // 100% 处的颜色
        }],
        global: false // 缺省为 false
    }, {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
            offset: 0,
            color: '#508097' // 0% 处的颜色
        }, {
            offset: 1,
            color: '#1C3979' // 100% 处的颜色
        }],
        global: false // 缺省为 false
    }, {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
            offset: 0,
            color: '#4d72d9' // 0% 处的颜色
        }, {
            offset: 1,
            color: '#75489F' // 100% 处的颜色
        }],
        global: false // 缺省为 false
    }],
    title: [{
        top: 125,
        left: 80,
        textStyle: {
            fontSize: 18,
            color: 'rgba(255,255,255,.6)'
        },
        text: '设备\n预警'
    },{
        top: 125,
        right: 80,
        textStyle: {
            fontSize: 18,
            color: 'rgba(255,255,255,.6)'
        },
        text: '行为\n隐患'
    }],
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
        left: 10,
        textStyle: {
            fontSize: 10,
            color: 'rgba(255,255,255,.7)'
        },
        data: ['塔吊', '高支模', '动火', '安全帽']
    },
    grid: {
        
        containLabel: true
    },
    series: [{
        name: '访问来源',
        type: 'pie',
        radius: ['45%', '65%'],
        center: ['75%', '55%'],
        avoidLabelOverlap: false,
        label: {
            // show: false,
            position: 'inner',
            formatter: '{b} {c} 起'
        },
        emphasis: {
            label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
            }
        },
        labelLine: {
            show: false
        },
        data: [
            { value: 2335, name: '塔吊' },
            { value: 810, name: '高支模' },
        ]
    }, {
        name: '访问来源',
        type: 'pie',
        radius: ['45%', '65%'],
        center: ['25%', '55%'],
        avoidLabelOverlap: false,
        label: {
            // show: false,
            position: 'inner',
            formatter: '安全帽 9 起'
        },
        emphasis: {
            label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
            }
        },
        labelLine: {
            show: false
        },
        data: [
            { value: 22, name: '动火' },
            { value: 9, name: '安全帽' }
        ]
    }]
};

myChart.setOption(option);