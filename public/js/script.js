$(function(){
  function get2digits (num){
    return ('0' + num).slice(-2);
  }

  function getDate(dateObj){
    if(dateObj instanceof Date)
      return dateObj.getFullYear() + '-' + get2digits(dateObj.getMonth()+1)+ '-' + get2digits(dateObj.getDate());
  }

  function getTime(dateObj){
    if(dateObj instanceof Date)
      return get2digits(dateObj.getHours()) + ':' + get2digits(dateObj.getMinutes())+ ':' + get2digits(dateObj.getSeconds());
  }

  function convertDate(){
    $('[data-date]').each(function(index,element){
      //console.log(element)
      var dateString = $(element).data('date');
      if(dateString){
        var date = new Date(dateString);
        $(element).html(getDate(date));
      }
    });
  }

  function convertDateTime(){
    $('[data-date-time]').each(function(index,element){
      var dateString = $(element).data('date-time');
      if(dateString){
        var date = new Date(dateString);
        $(element).html(getDate(date)+' '+getTime(date));
      }
    });
  }

  convertDate();
  convertDateTime();
});

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
