// form에서 get받은 정보를 name에 따라 반환해주는 function
// ex) URL이 localhost:3000/?type=1 일 경우 name에 type을 주면 1을 반환
function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// 설문결과에 대한 게임 정보를 user DB에 업데이트 할 수 있게 전달해주는 함수
// 형식은 search.js에 sendPlatform function과 유사
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

// 첫 번째와 두 번째 설문에서 사용자가 선택한 문항을 세 번째 설문 페이지에 전달해주는 함수
function secondSurvey(firstType, secondType) {
  location.href = '/surveys/survey-3?first_type=' + firstType + '&second_type=' + secondType;
}
