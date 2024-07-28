<template>
  <div>
    <input type="file" id="excel" multiple />
    
    <el-form :inline="true" class="demo-form-inline">
      
      <!-- <el-form-item label="昨日涨跌">
        <el-switch
          v-model="isHigh"
          active-text="涨"
          inactive-text="跌">
        </el-switch>
      </el-form-item> -->
      <el-form-item label="年份过滤">
        <el-input type="number" v-model="year"></el-input>
      </el-form-item>
      <el-form-item label="昨日涨幅">
        <el-input type="number" v-model="lastDay"></el-input>
      </el-form-item>
      <el-form-item label="跳空幅度">
        <el-input type="number" v-model="jmp"></el-input>
      </el-form-item>
      <el-form-item label="止损阈值">
        <el-input type="number" v-model="stop"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getHighJmp">分析数据</el-button>
      </el-form-item>
    </el-form>
    <div>
      <div :style="{color: Math.pow(涨大高多, 1/涨大高多num) > 1.01 ? 'red':''}">涨大高多:{{ 涨大高多 | numFilter }}|||{{涨大高多num}}|||{{ Math.pow(涨大高多, 1/涨大高多num) }}</div>
      <div :style="{color: Math.pow(涨大高空, 1/涨大高空num) > 1.01 ? 'red':''}">涨大高空:{{ 涨大高空 | numFilter }}|||{{涨大高空num}}|||{{ Math.pow(涨大高空, 1/涨大高空num) }}</div>
      <div :style="{color: Math.pow(涨小高多, 1/涨小高多num) > 1.01 ? 'red':''}">涨小高多:{{ 涨小高多 | numFilter }}|||{{涨小高多num}}|||{{ Math.pow(涨小高多, 1/涨小高多num) }}</div>
      <div :style="{color: Math.pow(涨小高空, 1/涨小高空num) > 1.01 ? 'red':''}">涨小高空:{{ 涨小高空 | numFilter }}|||{{涨小高空num}}|||{{ Math.pow(涨小高空, 1/涨小高空num) }}</div>
      <div :style="{color: Math.pow(跌大高多, 1/跌大高多num) > 1.01 ? 'red':''}">跌大高多:{{ 跌大高多 | numFilter }}|||{{跌大高多num}}|||{{ Math.pow(跌大高多, 1/跌大高多num) }}</div>
      <div :style="{color: Math.pow(跌大高空, 1/跌大高空num) > 1.01 ? 'red':''}">跌大高空:{{ 跌大高空 | numFilter }}|||{{跌大高空num}}|||{{ Math.pow(跌大高空, 1/跌大高空num) }}</div>
      <div :style="{color: Math.pow(跌小高多, 1/跌小高多num) > 1.01 ? 'red':''}">跌小高多:{{ 跌小高多 | numFilter }}|||{{跌小高多num}}|||{{ Math.pow(跌小高多, 1/跌小高多num) }}</div>
      <div :style="{color: Math.pow(跌小高空, 1/跌小高空num) > 1.01 ? 'red':''}">跌小高空:{{ 跌小高空 | numFilter }}|||{{跌小高空num}}|||{{ Math.pow(跌小高空, 1/跌小高空num) }}</div>
      <div :style="{color: Math.pow(涨大低多, 1/涨大低多num) > 1.01 ? 'red':''}">涨大低多:{{ 涨大低多 | numFilter }}|||{{涨大低多num}}|||{{ Math.pow(涨大低多, 1/涨大低多num) }}</div>
      <div :style="{color: Math.pow(涨大低空, 1/涨大低空num) > 1.01 ? 'red':''}">涨大低空:{{ 涨大低空 | numFilter }}|||{{涨大低空num}}|||{{ Math.pow(涨大低空, 1/涨大低空num) }}</div>
      <div :style="{color: Math.pow(涨小低多, 1/涨小低多num) > 1.01 ? 'red':''}">涨小低多:{{ 涨小低多 | numFilter }}|||{{涨小低多num}}|||{{ Math.pow(涨小低多, 1/涨小低多num) }}</div>
      <div :style="{color: Math.pow(涨小低空, 1/涨小低空num) > 1.01 ? 'red':''}">涨小低空:{{ 涨小低空 | numFilter }}|||{{涨小低空num}}|||{{ Math.pow(涨小低空, 1/涨小低空num) }}</div>
      <div :style="{color: Math.pow(跌大低多, 1/跌大低多num) > 1.01 ? 'red':''}">跌大低多:{{ 跌大低多 | numFilter }}|||{{跌大低多num}}|||{{ Math.pow(跌大低多, 1/跌大低多num) }}</div>
      <div :style="{color: Math.pow(跌大低空, 1/跌大低空num) > 1.01 ? 'red':''}">跌大低空:{{ 跌大低空 | numFilter }}|||{{跌大低空num}}|||{{ Math.pow(跌大低空, 1/跌大低空num) }}</div>
      <div :style="{color: Math.pow(跌小低多, 1/跌小低多num) > 1.01 ? 'red':''}">跌小低多:{{ 跌小低多 | numFilter }}|||{{跌小低多num}}|||{{ Math.pow(跌小低多, 1/跌小低多num) }}</div>
      <div :style="{color: Math.pow(跌小低空, 1/跌小低空num) > 1.01 ? 'red':''}">跌小低空:{{ 跌小低空 | numFilter }}|||{{跌小低空num}}|||{{ Math.pow(跌小低空, 1/跌小低空num) }}</div>
    </div>

    <el-table
      :data="highData"
      style="width: 100%">
      <el-table-column type="index"/>
      <el-table-column
        prop="name"
        v-for="(item, key) in highData[0]"
        :key="key"
        :label="key">
        <template slot-scope="{row}">
          {{ row[key] }}
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="高开">
        <template slot-scope="{row}">
          {{ row.open/row.preClose - 1 }}
        </template>
      </el-table-column> -->
      <el-table-column
        label="收益">
        <template slot-scope="{row}">
          <span :style="{color: row.close/row.open > 1 ? 'red' : 'green'}">
            {{ row.close/row.open - 1 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="注意">
        <template slot-scope="{row}">
          <span :style="{color: row.close === row.low || row.close === row.high ? 'red' : 'green'}" style="font-size: 40px;">
            {{ row.close === row.low || row.close === row.high ? '●' : '' }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 跌大高:
    <div>
      <div>
        title:
        <span style="display: inline-block;width: 100px;" v-for="i in 8" :key="i">
          {{ 1+i*0.01 }}
        </span>
      </div>
      <div v-for="idx in 11" :key="idx">
        {{ 2013 + idx }}:
        <span style="display: inline-block;width: 100px;" v-for="i in 8" :key="i">
          {{ highData.filter((item) => {
            return item.time.split('-')[0] == (2013 + idx) && item.close/item.open > 1+i*0.01 && item.close/item.open < 1+(i+1)*0.01
          }).length }}
        </span>
      </div>
    </div> -->
  </div>
</template>

<script>
import dayjs from 'dayjs';
const XLSX = require('xlsx');
import { getDaysBetween, fixdata, numFilter } from '@/utils/index.js';
import axios from 'axios';

export default {
  name: 'TestExcel',

  data() {
    return {
      year: null,
      data:[1],
      highData: [],
      lowData: [],
      haunyue: [],
      // jmp: 0.007, // 跳空幅度
      jmp: 0.01, // 跳空幅度
      // isHigh: true, // 昨日涨跌
      lastDay: 0.01, // 昨日涨幅
      stop: 1, // 止损阈值

      // highHighAdd: 0, // 高开做多
      // highHighCut: 0, // 高开做多
      // highLowAdd: 0, // 高开做空
      // highLowCut: 0, // 高开做空
      // lowHighAdd: 0, // 低开做多
      // lowHighCut: 0, // 低开做多
      // lowLowAdd: 0, // 低开做多
      // lowLowCut: 0, // 低开做多
      涨大高多: 1,
      涨大高空: 1,
      涨小高多: 1,
      涨小高空: 1,

      跌大高多: 1,
      跌大高空: 1,
      跌小高多: 1,
      跌小高空: 1,

      涨大低多: 1,
      涨大低空: 1,
      涨小低多: 1,
      涨小低空: 1,
      
      跌大低多: 1,
      跌大低空: 1,
      跌小低多: 1,
      跌小低空: 1,

      涨大高多num: 0,
      涨大高空num: 0,
      涨小高多num: 0,
      涨小高空num: 0,
      跌大高多num: 0,
      跌大高空num: 0,
      跌小高多num: 0,
      跌小高空num: 0,
      涨大低多num: 0,
      涨大低空num: 0,
      涨小低多num: 0,
      涨小低空num: 0,
      跌大低多num: 0,
      跌大低空num: 0,
      跌小低多num: 0,
      跌小低空num: 0,
    };
  },

  mounted() {
    this.getData()
    let wb;  // 读取完成的数据
    let rABS = false; // 是否将文件读取为二进制字符串
    document.getElementById("excel").addEventListener("change", (e) => {
      if(!e.target.files) return;
      var f = e.target.files[0];
      var reader = new FileReader();
      reader.onload = (e) => {
        var data = e.target.result;
        if(rABS) {
          wb = XLSX.read(btoa(fixdata(data)), {type: 'base64',cellDates: true});//手动转化
        } 
        else {
          wb = XLSX.read(data, {type: 'binary',cellDates: true});
        }
        //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        //wb.Sheets[Sheet名]获取第一个Sheet的数据
        // document.getElementById("demo").innerHTML= JSON.stringify( XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) );
        this.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        this.getHighJmp()
      };
      // if(rABS) {reader.readAsArrayBuffer(f);} 
      // else {;}
      reader.readAsBinaryString(f)
    });
  },
  filters: {
    numFilter
 },

  methods: {
    getData() {
      axios.get('/10All.csv').then(res => {
        const data = res.data
        const wb = XLSX.read(data, {type: 'binary',cellDates: true});
        this.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        this.getHighJmp()
      })
    },
    getHighJmp () {
      {
        this.highData = []
        this.涨大高多 = 1
        this.涨大高空 = 1
        this.涨小高多 = 1
        this.涨小高空 = 1
        this.跌大高多 = 1
        this.跌大高空 = 1
        this.跌小高多 = 1
        this.跌小高空 = 1
        this.涨大低多 = 1
        this.涨大低空 = 1
        this.涨小低多 = 1
        this.涨小低空 = 1
        this.跌大低多 = 1
        this.跌大低空 = 1
        this.跌小低多 = 1
        this.跌小低空 = 1
        this.涨大高多num = 0
        this.涨大高空num = 0
        this.涨小高多num = 0
        this.涨小高空num = 0
        this.跌大高多num = 0
        this.跌大高空num = 0
        this.跌小高多num = 0
        this.跌小高空num = 0
        this.涨大低多num = 0
        this.涨大低空num = 0
        this.涨小低多num = 0
        this.涨小低空num = 0
        this.跌大低多num = 0
        this.跌大低空num = 0
        this.跌小低多num = 0
        this.跌小低空num = 0
      }
      let sum = 1;
      console.log('getDaysBetween', getDaysBetween(this.data[0].time, this.data[1].time))
      this.data.forEach((item, index) => {
        if (index === 0) return // 不写报错  因为需要index-1
        if (
          item.thscode !== this.data[index - 1].thscode || // 保证不会是标的切换
          // dayjs(item.time).format('YYYY-MM-DD') == '2024-02-18' || // 过年回来的一天
          getDaysBetween(this.data[index - 1].time, item.time) < 5 ||
          item.openInterest < 5000 || // 不活跃 // 国际铜成交量不足10000
          item.openInterest > this.data[index - 1].openInterest * 1.3 // 持仓量大幅增加说明是主力合约换月
        ) return
        if (this.year && dayjs(item.time).format('YYYY') != this.year 
          // || new Date(item.time) < new Date('2015-7-1')
        ) return // 限制年份
        // if (this.year && dayjs(item.time).format('YYYY') < 2020 || dayjs(item.time).format('YYYY')>2022) return // 限制年份
        // if (item.thscode !== 'I9999') return // 限制标的
        // 涨大高
        if (item.open>this.data[index - 1].close * (1 + this.jmp*1) // 跳空高开jmp的幅度
        // && this.data[index - 1].close > this.data[index - 1].open *1 // 前一天是上涨 
        && this.data[index - 1].close > this.data[index - 1].open *(1 + this.lastDay*1) // 但涨幅小于1个点
        ) {
          // sum += item.close/item.open - 1
          // + 为做多 - 为做空
          this.涨大高多 *= 1 + (item.low/item.open - 1 <= -this.stop ? -5*this.stop : (item.close/item.open - 1)*5)
          this.涨大高空 *= 1 - (item.high/item.open - 1 > this.stop ? 5*this.stop : (item.close/item.open - 1)*5)
          this.涨大高多num += 1
          this.涨大高空num += 1
          // 补仓
          // if (item.high/item.open < 1.01) {
          //   sum *= 1 - (item.high/item.open - 1 > this.stop ? 5*this.stop : (item.close/item.open - 1)*5)*0.3
          // } else if (item.high/item.open < 1.02 && item.high/item.open >= 1.01) {
          //   sum *= 1 - (item.high/item.open - 1 > this.stop ? 5*this.stop : (item.close/item.open - 1)*5)*0.6
          // } else if (item.high/item.open < 1.03 && item.high/item.open >= 1.02) {
          //   sum *= 1 - (item.high/item.open - 1 > this.stop ? 5*this.stop : (item.close/item.open - 1)*5)*0.9
          // } else {
          //   sum *= 1 - (0.03)*5*0.9
          // }

          // this.highData.push({
          //   ...item,
          //   time: dayjs(item.time).format('YYYY-MM-DD')
          // })
        }
        // 涨小高
        if (item.open>this.data[index - 1].close * (1 + this.jmp*1) // 跳空高开jmp的幅度
        && this.data[index - 1].close > this.data[index - 1].open *1 // 前一天是上涨 
        && this.data[index - 1].close < this.data[index - 1].open *(1 + this.lastDay*1)
        // && this.data[index - 1].close > this.data[index - 1].open *(1 + 0.005)
        ) {
          this.涨小高多 *= 1 + (item.low/item.open - 1 <= -this.stop ? -5*this.stop : (item.close/item.open - 1)*5)
          this.涨小高空 *= 1 - (item.high/item.open - 1 > this.stop ? 5*this.stop : (item.close/item.open - 1)*5)
          this.涨小高多num += 1
          this.涨小高空num += 1
        }
        // 跌大高
        if (
          item.open > this.data[index - 1].close * (1 + this.jmp*1) // 跳空高开jmp的幅度
        //  && item.open <= this.data[index - 1].close * 1.011
        && this.data[index - 1].close < this.data[index - 1].open *1
        && this.data[index - 1].close < this.data[index - 1].open *(1 - this.lastDay*1)
        ) {
          this.跌大高多 *= 1 + (item.low/item.open - 1 <= -this.stop ? -5*this.stop : (item.close/item.open - 1)*5)
          this.跌大高空 *= 1 - (item.high/item.open - 1 > this.stop ? 5*this.stop : (item.close/item.open - 1)*5)
          this.跌大高多num += 1
          this.跌大高空num += 1

          this.highData.push({
            ...item,
            time: dayjs(item.time).format('YYYY-MM-DD')
          })
        }
        // 跌小高
        if (item.open>this.data[index - 1].close * (1 + this.jmp*1) // 跳空高开jmp的幅度
        && this.data[index - 1].close < this.data[index - 1].open *1
        && this.data[index - 1].close > this.data[index - 1].open *(1 - this.lastDay*1)
        ) {
          this.跌小高多 *= 1 + (item.low/item.open - 1 <= -this.stop ? -5*this.stop : (item.close/item.open - 1)*5)
          this.跌小高空 *= 1 - (item.high/item.open - 1 > this.stop ? 5*this.stop : (item.close/item.open - 1)*5)
          this.跌小高多num += 1
          this.跌小高空num += 1
        }
        // 涨大低
        if (item.open<this.data[index - 1].close * (1 - this.jmp*1) // 跳空高开jmp的幅度
        && this.data[index - 1].close > this.data[index - 1].open *1 // 前一天是上涨 
        && this.data[index - 1].close > this.data[index - 1].open *(1 + this.lastDay*1)
        // && item.close !== item.high
        ) {
          this.涨大低多 *= 1 + (item.low/item.open - 1 <= -this.stop ? -5*this.stop : (item.close/item.open - 1)*5)
          this.涨大低空 *= 1 - (item.high/item.open - 1 > this.stop ? 5*this.stop : (item.close/item.open - 1)*5)
          this.涨大低多num += 1
          this.涨大低空num += 1
        }
        // 涨小低
        if (item.open<this.data[index - 1].close * (1 - this.jmp*1) // 跳空高开jmp的幅度
        && this.data[index - 1].close > this.data[index - 1].open *1 // 前一天是上涨 
        && this.data[index - 1].close < this.data[index - 1].open *(1 + this.lastDay*1)
        ) {
          this.涨小低多 *= 1 + (item.low/item.open - 1 <= -this.stop ? -5*this.stop : (item.close/item.open - 1)*5)
          this.涨小低空 *= 1 - (item.high/item.open - 1 > this.stop ? 5*this.stop : (item.close/item.open - 1)*5)
          this.涨小低多num += 1
          this.涨小低空num += 1
        }
        // 跌大低
        if (item.open<this.data[index - 1].close * (1 - this.jmp*1) // 跳空高开jmp的幅度
        && this.data[index - 1].close < this.data[index - 1].open *1
        && this.data[index - 1].close < this.data[index - 1].open *(1 - this.lastDay*1)
        ) {
          this.跌大低多 *= 1 + (item.low/item.open - 1 <= -this.stop ? -5*this.stop : (item.close/item.open - 1)*5)
          this.跌大低空 *= 1 - (item.high/item.open - 1 > this.stop ? 5*this.stop : (item.close/item.open - 1)*5)
          this.跌大低多num += 1
          this.跌大低空num += 1
        }
        // 跌小低
        if (item.open<this.data[index - 1].close * (1 - this.jmp*1) // 跳空高开jmp的幅度
        && this.data[index - 1].close < this.data[index - 1].open *1
        && this.data[index - 1].close > this.data[index - 1].open *(1 - this.lastDay*1)
        ) {
          this.跌小低多 *= 1 + (item.low/item.open - 1 <= -this.stop ? -5*this.stop : (item.close/item.open - 1)*5)
          this.跌小低空 *= 1 - (item.high/item.open - 1 > this.stop ? 5*this.stop : (item.close/item.open - 1)*5)
          this.跌小低多num += 1
          this.跌小低空num += 1
        }



        // 先留着
        // if (
        //   item.open < this.data[index - 1].close*(1 - this.jmp*1)
        //   && this.data[index - 1].close > this.data[index - 1].open // 前一天是上涨
        //   // && this.data[index - 1].close < this.data[index - 1].open *0.99
        //   // && this.data[index - 1].close > this.data[index - 1].open *1.01
        // ) {
        //   if (item.open
        //     // && item.number != 648
        //   ) {
        //     // console.log(item.open)
        //     // sum *= 1 - (item.high/item.open - 1 > this.stop ? 5*this.stop : (item.close/item.open - 1)*5)
        //   }
          
          

        //   this.lowData.push({
        //     ...item,
        //     time: dayjs(item.time).format('YYYY-MM-DD')
        //   })
        // }
      })

      // console.log(999999, this.highData.length, sum)
      // console.log(this.涨大高多)
      // console.log(this.涨大高空)
      // console.log(this.涨小高多)
      // console.log(this.涨小高空)
      // console.log(this.跌大高多)
      // console.log(this.跌大高空)
      // console.log(this.跌小高多)
      // console.log(this.跌小高空)
      // console.log(this.涨大低多)
      // console.log(this.涨大低空)
      // console.log(this.涨小低多)
      // console.log(this.涨小低空)
      // console.log(this.跌大低多)
      // console.log(this.跌大低空)
      // console.log(this.跌小低多)
      // console.log(this.跌小低空)


      let all跌大低多 = Object.groupBy(this.highData, ({ thscode }) => thscode)
      console.log(all跌大低多)
      let shouyi = {}
      for (let key in all跌大低多) {
        shouyi[key] ? '' : shouyi[key] = { m: 1, num: 0 }
        all跌大低多[key].forEach(item => {
          shouyi[key].m *= 1 - (item.high/item.open - 1 > this.stop ? 5*this.stop : (item.close/item.open - 1)*5)
          shouyi[key].num += 1 
        })
        sum *= shouyi[key].m
        // shouyi[key] *= 1 + (all跌大低多[key].low/all跌大低多[key].open - 1 <= -this.stop ? -5*this.stop : (all跌大低多[key].close/all跌大低多[key].open - 1)*5)
      }
      console.log(shouyi)
      console.log(sum)

      //encodeURIComponent解决中文乱码
      // let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
      // //通过创建a标签实现
      // let link = document.createElement("a");
      // link.href = uri;
      // //对下载的文件命名
      // link.download = `${'专家数据'}.csv`;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
    }
  },
};
</script>

<style lang="less" scoped>

</style>