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

function changeBoxColor(box, color) {
  for(var i = 0, len = box.length; i < len; i++) {
    box[i].style["background-color"] = color;
  }
}
