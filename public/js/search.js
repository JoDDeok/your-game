// 메인 페이지나 검색 페이지에서 플랫폼 버튼을 눌를 경우 어떤 플랫폼을 눌렀는지 알려주기 위한 function
// form을 만들어 method = get, action = /platform으로 설정하고 param의 값을 갖는 input을 submit
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

// 선택된 플랫폼 버튼의 색을 바꾸기 위한 function
function changeBoxColor(box, color) {
  for(var i = 0, len = box.length; i < len; i++) {
    box[i].style["background-color"] = color;
  }
}
