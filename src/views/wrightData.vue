<template>
  <div>
    <button @click="wrightData">下载</button>
  </div>
</template>

<script>
// import data from './data.json';
import data from './10year.json';
console.log(data)

export default {
  name: 'TestWrightData',

  data() {
    return {
      
    };
  },

  mounted() {
    
  },

  methods: {
    wrightData() {
      // const arr = Object.keys(this.highData[0])
      // const data = this.highData
      // //定义表头
      let str = `thscode,time,open,close,openInterest,volume\n`;
      // //增加\t为了不让表格显示科学计数法或者其他格式
      // for(let i = 0 ; i < data.length ; i++ ){
      //   // for(let item in data[i]){
      //   //   str+=`${data[i][item] + '\t'},`;     
      //   // }
      //   arr.forEach(item => {
      //     // data[i][item] = (data[i][item]||'').replace(/,/g,`\\`)
      //     console.log(data[i][item])
      //     str += data[i][item] + '\t,'
      //   })
      //   str+='\n';
      // }

      Object.keys(data).forEach(item1 => {
        data[item1].forEach(item => {
          str += item1 + ','
          str += item['time'] + '\t,'
          str += item['open'] + '\t,'
          str += item['close'] + '\t,'
          str += item['open_interest'] + '\t,'
          str += item['volume'] + '\n'
        })
      })


      //encodeURIComponent解决中文乱码
      let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
      //通过创建a标签实现
      let link = document.createElement("a");
      link.href = uri;
      //对下载的文件命名
      link.download = `${'专家数据'}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
};
</script>

<style lang="less" scoped>

</style>