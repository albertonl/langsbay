/*
  frame.js
  Implementation of regular navbar and footer.
*/

import Vue from 'vue';
import Navbar from './components/static/Navbar.vue';
import Overlay from './components/static/Overlay.vue';
import Footer from './components/static/Footer.vue';

// Navbar and Overlay
new Vue({
  el: '#navbar',
  components: {
    langsbayNavbar: Navbar,
    langsbayNavbarOverlay: Overlay
  }
});

// Footer
new Vue({
  el: '#footer',
  components: {
    langsbayFooter: Footer
  }
});
