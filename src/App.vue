<template>
  <div id="app">
    <TGS />
  </div>
</template>

<script>
import TGS from './components/TGS.vue';

export default {
  name: 'App',
  components: {
    TGS
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
