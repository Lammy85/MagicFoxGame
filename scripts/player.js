import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimation.js";
import { floatingMessage } from "./floatingMessages.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 92;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 1;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 0;
        this.currentFrame = 0;
        this.maxFrame;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.states = [new Sitting(this.game), new Running(this.game),
        new Jumping(this.game), new Falling(this.game), new Rolling(this.game),
        new Diving(this.game), new Hit(this.game)];
        this.currentState = null;
        this.energy = 150;
        this.maxEnergy = 500;
        this.shadow = document.getElementById('shadow1');
        this.runsound = new Audio();
        this.runsound.src = "assets/sfx_step_grass_l.flac";
        this.volume = 0.5;
    }
    update(input, deltaTime) {

        this.currentState.jumpsound.volume = this.volume * this.game.soundVolume;
        this.currentState.firesound.volume = this.volume * this.game.soundVolume;
        this.currentState.doggrunt.volume = this.volume * this.game.soundVolume;
        this.currentState.bombsound.volume = this.volume * this.game.soundVolume;

        this.checkCollision();
        this.currentState.handleInput(input);
        this.runsound.volume = this.volume * this.game.soundVolume;
        if (this.currentState === this.states[1] && this.currentFrame === 4) {
            this.runsound.play();
        }
        // horizontal movement
        this.x += this.speed;
        if ((input.includes('d') || input.includes('touch right')) && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
        else if ((input.includes('a') || input.includes('touch left')) && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;
        else this.speed = 0;
        // horizontal boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        // vertical movement
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
        // vertical boundaries
        if (this.y > this.game.height - this.height - this.game.groundMargin) {
            this.y = this.game.height - this.height - this.game.groundMargin;
        }
        // sprite animation
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        this.currentFrame = this.frameX;
    }
    draw(context) {
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);

        context.drawImage(this.shadow, 0, 0, 79, 16, this.x, this.game.height - this.game.groundMargin - 8, this.width, 16);
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);


    }
    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }
    checkCollision() {
        this.game.powerups.forEach(powerup => {
            if (
                powerup.x < this.x + this.width &&
                powerup.x + powerup.width > this.x &&
                powerup.y < this.y + this.height &&
                powerup.y + powerup.height > this.y &&
                !powerup.collected
            ) {
                powerup.effect();
                powerup.frameX = 0;
                powerup.collected = true;
            }
        });

        this.game.enemies.forEach(enemy => {
            if (
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y &&
                !enemy.death
            ) {
                enemy.frameX = 0;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x +
                    enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if (this.currentState === this.states[4] ||
                    this.currentState === this.states[5]) {
                    enemy.death = true;
                    this.game.score++;
                    enemy.sound.play();
                    this.game.floatingMessages.push(new floatingMessage('+1', enemy.x, enemy.y, 150, 50, 'black', 'white'));

                } else if (!enemy.death) {
                    if (this.currentState != this.states[6]) {
                        this.setState(6, 0);
                        enemy.frameX = 0;

                        if (this.game.score > 0) {
                            this.game.score--;
                            this.game.floatingMessages.push(new floatingMessage('-1', enemy.x, enemy.y, 150, 50, 'red', 'white'));
                        }
                        this.game.lives--;
                        if (this.game.lives <= 0) this.game.gameOver = true;
                    }
                    enemy.death = true;
                }
            }
        });
    }
}