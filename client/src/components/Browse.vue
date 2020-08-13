<template>
  <!-- Browse (Dashboard) page component -->
  <div class="text-center main-content-browse">
    <div class="browse-header">
      <h1 class="poppins font-weight-bolder py-3">Welcome,<span class="big-only"></span><br class="small-only">{{ username }}.</h1>
      <p class="pb-3 raleway">What will you learn today?</p>
      <input type="hidden" id="defaultLanguage" v-bind:value="learning_lang.code">
    </div>
    <div class="row">
      <div class="col-lg-6 col-sm-12 mt-3">
        <h2 class="h3 poppins font-weight-bolder mb-4"><img class="flag" id="dictionaryFlag" v-bind:src="'/static/learning/img/flags/' + learning_lang.filename" v-bind:alt="learning_lang.name" height="36" width="36">&nbsp;&nbsp;<a class="text-decoration-none blacklink" href="/dictionary/">Dictionary</a></h2>
        <div class="mx-auto search-input-group">
          <div class="input-group ui-widget">
            <label for="dictionarySearch" class="sr-only">Browse the dictionary</label>
            <input type="text" id="dictionarySearch" class="form-control" v-bind:placeholder="'Browse the ' + learning_lang.name + ' dictionary...'" aria-label="Dictionary Search">
            <span class="input-btn-group">
              <button type="button" class="btn btn-primary" id="dictionarySearchToggle"><i class="fas fa-search" title="Go"></i></button>
            </span>
          </div>
          <div class="mx-5 mt-3">
            <select id="dictionaryLanguage" class="form-control">
              <optgroup label="My Languages">
                <option v-bind:value="learning_lang.code" selected>{{ learning_lang.name }}</option>
                <option v-bind:value="native_lang.code">{{ native_lang.name }}</option>
              </optgroup>
            </select>
          </div>
          <div>
            <!-- <span style="cursor:default;">&nbsp;</span> -->
          </div>
        </div>

        <!-- 5 most recent terms -->
        <h3 class="h4 raleway mt-4">Most recent terms in {{ learning_lang.name }}</h3>
        <p class="raleway text-muted mb-3">Crawled just for you :)</p>
        <div v-for="term in terms" class="card browse-term mx-5 mb-3" v-bind:data-ident="term.id" v-bind:key="term.id">
          <div class="card-body">
            <p class="h4 poppins font-weight-bold">{{ term.lemma }}</p>
            <p class="h6 raleway font-weight-normal text-muted">{{ term.added_date }}</p>
          </div>
        </div>
      </div>
      <hr class="my-4 d-md-none d-sm-block">
      <div class="col-lg-6 col-sm-12 mt-3">
        <h2 class="h3 poppins font-weight-bolder mb-4"><img class="flag" id="resourceFlag" v-bind:src="'/static/learning/img/flags/' + learning_lang.filename" v-bind:alt="learning_lang.name" height="36" width="36">&nbsp;&nbsp;<a class="text-decoration-none blacklink" href="#">Resources</a></h2>
        <div class="mx-auto search-input-group">
          <div class="input-group ui-widget">
            <label for="dictionarySearch" class="sr-only">Browse the resource library</label>
            <input type="text" id="resourceSearch" class="form-control" v-bind:placeholder="'Browse the ' + learning_lang.name +  ' library...'" aria-label="Library Search" title="Very soon!" readonly>
            <span class="input-btn-group">
              <button type="button" class="btn btn-primary" id="resourceSearchToggle" disabled><i class="fas fa-search" title="Go"></i></button>
            </span>
          </div>
          <div class="mx-5 mt-3">
            <select id="resourceLanguage" class="form-control" title="Very soon!" disabled>
              <optgroup label="My Languages">
                <option v-bind:value="learning_lang.code" selected>{{ learning_lang.name }}</option>
                <option v-bind:value="native_lang.code">{{ native_lang.name }}</option>
              </optgroup>
            </select>
          </div>
          <div>
            <!-- <a class="raleway" href="/resources/">Advanced search</a> -->
          </div>
        </div>

        <!-- 5 most recent resources -->
        <h3 class="h4 raleway mt-4">Most recent resources in {{ learning_lang.name }}</h3>
        <p class="raleway text-muted mb-3">What's your favorite?</p>
        <div class="card browse-resource mx-5 mb-3" data-ident="1">
          <div class="card-body">
            <p class="h4 poppins font-weight-bold red-text">(very soon!)</p>
            <p class="h6 raleway font-weight-normal text-muted">September 2020</p>
          </div>
        </div>
        <!-- <div v-for="resource in resources" class="card browse-resource mx-5 mb-3" v-bind:data-ident="resource.id" v-bind:key="resource.id">
          <div class="card-body">
            <p class="h4 poppins font-weight-bold">
              <i v-if="resource.type === 'video'" class="fas fa-video"></i>
              <i v-else-if="resource.type === 'document'" class="fas fa-file"></i>
              <i v-else-if="resource.type === 'article'" class="fas fa-newspaper"></i>
              <i v-else-if="resource.type === 'website'" class="fas fa-globe"></i>
              &nbsp;&nbsp;
              {{ resource.name }}
            </p>
            <p class="h6 raleway font-weight-normal text-muted">{{ title(resource.type) }}, {{ resource.added_date }}</p>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
  var reloadCount = 0;
  export default {
    name: 'browse',
    data() {
      return {
        username: null, // Username of the currently logged-in user.
        learning_lang: null, // User's specified learning language.
        native_lang: null, // User's specified native language.
        terms: null, // Recently-added dictionary terms in the user's learning language.
        // resources: null // Recently-added resources in the user's learning language. [DISABLED]
      }
    },
    async created() {
      // Fetch user data from the API.
      const request = new XMLHttpRequest();
      request.open('POST', '/api/browse_data/');

      // eslint-disable-next-line
      request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken')); // js-cookie is imported later

      request.onload = () => {
        const data = JSON.parse(request.responseText);
        if (data.success) {
          // Request successful
          reloadCount = 0;
          this.username = data.username;
          this.learning_lang = data.learning_language;
          this.native_lang = data.native_language;
          this.terms = data.terms;
        } else {
          // Request unsuccessful
          if (data.noauth) {
            window.location.href = '/'; // if the user is not authenticated, redirect to main page
            return;
          }
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

      // Send request.
      request.send();
      return;
    },
    computed: {
      /*
        Capitalizes the first letter of each word in a string.
        @param {string} str The string to capitalize.
        @return {string} The capitalized string.
      */
      title: function (str) {
        let splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
          splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
      }
    }
  }
</script>
