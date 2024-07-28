<template>
  <el-dialog
    title="节点"
    :visible.sync="dialogVisible"
    fullscreen
    :before-close="handleClose">
    <span>
      {{ JSON.stringify(result) }}
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'TestResult',

  data() {
    return {
      dialogVisible: false,
      result: {}
    };
  },

  mounted() {
    
  },

  methods: {
    show(result) {
      this.dialogVisible = true;
      this.result = result
    },
    handleClose() {
      
    }
  },
};
</script>

<style lang="less" scoped>

</style>