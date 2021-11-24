<template>
  <div id="wrapper">
    <span :key="key" v-for="(key, index) in keysFromMainProcess">
      {{ key }}
      <span v-if="index < keysFromMainProcess.length - 1">+</span>
    </span>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

export default {
  name: 'MainPage',
  data () {
    return {
      keysFromMainProcess: []
    }
  },
  created () {
    console.log('created');
    ipcRenderer.addListener('current-keys-change', (event, keys) => {
      this.keysFromMainProcess = keys;
      console.log(this.keysFromMainProcess);
    });
  }
}
</script>

<style>
/* @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro'); */

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Source Sans Pro', sans-serif;
}

#wrapper {
  -webkit-app-region: drag;
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
  padding: 0 auto;
  text-align: center;
  vertical-align: middle;
  width: 100vw;
  line-height: 100vh;
}
</style>
