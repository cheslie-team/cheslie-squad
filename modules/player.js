var config = require('cheslie-config'),
    io = require('socket.io-client');

var Player = class Player {
    constructor(aiModule) {
        this.ai = require('./' + aiModule);
        this.name = this.ai.name;
        this.initGame();
        this.initTournament();
    }
    initGame() {
        this.game = io(config.game.url, { forceNew: true });

        this.game.emitMove = (gameState, move) => {
            gameState.move = move;
            this.game.emit('move', gameState);
        };
        this.game.doMove = (gameState) => {
            try {
                var move = this.ai.move(gameState.board);
                if (typeof move === "string") {
                    this.game.emitMove(gameState, move);
                } else {
                    move.then(move => {
                        this.game.emitMove(gameState, move);
                    }).catch(err => {
                        console.error(err.error);
                        this.game.emitMove(gameState, err.move);
                    });
                }
            } catch (error) {
                console.error(error);
                this.game.disconnect();
                this.tournament.disconnect()
            }
        }

        this.game
            .on('connect', () => {
                if (this.tournament.connected) this.tournament.emit('enter', this.name);
                console.info('Player ' + this.name + ' is connected to ' + config.game.app.name + ' on ' + config.game.url);
            })
            .on('move', this.game.doMove)
            .on('disconnect', () => {

                this.tournament.emit('leave');
                this.game.connect();
            });
    }
    initTournament() {
        this.tournament = io(config.tournament.url, { forceNew: true });
        this.tournament
            .on('connect', () => {
                console.info('Player ' + this.name + ' is connected to ' + config.tournament.app.name + ' on ' + config.tournament.url);
                this.tournament.emit('enter', this.name);
            })
            .on('reconnect', () => {
                if (this.game.connected) {
                    this.tournament.emit('enter', this.name);
                }
            })
            .on('join', (gameId) => {
                if (this.game.connected) {
                    this.game.emit('join', gameId, this.name);
                } else {
                    this.tournament.emit('leave');
                    this.game.connect();
                }
            });
        return this.tournament
    }
};

module.exports = Player;
