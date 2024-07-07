<template>
  <div class="record-page">
    <div style="margin-bottom: 15px;">
      <el-button @click="startRecording" :disabled="videoStart" size="small">开始录制</el-button>
      <el-button @click="stopRecording" :disabled="!videoStart" size="small" id="btn-stop-recording">结束录制</el-button>
    </div>
    <video controls autoplay playsinline ref="video" width="400" height="300"></video>
  </div>
</template>
 
<script>
import RecordRTC from 'recordrtc'
export default {
  name: 'screenRecord',
  data () {
    return {
      video: null,
      videoStart: false,
      recorder: null
    }
  },
  created () {
    console.log(navigator.getDisplayMedia)
    if (!navigator.getDisplayMedia && !navigator.mediaDevices.getDisplayMedia) {
      const error = 'Your browser does NOT support the getDisplayMedia API.'
      throw new Error(error)
    }
  },
  mounted () {
    this.video = document.querySelector('video')
  },
  methods: {
    // 调用获取显示媒体
    invokeGetDisplayMedia (success, error) {
      const displaymediastreamconstraints = {
        video: {
          displaySurface: 'window', // monitor, window, application, browser
          logicalSurface: false,
          cursor: 'always' // never, always, motion
        }
      }
      // above constraints are NOT supported YET
      // that's why overridnig them
 
      // displaymediastreamconstraints = {
      //   video: true
      // }
      if (navigator.mediaDevices.getDisplayMedia) {
        console.log(navigator.mediaDevices.getDisplayMedia(displaymediastreamconstraints))
        navigator.mediaDevices.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error)
      } else {
        navigator.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error)
      }
    },
    // 捕获屏幕
    captureScreen (callback) {
      this.invokeGetDisplayMedia(
        screen => {
          console.log(screen)
          this.addStreamStopListener(screen, () => {
            //
          })
          callback(screen)
        },
        function (error) {
          console.error(error)
          alert('Unable to capture your screen. Please check console logs.\n' + error)
        }
      )
    },
    addStreamStopListener (stream, callback) {
      stream.addEventListener(
        'ended',
        function () {
          callback()
          callback = function () {}
        },
        false
      )
      stream.addEventListener(
        'inactive',
        function () {
          callback()
          callback = function () {}
        },
        false
      )
      stream.getTracks().forEach(track => {
        track.addEventListener(
          'ended',
          () => {
            this.stopRecording()
            callback()
            callback = function () {}
          },
          false
        )
        track.addEventListener(
          'inactive',
          function () {
            callback()
            callback = function () {}
          },
          false
        )
      })
    },
    startRecording () {
      this.captureScreen(screen => {
        this.video.srcObject = screen
        this.recorder = RecordRTC(screen, {
          type: 'video'
        })
        this.recorder.startRecording()
        // release screen on stopRecording
        this.recorder.screen = screen
        this.videoStart = true
      })
    },
    stopRecordingCallback () {
      this.video.src = this.video.srcObject = null
      this.video.src = URL.createObjectURL(this.recorder.getBlob())
      // 如果需要下载录屏文件可加上下面代码
      // const url = URL.createObjectURL(this.recorder.getBlob())
      // const a = document.createElement('a')
      // document.body.appendChild(a)
      // a.style.display = 'none'
      // a.href = url
      // a.download = new Date() + '.mp4'
      // a.click()
      // window.URL.revokeObjectURL(url)
      // 以上是下载所需代码
      this.recorder.screen.stop()
      this.recorder.destroy()
      this.recorder = null
      this.videoStart = false
    },
    stopRecording () {
      this.recorder.stopRecording(this.stopRecordingCallback)
    }
  }
}
</script>
 
<style scoped>
</style>