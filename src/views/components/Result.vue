<template>
  <el-dialog
    title="节点"
    :visible.sync="dialogVisible"
    fullscreen
    :before-close="handleClose">
    <span>
      {{ JSON.stringify(result) }}
    </span>
    <el-input type="number" v-model="year"></el-input>
    <el-button @click="getHighJmp(result.lastDay, result.jmp, result.stop)">重算</el-button>
    {{ newr }}
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column type="index"/>
      <el-table-column
        prop="name"
        v-for="(item, key) in list[0]"
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDaysBetween, numFilter } from '@/utils/index.js';
import dayjs from 'dayjs';

export default {
  name: 'TestResult',
  props: ['data'],

  data() {
    return {
      dialogVisible: false,
      result: {},
      list: [],
      year: null,
      newr: {}
    };
  },

  mounted() {
    
  },

  methods: {
    show(result) {
      this.dialogVisible = true;
      this.result = result

      this.getHighJmp(result.lastDay, result.jmp, result.stop)
    },
    handleClose() {
      this.dialogVisible = false
    },
    getHighJmp(lastDay, jmp, stop) {
      this.list = []
      let profit = 1
      let times = 0
      this.data.forEach((item, index) => {
        if (index === this.data.length - 1) {
          this.newr = {
            profit,
            times,
            once: Math.pow(profit, 1/times)
          }
        }
        if (index < 2) return // 不写报错  因为需要index-1
        if (
          item.thscode !== this.data[index - 2].thscode || // 保证不会是标的切换
          getDaysBetween(this.data[index - 1].time, item.time) > 2 || // 中间没有放假

          item.openInterest < 5000 || // 不活跃 // 国际铜成交量不足10000
          item.openInterest > this.data[index - 1].openInterest * 1.3 // 持仓量大幅增加说明是主力合约换月
        ) return
        if (this.year && dayjs(item.time).format('YYYY') != this.year 
          // || new Date(item.time) < new Date('2015-7-1')
        ) return // 限制年份
        // if (this.year && dayjs(item.time).format('YYYY') < 2020 || dayjs(item.time).format('YYYY')>2022) return // 限制年份
        // if (item.thscode !== 'I9999') return // 限制标的
        
        if (
          item.open>this.data[index - 1].close * (1 + jmp*1) // 跳空高开jmp的幅度
          && item.open<this.data[index - 1].close * (1 + jmp*1 + 0.005)
          && this.data[index - 1].close > this.data[index - 2].close *(1 + lastDay*1)
          && this.data[index - 1].close < this.data[index - 2].close *(1 + lastDay*1 + 0.005)
        ) {
          this.list.push({
            ...item,
            time: dayjs(item.time).format('YYYY-MM-DD')
          })

          if (stop < 0) {
            profit *= 1 + (item.low/item.open - 1 <= stop ? 5*stop : (item.close/item.open - 1)*5)
            times += 1
          } else {
            profit *= 1 - (item.high/item.open - 1 > stop ? 5*stop : (item.close/item.open - 1)*5)
            times += 1
          }

        }

      })
    }
    
  },
};
</script>

<style lang="less" scoped>

</style>