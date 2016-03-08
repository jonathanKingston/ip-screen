var http = require('http');
var os = require('os');
var port = 8080;

var server = http.createServer(function (request, response) {
  var path = request.url;
  if (/^\/onramp[/]?([?].*)?$/.test(path)) {
    onramp.apply(this, arguments);
  } else {
    other.apply(this, arguments);
  }
});

function onramp(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
  response.end(JSON.stringify({
    type: 'tv-remote-onramp'
  }));
}


server.listen(port);

var interfaces = os.networkInterfaces();
var chosenInterface;

Object.keys(interfaces).forEach(function (name) {
  interfaces[name].forEach(function (interface) {
    if (interface.family !== 'IPv4' || interface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (!chosenInterface) {
      console.log('Chosen interface: ', interface.address);
      chosenInterface = interface.address;
    } else {
      console.log('Ignoring other interfaces: ', interface.address);
    }
  });
});

function checkIP(ip) {
  var settings = {
    items: [
      'bbq',
      'bridge',
      'cd',
      'chicken',
      'dog',
      'horse',
      'kangaroo',
      'seagull',
      'seal',
      'sheep',
      'squirrel',
      'taxi'
    ],
    firstRound: [
      '192.168.0.', // D-Link, Netgear
      '192.168.1.', // Linksys
      '192.168.2.', // Belkin, SMC
      '192.168.3.', //
      '192.168.4.', //
      '192.168.10.', //
      '192.168.11.', // :decoder
      '192.168.100.', // Many?
      '192.168.101.', // Aus?
      '192.168.123.', // US Robotics
      '192.168.178.', // AVM Fritzbox
      '192.168.254.', // :decoder
      '.' // Other, move to normal keyboard
    ],
    startRound: [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0.',
      '1.'
    ],
    midRound: [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0.',
      '.'
    ]
  };

  var res = matchParts({
    round: settings.firstRound,
    remainderToMatch: ip + '.',
    progress: '',
    matches: [],
    settings
  });
  while (res.remainderToMatch !== '') {
    var round = settings.midRound;
    if (res.progress[res.progress.length-1] === '.') {
      round = settings.startRound;
    }
    res = matchParts({
      round: round,
      remainderToMatch: res.remainderToMatch,
      progress: res.progress,
      matches: res.matches,
      settings
    });
  }
  return res.matches;
}

function matchParts(options) {
  var currentMatch = null;
  var progress = options.progress;
  var matches = options.matches.slice(0);
  var lastBoundaryFull = /^[0-9]{3}([.][0-9]{3})*$/; 

  options.round.forEach(function (ipAddress, id) {
    if (currentMatch) {
      return;
    }
    if (options.remainderToMatch.substring(0, ipAddress.length) === ipAddress) {
      remainderToMatch = options.remainderToMatch.substring(ipAddress.length, options.remainderToMatch.length);
      currentMatch = id;
      progress += ipAddress;
    }
  });

  matches.push(options.settings.items[currentMatch]);

  if (lastBoundaryFull.test(progress)) {
    progress += '.';
  }

  return {
    remainderToMatch,
    currentMatch,
    progress,
    matches
  };
}

function other(request, response) {
  var output = '';
  response.writeHead(200, {"Content-Type": "text/plain"});
  output += 'The address is ' + chosenInterface;
  output += '\n\n' + JSON.stringify(checkIP(chosenInterface));
  response.end(output);
}

console.log("Server running at http://"+chosenInterface+":"+port+"/");
