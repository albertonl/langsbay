<template>
  <!-- Main application -->
  <div id="app">
    <!-- Burger navbar -->
    <div id="navbar">
      <langsbay-navbar v-if="auth" v-bind:username="username" />
      <langsbay-navbar v-else noauth />
      <langsbay-navbar-overlay />
    </div>

    <!-- Main -->
    <router-view />

    <!-- Footer -->
    <div id="footer">
      <langsbay-footer />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        auth: null,
        username: null
      }
    },
    async created() {
      // #view-data will be automatically rendered into the appropriate
      // template by Django as a JSON object.
      const data = JSON.parse(document.getElementById('view-data').textContent);
      this.auth = data.auth;
      this.username = data.auth ? data.username : null;
    }
  };
</script>
