const path = require('path');
const fs = require('fs');
const Player = require('./player.js');

var Squad = class Squad {
    constructor(teamName) {
        this.name = teamName;
        this.players = []
        this.initPlayers();
    }
    initPlayers() {
        var homeStadium = path.join('.', 'modules', 'teams', this.name);
        fs.readdir(homeStadium, (err, files) => {
            if (err) return console.error(err);
            files.forEach(aiFile => {
                var aiPath = path.join('.', 'teams', this.name, aiFile)
                this.players.push(new Player(aiPath))
            });
        })
    }
};

module.exports = Squad;