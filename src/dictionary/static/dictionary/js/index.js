var langs_data = undefined;

function isEmptyOrSpaces(str) {
  return str === null | str === '' | str.match(/^\s*$/) !== null;
}

document.addEventListener('DOMContentLoaded', () => {
  // Enable tooltips
  $(function() {
    $('[data-toggle="tooltip"]').tooltip();
  });

  // Populate select input with the complete list of languages.
  const request = new XMLHttpRequest();
  request.open('POST', '/get/languages/');
  request.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));

  request.onload = () => {
    langs_data = JSON.parse(request.responseText);
    for (let i = 0; i < langs_data.length; i++) {
      let content = `<option value="${langs_data[i].code}">${langs_data[i].name}</option>`;
      document.getElementById('dictionaryLanguage').innerHTML += content;
    }
    document.getElementById('dictionaryLanguage').addEventListener('change', e => {
      $('#dictionarySearch').autocomplete({
        source: `/dictionary/autocomplete?lang=${document.getElementById('dictionaryLanguage').value}` // probably need to change this and do the array thingy
      });
      for (let i = 0; i < langs_data.length; i++) {
        if (langs_data[i].code === document.getElementById('dictionaryLanguage').value) {
          document.getElementById('dictionarySearch').placeholder = `Browse the ${langs_data[i].name} dictionary...`;
          document.getElementById('dictionaryLangImg').src = `/static/learning/img/flags/${langs_data[i].filename}`;
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

  // Search autocomplete
  document.getElementById('dictionarySearch').addEventListener('keyup', e => {
    if (e.keyCode === 13) {
      document.getElementById('dictionarySearchToggle').click();
      return;
    }
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
});
