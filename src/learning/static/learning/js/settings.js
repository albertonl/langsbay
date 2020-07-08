var langsData = undefined;
document.addEventListener('DOMContentLoaded', () => {
  // Populate language lists
  const request = new XMLHttpRequest();
  request.open('POST', '/get/languages/');
  request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));

  request.onload = () => {
    langsData = JSON.parse(request.responseText);
    for (let i = 0; i < langsData.length; i++) {
      // native language select
      if (langsData[i].code !== document.getElementById('nativeLanguageSettings').value)
        document.getElementById('nativeLanguageSettings').innerHTML += `<option value="${langsData[i].code}"${langsData[i].code === document.getElementById('learningLanguageSettings').value ? ' hidden' : ''}>${langsData[i].name}</option>`;
      // learning language select
      if (langsData[i].code !== document.getElementById('learningLanguageSettings').value)
        document.getElementById('learningLanguageSettings').innerHTML += `<option value="${langsData[i].code}"${langsData[i].code === document.getElementById('nativeLanguageSettings').value ? ' hidden' : ''}>${langsData[i].name}</option>`;
    }

    // Change flags and option visibility
    document.getElementById('nativeLanguageSettings').addEventListener('change', e => {
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
    document.getElementById('learningLanguageSettings').addEventListener('change', e => {
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
