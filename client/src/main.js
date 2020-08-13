import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
import Browse from './components/Browse.vue'
import Profile from './components/Profile.vue'
import Settings from './components/Settings.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [{
    path: '/browse',
    component: Browse
  }, {
    path: '/u/:username',
    component: Profile
  }, {
    path: '/settings',
    component: Settings
  }, {
    path: '*',
    component: Settings
  }]
})

new Vue({
  el: '#app',
  template: '<app/>',
  components: { App },
  router: router
})
