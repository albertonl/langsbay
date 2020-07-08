document.addEventListener('DOMContentLoaded', () => {
  let current_input = '';
  // Section header event listeners for display.
  document.querySelectorAll('.dictionary-term-section h3').forEach(header => {
    header.addEventListener('mouseover', () => {
      header.querySelector('.modif-btn-group').style.display = 'inline';
    });
    header.addEventListener('mouseout', () => {
      header.querySelector('.modif-btn-group').style.display = 'none';
    });
    header.addEventListener('click', () => {
      header.querySelector('.modif-btn-group').style.display = header.querySelector('.modif-btn-group').style.display === 'none' ? 'inline' : 'none';
    });
  });

  // Translation event listeners for display.
  document.querySelectorAll('#translations .translation').forEach(translation => {
    translation.addEventListener('mouseover', () => {
      translation.querySelector('.modif-btn-group').style.display = 'inline';
    });
    translation.addEventListener('mouseout', () => {
      translation.querySelector('.modif-btn-group').style.display = 'none';
    });
    translation.addEventListener('click', () => {
      translation.querySelector('.modif-btn-group').style.display = translation.querySelector('.modif-btn-group').style.display === 'none' ? 'inline' : 'none';
    });
  });

  // Translation section header event listener for display.
  document.querySelector('#translations h3').addEventListener('click', () => {
    let none = undefined;
    document.querySelectorAll('#translations .translation .modif-btn-group').forEach(group => {
      none = none === undefined ? group.style.display === 'none' : none;
      group.style.display = none ? 'inline' : 'none';
    });
  });

  // Display Change Lemma modal.
  document.querySelector('[data-report="lemma"] .edit-field').addEventListener('click', () => {
    document.getElementById('changeLemmaInput').value = document.getElementById('lemma').innerHTML;
    document.getElementById('changeLemmaValidate').addEventListener('click', () => {
      const request = new XMLHttpRequest();
      request.open('POST', '/dictionary/check/lemma/');
      request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));

      request.onload = () => {
        const data = JSON.parse(request.responseText);
        let validate = document.getElementById('changeLemmaAlert');
        let input = document.getElementById('changeLemmaInput').value;
        if (data.status === 'term_available') {
          validate.classList.remove('alert-danger', 'alert-warning', 'alert-info');
          validate.classList.add('alert-success');
          validate.innerHTML = 'Available!';
          validate.style.display = 'block';

          current_input = input;
          document.getElementById('changeLemmaSubmit').disabled = false;
        } else if (data.status === 'term_exists') {
          validate.classList.remove('alert-success', 'alert-warning', 'alert-info');
          validate.classList.add('alert-danger');
          validate.innerHTML = `The term "${data.lemma}" already exists. Please <a class="alert-link" href="/dictionary/${data.language}/term/${data.id}" target="_blank">review it</a> before proceeding.`;
          validate.style.display = 'block';

          document.getElementById('changeLemmaSubmit').disabled = true;
        }
      };

      // Append data to request.
      const requestData = new FormData();
      requestData.append('lang', document.getElementById('language').dataset.language);
      if (isEmptyOrSpaces(document.getElementById('changeLemmaInput').value)) {
        document.getElementById('changeLemmaAlert').classList.remove('alert-danger', 'alert-success', 'alert-info');
        document.getElementById('changeLemmaAlert').classList.add('alert-warning');
        document.getElementById('changeLemmaAlert').innerHTML = 'You can\'t check an empty lemma!';
        document.getElementById('changeLemmaAlert').style.display = 'block';

        document.getElementById('changeLemmaSubmit').disabled = true;
        return false;
      }
      requestData.append('term', document.getElementById('changeLemmaInput').value);

      // Send request.
      request.send(requestData);
      return false;
    });
    document.getElementById('changeLemmaAlert').style.display = 'none';
    $('#changeLemmaModal').modal('toggle');
  });

  // Disable submit on change input.
  document.getElementById('changeLemmaInput').addEventListener('keyup', e => {
    if (isEmptyOrSpaces(document.getElementById('changeLemmaInput').value) || document.getElementById('changeLemmaInput').value !== current_input)
      document.getElementById('changeLemmaSubmit').disabled = true;
    else {
      document.getElementById('changeLemmaSubmit').disabled = false;
      if (e.keyCode === 13) // Click button on Return.
        document.getElementById('changeLemmaSubmit').click();
    }
  });

  // Submit new lemma.
  document.getElementById('changeLemmaSubmit').addEventListener('click', () => {
    const request = new XMLHttpRequest();
    request.open('POST', '/dictionary/update_term/');
    request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));

    request.onload = () => {
      const data = JSON.parse(request.responseText);
      if (data.success) {
        $('#changeLemmaModal').modal('hide');
        window.location.reload(true);
      } else {
        let alert = document.getElementById('changeLemmaAlert');
        alert.classList.remove('alert-success', 'alert-warning', 'alert-info');
        alert.classList.add('alert-danger');
        alert.innerHTML = 'There was an error processing your request.';
        alert.style.display = 'block';
      }
    };

    // Append data to request.
    const requestData = new FormData();
    requestData.append('id', parseInt(document.getElementById('lemma').dataset.termid));
    requestData.append('part', 'lemma');
    requestData.append('new', document.getElementById('changeLemmaInput').value);

    // Send request.
    request.send(requestData);
    return false;
  });

  // Display Change Field Short modal.
  document.querySelectorAll('[data-report="example_sent1"] .edit-field, [data-report="example_sent2"] .edit-field').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('changeFieldShortInput').value = button.parentNode.dataset.report === 'example_sent1' ? document.querySelector('#sentence1 p i').innerHTML === '(not available)' ? '' : document.querySelector('#sentence1 p i').innerHTML : document.querySelector('#sentence2 p i').innerHTML === '(not available)' ? '' : document.querySelector('#sentence2 p i').innerHTML;
      current_input = document.getElementById('changeFieldShortInput').value;
      document.getElementById('changeFieldShortPart').value = button.parentNode.dataset.report;
      document.getElementById('changeFieldShortAlert').style.display = 'none';
      $('#changeFieldShortModal').modal('toggle');
    });
  });

  // Disable submit on same or empty input.
  document.getElementById('changeFieldShortInput').addEventListener('keyup', e => {
    if (isEmptyOrSpaces(document.getElementById('changeFieldShortInput').value) || document.getElementById('changeFieldShortInput').value === current_input)
      document.getElementById('changeFieldShortSubmit').disabled = true;
    else
      document.getElementById('changeFieldShortSubmit').disabled = false;
  });

  // Submit new short field.
  document.getElementById('changeFieldShortSubmit').addEventListener('click', () => {
    const request = new XMLHttpRequest();
    request.open('POST', '/dictionary/update_term/');
    request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));

    request.onload = () => {
      const data = JSON.parse(request.responseText);
      if (data.success) {
        $('#changeFieldShortModal').modal('hide');
        window.location.reload(true);
      } else {
        let alert = document.getElementById('changeFieldShortAlert');
        alert.classList.remove('alert-success', 'alert-warning', 'alert-info');
        alert.classList.add('alert-danger');
        alert.innerHTML = 'There was an error processing your request.';
        alert.style.display = 'block';
      }
    };

    // Append data to request.
    const requestData = new FormData();
    requestData.append('id', parseInt(document.getElementById('lemma').dataset.termid));
    requestData.append('part', document.getElementById('changeFieldShortPart').value);
    requestData.append('new', document.getElementById('changeFieldShortInput').value);

    // Send request.
    request.send(requestData);
    return false;
  });

  // Display Change Field Long modal.
  document.querySelectorAll('[data-report="definition"] .edit-field, [data-report="etymology"] .edit-field').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('changeFieldLongInput').value = document.querySelector(`#${button.parentNode.dataset.report} p`).innerHTML === '(not available)' ? '' : document.querySelector(`#${button.parentNode.dataset.report} p`).innerHTML;
      current_input = document.getElementById('changeFieldLongInput').value;
      document.getElementById('changeFieldLongPart').value = button.parentNode.dataset.report;
      document.getElementById('changeFieldLongAlert').style.display = 'none';
      $('#changeFieldLongModal').modal('toggle');
    });
  });

  // Disable submit on same or empty input.
  document.getElementById('changeFieldLongInput').addEventListener('keyup', e => {
    if (isEmptyOrSpaces(document.getElementById('changeFieldLongInput').value) || document.getElementById('changeFieldLongInput').value === current_input)
      document.getElementById('changeFieldLongSubmit').disabled = true;
    else
      document.getElementById('changeFieldLongSubmit').disabled = false;
  });

  // Submit new long field.
  document.getElementById('changeFieldLongSubmit').addEventListener('click', () => {
    const request = new XMLHttpRequest();
    request.open('POST', '/dictionary/update_term/');
    request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));

    request.onload = () => {
      const data = JSON.parse(request.responseText);
      if (data.success) {
        $('#changeFieldLongModal').modal('hide');
        window.location.reload(true);
      } else {
        let alert = document.getElementById('changeFieldLongAlert');
        alert.classList.remove('alert-success', 'alert-warning', 'alert-info');
        alert.classList.add('alert-danger');
        alert.innerHTML = 'There was an error processing your request.';
        alert.style.display = 'block';
      }
    };

    // Append data to request.
    const requestData = new FormData();
    requestData.append('id', parseInt(document.getElementById('lemma').dataset.termid));
    requestData.append('part', document.getElementById('changeFieldLongPart').value);
    requestData.append('new', document.getElementById('changeFieldLongInput').value);

    // Send request.
    request.send(requestData);
    return false;
  });

  // Display Change Translation modal.
  document.querySelectorAll('[data-report="translation"] .edit-field').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('changeTranslationInput').value = button.parentNode.parentNode.querySelector('a').innerHTML;
      current_input = document.getElementById('changeTranslationInput').value;
      document.getElementById('changeTranslationPart').value = button.parentNode.dataset.report;
      document.getElementById('changeTranslationId').value = button.parentNode.parentNode.querySelector('a').dataset.tid;
      document.getElementById('changeTranslationLanguage').value = button.parentNode.parentNode.querySelector('a').dataset.language;
      document.getElementById('changeTranslationHelper').innerHTML = `Please, introduce the new ${button.parentNode.parentNode.querySelector('img').title} translation:`;
      document.getElementById('changeTranslationInput').placeholder = `Browse the ${button.parentNode.parentNode.querySelector('img').title} dictionary...`;


      // Search autocomplete.
      $('#changeTranslationInput').autocomplete({
        source: `/dictionary/autocomplete?lang=${button.parentNode.parentNode.querySelector('a').dataset.language}`
      }).data("ui-autocomplete")._renderItem = function (ul, item) {
        var newText = String(item.value).replace(
          new RegExp(this.term, "gi"),
          "<b>$&</b>");
        return $("<li></li>")
          .data("item.autocomplete", item)
          .append("<div>" + newText + "</div>")
          .appendTo(ul);
      };

      // Check lemma on select.
      document.getElementById('changeTranslationSelect').addEventListener('click', () => {
        const request = new XMLHttpRequest();
        request.open('POST', '/dictionary/check/lemma/');
        request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));

        request.onload = () => {
          const data = JSON.parse(request.responseText);
          let validate = document.getElementById('changeTranslationAlert');
          let input = document.getElementById('changeTranslationInput');
          if (data.status === 'term_available') {
            validate.classList.remove('alert-success', 'alert-warning', 'alert-info');
            validate.classList.add('alert-danger');
            validate.innerHTML = `The term "${input.value}" is not yet registered, or does not exist. You can <a href="/dictionary/add/" class="alert-link" target="_blank">register it now</a>.`;
            validate.style.display = 'block';

            document.getElementById('changeTranslationSubmit').disabled = true;
          } else if (data.status === 'term_exists') {
            validate.classList.remove('alert-danger', 'alert-warning', 'alert-info');
            validate.classList.add('alert-success');
            validate.innerHTML = 'Sounds good!';
            validate.style.display = 'block';

            document.getElementById('changeTranslationSelection').innerHTML = `<a href="/dictionary/${data.language}/term/${data.id}/" class="h5 raleway blacklink-nohover text-decoration-none" target="_blank">${data.lemma}</a>`;
            current_input = document.getElementById('changeTranslationInput').value;
            document.getElementById('changeTranslationInput').value = '';
            document.getElementById('changeTranslationSubmit').disabled = false;
          }
        };

        // Append data to request.
        const requestData = new FormData();
        requestData.append('lang', document.getElementById('changeTranslationLanguage').value);
        if (isEmptyOrSpaces(document.getElementById('changeTranslationInput').value)) {
          document.getElementById('changeTranslationAlert').classList.remove('alert-danger', 'alert-success', 'alert-info');
          document.getElementById('changeTranslationAlert').classList.add('alert-warning');
          document.getElementById('changeTranslationAlert').innerHTML = 'You can\'t select an empty term!';
          document.getElementById('changeTranslationAlert').style.display = 'block';

          document.getElementById('changeTranslationSubmit').disabled = true;
          return false;
        } else if (document.getElementById('changeTranslationInput').value.toLowerCase() === document.querySelector(`[data-tid="${document.getElementById('changeTranslationId').value}"]`).innerHTML.toLowerCase()) {
          document.getElementById('changeTranslationAlert').classList.remove('alert-danger', 'alert-success', 'alert-info');
          document.getElementById('changeTranslationAlert').classList.add('alert-warning');
          document.getElementById('changeTranslationAlert').innerHTML = 'You can\'t select the old term!';
          document.getElementById('changeTranslationAlert').style.display = 'block';

          document.getElementById('changeTranslationSubmit').disabled = true;
          return false;
        }
        requestData.append('term', document.getElementById('changeTranslationInput').value);

        // Send request.
        request.send(requestData);
        return false;
      });
      document.getElementById('changeTranslationAlert').style.display = 'none';
      $('#changeTranslationModal').modal('toggle');
    });
  });

  // Disable submit on same or empty input.
  document.getElementById('changeTranslationInput').addEventListener('keyup', e => {
    let input = document.getElementById('changeTranslationInput');
    let submit = document.getElementById('changeTranslationSubmit');
    if (isEmptyOrSpaces(input.value) || input.value === current_input || input.value.toLowerCase() === document.querySelector(`[data-tid="${document.getElementById('changeTranslationId').value}"]`).innerHTML.toLowerCase())
      submit.disabled = true;
    else {
      submit.disabled = false;
      if (e.keyCode === 13) // Click button on Return.
        document.getElementById('changeTranslationSelect').click();
    }
  });

  // Submit new translation.
  document.getElementById('changeTranslationSubmit').addEventListener('click', () => {
    const request = new XMLHttpRequest();
    request.open('POST', '/dictionary/update_term/');
    request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));

    request.onload = () => {
      const data = JSON.parse(request.responseText);
      if (data.success) {
        $('#changeTranslationModal').modal('hide');
        window.location.reload(true);
      } else {
        let alert = document.getElementById('changeTranslationAlert');
        alert.classList.remove('alert-success', 'alert-warning', 'alert-info');
        alert.classList.add('alert-danger');
        alert.innerHTML = 'There was an error processing your request.';
        alert.style.display = 'block';
      }
    };

    // Append data to request.
    const requestData = new FormData();
    requestData.append('id', parseInt(document.getElementById('lemma').dataset.termid));
    requestData.append('part', document.getElementById('changeTranslationPart').value);
    requestData.append('new', document.querySelector('#changeTranslationSelection a').innerText);
    requestData.append('old', parseInt(document.getElementById('changeTranslationId').value));
    requestData.append('lang', document.getElementById('changeTranslationLanguage').value);

    // Send request.
    request.send(requestData);
    return false;
  });

  /* **** REPORTING **** */

  // Display Report Field modal.
  document.querySelectorAll('.report-field').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('reportFieldPart').value = button.parentNode.dataset.report;
      if (button.parentNode.dataset.report === 'translation')
        document.getElementById('reportFieldAux').value = button.parentNode.parentNode.querySelector('a').dataset.tid;

      document.getElementsByName('report_field_reason').forEach(radio => {
        radio.addEventListener('click', () => {
          if (document.querySelector('input[name="report_field_reason"]:checked').value === 'content_other') {
            document.getElementById('reportFieldOptionCustom').readOnly = false;
            document.getElementById('reportFieldOptionCustom').addEventListener('keyup', e => {
              document.getElementById('reportFieldSubmit').disabled = isEmptyOrSpaces(document.getElementById('reportFieldOptionCustom').value);
            });
          } else {
            document.getElementById('reportFieldOptionCustom').readOnly = true;
            document.getElementById('reportFieldSubmit').disabled = false;
          }
        });
      });

      try {
        document.querySelector('[name="report_field_reason"]:clicked').checked = false;
      } catch (e) {}
      document.getElementById('reportFieldAlert').style.display = 'none';
      document.getElementById('reportFieldCancel').innerHTML = 'Cancel';
      document.getElementById('reportFieldSubmit').disabled = true;
      $('#reportFieldModal').modal('toggle');
    });
  });

  // Submit report.
  document.getElementById('reportFieldSubmit').addEventListener('click', () => {
    const request = new XMLHttpRequest();
    request.open('POST', '/dictionary/report/');
    request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));

    request.onload = () => {
      const data = JSON.parse(request.responseText);
      let alert = document.getElementById('reportFieldAlert');
      if (data.success) {
        alert.classList.remove('alert-danger', 'alert-warning', 'alert-info');
        alert.classList.add('alert-success');
        alert.innerHTML = 'Your report has been submitted! You can close this pop-up now.';
        alert.style.display = 'block';

        try {
          document.querySelector('[name="report_field_reason"]:checked').checked = false;
        } catch (e) {}
        document.getElementById('reportFieldOptionCustom').readOnly = true;
        document.getElementById('reportFieldOptionCustom').value = '';
        document.getElementById('reportFieldDetails').value = '';
        document.getElementById('reportFieldSubmit').disabled = true;
        document.getElementById('reportFieldCancel').innerHTML = 'Close';
      } else {
        alert.classList.remove('alert-success', 'alert-warning', 'alert-info');
        alert.classList.add('alert-danger');
        alert.innerHTML = 'There was an error processing your request.';
        alert.style.display = 'block';

        document.getElementById('reportFieldCancel').innerHTML = 'Cancel';
        document.getElementById('reportFieldSubmit').disabled = true;
      }
    };

    // Append data to request.
    const requestData = new FormData();
    requestData.append('id', parseInt(document.getElementById('lemma').dataset.termid));
    requestData.append('part', document.getElementById('reportFieldPart').value);
    if (document.getElementById('reportFieldPart').value === 'translation')
      requestData.append('target', parseInt(document.getElementById('reportFieldAux').value));
    requestData.append('reason', document.querySelector('[name="report_field_reason"]:checked').value);
    if (document.querySelector('[name="report_field_reason"]:checked').value === 'content_other') {
      if (isEmptyOrSpaces(document.getElementById('reportFieldOptionCustom').value)) {
        let alert = document.getElementById('reportFieldAlert');
        alert.classList.remove('alert-success', 'alert-warning', 'alert-info');
        alert.classList.add('alert-danger');
        alert.innerHTML = 'You must give a reason if you select \'Other\' before submitting.';
        alert.style.display = 'none';

        document.getElementById('reportFieldSubmit').disabled = true;
        return false;
      } else {
        requestData.append('custom', document.getElementById('reportFieldOptionCustom').value);
      }
    }
    requestData.append('details', document.getElementById('reportFieldDetails').value);

    // Send request.
    request.send(requestData);
    return false;
  });
});
