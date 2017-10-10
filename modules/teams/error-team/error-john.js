const Chess = require('chess.js').Chess,
    move = board => {
        var chess = new Chess(board)
        return chess.thisIsNotAFunction();
    };

module.exports = { name: "error-john", move: move };