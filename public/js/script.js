function sendPlatform(param) {
  var form = document.createElement('form');
  form.setAttribute('method', 'get');
  form.setAttribute('action', '/platform');

  var hiddenField = document.createElement('input');

  hiddenField.setAttribute('type', 'hidden');
  hiddenField.setAttribute('name', 'searchPlatform');
  hiddenField.setAttribute('value', param);
  form.appendChild(hiddenField);

  document.body.appendChild(form);
  form.submit();
}

function updateUserGame(action, gameName, gameURL) {
  var form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', action);

  var hiddenGameField = document.createElement('input');

  hiddenGameField.setAttribute('type', 'hidden');
  hiddenGameField.setAttribute('name', 'gameName');
  hiddenGameField.setAttribute('value', gameName);
  form.appendChild(hiddenGameField);

  var hiddenUrlField = document.createElement('input');

  hiddenUrlField.setAttribute('type', 'hidden');
  hiddenUrlField.setAttribute('name', 'gameURL');
  hiddenUrlField.setAttribute('value', gameURL);
  form.appendChild(hiddenUrlField);

  document.body.appendChild(form);
  form.submit();
}

function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function locationJS(url) {
  location.href = url;
}
