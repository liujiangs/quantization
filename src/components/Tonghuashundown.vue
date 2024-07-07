<template>
  <div>
    <!-- -->
    <el-table
      :data="ratesArr"
      style="width: 100%">
      <el-table-column
        prop="time"
        label="日期">
      </el-table-column>
      <el-table-column
        prop="thscode"
        label="标的代码">
      </el-table-column>
      <el-table-column
        v-for="i in 7"
        :key="i"
        :label="`${i+2}分钟涨幅`">
        <template slot-scope="{row}">
          <span :style="row[`${i+2}分钟涨幅`] > row['3分钟涨幅'] ? 'color: red;' : 'color: green;'">
            {{  row[`${i+2}分钟涨幅`] - row['3分钟涨幅'] | toF}}%
            {{ row[`${i+2}分钟涨幅`] | toF }}%
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="当日涨幅"
        label="当日涨幅">
        <template slot-scope="{row}">
          {{ row['当日涨幅'] | toF }}%
        </template>
      </el-table-column>
      <el-table-column
        prop="最高涨幅"
        label="最高涨幅">
        <template slot-scope="{row}">
          {{ row['最高涨幅'] | toF }}%
        </template>
      </el-table-column>
      <el-table-column
        label="10分钟涨幅赚">
        <template slot-scope="{row}">
          <span :style="row['10分钟涨幅'] > row['3分钟涨幅'] ? 'color: red;' : 'color: green;'">
            {{  row['10分钟涨幅'] - row['3分钟涨幅'] | toF}}%
            {{row['10分钟涨幅'] > row['3分钟涨幅'] ? '盈' : '亏'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="最高涨幅赚"
        label="最高涨幅赚">
        <template slot-scope="{row}">
          <span :style="row['最高涨幅'] > row['3分钟涨幅'] ? 'color: red;' : 'color: green;'">
            {{  row['最高涨幅'] - row['3分钟涨幅'] | toF}}%
            {{row['最高涨幅'] > row['3分钟涨幅'] ? '盈' : '亏'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="当日涨幅赚"
        label="当日涨幅赚">
        <template slot-scope="{row}">
          <span :style="row['当日涨幅'] > row['3分钟涨幅'] ? 'color: red;' : 'color: green;'">
            {{  row['当日涨幅'] - row['3分钟涨幅'] | toF}}%
            {{row['当日涨幅'] > row['3分钟涨幅'] ? '盈' : '亏'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="3分钟涨的个数">
        <template slot-scope="{row}">
          {{ row.upnum }}
        </template>
      </el-table-column>
      <el-table-column
        label="标的总数">
        <template slot-scope="{row}">
          {{ row.allnum }}
        </template>
      </el-table-column>
      <el-table-column
        label="回调前最高分钟">
        <template slot-scope="{row}">
          {{ row.highmin }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="{row}">
          <el-button @click="open(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <TonghuashunDetailVue ref="TonghuashunDetailVue"/>
  </div>
</template>

<script>
import * as axiosService from '../services/axiosInterceptor.js'
const {postAction} = axiosService
import dayjs from 'dayjs';
import TonghuashunDetailVue from './TonghuashunDetail.vue';

function getAll(start, end) {
  let dateList = [];
  var startTime = getDate(start);
  var endTime = getDate(end);

  while ((endTime.getTime() - startTime.getTime()) >= 0) {
    var year = startTime.getFullYear();
    var month = startTime.getMonth() + 1 < 10 ? '0' + (startTime.getMonth() + 1) : startTime.getMonth() + 1;
    var day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
    if (new Date(year + "-" + month + "-" + day).getDay() !== 0 && new Date(year + "-" + month + "-" + day).getDay() !== 6 ) {
      dateList.push(year + "-" + month + "-" + day);
    }
    startTime.setDate(startTime.getDate() + 1);
  }
  return dateList;
}

function getDate(datestr) {
  var temp = datestr.split("-");
  var date = new Date(temp[0], temp[1] - 1, temp[2]);
  return date;
}

export default {
  name: 'TestTonghuashun',
  components: {
    TonghuashunDetailVue
  },

  data() {
    return {
      allContract:[],
      allContractCode: [],
      nightContractCode: [],
      m3List: {}, // 3分钟数据
      rates: {},
      ratesArr:[],
      startTime: '2024-05-01',
      endTime: '2024-05-31'
    };
  },

  mounted() {
    // this.getContractList()
    this.start()
  },

  methods: {
    open(row) {
      this.$refs.TonghuashunDetailVue.show(row)
    },
    start() {
      let times = getAll(this.startTime,this.endTime)
      times.forEach((time, idx) => {
        // if (idx != 0) return
        setTimeout(() => {
          try {
            this.getNightContractCode(time, times[idx + 1])
          } catch (error) {
            console.log(error)
            this.getNightContractCode(time, times[idx + 1])
          }
        }, idx*1000)
      })
    },
    // 获取夜盘商品主力合约 
    async getNightContractCode(time, time2) {
        // 1获取日期下主力合约
      let data_poolRes = await postAction('data_pool',{"reportname":"p00738","functionpara":{"date": dayjs(time).format('YYYYMMDD')},"outputpara":"p00738_f001,p00738_f002,p00738_f003"})
      let allContract = data_poolRes.tables[0].table.p00738_f001
      // .filter(item => !item.includes('LC'))
      // 2主力合约转同花顺代码列表
      let get_thscodeRes = await postAction('get_thscode',{"seccode":allContract.join(),"functionpara":{"mode":"seccode","sectype":"007,007001,007002,007002001,007002002,007002003,007002004,007002005,007002006","market":"","tradestatus":"2","isexact":"1"}})
      let allContractCode = get_thscodeRes.tables.map(item => item.table.thscode[0])
      // 3获取3分钟涨幅数据
      let high_frequencyRes = await postAction('high_frequency ', {"codes":allContractCode.join(),"indicators":"open,high,low,close,change","starttime":time + " 21:03:00","endtime":time+" 21:03:00"})
      let night = high_frequencyRes.tables.filter(item => !!item.table)
      let nightContractCode = night.map(item => item.thscode)
      let m3List = night
      // m3List[time] = night

      // 4获取当日涨幅数据并计算整合
      let cmd_history_quotationRes = await postAction('cmd_history_quotation', {"codes":nightContractCode.join(),"indicators":"preClose,open,high,low,close","startdate":time2,"enddate":time2})
      // console.log(time === this.endTime, 'cmd_history_quotationRes.tables', cmd_history_quotationRes.tables)
      let z = 0 // 获取到数据的标的数量
      let rates = cmd_history_quotationRes.tables.map(item => {
        let m3close = m3List.find(item2 => item2.thscode === item.thscode).table?.open
        
        let rate3 = (m3close/item.table.preClose - 1)*100
        if (rate3 > 0) {
          z++
        }
        return {
          ...item,
          '最高涨幅': (item.table.high/item.table.preClose - 1)*100,
          '当日涨幅': (item.table.close/item.table.preClose - 1)*100,
          '3分钟涨幅': rate3,
        }
      });

      rates.sort(function(a,b){
        return a['3分钟涨幅']-b['3分钟涨幅'];  //降序排列，return a-b; —>升序排列
      })

      if (time2) {
        let minRes
        // try {
        minRes = await postAction('high_frequency ', {"codes": rates[0]?.thscode,"indicators":"open,high,low,close,change","starttime":time + " 21:00:00","endtime":time+" 23:00:00"})
        // } catch (error) {
        //   minRes = await postAction('high_frequency ', {"codes": rates[0].thscode,"indicators":"open,high,low,close,change","starttime":time + " 21:03:00","endtime":time+" 21:15:00"})
        // }
        minRes.tables[0].table.low.forEach((item, idx) => {
          rates[0][idx+3+'分钟涨幅'] = (item/rates[0].table.preClose - 1)*100
        })
        minRes.tables[0].table.high.forEach((item, idx) => {
          rates[0][idx+3+'分钟高'] = (item/rates[0].table.preClose - 1)*100
        })
        rates[0].upnum = z
        rates[0].allnum = cmd_history_quotationRes.tables.length

        rates[0].line = minRes.tables[0].table.close
        .map(item => {
          return (item/rates[0].table.preClose - 1)*100
        })


        this.rates[time2] = rates[0]
        this.ratesArr.push({
          ...rates[0],
          time: time2
        })
      }

      if (time === this.endTime) {
        setTimeout(() => {
          console.log(this.ratesArr)
          // this.ratesArr.sort((a,b) => {
          //   return Date.parse(a) - Date.parse(b)
          // })
          let sum = 0
          this.ratesArr.forEach((item, idx) => {
            let higheast = 0

            // if (item['3分钟涨幅'] < item['2分钟涨幅'] || item['3分钟涨幅'] < item['1分钟涨幅']) {
            //   return
            // }
            // // let hightPer
            // for(let i=0;i<12;i++) {
            //   if (item[`${i+4}分钟高`] > higheast) { // 刷新最高点
            //     higheast = item[`${i+4}分钟高`] - item['3分钟涨幅']
            //     // this.ratesArr[idx].highmin = i+4
            //     this.$set(this.ratesArr[idx], 'highmin', i+4)
            //     // hightPer = item[`${i+4}分钟高`] - item['3分钟涨幅']
            //   }

            //   if (item[`${i+4}分钟涨幅`]-item['3分钟涨幅'] < -0.1) { // 如果某分钟导致总亏损达到0.1% 直接止损
            //     // sum += (item[`${i+4}分钟涨幅`] || 0)
            //     sum -= 0.1

            //     break
            //   }
            //    else if (item[`${i+4}分钟涨幅`]-item['3分钟涨幅'] < higheast*2/3 && i>2) { // 最高点到3分钟的涨幅回调了1/3直接止盈
            //     console.log(item.time, i+4+'回调止盈,最高', higheast)
            //     sum += higheast*2/3
            //     break
            //   }
            //   else { // 未止损情况准时3分钟买入15分钟卖出
            //     if (i===11) {
            //       sum += (item['15分钟涨幅'] || 0)
            //       sum -= (item['3分钟涨幅'] || 0)
            //     }
            //   }
            // }

            // if (item['4分钟涨幅']-item['3分钟涨幅'] < -0.1) {
            //   sum += (item['4分钟涨幅'] || 0)
            //   sum -= 0.1
            // } else {
              sum += (item['10分钟涨幅'] || 0)
              sum -= (item['3分钟涨幅'] || 0)
            // }
          })
          console.log('总涨幅', sum)
        }, 1000);
      }
      
    },















    getContractList(time) {
      postAction('data_pool',{"reportname":"p00738","functionpara":{"date": time},"outputpara":"p00738_f001,p00738_f002,p00738_f003"}).then(res => {
        let allContract = res.tables[0].table.p00738_f001.filter(item => item !== 'LC2407')
        this.getCode(allContract)
      })
    },
    getCode(allContract) {
      postAction('get_thscode',{"seccode":allContract.join(),"functionpara":{"mode":"seccode","sectype":"","market":"","tradestatus":"2","isexact":"1"}}).then(res => {
        // console.log(res)
        // this.allContract.join()
        let allContractCode = res.tables.map(item => item.table.thscode[0])

        this.getNight(allContractCode)
      })
    },
    getNight(allContractCode) {
      postAction('high_frequency ', {"codes": allContractCode.join(),"indicators":"open,high,low,close,change","starttime":"2024-05-28 21:03:00","endtime":"2024-05-28 21:03:00"}).then(res => {
        // console.log(res.tables)
        // this.m3List = res.tables
        let night = res.tables.filter(item => !!item.table)
        this.nightContractCode = night.map(item => item.thscode)

        this.get3()
      })
    },
    get3(time, time2) {
      postAction('high_frequency ', {"codes":this.allContractCode.join(),"indicators":"open,high,low,close,change","starttime":time+" 21:03:00","endtime":time+" 21:03:00"}).then(res => {
        // console.log(res.tables)
        this.m3List[time] = res.tables
        // let night = res.tables.filter(item => !!item.table)
        // this.nightContractCode = night.map(item => item.thscode)
        this.cmd_history_quotation(time, time2)
      })
    },
    cmd_history_quotation(time, time2) {
      postAction('cmd_history_quotation', {"codes":this.nightContractCode.join(),"indicators":"preClose,open,high,low,close","startdate":time2,"enddate":time2}).then(res => {
        let rates = res.tables.map(item => {
          let m3close = this.m3List[time].find(item2 => item2.thscode === item.thscode).table.close

          console.log(time, this.m3List[time].map(item => item.table.close))
          let rate3 = (m3close/item.table.preClose - 1)*100 
          // + '%'
          return {
            ...item,
            '最高涨幅': (item.table.high/item.table.preClose - 1)*100,
            '当日涨幅': (item.table.close/item.table.preClose - 1)*100,
            // thscode: item.thscode,
            // name: this.allContractCode.find()
            '3分钟涨幅': rate3
          }
        });

        rates.sort(function(a,b){
            return b['3分钟涨幅']-a['3分钟涨幅'];  //降序排列，return a-b; —>升序排列
        })
        // console.log(rates[0])
        this.rates[time2] = rates[0]

        if (time === this.endTime) {
          setTimeout(() => {
            console.log(this.rates)
          }, 1000);
        }
      })
    },

    
  },
  filters: {
    toF(str) {
      return str.toFixed(2)
    }
  }
};
</script>

<style lang="less" scoped>

</style>