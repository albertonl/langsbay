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
      <router-link role="button" class="btn btn-primary btn-lg btn-block font-weight-bolder raleway mt-5 mb-1" to="/settings/">Go to settings</router-link>
      <a role="button" class="btn btn-secondary btn-lg btn-block font-weight-bolder raleway mt-1" href="/accounts/logout/">Log out</a>
      <div class="mt-5">
        <router-link class="h5 text-decoration-none" to="/browse/">
          <i class="fas fa-chevron-left"></i>&nbsp;&nbsp;
          Back to main page
        </router-link>
      </div>
    </div>
    <div v-else>
      <div class="mt-5">
        <router-link class="h5 text-decoration-none" to="/">
          <i class="fas fa-chevron-left"></i>&nbsp;&nbsp;
          Back to main page
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'profile',
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
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.fetchData(to.params.username);
      });
    },
    beforeRouteUpdate (to, from, next) {
      this.self = null;
      this.username = null;
      this.points = null;
      this.dcontrib = null;
      this.rcontrib = null;
      this.date_joined = null;

      this.fetchData(to.params.username);
      next();
    },
    methods: {
      /**
       * Fetch the requested user's data to be displayed on their profile page.
       * Saves the active user's data in localStorage if requested
       * and/or pulls it from localStorage if found.
       * @param  {string} username The username of the requested user.
       * @return {undefined}
       */
      fetchData (username) {
        if (localStorage.getItem('active-user')) {
          try {
            const localData = JSON.parse(localStorage.getItem('active-user'));
            if (localData.username === username) {
              // Requesting active user
              if (parseInt(localStorage.getItem('active-user-lifespan-end')) > Date.now()) {
                // Data in localStorage is still valid
                this.self = true;
                this.username = localData.username;
                this.points = localData.settings.points;
                this.dcontrib = localData.settings.dcontrib;
                this.rcontrib = localData.settings.rcontrib;
                this.date_joined = localData.date_joined;
                return;
              } else {
                // Data in localStorage is outdated
                localStorage.removeItem('active-user');
                localStorage.removeItem('active-user-lifespan-end');
              }
            }
          } catch (e) {
            // If there are any doubts, simply remove and later replace the data in localStorage
            localStorage.removeItem('active-user');
            localStorage.removeItem('active-user-lifespan-end');
          }
        }
        // Fetch data from the API
        const request = new XMLHttpRequest();
        request.open('POST', '/api/user/');

        // eslint-disable-next-line
        request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken')); // js-cookie is imported later

        request.onload = () => {
          const data = JSON.parse(request.responseText);
          if (data.success) {
            // Request successful
            this.self = data.self;
            this.username = data.username;
            this.points = data.settings.points;
            this.dcontrib = data.settings.dcontrib;
            this.rcontrib = data.settings.rcontrib;
            this.date_joined = data.date_joined;

            // Save to local storage if it is the active user.
            if (this.self) {
              localStorage.setItem('active-user', request.responseText);
              localStorage.setItem('active-user-lifespan-end', Date.now() + 60000); // useable for 10 minutes (60000 ms) before it becomes stale
            }
          } else {
            // Request unsuccessful
            alert('The Langsbay API seems unreachable. Please, check your internet connection or try again later.');
          }
        };

        // Append data to request.
        const requestData = new FormData();
        requestData.append('u', encodeURIComponent(username));

        // Send request.
        request.send(requestData);
        return;
      }
    }
  }
</script>
