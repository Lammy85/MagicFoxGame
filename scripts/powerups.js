import { floatingMessage } from "./floatingMessages.js";

class PowerUp {
    constructor() {
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 0;
        this.fps = 20;
        this.currentFrame = 0;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.collected = false;
        this.markedForDeletion = false;
        this.sound = new Audio();
        this.volume = 0.5;
        this.hasShadow = false;
        this.shadow = document.getElementById('shadow1');
    }
    update(deltaTime) {
        this.sound.volume = this.volume * this.game.soundVolume;
        // movement
        this.x -= this.speedX + this.game.speed;
        this.y += this.speedY;
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else if (!this.collected) this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        this.currentFrame = this.frameX;
        //check if off screen
        if (this.x + this.width < 0) this.markedForDeletion = true;
        if (this.y < -this.height) this.markedForDeletion = true;
        if (this.y - this.height > 500) this.markedForDeletion = true;
        //collect animation
        if (this.collected) {
            this.frameY = 1;
            if (this.frameX >= this.maxFrame) this.frameX = this.maxFrame;
        }
    }
    draw(context) {
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        if (this.hasShadow) { context.drawImage(this.shadow, 0, 0, 79, 16, this.x, this.game.height - this.game.groundMargin - 8, this.width, 16); }
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width,
            this.height, this.x, this.y, this.width, this.height);
    }
}

export class Life extends PowerUp {
    constructor(game) {
        super();
        this.game = game;
        this.width = 50;
        this.height = 50;
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * 0.5;
        this.speedX = 0;
        this.speedY = 0;
        this.maxFrame = 4;
        this.image = document.getElementById('lives');
        this.sound.src = "assets/achievement.wav";
        this.sound.volume = 1;
    }

    effect() {
        this.sound.play();
        this.game.lives++;
        this.game.floatingMessages.push(new floatingMessage('+1', this.x, this.y, 150, 120, 'white', 'black'));
    }
}

export class Energy extends PowerUp {
    constructor(game) {
        super();
        this.game = game;
        this.width = 50;
        this.height = 50;
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * 0.5;
        this.speedX = 0;
        this.speedY = 0;
        this.maxFrame = 6;
        this.image = document.getElementById('energy');
        this.hasShadow = true;
        this.sound.src = "assets/Drink_06.wav";
        this.sound.volume = 1;
    }

    effect() {
        this.sound.play();
        if (this.game.player.energy < (this.game.player.maxEnergy - 100)) this.game.player.energy += 100;
        else this.game.player.energy = this.game.player.maxEnergy;
        this.game.floatingMessages.push(new floatingMessage('+100', this.x, this.y, 100, 150, 'black', 'white'));
    }

    update(deltaTime) {
        super.update(deltaTime);
        if (this.frameX >= this.maxFrame) this.hasShadow = false;
    }
}

export class Speed extends PowerUp {
    constructor(game) {
        super();
        this.game = game;
        this.width = 50;
        this.height = 50;
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * 0.5;
        this.speedX = 0;
        this.speedY = 0;
        this.maxFrame = 3;
        this.timer = 10000;
        this.image = document.getElementById('speed');
        this.hasShadow = true;
        this.sound.src = "assets/foom.wav";
        this.sound.volume = 0.5;
    }

    effect() {
        this.sound.play();
        this.game.speed *= 3;
        this.game.maxSpeed *= 3;
        this.game.player.speed *= 2;
        this.game.player.maxSpeed *= 2;
    }

    update(deltaTime) {
        this.sound.volume = this.volume * this.game.soundVolume;
        this.x -= this.speedX + this.game.speed;
        this.y += this.speedY;
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else if (!this.collected) this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        this.currentFrame = this.frameX;
        if (this.frameX >= this.maxFrame) this.hasShadow = false;
        if (this.collected) {
            this.frameY = 1;
            if (this.frameX >= this.maxFrame) this.frameX = this.maxFrame;
            if (this.timer <= 0) {
                this.game.player.maxSpeed = 10;
                this.game.maxSpeed = 3;
                this.markedForDeletion = true;
            } else this.timer -= deltaTime;
        }
    }
}