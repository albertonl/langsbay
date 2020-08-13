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
          <select id="nativeLanguageSettings" class="form-control">
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
          <select id="learningLanguageSettings" class="form-control">
            <option v-bind:value="learning_lang.code" selected>{{ learning_lang.name }}</option>
          </select>
        </td>
      </tr>
    </table>

    <hr class="my-4">

    <button type="button" id="saveSettingsBtn" class="btn btn-primary btn-lg btn-block font-weight-bolder raleway mt-5 mb-1">Save changes</button>
    <a role="button" class="btn btn-secondary btn-lg btn-block font-weight-bolder raleway mt-1" v-bind:href="'/u/' + username + '/'">Cancel</a>
    <div class="mt-5"><a class="h5 text-decoration-none" href="/browse/"><i class="fas fa-chevron-left"></i>&nbsp;&nbsp;Back to main page</a></div>
  </div>
</template>

<script>
  var reloadCount = 0;
  var langsData = undefined;
  export default {
    name: 'settings',
    data() {
      return {
        username: null, // username (fetched from the API)
        email: null, // email (fetched from the API)
        native_lang: null,
        learning_lang: null
      }
    },
    async created() {
      // Fetch data from the API
      const request = new XMLHttpRequest();
      request.open('POST', '/api/user/');

      // eslint-disable-next-line
      request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));

      request.onload = () => {
        const data = JSON.parse(request.responseText);
        console.log(data);
        if (data.success) {
          // Request successful.
          reloadCount = 0;
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
        } else {
          // Request unsuccessful.
          if (data.noauth) {
            window.location.href = '/';
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
      // (Not appending any data will give back the active user's information)
      request.send();
      return;
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Populate language lists
    const request = new XMLHttpRequest();
    request.open('POST', '/get/languages/');
    // eslint-disable-next-line
    request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));

    request.onload = () => {
      langsData = JSON.parse(request.responseText);
      for (let i = 0; i < langsData.length; i++) {
        // native language select
        if (langsData[i].code !== document.getElementById('nativeLanguageSettings').value)
          document.getElementById('nativeLanguageSettings').innerHTML += `<option value="${langsData[i].code}"${langsData[i].code === document.getElementById('learningLanguageSettings').value ? ' hidden' : ''}>${langsData[i].name}</option>`;
        // learning language select
        if (langsData[i].code != document.getElementById('learningLanguageSettings').value)
          document.getElementById('learningLanguageSettings').innerHTML += `<option value="${langsData[i].code}"${langsData[i].code === document.getElementById('nativeLanguageSettings').value ? 'hidden' : ''}>${langsData[i].name}</option>`;
      }

      // Change flag and option visibility
      document.getElementById('nativeLanguageSettings').addEventListener('change', () => {
        // Change flag
        for (let i = 0; i < langsData.length; i++) {
          if (langsData[i].code === document.getElementById('nativeLanguageSettings').value) {
            document.getElementById('nativeLanguageSettingsFlag').src = `/static/learning/img/flags/${langsData[i].filename}`;
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
      });
      document.getElementById('learningLanguageSettings').addEventListener('change', () => {
        // Change flag
        for (let i = 0; i < langsData.length; i++) {
          if (langsData[i].code === document.getElementById('learningLanguageSettings').value) {
            document.getElementById('learningLanguageSettingsFlag').src = `/static/learning/img/flags/${langsData[i].filename}`;
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
      });
    };
    request.send();

    // Save changes
    document.getElementById('saveSettingsBtn').addEventListener('click', () => {
      const saveRequest = new XMLHttpRequest();
      saveRequest.open('POST', '/settings/');
      // eslint-disable-next-line
      saveRequest.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));

      saveRequest.onload = () => {
        const saveRequestData = JSON.parse(saveRequest.responseText);
        const alert = document.getElementById('settingsAlert');
        switch(saveRequestData.response) {
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
      const saveData = new FormData();
      saveData.append('email', document.getElementById('emailSettings').value);
      saveData.append('native_language', document.getElementById('nativeLanguageSettings').value);
      saveData.append('learning_language', document.getElementById('learningLanguageSettings').value);

      // Send request.
      saveRequest.send(saveData);
      return false;
    });
  });
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
