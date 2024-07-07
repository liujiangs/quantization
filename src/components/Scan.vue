<template>
  <div class="scan-page">
    <!-- <img class="scanCode" :src="require('@/assets/referral/scanCode.png')" alt="" @click="openScan()"> -->
    <div class="des" @click="openScan()">
      扫一扫患者电子健康卡，添加就诊卡
    </div>
    <div class="btn" @click="$router.push('/doctor/referral/patientInfoInput')">
      <i class="el-icon-circle-plus-outline"></i>
      无就诊卡，点击申请
    </div>
    <div v-if="showScan" class="scan" @click="showScan = false">
      <video ref="video" id="video" class="scan-video" autoplay></video>
      <!-- 提示语 -->
      <div v-show="tipShow" class="scan-tip">{{ tipMsg }}</div>
    </div>
  </div>
</template>

<script>
import { BrowserMultiFormatReader } from '@zxing/library';
export default {
  name: 'RemoteConsultationMobilScan',

  data() {
    return {
      showScan: false,
      codeReader: null,
      tipShow: false,  // 是否展示提示
      tipMsg: '',  // 提示文本内容
      scanText: '',  // 扫码结果文本内容
    };
  },

  mounted() {
    this.$store.getters.referralInfo = {}
  },

  methods: {
    async openScan() {  // 初始化摄像头
      this.showScan = true
      this.codeReader = await new BrowserMultiFormatReader();
      this.codeReader.getVideoInputDevices().then(videoDevices => {
        this.tipMsg = '正在调用摄像头...';
        this.tipShow = true;
        console.log('get-videoDevices', videoDevices);

        // 默认获取摄像头列表里的最后一个设备id，通过几部测试机发现一般前置摄像头位于列表里的前面几位，所以一般获取最后一个的是后置摄像头
        let firstDeviceId = videoDevices[videoDevices.length - 1].deviceId; 
        // 一般获取了手机的摄像头列表里不止一个，有的手机摄像头高级多层，会有变焦摄像头等情况，需要做处理
        if (videoDevices.length > 1) {
          // 一般通过判断摄像头列表项里的 label 字段，'camera2 0, facing back' 字符串含有 'back' 和 '0'，大部分机型是这样，如果有些机型没有，那就还是默认获取最后一个
          firstDeviceId = videoDevices.find(el => { return el.label.indexOf('back') > -1 && el.label.indexOf('0') > -1 }) ? 
            videoDevices.find(el => { return el.label.indexOf('back') > -1 && el.label.indexOf('0') > -1 }).deviceId : 
            videoDevices[videoDevices.length - 1].deviceId;
        }
        console.log('get-firstDeviceId', firstDeviceId);

        this.decodeFromInputVideoFunc(firstDeviceId);
      }).catch(err => {
        this.tipShow = false;
        console.error(err);
      });
    },
    decodeFromInputVideoFunc(firstDeviceId) {  // 使用摄像头扫描
      this.codeReader.reset(); // 重置
      this.codeReader.decodeFromInputVideoDeviceContinuously(firstDeviceId, 'video', (result, err) => {
        console.error(err);
        this.tipMsg = '正在识别...';
        if (result) {
          console.log('扫码结果', result);
          this.scanText = result.text;
          if (this.scanText) {
            this.tipShow = false;
            // alert(this.scanText)
            this.codeReader.reset()
            this.showScan = false

            // this.$store.getters.referralInfo.info = 
            this.$router.push('/doctor/referral/patientInfo?cardNo='+this.scanText)
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.scan-page {
  height: 100vh;
  background-size: 100%;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 16px;
}
.scanCode {
  width: 125px;
  height: 125px;
}
.des {
  font-size: 14px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  color: rgba(0,0,0,0.53);
  margin: 16px 0 24px;
}
.btn {
  height: 34px;
  width: 100%;
  line-height: 34px;
  border-radius: 4px 4px 4px 4px;
  border: 1px dashed rgba(0,0,0,0.14);
  font-size: 12px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  color: #808080;
  text-align: center;
}
.scan{
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  min-height: 100vh;
  background-color: #363636;
  overflow-y: hidden;
  .scan-video{
    height: 85vh;
  }
  .scan-tip{
    width: 100vw;
    text-align: center;
    color: white;
    font-size: 5vw;
  }
}
</style>