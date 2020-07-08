var nativeSelected = undefined;
var learningSelected = undefined;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('inputLevelRegularSignUp').addEventListener('change', () => {
    if (document.getElementById('inputLevelRegularSignUp').checked) {
      document.getElementById('inputLevelCEFROptionSignUp').disabled = true;
      document.getElementById('inputLevelRegularOptionSignUp').disabled = false;
    }
  });
  document.getElementById('inputLevelCEFRSignUp').addEventListener('change', () => {
    if (document.getElementById('inputLevelCEFRSignUp').checked) {
      document.getElementById('inputLevelRegularOptionSignUp').disabled = true;
      document.getElementById('inputLevelCEFROptionSignUp').disabled = false;
    }
  });
  document.getElementById('inputLevelRegularOptionSignUp').addEventListener('change', e => {
    document.getElementById('inputLevelRegularHiddenSignUp').value = e.target.value;
    document.getElementById('inputLevelCEFROptionSignUp').selectedIndex = 0;
  });
  document.getElementById('inputLevelCEFROptionSignUp').addEventListener('change', e => {
    document.getElementById('inputLevelCEFRHiddenSignUp').value = e.target.value;
    const select = document.getElementById('inputLevelRegularOptionSignUp');
    switch(e.target.value) {
      case 'A1':
      case 'A2':
        select.value = 'beginner';
        break;
      case 'B1':
      case 'B2':
        select.value = 'intermediate';
        break;
      case 'C1':
      case 'C2':
        select.value = 'advanced';
        break;
      default:
        location.reload();
    }
  });

  const request = new XMLHttpRequest();
  request.open('POST', '/get/languages/');
  request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));

  request.onload = () => {
    const data = JSON.parse(request.responseText);
    for (let i = 0; i < data.length; i++) {
      document.getElementById('inputNativeLanguageSignUp').innerHTML += `<option value="${data[i].code}" data-filename="${data[i].filename}">${data[i].name}</option>`;
      document.getElementById('inputLearningLanguageSignUp').innerHTML += `<option value="${data[i].code}" data-filename="${data[i].filename}">${data[i].name}</option>`;
    }
    document.getElementById('inputNativeLanguageSignUp').addEventListener('change', e => {
      // Show previous.
      for (let i = 0; i < document.getElementById('inputLearningLanguageSignUp').options.length; i++) {
        if (document.getElementById('inputLearningLanguageSignUp').options[i].value === nativeSelected) {
          document.getElementById('inputLearningLanguageSignUp').options[i].hidden = false;
          break;
        }
      }
      // Hide the new selection.
      nativeSelected = document.getElementById('inputNativeLanguageSignUp').value;
      for (let i = 0; i < document.getElementById('inputLearningLanguageSignUp').options.length; i++) {
        if (document.getElementById('inputLearningLanguageSignUp').options[i].value === nativeSelected) {
          document.getElementById('inputLearningLanguageSignUp').options[i].hidden = true;
          break;
        }
      }
      document.getElementById('nativeLanguageFlag').innerHTML = `<img src="/static/learning/img/flags/${e.target.options[e.target.selectedIndex].dataset.filename}" height="40" width="40" style="border-radius:50%;">`;
    });
    document.getElementById('inputLearningLanguageSignUp').addEventListener('change', e => {
      // Show previous.
      for (let i = 0; i < document.getElementById('inputNativeLanguageSignUp').options.length; i++) {
        if (document.getElementById('inputNativeLanguageSignUp').options[i].value === learningSelected) {
          document.getElementById('inputNativeLanguageSignUp').options[i].hidden = false;
          break;
        }
      }
      // Hide the new selection.
      learningSelected = document.getElementById('inputLearningLanguageSignUp').value;
      for (let i = 0; i < document.getElementById('inputNativeLanguageSignUp').options.length; i++) {
        if (document.getElementById('inputNativeLanguageSignUp').options[i].value === learningSelected) {
          document.getElementById('inputNativeLanguageSignUp').options[i].hidden = true;
          break;
        }
      }
      document.getElementById('learningLanguageFlag').innerHTML = `<img src="/static/learning/img/flags/${e.target.options[e.target.selectedIndex].dataset.filename}" height="40" width="40" style="border-radius:50%;">`;
    });
  };
  request.send();
});
