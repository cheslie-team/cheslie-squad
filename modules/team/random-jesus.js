const Chess = require('chess.js').Chess,
    move = board => {
        var chess = new Chess(board),
            moves = chess.moves(),
            move = moves[Math.floor(Math.random() * moves.length)];
        return move;
    };

module.exports = { name: "random-jesus", move: move };