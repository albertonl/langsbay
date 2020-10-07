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
    component: Browse,
    name: 'browse',
    meta: { title: 'Browse' }
  }, {
    path: '/u/:username',
    component: Profile,
    name: 'profile',
    meta: { title: 'Profile' }
  }, {
    path: '/settings',
    component: Settings,
    name: 'settings',
    meta: { title: 'Settings' }
  }, {
    path: '/',
    component: Landing,
    name: 'landing',
    meta: { title: 'Welcome' }
  }]
})

// document.title processing
const DEFAULT_TITLE = 'Langsbay'
router.afterEach((to, from) => { // eslint-disable-line
  // Use next tick to handle router history correctly
  Vue.nextTick(() => {
    document.title = to.meta.title + ' | Langsbay' || DEFAULT_TITLE;
    document.querySelector('#navbar .burger').classList.remove('clicked');
    document.querySelector('#navbar nav').classList.remove('show');
    document.querySelector('#navbar .overlay').classList.remove('show');
    document.querySelector('body').classList.remove('overflow');
  })
})

new Vue({
  el: '#app',
  template: '<app router="main" />',
  components: { App },
  router: router
})
