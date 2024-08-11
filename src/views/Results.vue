<template>
  <div>
    止损小于0时代表做多，止损大于0时代表做空
    <el-button :loading="loading" @click="createData">开始计算数据</el-button>
    <el-button :loading="loading" @click="getJSON">直接获取数据</el-button>
    <el-form :inline="true">
      <!-- <el-form-item label="年份过滤">
        <el-input type="number" v-model="year"></el-input>
      </el-form-item> -->
      <el-form-item label="昨日涨幅">
        {{ typeof(lastDay)  }}
        <el-input-number type="number" :controls="false" v-model="lastDay"></el-input-number>
      </el-form-item>
      <el-form-item label="跳空幅度">
        <el-input-number type="number" :controls="false" v-model="jmp"></el-input-number>
      </el-form-item>
      <el-form-item label="止损阈值（±0.03代表不止损">
        <el-input-number type="number" :controls="false" v-model="stop"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="filterPoint()">筛选数据</el-button>
      </el-form-item>
    </el-form>
    <div id="plot"></div>
    <resDialog ref="resDialog" :data="data"/>
  </div>
</template>

<script>
import dayjs from 'dayjs';
const XLSX = require('xlsx');
import { getDaysBetween, numFilter } from '@/utils/index.js';
import axios from 'axios';
import Plotly from 'plotly.js-dist'
// const Plotly = require('plotly.js-dist');
import resDialog from './components/Result.vue'

export default {
  name: 'TestResults',

  components: {
    resDialog
  },

  data() {
    return {
      loading: false,
      data: [],
      x: [],
      y: [],
      z: [],
      results: [],
      showResults: [],
      texts: [],
      colors: [],
      lastDay: 0.01,
      jmp: 0.01,
      stop: 0.01
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    getJSON() {
      // axios.get('./json/昨日开盘计算/无假期数据0.005.json').then(res => {
        // axios.get('./json/前日收盘计算/无假期数据前日为标准.json').then(res => {
        axios.get('./json/前日收盘计算/无假期±5.json').then(res => {
        console.log(res.data)
        this.results = res.data
        this.showResults = this.results
        // .map(item => {
        //   if (
        //     item.once < 1 
        //     || item.times < 5 
        //     || item.stop != -1
        //   ) {
        //     return {
        //       lastDay: 0,
        //       jmp: 0,
        //       stop: 0
        //     }
        //   } else {
        //     return item
        //   }
        // })
        this.createPlotly()
      })
    },
    filterPoint() {
      console.log(this.results)
      this.showResults = this.results.filter(item => {
        // return item.lastDay === Number(this.lastDay) && item.jmp === Number(this.jmp) && item.stop === Number(this.stop)
        return (this.lastDay == null || item.lastDay === Number(this.lastDay)) &&
         (this.jmp == null || item.jmp === Number(this.jmp)) &&
         (this.stop == null || item.stop === Number(this.stop))
      })
      console.log(this.showResults)
      this.createPlotly()
    },
    getData() {
      axios.get('/10All.csv').then(res => {
        const data = res.data
        const wb = XLSX.read(data, {type: 'binary',cellDates: true});
        this.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        // this.createData()
      })
    },
    createData() {
      this.loading = true
      // 生成所有可能的x, y, z组合
      ////
      for (let i = -10; i <= 9; i++) {
          for (let j = -10; j <= 9; j++) {
              for (let k = -3; k <= 3; k++) {
      // for (let i = -1; i <= 1; i++) {
      //     for (let j = -1; j <= 1; j++) {
      //         for (let k = -1; k <= 1; k++) {
                setTimeout(() => {
                  if (k === 0) return
                  this.x.push(i*0.005);
                  this.y.push(j*0.005);
                  this.z.push(k*0.01);

                  this.getHighJmp(i*0.005, j*0.005, k*0.01)
                ////
                }, 0);
                // }, 10000 * (i+5) + 1000 * (j+5) + 100 * (k+5));
                // }, 1000 * (i+1) + 400 * (j+1) + 100 * (k+1));
              }
          }
      }
    },
    getHighJmp(lastDay, jmp, stop) {
      console.log(lastDay, jmp, stop)
      let profit = 1
      let times = 0
      this.data.forEach((item, index) => {
        if (index === this.data.length - 1) {
          let obj = {
            lastDay,
            jmp,
            stop,
            profit,
            times,
            once: Math.pow(profit, 1/times),
            // list: list
          }

          if (stop === 0) {
            this.texts.push('')
            this.colors.push('#000000')
            return
          }
          this.texts.push(`${lastDay}${jmp}${stop}
          ，${Math.pow(profit, 1/times)}`)

          switch (true) {
            case Math.pow(profit, 1/times) > 1.1:
              this.colors.push('#F00')
              obj.color = '#F00'
              break;
            case Math.pow(profit, 1/times) > 1.07:
              this.colors.push('#FF00E0')
              obj.color = '#FF00E0'
              break;
            case Math.pow(profit, 1/times) > 1.05:
              this.colors.push('#B400FF')
              obj.color = '#B400FF'
              break;
            case Math.pow(profit, 1/times) > 1.03:
              this.colors.push('#3300FF')
              obj.color = '#3300FF'
              break;
            case Math.pow(profit, 1/times) > 1.02:
              this.colors.push('#00A1FF')
              obj.color = '#00A1FF'
              break;
            case Math.pow(profit, 1/times) > 1.01:
              this.colors.push('#00FFFF')
              obj.color = '#00FFFF'
              break;
            case Math.pow(profit, 1/times) < 1:
              this.colors.push('#00FF00')
              obj.color = '#00FF00'
              break;
            default:
              this.colors.push('#FFFF00')
              obj.color = '#FFFF00'
              break;
          }

          this.results.push(obj)

          ////
          // if (lastDay===0.04 && jmp===0.04 && stop===0.02) {
            if (lastDay===0.045 && jmp===0.045 && stop===1) {
          // if (lastDay===0.01 && jmp===0.01 && stop===0.01) {
            alert('数据计算完成')
            console.log('results', JSON.stringify(this.results))
            this.loading = false
            this.createPlotly()
          }
        }
        if (index < 2) return // 不写报错  因为需要index-1
        if (
          item.thscode !== this.data[index - 2].thscode || // 保证不会是标的切换
          // dayjs(item.time).format('YYYY-MM-DD') == '2024-02-18' || // 过年回来的一天
          getDaysBetween(this.data[index - 1].time, item.time) > 2 || // 中间没有放假

          item.openInterest < 5000 || // 不活跃 // 国际铜成交量不足10000
          item.openInterest > this.data[index - 1].openInterest * 1.3 // 持仓量大幅增加说明是主力合约换月
        ) return
        // if (this.year && dayjs(item.time).format('YYYY') != this.year 
          // || new Date(item.time) < new Date('2015-7-1')
        // ) return // 限制年份
        // if (this.year && dayjs(item.time).format('YYYY') < 2020 || dayjs(item.time).format('YYYY')>2022) return // 限制年份
        // if (item.thscode !== 'I9999') return // 限制标的

        if (stop == 0.03) stop = 1
        if (stop == -0.03) stop = -1
        
        if (
          item.open>this.data[index - 1].close * (1 + jmp*1) // 跳空高开jmp的幅度
          && item.open<this.data[index - 1].close * (1 + jmp*1 + 0.005)
          && this.data[index - 1].close > this.data[index - 2].close *(1 + lastDay*1)
          && this.data[index - 1].close < this.data[index - 2].close *(1 + lastDay*1 + 0.005)
        ) {
          
          if (stop < 0) {
            profit *= 1 + (item.low/item.open - 1 <= stop ? 5*stop : (item.close/item.open - 1)*5)
            times += 1
          } else {
            profit *= 1 - (item.high/item.open - 1 > stop ? 5*stop : (item.close/item.open - 1)*5)
            times += 1
          }
        }

      })
    },
    createPlotly() {
      // 创建3D散点图
      const trace = {
            // x: this.x,
            // y: this.y,
            // z: this.z,
            x: this.showResults.map(ele => ele.lastDay),
            y: this.showResults.map(ele => ele.jmp),
            z: this.showResults.map(ele => {
              if (ele.stop === 1) {
                ele.stop = 0.03
              } else if (ele.stop === -1) {
                ele.stop = -0.03
              }
              return ele.stop
            }),
            mode: 'markers',
            marker: {
                size: 6,
                // color: this.colors,
                color: this.showResults.map(ele => ele.color),
                // colorscale: 'Viridis',
                // showscale: true
            },
            result: this.showResults,
            text: this.showResults,
            type: 'scatter3d'
        };

        // 定义穿过原点 (0,0,0) 的三根线
        const traceXLine = {
            x: [0, 0.02],
            y: [0, 0],
            z: [0, 0],
            mode: 'lines',
            line: {
                color: 'rgb(0, 0, 255)', // 蓝色
                width: 5
            },
            type: 'scatter3d'
        };

        const traceYLine = {
            x: [0, 0],
            y: [0, 0.02],
            z: [0, 0],
            mode: 'lines',
            line: {
                color: 'rgb(0, 255, 0)', // 绿色
                width: 5
            },
            type: 'scatter3d'
        };

        const traceZLine = {
            x: [0, 0],
            y: [0, 0],
            z: [0, 0.02],
            mode: 'lines',
            line: {
                color: 'rgb(255, 0, 0)', // 红色
                width: 5
            },
            type: 'scatter3d'
        };

        // 创建三维网格
        const gridLines = [];
        const interval = 0.005;

        // X和Y范围为-0.05到0.05，Z范围为-0.03到0.03
        // const xRange = [-0.05, 0.05];
        // const yRange = [-0.05, 0.05];
        // const zRange = [-0.03, 0.03];
        const xRange = [this.showResults[0].lastDay, this.showResults[this.showResults.length - 1].lastDay];
        const yRange = [this.showResults[0].jmp, this.showResults[this.showResults.length - 1].jmp];
        const zRange = [this.showResults[0].stop, this.showResults[this.showResults.length - 1].stop];

        // 在X方向上创建网格线
        for (let x = xRange[0]; x <= xRange[1]; x += interval) {
            for (let z = zRange[0]; z <= zRange[1]; z += interval) {
                gridLines.push({
                    x: [x, x],
                    y: yRange,
                    z: [z, z],
                    mode: 'lines',
                    line: {
                        color: 'rgba(200, 200, 200, 1)', // 半透明灰色
                        width: 1
                    },
                    type: 'scatter3d'
                });
            }
        }

        // 在Y方向上创建网格线
        for (let y = yRange[0]; y <= yRange[1]; y += interval) {
            for (let z = zRange[0]; z <= zRange[1]; z += interval) {
                gridLines.push({
                    x: xRange,
                    y: [y, y],
                    z: [z, z],
                    mode: 'lines',
                    line: {
                        color: 'rgba(200, 200, 200, 1)', // 半透明灰色
                        width: 1
                    },
                    type: 'scatter3d'
                });
            }
        }

        // 在Z方向上创建网格线
        for (let x = xRange[0]; x <= xRange[1]; x += interval) {
            for (let y = yRange[0]; y <= yRange[1]; y += interval) {
                gridLines.push({
                    x: [x, x],
                    y: [y, y],
                    z: zRange,
                    mode: 'lines',
                    line: {
                        color: 'rgba(200, 200, 200, 1)', // 半透明灰色
                        width: 1
                    },
                    type: 'scatter3d'
                });
            }
        }

        const data = [trace, traceXLine, traceYLine, traceZLine]
        .concat(gridLines);
        const layout = {
            title: '3D Scatter Plot of x, y, z combinations',
            scene: {
              xaxis: { title: '昨日涨幅' },
              yaxis: { title: '今日跳空' },
              zaxis: { title: '止损' }
            }
        };

        Plotly.newPlot('plot', data, layout);

        // 添加点击事件监听器
        document.getElementById('plot').on('plotly_click', (data) => {
          if (data.points[0].data.mode !== 'markers') return // 如果点击的不是点，则不执行任何操作
          const point = data.points[0];
          const result = point.text;
          // alert(`You clicked on:\n${result}`);
          // console.log(result)
          // console.log(this.$refs.resDialog)
          this.$refs.resDialog.show(result)
        });
    },
  },
};
</script>

<style lang="less" scoped>
#plot {
  display: block;
  width: 1300px;
  height: 900px;
  // color: #ff0000;
}
</style>