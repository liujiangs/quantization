<template>
  <div>
    <!-- -->
  </div>
</template>

<script>
import {postAction} from '../services/axiosInterceptor.js'
export default {
  name: 'TestDay',

  data() {
    return {
      high:[],
      low: [],
      a: [],
      b: [],
      highNum: 0,
      lowNum: 0
    };
  },

  mounted() {
    this.getList()
  },

  methods: {
    getList() {
      // ,BBZL.DCE,BZL.DCE,CSZL.DCE,CZL.DCE,EBZL.DCE,EGZL.DCE,FBZL.DCE,IZL.DCE,JDZL.DCE,JMZL.DCE,JZL.DCE,LHZL.DCE,LZL.DCE,MZL.DCE,PGZL.DCE,PPZL.DCE,PZL.DCE,RRZL.DCE,VZL.DCE,YZL.DCE,APZL.CZC,CFZL.CZC,CJZL.CZC,CYZL.CZC,FGZL.CZC,JRZL.CZC,LRZL.CZC,MAZL.CZC,OIZL.CZC,PFZL.CZC,PKZL.CZC,PMZL.CZC,PXZL.CZC,RIZL.CZC,RMZL.CZC,RSZL.CZC,SAZL.CZC,SFZL.CZC,SHZL.CZC,SMZL.CZC,SRZL.CZC,TAZL.CZC,URZL.CZC,WHZL.CZC,ZCZL.CZC
      postAction('cmd_history_quotation', {"codes":"AGZL.SHF,ALZL.SHF,AOZL.SHF,AUZL.SHF,BCZL.SHF,BRZL.SHF,BUZL.SHF,CUZL.SHF,ECZL.SHF,FUZL.SHF,HCZL.SHF,LUZL.SHF,NIZL.SHF,NRZL.SHF,PBZL.SHF,RBZL.SHF,RUZL.SHF,SCZL.SHF,SNZL.SHF,SPZL.SHF,SSZL.SHF,WRZL.SHF,ZNZL.SHF,AZL.DCE","indicators":"preClose,open,high,low,close","startdate":"2023-06-12","enddate":"2024-06-12"}).then(res => {
        console.log(res)
        res.tables.forEach(bd => {
          bd.time.forEach((t,idx) => {
            if (bd.table.open[idx]/bd.table.preClose[idx] > 1.01) {
              let data = {
                code: bd.thscode,
                preClose: bd.table.preClose[idx],
                high: bd.table.high[idx],
                low: bd.table.low[idx],
                close: bd.table.close[idx],
                open: bd.table.open[idx],
                time: t
              }
              this.high.push(data)
              if (data.close > data.open) {
                this.a.push(data)
                this.highNum += data.close/data.open - 1
              }
            }

            else if (bd.table.open[idx]/bd.table.preClose[idx] < 0.99) {
              let data = {
                code: bd.thscode,
                preClose: bd.table.preClose[idx],
                high: bd.table.high[idx],
                low: bd.table.low[idx],
                close: bd.table.close[idx],
                open: bd.table.open[idx],
                time: t
              }
              this.low.push(data)
              if (data.close > data.open) {
                this.b.push(data)
                // this.lowNum += Number.isFinite(data.close/data.open - 1) ? 0 : data.close/data.open - 1
                this.lowNum += data.open
                if (Number.isFinite(data.close/data.open - 1)) {
                  alert(data.close +'-'+ data.open+'-'+data.close/data.open)
                }
              }
            }

          })
        })
        console.log(this.low, this.high)
        console.log(this.a, this.b)
        console.log(this.highNum, this.lowNum)
      })
    }
  },
};
</script>

<style lang="less" scoped>

</style>