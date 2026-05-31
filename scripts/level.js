import { Background } from "./background.js";
import { GroundEnemy, ClimbingEnemy, FlyingEnemy, WalkingEnemy, BatEnemy, WalkingEnemy2, HandEnemy, GhostEnemy, SkeletonEnemy } from "./enemies.js";
import { Energy, Life, Speed } from "./powerups.js";

class Level {
    addPowerUp() {
        if (this.game.speed > 0 && Math.random() < 0.5) {
            if (this.game.speed > 0 && Math.random() < 0.5) {
                if (this.game.time % 150 == 0 && !this.game.powerups.some(obj => obj instanceof Energy)) {
                    this.game.powerups.push(new Energy(this.game));
                }
            } else if (this.game.speed > 0) {
                if (this.game.time <= 50000 && this.speed > 0) {
                    this.game.powerups.push(new Speed(this.game));
                    this.speed--;
                } else if (this.game.time <= 30000 && this.lifes > 0) {
                    this.game.powerups.push(new Life(this.game));
                    this.lifes--;
                }
            }
        }
    }
}

export class Level0 extends Level {
    constructor(game) {
        super();
        this.game = game;
        this.winningScore = 10;
        this.goodScore = 40;
        this.enemyInterval = 1800;
        this.bgm = new Audio();
        this.lifes = 1;
        this.speed = 1;
        this.bgm.src = "assets/Caketown1.mp3";
        this.volume = 0.3;
        this.bgm.loop = true;
        this.bglayer1 = document.getElementById('bg3layer1');
        this.bglayer2 = document.getElementById('bg3layer2');
        this.bglayer3 = document.getElementById('bg3layer3');
        this.bglayer4 = document.getElementById('bg3layer4');
        this.bglayer5 = document.getElementById('bg3layer5');
        this.background = new Background(this.game, this.bglayer1, this.bglayer2, this.bglayer3, this.bglayer4, this.bglayer5);
    }
    addEnemy() {
        if (this.game.speed > 0 && Math.random() < 0.5) this.game.enemies.push(new GroundEnemy(this.game));
        this.game.enemies.push(new FlyingEnemy(this.game));
        if (this.game.maxSpeed > 3) this.enemyInterval = 900;
        else this.enemyInterval = 1800;
    }

}


export class Level1 extends Level {
    constructor(game) {
        super();
        this.game = game;
        this.winningScore = 40;
        this.goodScore = 80;
        this.enemyInterval = 1400;
        this.bgm = new Audio();
        this.lifes = 1;
        this.speed = 1;
        this.bgm.src = "assets/Harp.mp3";
        this.volume = 1;
        this.bgm.loop = true;
        this.bglayer1 = document.getElementById('layer1');
        this.bglayer2 = document.getElementById('layer2');
        this.bglayer3 = document.getElementById('layer3');
        this.bglayer4 = document.getElementById('layer4');
        this.bglayer5 = document.getElementById('layer5');
        this.background = new Background(this.game, this.bglayer1, this.bglayer2, this.bglayer3, this.bglayer4, this.bglayer5);
    }
    addEnemy() {
        if (this.game.speed > 0 && Math.random() < 0.5) this.game.enemies.push(new GroundEnemy(this.game));
        else if (this.game.speed > 0) this.game.enemies.push(new ClimbingEnemy(this.game));
        this.game.enemies.push(new FlyingEnemy(this.game));
        if (this.game.enemies.length % 2 == 0) this.game.enemies.push(new WalkingEnemy(this.game));
        if (this.game.maxSpeed > 3) this.enemyInterval = 700;
        else this.enemyInterval = 1400;
    }
}

export class Level2 extends Level {
    constructor(game) {
        super();
        this.game = game;
        this.winningScore = 50;
        this.goodScore = 90;
        this.enemyInterval = 1000;
        this.bgm = new Audio();
        this.lifes = 1;
        this.speed = 1;
        this.bgm.src = "assets/Undead Rising (Low Tension 1).wav";
        this.volume = 0.5;
        this.bgm.loop = true;
        this.bglayer1 = document.getElementById('bg2layer1');
        this.bglayer2 = document.getElementById('bg2layer2');
        this.bglayer3 = document.getElementById('bg2layer3');
        this.bglayer4 = document.getElementById('bg2layer4');
        this.bglayer5 = document.getElementById('bg2layer5');
        this.background = new Background(this.game, this.bglayer1, this.bglayer2, this.bglayer3, this.bglayer4, this.bglayer5);
    }
    addEnemy() {
        if (this.game.speed > 0 && Math.random() < 0.5) this.game.enemies.push(new HandEnemy(this.game));
        this.game.enemies.push(new BatEnemy(this.game));
        if (this.game.enemies.length % 2 == 0) {
            this.game.enemies.push(new WalkingEnemy2(this.game))
        }
        else if (this.game.enemies.length % 3 === 0) {
            this.game.enemies.push(new GhostEnemy(this.game))
        }
        if (this.game.maxSpeed > 3) this.enemyInterval = 500;
        else this.enemyInterval = 1000;
    }
}

export class Level3 extends Level {
    constructor(game) {
        super();
        this.game = game;
        this.winningScore = 60;
        this.goodScore = 100;
        this.enemyInterval = 800;
        this.bgm = new Audio();
        this.lifes = 1;
        this.speed = 1;
        this.bgm.src = "assets/dark_caves.ogg";
        this.volume = 0.4;
        this.bgm.loop = true;
        this.bglayer1 = document.getElementById('cave1');
        this.bglayer2 = document.getElementById('cave2');
        this.bglayer3 = document.getElementById('cave3');
        this.bglayer4 = document.getElementById('cave4');
        this.bglayer5 = document.getElementById('cave5');
        this.background = new Background(this.game, this.bglayer1, this.bglayer2, this.bglayer3, this.bglayer4, this.bglayer5);
    }
    addEnemy() {
        if (this.game.speed > 0 && this.game.enemies.length % 3 === 0) this.game.enemies.push(new ClimbingEnemy(this.game));
        this.game.enemies.push(new BatEnemy(this.game));
        if (this.game.enemies.length % 2 === 0) {
            this.game.enemies.push(new SkeletonEnemy(this.game))
        }
        else if (this.game.enemies.length % 3 === 0) {
            this.game.enemies.push(new GhostEnemy(this.game))
        }
        if (this.game.maxSpeed > 3) this.enemyInterval = 500;
        else this.enemyInterval = 1000;
    }
}