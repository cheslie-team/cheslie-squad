const Chess = require('chess.js').Chess,
    move = board => {
        var chess = new Chess(board)
        return (chess.turn() === 'w') ? 'e4' : 'e6';
    };

module.exports = { name: "e4-amy", move: move };