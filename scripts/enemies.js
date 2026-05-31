class Enemy {
    constructor() {
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 0;
        this.fps = 20;
        this.currentFrame = 0;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.death = false;
        this.markedForDeletion = false;
        this.sound = new Audio();
        this.step1 = new Audio();
        this.hasShadow = true;
        this.shadow = document.getElementById('shadow1');
        this.volume = 0.5;
    }
    update(deltaTime) {
        this.sound.volume = this.volume * this.game.soundVolume;
        this.step1.volume = this.volume * this.game.soundVolume;
        // movement
        this.x -= this.speedX + this.game.speed;
        this.y += this.speedY;
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else if (!this.death) this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        this.currentFrame = this.frameX;
        //check if off screen
        if (this.x + this.width < 0) this.markedForDeletion = true;
        if (this.y < -this.height) this.markedForDeletion = true;
        if (this.y - this.height > 500) this.markedForDeletion = true;
        //death animation
        if (this.death) {
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

export class FlyingEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.width = 58;
        this.height = 59;
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.5;
        this.speedX = Math.random() + 1;
        this.speedY = 0;
        this.maxFrame = 5;
        this.image = document.getElementById('enemy_fly');
        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.1;
        this.sound.src = "assets/random4.wav";
        this.volume = 0.3;
    }
    update(deltaTime) {
        super.update(deltaTime);
        if (!this.death) {
            this.angle += this.va;
            this.y += Math.sin(this.angle);
        }

        if (this.death) {
            this.speedX = 0;
            if (this.y > this.game.height - this.height - this.game.groundMargin) { this.speedY = 0; }
            else { this.speedY = 4; }
        }
    }
}

export class BatEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.width = 64;
        this.height = 59;
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.5;
        this.speedX = Math.random() + 2;
        this.speedY = 0;
        this.maxFrame = 5;
        this.image = document.getElementById('enemy_bat');
        this.angle = 0;
        this.va = Math.random() * 0.01 + 0.05;
        this.sound.src = "assets/alien_06.ogg";
    }

    update(deltaTime) {
        super.update(deltaTime);
        if (!this.death) {
            this.angle += this.va;
            this.y += Math.sin(this.angle);
        }

        if (this.death) {
            this.speedX = 0;
            if (this.y > this.game.height - this.height - this.game.groundMargin) { this.speedY = 0; }
            else { this.speedY = 4; }
        }
    }
}

export class GhostEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.width = 151;
        this.height = 150;
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.5;
        this.speedX = Math.random() + 0.5;
        this.speedY = 0;
        this.maxFrame = 8;
        this.image = document.getElementById('enemy_ghost');
        this.angle = 0;
        this.va = Math.random() * 0.003 + 0.005;
        this.sound.src = "assets/ghost.wav";
    }
    update(deltaTime) {
        super.update(deltaTime);
        this.angle += this.va;
        this.y += Math.sin(this.angle);
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.angle *= -1;
        if (this.death)this.hasShadow = false;
    }
}

export class GroundEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.width = 60;
        this.height = 87;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById('enemy_plant');
        this.speedX = 0;
        this.speedY = 0;
        this.maxFrame = 1;
        this.hasShadow = false;
        this.sound.src = "assets/monster_05.ogg";
    }
}

export class HandEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.width = 56;
        this.height = 86;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById('enemy_hand');
        this.speedX = 0;
        this.speedY = 0;
        this.maxFrame = 4;
        this.hasShadow = false;
        this.sound.src = "assets/grunt_01.ogg";
    }
}

export class ClimbingEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.width = 120;
        this.height = 144;
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * 0.5;
        this.image = document.getElementById('enemy_spider_big');
        this.speedX = 0;
        this.speedY = Math.random() > 0.5 ? 1 : -1;
        this.maxFrame = 5;
        this.sound.src = "assets/bug_04.ogg";
    }
    update(deltaTime) {
        super.update(deltaTime);
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.speedY *= -1;
        if (this.death) this.speedY = 0;
    }
    draw(context) {
        super.draw(context);
        context.beginPath();
        context.moveTo(this.x + this.width / 2, 0);
        context.lineTo(this.x + this.width / 2, this.y + 40);
        context.strokeStyle = "white";
        context.stroke();
    }
}

export class WalkingEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.width = 94;
        this.height = 149;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.speedX = Math.random() * 1.5 + 1;
        this.speedY = 0;
        this.maxFrame = 7;
        this.image = document.getElementById('enemy_zombie');
        this.sound.src = "assets/zombie-2.wav";
        this.step1 = new Audio();
        this.step1.src = "assets/leaves01.ogg";

    }
    update(deltaTime) {
        super.update(deltaTime);

        if (!this.death && this.currentFrame == 4) this.step1.play();

        if (this.death) this.speedX = 0;
    }
}

export class WalkingEnemy2 extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.width = 94;
        this.height = 149;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.speedX = Math.random() * 1.5 + 1;
        this.speedY = 0;
        this.maxFrame = 7;
        this.image = document.getElementById('enemy_zombie2');
        this.sound.src = "assets/zombie-2.wav";
        this.step1 = new Audio();
        this.step1.src = "assets/leaves01.ogg";

    }
    update(deltaTime) {
        super.update(deltaTime);

        if (!this.death && this.currentFrame == 4) this.step1.play();

        if (this.death) this.speedX = 0;
    }
}

export class SkeletonEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.width = 96;
        this.height = 161;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.speedX = Math.random() * 1.5 + 1.5;
        this.speedY = 0;
        this.maxFrame = 7;
        this.image = document.getElementById('enemy_skeleton');
        this.sound.src = "assets/strike2n-5.wav";
        this.step1 = new Audio();
        this.step1.src = "assets/leaves01.ogg";

    }
    update(deltaTime) {
        super.update(deltaTime);

        if (!this.death && this.currentFrame == 4) this.step1.play();

        if (this.death) this.speedX = 0;
    }
}