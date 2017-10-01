var config = require('cheslie-config'),
  server = require('http').createServer(),
  io = require('socket.io').listen(server),
  Squad = require('./modules/squad.js'),
  squads = [];


squads.push(new Squad('team'))

io.on('connect', function (socket) {
});

server.listen(config.game.port, function () {
  console.log('Running server on port: ' + config.game.port)
});