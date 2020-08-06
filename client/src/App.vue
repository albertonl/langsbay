<template>
  <div id="app">
    <!-- <browse></browse> -->
    <profile user="" />
  </div>
</template>

<script>
import Browse from './components/Browse.vue'
import Profile from './components/Profile.vue'

export default {
  name: 'App',
  components: {
    Browse,
    Profile
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
