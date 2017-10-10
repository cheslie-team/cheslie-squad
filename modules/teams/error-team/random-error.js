const Chess = require('chess.js').Chess,
    move = board => {
        var chess = new Chess(board),
            moves = chess.moves(),
            move = moves[Math.floor(Math.random() * moves.length)];
        return (Math.floor(Math.random()) === 1) ? move : 'e4';
    };

module.exports = { name: "random-error", move: move };