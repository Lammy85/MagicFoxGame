import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { UI } from "./UI.js";
import { Level0, Level1, Level2, Level3 } from "./level.js";
import { RollButton, LeftButton, RightButton, UpButton, DownButton } from "./GUI.js";

window.addEventListener('load', function () {
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;
    canvas.originalWidth = canvas.width;
    canvas.originalHeight = canvas.height;

    const fullScreenButton = this.document.getElementById('fullScreenButton');

    fullScreenButton.addEventListener('click', () => {
        toggleFullScreen(canvas);
    });

    class Game {
        constructor(width, height, canvas) {
            this.canvas = canvas;
            this.width = width;
            this.height = height;
            this.groundMargin = 40;
            this.speed = 0;
            this.maxSpeed = 3;
            this.level = [new Level0(this), new Level1(this), new Level2(this), new Level3(this)];
            this.currentLevel = 0;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.rollButton = new RollButton(this);
            this.leftButton = new LeftButton(this);
            this.rightButton = new RightButton(this);
            this.upButton = new UpButton(this);
            this.downButton = new DownButton(this);
            this.enemies = [];
            this.powerups = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.maxParticles = 50;
            this.enemyTimer = 0;
            this.debug = false;
            this.score = 0;
            this.totalScore = 0;
            this.fontColor = 'black';
            this.time = 60000;
            this.maxTime = 0;
            this.gameOver = false;
            this.levelWon = false;
            this.lives = 5;
            this.pause = false;
            this.startscreen = true;
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
            this.gameOverSound = new Audio();
            this.gameOverSound.src = "assets/death_bell_sound_effect.wav";
            this.wonSound = new Audio();
            this.wonSound.src = "assets/achievement.wav";
            this.levelSwitchActive = false;
            this.gameWon = false;
            this.bgmVolume = 1;
            this.soundVolume = 1;
        }

        update(deltaTime) {
            //console.log(ctx);
            this.bgmVolume = document.getElementById('bgmVolume').value / 100;
            this.soundVolume = document.getElementById('soundVolume').value / 100;
            this.gameOverSound.volume = this.soundVolume * 0.5;
            this.wonSound.volume = this.soundVolume * 0.5;
            this.level[this.currentLevel].bgm.volume = this.level[this.currentLevel].volume * this.bgmVolume;

            if (!game.pause && !game.startscreen && !game.gameOver && !game.levelWon && !game.gameWon) {
                this.level[this.currentLevel].bgm.play();
                this.level[this.currentLevel].bgm.volume = this.level[this.currentLevel].volume * this.bgmVolume;
                this.time -= deltaTime;
                if (this.player.energy > 0 &&
                    (this.player.currentState === this.player.states[4] ||
                        this.player.currentState === this.player.states[5])) {
                    this.player.energy -= 1;
                } else if (this.player.energy < this.player.maxEnergy &&
                    (this.player.currentState === this.player.states[0])) {
                    this.player.energy += 1;
                } else if (this.player.energy < this.player.maxEnergy &&
                    (this.player.currentState === this.player.states[1] ||
                        this.player.currentState === this.player.states[2] ||
                        this.player.currentState === this.player.states[3]
                    )) {
                    this.player.energy += 0.1;
                }
                if (this.time < this.maxTime) {
                    if (this.score >= this.level[this.currentLevel].winningScore) {
                        if ((this.currentLevel + 1) >= this.level.length) {
                            this.totalScore = this.totalScore + this.score;
                            this.wonSound.play();
                            this.gameWon = true;
                        } else this.levelWon = true;
                    }
                    else {
                        this.gameOver = true;
                    }
                }
                this.level[this.currentLevel].background.update(deltaTime);
                this.player.update(this.input.keys, deltaTime);
                this.rollButton.update(deltaTime);
                this.upButton.update(deltaTime);
                this.downButton.update(deltaTime);
                this.leftButton.update(deltaTime);
                this.rightButton.update(deltaTime);
                // handleEnemies
                if (this.enemyTimer > this.level[this.currentLevel].enemyInterval) {
                    this.level[this.currentLevel].addEnemy();
                    this.enemyTimer = 0;
                } else {
                    this.enemyTimer += deltaTime;
                }
                this.enemies.forEach(enemy => {
                    enemy.update(deltaTime);
                });

                //handle powerups

                this.level[this.currentLevel].addPowerUp();

                this.powerups.forEach(powerup => {
                    powerup.update(deltaTime);
                });

                // handle messages
                this.floatingMessages.forEach(message => {
                    message.update();
                });
                // handle particles
                this.particles.forEach((particle) => {
                    particle.update();
                });
                if (this.particles.length > this.maxParticles) {
                    this.particles.length = this.maxParticles;
                }
                // handle collision sprites
                this.collisions.forEach((collision) => {
                    collision.update(deltaTime);
                });
                this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
                this.particles = this.particles.filter(particle => !particle.markedForDeletion);
                this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
                this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
                this.powerups = this.powerups.filter(powerup => !powerup.markedForDeletion);
            }

            if (this.pause || this.gameOver || this.levelWon || this.gameWon) {
                this.level[this.currentLevel].bgm.pause();
            }
            if (this.gameOver) {
                this.gameOverSound.play();
            }

            if (this.levelWon) {
                this.wonSound.play();
                if (this.levelSwitchActive) return
                this.levelSwitchActive = true;
                setTimeout(() => this.nextLevel(), 2000);
            }
        }

        nextLevel() {
            this.totalScore = this.totalScore + this.score;
            this.pause = false;
            this.gameOver = false;
            this.currentLevel = this.currentLevel + 1;
            this.levelWon = false;
            this.enemies = [];
            this.powerups = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.input.keys = [];
            this.player.setState(0, 0);
            this.player.x = 0;
            this.player.y = this.height - this.player.height - this.groundMargin;
            this.player.vy = 0;
            this.score = 0;
            this.player.energy = 150;
            this.time = 60000;
            this.startscreen = true;
            this.levelSwitchActive = false;
            if (this.lives <= 5) this.lives = 5;
        }

        draw(context) {
            context.imageSmoothingEnabled = false;
            this.level[this.currentLevel].background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.powerups.forEach(powerup => {
                powerup.draw(context);
            });
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
            this.floatingMessages.forEach(message => {
                message.draw(context);
            });
            this.UI.draw(context);
            this.rollButton.draw(context);
            this.upButton.draw(context);
            this.downButton.draw(context);
            this.leftButton.draw(context);
            this.rightButton.draw(context);
        }

        restartGame() {
            location.reload();
        }
    }

    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            const scaleX = window.innerWidth / canvas.width;
            const scaleY = window.innerHeight / canvas.height;

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const ctx = canvas.getContext('2d');
            ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            game.draw(ctx);
        } else {
            canvas.width = 900;
            canvas.height = 500;

            const ctx = canvas.getContext('2d');
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            game.draw(ctx);
        }
    });

    function toggleFullScreen(canvas) {
        if (!document.fullscreenElement) {
            if (canvas.requestFullscreen) {
                canvas.requestFullscreen(); // Default
            } else if (canvas.webkitRequestFullscreen) { // Safari
                canvas.webkitRequestFullscreen();
            } else if (canvas.mozRequestFullScreen) { // Firefox
                canvas.mozRequestFullScreen();
            } else if (canvas.msRequestFullscreen) { // Internet Explorer/Edge
                canvas.msRequestFullscreen();
            } else {
                console.log("No fullscreen API support.");
            }
            
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen(); // Default
            } else if (document.webkitExitFullscreen) { // Safari
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) { // Internet Explorer/Edge
                document.msExitFullscreen();
            }
        }
    }

    const game = new Game(canvas.width, canvas.height, canvas);
    let lastTime = performance.now();
    let accumulatedFrameTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        accumulatedFrameTime += deltaTime;
        if (accumulatedFrameTime >= game.player.frameInterval) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            game.update(deltaTime);
            game.draw(ctx);
        }
        if (!game.gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});