document.addEventListener('DOMContentLoaded', () => {
  let current_input = '';
  document.getElementById('lemmaValidateBtn').addEventListener('click', () => {
    // Lemma validation
    const request = new XMLHttpRequest();
    request.open('POST', '/dictionary/check/lemma/');
    request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));

    request.onload = () => {
      const data = JSON.parse(request.responseText);
      let validate = document.getElementById('lemmaValidation');
      let lemmaInput = document.getElementById('lemmaInput').value;
      if (data.status === 'term_available') {
        validate.classList.remove('alert-danger', 'alert-warning', 'alert-info');
        validate.classList.add('alert-success');
        validate.innerHTML = 'Available!';
        validate.style.display = 'block';

        current_input = lemmaInput;
        document.getElementById('dictionaryAddSubmitBtn').disabled = false;
      } else if (data.status === 'term_exists') {
        validate.classList.remove('alert-success', 'alert-warning', 'alert-info');
        validate.classList.add('alert-danger');
        validate.innerHTML = `The term "${data.lemma}" already exists. Please <a class="alert-link" href="/dictionary/${data.language}/term/${data.id}" target="_blank">review it</a> before proceeding.`;
        validate.style.display = 'block';

        document.getElementById('dictionaryAddSubmitBtn').disabled = true;
      }
    };
    // Append data to request.
    const requestData = new FormData();
    if (isEmptyOrSpaces(document.getElementById('dictionaryLanguage').value)) {
      document.getElementById('language').classList.add('was-validated');
    } else {
      requestData.append('lang', document.getElementById('dictionaryLanguage').value);
      if (isEmptyOrSpaces(document.getElementById('lemmaInput').value)) {
        document.getElementById('lemmaValidation').classList.remove('alert-danger', 'alert-success', 'alert-info');
        document.getElementById('lemmaValidation').classList.add('alert-warning');
        document.getElementById('lemmaValidation').innerHTML = 'You can\'t check an empty lemma!';
        document.getElementById('lemmaValidation').style.display = 'block';

        document.getElementById('dictionaryAddSubmitBtn').disabled = true;
        return false;
      }
      requestData.append('term', document.getElementById('lemmaInput').value);

      // Send request.
      request.send(requestData);
      return false;
    }
  });

  // Populate second select list with the complete list of languages
  const request = new XMLHttpRequest();
  request.open('POST', '/get/languages/');
  request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));

  request.onload = () => {
    const data = JSON.parse(request.responseText);
    for (let i = 0; i < data.length; i++) {
      let content = `<option value="${data[i].code}">${data[i].name}</option>`;
      document.getElementById('dictionaryAddTranslationLanguage').innerHTML += content;
    }
    document.getElementById('dictionaryAddTranslationLanguage').addEventListener('change', e => {
      $('#dictionaryAddTranslationSearch').autocomplete({
        source: `/dictionary/autocomplete?lang=${document.getElementById('dictionaryAddTranslationLanguage').value}`
      });
      if (!isEmptyOrSpaces(document.getElementById('dictionaryAddTranslationLanguage').value)
        && document.getElementById('dictionaryAddTranslationSearch').readOnly) {
        document.getElementById('dictionaryAddTranslationSearch').readOnly = false;
      }

      // Restrict lemma in the same language as translation (vice versa starting in line ~140).
      let select = document.getElementById('dictionaryLanguage');
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].hidden && !isEmptyOrSpaces(select.options[i].value))
          select.options[i].hidden = false;
        if (select.options[i].value === document.getElementById('dictionaryAddTranslationLanguage').value)
          select.options[i].hidden = true;
      }
    });

    // Click button on Return
    document.getElementById('dictionaryAddTranslationSearch').addEventListener('keyup', e => {
      if (isEmptyOrSpaces(document.getElementById('dictionaryAddTranslationSearch').value))
        document.getElementById('dictionaryAddTranslationToggle').disabled = true;
      else
        document.getElementById('dictionaryAddTranslationToggle').disabled = false;

      if (e.keyCode === 13) {
        document.getElementById('dictionaryAddTranslationToggle').click();
      }
    });

    // Search autocomplete
    $('#dictionaryAddTranslationSearch').autocomplete({
      source: `/dictionary/autocomplete?lang=${document.getElementById('dictionaryAddTranslationLanguage').value}`
    }).data('ui-autocomplete')._renderItem = function (ul, item) {
      var newText = String(item.value).replace(
        new RegExp(this.term, "gi"),
        "<b>$&</b>");

      return $('<li></li>')
        .data('item.autocomplete', item)
        .append("<div>" + newText + "</div>")
        .appendTo(ul);
    }

    // Check translation
    document.getElementById('dictionaryAddTranslationToggle').addEventListener('click', () => {
      const checkLemmaLang = document.getElementById('dictionaryAddTranslationLanguage').value;
      const checkLemmaTerm = document.getElementById('dictionaryAddTranslationSearch').value;
      const checkLemmaRequest = new XMLHttpRequest();
      checkLemmaRequest.open('POST', '/dictionary/check/lemma/');
      checkLemmaRequest.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));

      checkLemmaRequest.onload = () => {
        const checkLemmaData = JSON.parse(checkLemmaRequest.responseText);
        let alert = document.getElementById('dictionaryAddTranslationAlert');
        if (checkLemmaData.status === 'term_available') {
          alert.classList.remove('alert-success', 'alert-warning', 'alert-info');
          alert.classList.add('alert-danger');
          alert.innerHTML = 'That term is not registered yet or does not exist.';
          alert.style.display = 'block';
        } else if (checkLemmaData.status === 'term_exists') {
          const translationContent = `<img class="flag" src="/static/learning/img/flags/${checkLemmaData.flag_filename}" alt="${checkLemmaData.language_name} Language Flag" height="40" width="40">&nbsp;&nbsp;<a class="h5 blacklink-nohover text-decoration-none" href="/dictionary/${checkLemmaData.language}/term/${checkLemmaData.id}/" target="_blank" title="See definition (in a new window)">${checkLemmaData.lemma}</span>`;
          document.getElementById('translationIdInput').value = checkLemmaData.id;
          document.getElementById('translationContainer').innerHTML = translationContent;

          alert.classList.remove('alert-danger', 'alert-warning', 'alert-info');
          alert.classList.add('alert-success');
          alert.innerHTML = 'Sounds great!';
          alert.style.display = 'block';
        }
      };

      // Append data to request.
      const checkLemmaForm = new FormData();
      checkLemmaForm.append('lang', checkLemmaLang);
      checkLemmaForm.append('term', checkLemmaTerm);

      // Send request.
      checkLemmaRequest.send(checkLemmaForm);
      return false;
    });

    // Restrict translation in the same language as lemma.
    document.getElementById('dictionaryLanguage').addEventListener('change', e => {
      let select = document.getElementById('dictionaryAddTranslationLanguage');
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].hidden && !isEmptyOrSpaces(select.options[i].value))
          select.options[i].hidden = false;
        if (select.options[i].value === document.getElementById('dictionaryLanguage').value)
          select.options[i].hidden = true;
      }
    });

    // Disable submit on change input.
    document.getElementById('lemmaInput').addEventListener('keyup', e => {
      if (isEmptyOrSpaces(document.getElementById('lemmaInput').value) || document.getElementById('lemmaInput') !== current_input)
        document.getElementById('dictionaryAddSubmitBtn').disabled = true;
      else
        document.getElementById('dictionaryAddSubmitBtn').disabled = false;
    });
  };
  request.send();
});
