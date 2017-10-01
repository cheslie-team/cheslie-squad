var config = require('cheslie-config');

var Player = class Player {
    constructor(aiModule) {
        this.ai = require('./' + aiModule);
        this.name = this.ai.name;
        this.io = require('socket.io-client');
        this.initGame()
        this.initTournament();
    }
    initGame() {
        this.game = this.io(config.game.url, { forceNew: true });

        this.game.emitMove = (gameState, move) => {
            gameState.move = move;
            this.game.emit('move', gameState);
        };
        this.game.doMove = (gameState) => {
            var move = this.ai.move(gameState.board);
            if (typeof move === "string") {
                this.game.emitMove(gameState, move);
            } else {
                move.then(move => {
                    this.game.emitMove(gameState, move);
                }).catch(err => {
                    console.log(err.error);
                    this.game.emitMove(gameState, err.move);
                });
            }
        }

        this.game
            .on('connect', () => {
                if (this.tournament.connected) this.tournament.emit('enter', this.name);
                console.log('Player ' + this.name + ' is connected to ' + config.game.app.name);
            })
            .on('move', this.game.doMove)
            .on('disconnect', () => {
                this.tournament.emit('leave');
                this.game.connect();
            });
    }
    initTournament() {
        this.tournament = this.io(config.tournament.url, { forceNew: true });
        this.tournament
            .on('connect', () => {
                this.tournament.emit('enter', this.name);
            })
            .on('reconnect', () => {
                if (this.game.connected) {
                    this.tournament.emit('enter', this.name);
                }
            })
            .on('join', this.joinGame);
        return this.tournament
    }
    joinGame(gameId) {
        if (this.game.connected) {
            this.game.emit('join', gameId, this.name);
        } else {
            this.tournament.emit('leave');
            this.game.connect();
        }
    }
};

module.exports = Player;
