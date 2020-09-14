<template>
  <!-- Main application -->
  <div id="app">
    <!-- Burger navbar -->
    <div id="navbar">
      <langsbay-navbar v-if="auth" v-bind:username="username" v-bind:router="router" />
      <langsbay-navbar v-else noauth v-bind:router="router"/>
      <langsbay-navbar-overlay />
    </div>

    <!-- Main -->
    <div v-if="landing" class="intro text-left" id="backgroundimg">
      <div class="intro-text">
        No<br>
        more<br>
        courses.<br>
        <a role="button" class="btn btn-primary btn-lg" href="/accounts/signup/">Get started</a>
      </div>
    </div>
    <router-view />

    <!-- Footer -->
    <div id="footer">
      <langsbay-footer v-bind:router="router" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app',
    props: {
      router: String // the app to which the router belongs
    },
    data() {
      return {
        auth: null,
        username: null,
        landing: false,
      }
    },
    async created() {
      // #view-data will be automatically rendered into the appropriate
      // template by Django as a JSON object.
      const data = JSON.parse(document.getElementById('view-data').textContent);
      this.auth = data.info.auth;
      this.username = data.info.auth ? data.info.username : null;

      this.landing = data.info.view === 'index';
    }
  };
</script>
