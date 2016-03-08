function setup() {
  window.scan = {};
  window.scan.requests = [];
  for (let i=255; i>=0; i--) {
    log('trying: ', i);
    (function (a) {
      window.scan.requests.push(x(a))
    }(i))
  }
}

function cancelAll() {
  log('cancel all');
  window.scan.requests.forEach(function (request) {
    request.abort();
  });
}

function log() {
  let textArea = document.querySelector('textarea');
  console.log('err', arguments[0], arguments);
  textArea.value = textArea.value + '\n' + JSON.stringify(arguments);
}

function x(guess) {
  var request = new XMLHttpRequest({mozSystem: true});
  request.open('GET', `http://192.168.0.${guess}:8080`);
  //request.timeout = 7000;
  //request.onreadystatechange = function () {
  //  console.log(arguments);
  //};
 request.onloadstart = function () {
    log('loading start', arguments);
    setTimeout(function () {
      log(`aborting (${guess}): `, request);
      request.abort();
    }, 40000);
  };

  request.onreadystatechange = function (e) {
console.log('ready state', e, e.target.status, e.target.readyState, guess);
    if (e.target.readyState === 4 && e.target.status === 200) {
      window.scan.guess = guess;
      document.querySelector('scan-ip').innerText = guess;
      cancelAll();
    }
  };

  request.send();
  return request;
}

window.addEventListener('load', setup);
