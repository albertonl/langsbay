<template>
  <!-- User profile page -->
  <div class="text-center main-content-profile my-5">
    <h1 class="poppins font-weight-bolder">{{ username }}</h1>
    <p class="h5 raleway font-weight-normal">{{ points }} points</p>

    <hr class="my-4">

    <p class="h3 h3-small font-weight-normal">
      <i class="fas fa-book"></i>&nbsp;&nbsp;
      <span class="poppins small-only">Dictionary points:</span>
      <span class="poppins big-only">Dictionary contributions:</span>&nbsp;
      <span class="raleway">{{ dcontrib }}</span>
    </p>
    <p class="h3 h3-small font-weight-normal text-muted">
      <i class="fas fa-newspaper"></i>&nbsp;&nbsp;
      <span class="poppins small-only">Resource points:</span>
      <span class="poppins big-only">Resource contributions:</span>&nbsp;
      <span class="raleway">{{ rcontrib }}</span>
    </p>

    <hr class="my-4">

    <div class="h4 h4-small raleway font-weight-normal"><i>Member since {{ date_joined }}</i></div>

    <div v-if="self">
      <a role="button" class="btn btn-primary btn-lg btn-block font-weight-bolder raleway mt-5 mb-1" href="/settings/">Go to settings</a>
      <a role="button" class="btn btn-secondary btn-lg btn-block font-weight-bolder raleway mt-1" href="/accounts/logout/">Log out</a>
      <div class="mt-5">
        <a class="h5 text-decoration-none" href="/browse/">
          <i class="fas fa-chevron-left"></i>&nbsp;&nbsp;
          Back to main page
        </a>
      </div>
    </div>
    <div v-else>
      <div class="mt-5">
        <a class="h5 text-decoration-none" href="/">
          <i class="fas fa-chevron-left"></i>&nbsp;&nbsp;
          Back to main page
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  var reloadCount = 0;
  export default {
    name: 'profile',
    props: {
      user: String // username
    },
    data() {
      return {
        self: null, // fetched user == active user
        username: null, // username (fetched from the API)
        points: null, // "general" points (e.g. Reddit karma)
        dcontrib: null, // dictionary contributions
        rcontrib: null, // resource contributions
        date_joined: null // date of the user's registration
      }
    },
    async created() {
      // Fetch data from the API
      const request = new XMLHttpRequest();
      request.open('POST', `/api/user/`);

      // eslint-disable-next-line
      request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken')); // js-cookie is imported later

      request.onload = () => {
        const data = JSON.parse(request.responseText);
        if (data.success) {
          // Request successful
          reloadCount = 0;
          this.self = data.self;
          this.username = data.username;
          this.points = data.settings.points;
          this.dcontrib = data.settings.dcontrib;
          this.rcontrib = data.settings.rcontrib;
          this.date_joined = data.date_joined;
        } else {
          // Request unsuccessful
          if (reloadCount < 3) { // only three reloads in order to avoid abuse
            if (data.error_code && data.error_message) {
              if (confirm(`Langsbay API - HTTP ${data.error_code}: ${data.error_message}\nWould you like to force a new request to the API?`)) {
                reloadCount++;
                this.$forceUpdate();
              }
            } else {
              if (confirm('The Langsbay API seems unreachable.\nWould you like to force a new request to the API?')) {
                reloadCount++;
                this.$forceUpdate();
              }
            }
          } else {
            alert('The Langsbay API seems unreachable. Please, check your internet connection or try again later.');
          }
        }
      };

      // Append data to request.
      const requestData = new FormData();
      requestData.append('u', encodeURIComponent(this.$props.user));

      // Send request.
      request.send(requestData);
      return;
    }
  }
</script>
