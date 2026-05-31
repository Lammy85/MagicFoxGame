export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Creepster';
        this.livesImage = document.getElementById('livesUI');
    }
    draw(context) {
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'white';
        context.shadowBlur = 0;
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;
        // score
        context.fillText('Score: ' + this.game.score + "/" + this.game.level[this.game.currentLevel].winningScore, 20, 50);
        // timer
        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillText('Time: ' + (this.game.time * 0.001).toFixed(1), 20, 80);
        // lives
        for (let i = 0; i < this.game.lives; i++) {
            context.shadowColor = 'black';
            context.drawImage(this.livesImage, 25 * i + 20, 95, 25, 25);
        }
        // energy
        context.shadowColor = 'white';
        if (this.game.player.energy > 50) {
            context.fillStyle = this.game.fontColor;
            context.fillText('Energy: ' + Math.trunc(this.game.player.energy), 20, 150);
        }
        else {
            context.fillStyle = "red";
            context.fillText('Energy: ' + Math.trunc(this.game.player.energy), 20, 150);
        }

        // game over messages
        if (this.game.gameOver || this.game.levelWon) {
            context.textAlign = 'center';
            context.fillStyle = this.game.fontColor;
            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;

            if (this.game.lives <= 0 || this.game.score < this.game.level[this.game.currentLevel].winningScore) {
                context.fillText('Love at first bite?', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('Nope. Better luck next time!', this.game.width * 0.5, this.game.height * 0.5 + 20);
            } else if (this.game.score >= this.game.level[this.game.currentLevel].goodScore) {
                context.fillText('Hell yeah', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('You are unstoppable!', this.game.width * 0.5, this.game.height * 0.5 + 20);
            } else {
                context.fillText('Boo-yah', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('What are creatures of the night afraid of? YOU!!!', this.game.width * 0.5, this.game.height * 0.5 + 20);
            }
        }

        //game won message
        if (this.game.gameWon) {
            context.textAlign = 'center';
            context.fillStyle = this.game.fontColor;
            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            context.fillText('Congratulations', this.game.width * 0.5, this.game.height * 0.5 - 20);
            context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
            context.fillText('You won the game. Total Score: ' + this.game.totalScore, this.game.width * 0.5, this.game.height * 0.5 + 20);
        }
        // pause message
        if (this.game.pause) {
            context.textAlign = 'center';
            context.fillStyle = this.game.fontColor;
            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            context.fillText('Pause', this.game.width * 0.5, this.game.height * 0.5 - 20);
        }
        // startscreen message
        if (this.game.startscreen) {
            context.textAlign = 'center';
            context.fillStyle = this.game.fontColor;
            context.font = this.fontSize * 1 + 'px ' + this.fontFamily;
            context.fillText('Level ' + (this.game.currentLevel + 1), this.game.width * 0.5, this.game.height * 0.5 - 90);
            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            context.fillText('Press Enter to start', this.game.width * 0.5, this.game.height * 0.5 - 20);
            context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
            context.fillText('You need at least a score of ' + this.game.level[this.game.currentLevel].winningScore + ' to win this level.', this.game.width * 0.5, this.game.height * 0.5 + 20);
        }

        context.restore();
    }
}