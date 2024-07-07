<template>
  <div>
    <!-- -->
  </div>
</template>

<script>
import data from './data.json';
console.log(data)
export default {
  name: 'TestJson',

  data() {
    return {
      
    };
  },

  mounted() {
    
  },

  methods: {
    jiexi() {
      data.forEach(element => {
        console.log(element.name)
      });
    }
  },
};
</script>

<style lang="less" scoped>

</style>