<template>
  <el-card shadow="never" class="aui-card--fill">
    <Scan/>
    <div class="rrweb-create">
      <el-button @click="crateWeb">开始录制</el-button>
      <el-button @click="saveWeb">保存录制</el-button>
      <el-button @click="getInfo">回放录屏</el-button>
      <video src="http://vod.v.jstv.com/video/2023/5/1/2023511682913339999_561_13363.mp4" autoplay controls></video>
    </div>
    <div id="replaycontent" style="width: 1000px;height: 500px;background-color: #cccccc"></div>
  </el-card>
</template>
<script>
import { record } from 'rrweb'
import 'rrweb-player/dist/style.css'
import rrwebPlayer from 'rrweb-player'
import Scan from './Scan.vue'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Rrweb',
  components: {
    Scan
  },
  data () {
    return {
      events: []
    }
  },
  props: {},
  watch: {},
  methods: {
    // 开始录屏
    crateWeb () {
      const _this = this
      _this.events = []
      record({
        emit (event) {
          // 用任意方式存储 event
          _this.events.push(event)
          // _this.$store.commit('getEvents', _this.events)
        }
      })
    },
    // 保存录屏
    saveWeb () {
      // console.log(this.events)
      // this.$http.post('/record/create/setCreate', {
      //   events: this.events
      // }).then(({ data: res }) => {
      //   this.crateWeb()
      // }).catch(() => {
      //   this.crateWeb()
      // })
    },
    // 回放录屏
    getInfo () {
      console.log(this.events)
      var events = this.events
      
      // this.$http.get('/record/create/getInfo', {
      //   params: {
      //     id: 18
      //   }
      // }).then(({ data: res }) => {
      //   const events = JSON.parse(res.data.events)
      // eslint-disable-next-line no-new,new-cap
      new rrwebPlayer({
        target: document.getElementById('replaycontent'),
        data: {
          events
        }
      })
      // }).catch(() => {
      //   this.crateWeb()
      // })
    }
  },
  computed: {},
  created () {},
  mounted () {}
}
</script>
<style lang="scss" scoped>
</style>