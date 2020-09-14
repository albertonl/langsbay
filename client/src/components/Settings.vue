<template>
  <!-- User Settings -->
  <div class="text-center main-content-profile my-5">
    <h1 class="poppins font-weight-bolder">{{ username }}</h1>
    <p class="h5 raleway font-weight-normal">Settings</p>

    <div class="alert mt-4" id="settingsAlert" style="display:none;">
    </div>

    <hr class="my-4">

    <table class="settings-table text-left raleway mx-auto">
      <tr class="settings-item" id="email">
        <td class="setting-des"><label for="emailSettings">Email Address</label></td>
        <td class="setting-mod"><input type="email" id="emailSettings" class="form-control" placeholder="Email address" v-bind:value="email" readonly></td>
      </tr>
      <tr class="settings-item" id="nativeLanguage">
        <td class="setting-des">
          <img id="nativeLanguageSettingsFlag" class="flag big-only" v-bind:src="'/static/learning/img/flags/' + native_lang.filename" alt="" height="36" width="36">
          <span class="big-only">&nbsp;&nbsp;</span>
          <label for="nativeLanguageSettings">I speak...</label>
        </td>
        <td class="setting-mod">
          <select v-on:change="nativeLanguageChange" id="nativeLanguageSettings" class="form-control">
            <option v-bind:value="native_lang.code" selected>{{ native_lang.name }}</option>
          </select>
        </td>
      </tr>
      <tr class="settings-item" id="learningLanguage">
        <td class="setting-des">
          <img id="learningLanguageSettingsFlag" class="flag big-only" v-bind:src="'/static/learning/img/flags/' + learning_lang.filename" alt="" height="36" width="36">
          <span class="big-only">&nbsp;&nbsp;</span>
          <label for="learningLanguageSettings">I am learning...</label>
        </td>
        <td class="setting-mod">
          <select v-on:change="learningLanguageChange" id="learningLanguageSettings" class="form-control">
            <option v-bind:value="learning_lang.code" selected>{{ learning_lang.name }}</option>
          </select>
        </td>
      </tr>
    </table>

    <hr class="my-4">

    <button v-on:click="onSaveChanges" type="button" id="saveSettingsBtn" class="btn btn-primary btn-lg btn-block font-weight-bolder raleway mt-5 mb-1">Save changes</button>
    <router-link role="button" class="btn btn-secondary btn-lg btn-block font-weight-bolder raleway mt-1" v-bind:to="'/u/' + username + '/'">Cancel</router-link>
    <div class="mt-5"><router-link class="h5 text-decoration-none" to="/browse/"><i class="fas fa-chevron-left"></i>&nbsp;&nbsp;Back to main page</router-link></div>
  </div>
</template>

<script>
  export default {
    name: 'settings',
    data() {
      return {
        loaded: false,
        username: null, // username (fetched from the API)
        email: null, // email (fetched from the API)
        native_lang: null,
        learning_lang: null,
        langsData: null, // list of languages
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.fetchData(); // fetch the active user's data
        vm.waitUntilLoaded();
      })
    },
    beforeRouteUpdate (to, from, next) {
      this.username = null;
      this.email = null;
      this.native_lang = null;
      this.learning_lang = null;

      this.fetchData(); // see above
      this.waitUntilLoaded();
      next();
    },
    methods: {
      /**
       * Fetch the active user's data to be displayed on their settings page.
       * Saves that data in localStorage and/or pulls it from there it found.
       * @return {undefined}
       */
      fetchData () {
        if (localStorage.getItem('active-user')) {
          try {
            const localData = JSON.parse(localStorage.getItem('active-user'));
            if (parseInt(localStorage.getItem('active-user-lifespan-end')) > Date.now()) {
              // Data in localStorage is still valid
              this.username = localData.username;
              this.email = localData.email;
              this.native_lang = {
                code: localData.settings.native_language.code,
                name: localData.settings.native_language.name,
                filename: localData.settings.native_language.filename
              };
              this.learning_lang = {
                code: localData.settings.learning_language.code,
                name: localData.settings.learning_language.name,
                filename: localData.settings.learning_language.filename
              };
              return;
            } else {
              // Data in localStorage is outdated
              localStorage.removeItem('active-user');
              localStorage.removeItem('active-user-lifespan-end');
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
            // Request successful.
            this.username = data.username;
            this.email = data.email;
            this.native_lang = {
              code: data.settings.native_language.code,
              name: data.settings.native_language.name,
              filename: data.settings.native_language.filename
            };
            this.learning_lang = {
              code: data.settings.learning_language.code,
              name: data.settings.learning_language.name,
              filename: data.settings.learning_language.filename
            };

            // Save to localStorage
            localStorage.setItem('active-user', request.responseText);
            localStorage.setItem('active-user-lifespan-end', Date.now() + 60000); // useable for 10 min (60000 ms) before it becomes stale
          } else {
            // Request unsuccessful.
            if (data.noauth) {
              window.location.href = '/';
              return;
            }
            alert('The Langsbay API seems unreachable. Please, check your internet connection or try again later.');
          }
          this.loaded = true;
        };

        // Send request.
        // (Not appending any data will give back the active user's information.)
        request.send();
        return;
      },
      /**
       * Fetches a list of languages from the API.
       * Saves it to localStorage and/or pulls it
       * from there if found.
       * @return {undefined}
       */
      fetchLanguages () {
        if (localStorage.getItem('languages-data')) {
          try {
            const localData = JSON.parse(localStorage.getItem('languages-data'));
            if (parseInt(localStorage.getItem('languages-data-lifespan-end')) > Date.now()) {
              // Data in localStorage is still valid
              this.langsData = localData;
              return;
            } else {
              // Data in localStorage has become stale
              localStorage.removeItem('languages-data');
              localStorage.removeItem('languages-data-lifespan-end');
            }
          } catch (e) {
            // If there are any doubts, simply remove and later replace the data in localStorage
            localStorage.removeItem('languages-data');
            localStorage.removeItem('languages-data-lifespan-end');
          }
        }
        // Populate language lists.
        const request = new XMLHttpRequest();
        request.open('POST', '/get/languages/');

        // eslint-disable-next-line
        request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));

        request.onload = () => {
          this.langsData = JSON.parse(request.responseText);
          for (let i = 0; i < this.langsData.length; i++) {
            // native language select
            if (this.langsData[i].code !== document.getElementById('nativeLanguageSettings').value)
              document.getElementById('nativeLanguageSettings').innerHTML += `<option value="${this.langsData[i].code}"${this.langsData[i].code === document.getElementById('learningLanguageSettings').value ? ' hidden' : ''}>${this.langsData[i].name}</option>`;
            // learning language select
            if (this.langsData[i].code != document.getElementById('learningLanguageSettings').value)
              document.getElementById('learningLanguageSettings').innerHTML += `<option value="${this.langsData[i].code}"${this.langsData[i].code === document.getElementById('nativeLanguageSettings').value ? 'hidden' : ''}>${this.langsData[i].name}</option>`;
          }
        };
        request.send();
      },
      /**
       * Logic to be run when the selected native language changes (see v-on:change in-template above.)
       * Shows the appropriate flag and hides the selected language in the "learning language" list
       * (you cannot learn and speak (in the sense of being native) the same language at the same time.)
       */
      nativeLanguageChange () {
        // Change flag
        for (let i = 0; i < this.langsData.length; i++) {
          if (this.langsData[i].code === document.getElementById('nativeLanguageSettings').value) {
            document.getElementById('nativeLanguageSettingsFlag').src = `/static/learning/img/flags/${this.langsData[i].filename}`;
            break;
          }
        }
        // Change visibility stuff
        let learning = document.getElementById('learningLanguageSettings');
        for (let i = 0; i < learning.options.length; i++) {
          if (learning.options[i].hidden)
            learning.options[i].hidden = false;
          if (learning.options[i].value === document.getElementById('nativeLanguageSettings').value)
            learning.options[i].hidden = true;
        }
      },
      /**
       * Same logic as nativeLanguageChange() above, but with different parameters
       * (for when the selected learning language changes.)
       */
      learningLanguageChange () {
        // Change flag
        for (let i = 0; i < this.langsData.length; i++) {
          if (this.langsData[i].code === document.getElementById('learningLanguageSettings').value) {
            document.getElementById('learningLanguageSettingsFlag').src = `/static/learning/img/flags/${this.langsData[i].filename}`;
            break;
          }
        }
        // Change visibility stuff
        let native = document.getElementById('nativeLanguageSettings');
        for (let i = 0; i < native.options.length; i++) {
          if (native.options[i].hidden)
            native.options[i].hidden = false;
          if (native.options[i].value === document.getElementById('learningLanguageSettings').value)
            native.options[i].hidden = true;
        }
      },
      /**
       * Logic to be run whenever the "save changes" button is clicked
       * (see v-on:click in-template above.)
       */
      onSaveChanges () {
        // Remove outdated data from localStorage
        localStorage.removeItem('active-user');
        localStorage.removeItem('active-user-lifespan-end');

        // Proceed with request
        const request = new XMLHttpRequest();
        request.open('POST', '/settings/');

        // eslint-disable-next-line
        request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));

        request.onload = () => {
          const data = JSON.parse(request.responseText);
          const alert = document.getElementById('settingsAlert');
          switch(data.response) {
            case 'success':
              alert.classList.remove('alert-warning', 'alert-danger');
              alert.classList.add('alert-success');
              alert.innerHTML = 'Your settings have been updated successfully.';
              break;
            case 'nochange':
              alert.classList.remove('alert-success', 'alert-danger');
              alert.classList.add('alert-warning');
              alert.innerHTML = 'You don\'t seem to have changed anything...';
              break;
            case 'emailchanged':
              alert.classList.remove('alert-success', 'alert-warning');
              alert.classList.add('alert-danger');
              alert.innerHTML = 'Sorry, you cannot change your email address.';
              break;
            case 'samelanguage':
              alert.classList.remove('alert-success', 'alert-warning');
              alert.classList.add('alert-danger');
              alert.innerHTML = 'You can\'t speak and learn the same language at the same time!';
              break;
            default:
              alert.classList.remove('alert-success', 'alert-danger');
              alert.classList.add('alert-warning');
              alert.innerHTML = 'An unknown error occurred. Your settings have not been updated.';
              break;
          }
          alert.style.display = 'block';
        };

        // Append data to request.
        const requestData = new FormData();
        requestData.append('email', document.getElementById('emailSettings').value);
        requestData.append('native_language', document.getElementById('nativeLanguageSettings').value);
        requestData.append('learning_language', document.getElementById('learningLanguageSettings').value);

        // Send request.
        request.send(requestData);
      },
      /**
       * Recursive function that checks whether the data has been loaded.
       * @return {undefined}
       */
      waitUntilLoaded () {
        if (!this.loaded) {
          setTimeout(this.waitUntilLoaded, 100); // checks if loaded every 100ms
        } else {
          return;
        }
      }
    }
  };
</script>

<style scoped>
  .setting-des, .setting-mod {
    padding-top: 25px;
    padding-bottom: 25px;
  }
  .setting-des {
    padding-right: 30px;
  }
  .setting-mod {
    padding-left: 30px;
  }
  @media only screen and (max-width: 768px) {
    .setting-des {
      padding-right: 5px;
    }
    .setting-mod {
      padding-left: 5px;
    }
  }
  @media only screen and (min-width: 768px) {
    #nativeLanguageSettingsFlag,
    #learningLanguageSettingsFlag {
      margin-right: 10px;
    }
    label[for="nativeLanguageSettings"],
    label[for="learningLanguageSettings"] {
      padding-left: 10px;
    }
  }
</style>
