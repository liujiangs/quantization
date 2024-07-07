<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    fullscreen>
    <div id="main">

    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: 'TestTonghuashunDetail',

  data() {
    return {
      dialogVisible: false,
      row: {}
    };
  },

  mounted() {
    
  },

  methods: {
    show(row) {
      this.dialogVisible = true
      this.row = row
      this.$nextTick(() => {
        var chartDom = document.getElementById('main');
        var myChart = echarts.init(chartDom);
        var option;

        option = {
          xAxis: {
            type: 'category',
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value',
            // min:'dataMin', //取最小值为最小刻度
            // max: 'dataMax', //取最大值为最大刻度
          },
          series: [
            {
              data: row.line,
              type: 'line'
            }
          ]
        };

        option && myChart.setOption(option);
      })

      

    }
  },
};
</script>

<style scoped>
#main {
  height: 80vh;
  width: 80vw;
}
</style>