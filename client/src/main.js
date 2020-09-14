import Vue from 'vue'
import VueRouter from 'vue-router'

import Navbar from './components/static/Navbar.vue'
import Overlay from './components/static/Overlay.vue'
import Footer from './components/static/Footer.vue'

import App from './App.vue'
import Landing from './components/LandingPage.vue'
import Browse from './components/Browse.vue'
import Profile from './components/Profile.vue'
import Settings from './components/Settings.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)

Vue.component('langsbay-navbar', Navbar)
Vue.component('langsbay-navbar-overlay', Overlay)
Vue.component('langsbay-footer', Footer)

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
    component: Landing
  }]
})

new Vue({
  el: '#app',
  template: '<app router="main" />',
  components: { App },
  router: router
})
