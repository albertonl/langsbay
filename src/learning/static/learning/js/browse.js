var langs_data = undefined;
var autocompleteDictionaryData = [];
var autocompleteResourceData = [];

function isEmptyOrSpaces(str) {
  return str === null | str === '' | str.match(/^\s*$/) !== null;
}

document.addEventListener('DOMContentLoaded', () => {
  // Populate select inputs with the complete list of languages.
  const request = new XMLHttpRequest();
  request.open('POST', '/get/languages/');
  request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));

  request.onload = () => {
    langs_data = JSON.parse(request.responseText);
    for (let i = 0; i < langs_data.length; i++) {
      let content = `<option value="${langs_data[i].code}">${langs_data[i].name}</option>`;
      document.getElementById('dictionaryLanguage').innerHTML += content;
      document.getElementById('resourceLanguage').innerHTML += content;
    }
    document.getElementById('dictionaryLanguage').addEventListener('change', e => {
      $('#dictionarySearch').autocomplete({
        source: `/dictionary/autocomplete?lang=${document.getElementById('dictionaryLanguage').value}`
      });
      for (let i = 0; i < langs_data.length; i++) {
        if (langs_data[i].code === document.getElementById('dictionaryLanguage').value) {
          document.getElementById('dictionarySearch').placeholder = `Browse the ${langs_data[i].name} dictionary...`;
          document.getElementById('dictionaryFlag').src = `/static/learning/img/flags/${langs_data[i].filename}`;
          break;
        }
      }
    });
    document.getElementById('resourceLanguage').addEventListener('change', e => {
      $('#resourceSearch').autocomplete({
        source: `/resources/autocomplete?lang=${document.getElementById('resourceLanguage').value}`
      });
      for (let i = 0; i < langs_data.length; i++) {
        if (langs_data[i].code === e.target.options[e.target.selectedIndex].value) {
          document.getElementById('resourceSearch').placeholder = `Browse the ${langs_data[i].name} library...`;
          document.getElementById('resourceFlag').src = `/static/learning/img/flags/${langs_data[i].filename}`;
          break;
        }
      }
    });
  };
  request.send();

  // Search functionality
  document.getElementById('dictionarySearchToggle').addEventListener('click', () => {
    let query = document.getElementById('dictionarySearch').value;
    let lang = document.getElementById('dictionaryLanguage').value;
    if (!isEmptyOrSpaces(query)) {
      window.location.href = `/dictionary/${lang}?q=${encodeURIComponent(query)}`;
    }
  });
  document.getElementById('resourceSearchToggle').addEventListener('click', () => {
    let query = document.getElementById('resourceSearch').value;
    let lang = document.getElementById('resourceLanguage').value;
    if (!isEmptyOrSpaces(query)) {
      window.location.href = `/resources/${lang}?q=${encodeURIComponent(query)}`;
    }
  });

  // Search autocomplete
  document.getElementById('dictionarySearch').addEventListener('keyup', e => {
    if (e.keyCode === 13) {
      document.getElementById('dictionarySearchToggle').click();
      return;
    }
    // const autocompleteRequest = new XMLHttpRequest();
    // autocompleteRequest.open('POST', '/dictionary/autocomplete/');
    // autocompleteRequest.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));
    //
    // autocompleteRequest.onload = () => {
    //   autocompleteDictionaryData = JSON.parse(autocompleteRequest.responseText);
    // };
    //
    // // Append data to request.
    // const autocompleteForm = new FormData();
    // autocompleteForm.append('language', document.getElementById('dictionaryLanguage').value);
    // autocompleteForm.append('query', document.getElementById('dictionarySearch').value);
    //
    // // Send request.
    // autocompleteRequest.send(autocompleteForm);
  });
  document.getElementById('resourceSearch').addEventListener('keyup', e => {
    if (e.keyCode === 13) {
      document.getElementById('resourceSearchToggle').click();
      return;
    }
    // const autocompleteRequest = new XMLHttpRequest();
    // autocompleteRequest.open('POST', '/resources/autocomplete/');
    // autocompleteRequest.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));
    //
    // autocompleteRequest.onload = () => {
    //   autocompleteResourceData = JSON.parse(autocompleteRequest.responseText);
    // };
    //
    // // Append data to request.
    // const autocompleteForm = new FormData();
    // autocompleteForm.append('language', document.getElementById('resourceLanguage').value);
    // autocompleteForm.append('query', document.getElementById('resourceSearch').value);
    //
    // // Send request.
    // autocompleteRequest.send(autocompleteForm);
  });

  $('#dictionarySearch').autocomplete({
    source: `/dictionary/autocomplete?lang=${document.getElementById('dictionaryLanguage').value}` // probably need to change this and do the array thingy
  }).data("ui-autocomplete")._renderItem = function (ul, item) {
    var newText = String(item.value).replace(
      new RegExp(this.term, "gi"),
      "<b>$&</b>");

    return $("<li></li>")
      .data("item.autocomplete", item)
      .append("<div>" + newText + "</div>")
      .appendTo(ul);
  };
  $('#resourceSearch').autocomplete({
    source: `/resources/autocomplete?lang=${document.getElementById('resourceLanguage').value}`
  }).data("ui-autocomplete")._renderItem = function (ul, item) {
    var newText = String(item.value).replace(
      new RegExp(this.term, "gi"),
      "<b>$&</b>");

    return $("<li></li>")
      .data("item.autocomplete", item)
      .append("<div>" + newText + "</div>")
      .appendTo(ul);
  };

  // Card redirects
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      let lang = document.getElementById('defaultLanguage').value;
      let term = card.dataset.ident;
      if (card.classList.contains('browse-term'))
        window.location.href = `/dictionary/${lang}/term/${term}`;
      // else if (card.classList.contains('browse-resource'))
      //   window.location.href = `/resources/${lang}/term/${term}`;
    });
  });

  // Card animations
  $('.card').mouseenter(function () {
    $(this).animate({
      marginTop: "-1%",
    },200);
  }).mouseleave(function () {
    $(this).animate({
      marginTop: "0%",
    },200);
  });
});
