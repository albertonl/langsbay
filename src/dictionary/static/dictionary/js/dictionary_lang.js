function isEmptyOrSpaces(str) {
  return str === null || str === '' || str.match(/^\s*$/) !== null
}

document.addEventListener('DOMContentLoaded', () => {
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
    source: `/dictionary/autocomplete?lang=${document.getElementById('dictionaryLanguage').value}`
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
