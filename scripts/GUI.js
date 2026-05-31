class Button {
    constructor() {
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 0;
        this.fps = 20;
        this.currentFrame = 0;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.pressed = false;
        this.visible = false;
        this.width = 0;
        this.height = 0;
        this.touchX = this.x;
        this.touchY = this.y;
        this.originalX = this.x;
        this.originalY = this.y;
        this.originalWidth = this.width;
        this.originalHeight = this.height;
    }

    update(deltaTime) {
        
        const scaleX = this.game.canvas.width / this.game.canvas.originalWidth;
        const scaleY = this.game.canvas.height / this.game.canvas.originalHeight;

        this.touchX = this.originalX * scaleX;
        this.touchY = this.originalY * scaleY;
        this.width = this.originalWidth * scaleX;
        this.height = this.originalHeight * scaleY;

        if (this.x + this.width > this.game.canvas.width) {
            this.x = this.game.canvas.width - this.width;
        }
        if (this.y + this.height > this.game.canvas.height) {
            this.y = this.game.canvas.height - this.height;
        }
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;

        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else {
                this.frameTimer += deltaTime;
            }
            this.currentFrame = this.frameX;
        }
        if (this.pressed) {
            this.frameY = 1;
        } else this.frameY = 0;
    }

    draw(context) {
        if (this.visible) {
            context.drawImage(this.image, this.frameX * this.originalWidth, this.frameY * this.originalHeight, this.originalWidth,
                this.originalHeight, this.originalX, this.originalY, this.originalWidth, this.originalHeight);
        }
    }
}

export class RollButton extends Button {
    constructor(game) {
        super();
        this.game = game;
        this.width = 100;
        this.height = 100;
        this.x = this.game.width - this.width;
        this.y = this.game.height - this.height;
        this.originalX = this.x;
        this.originalY = this.y;
        this.originalWidth = this.width;
        this.originalHeight = this.height;
        this.image = document.getElementById('rollButton');
    }
}

export class LeftButton extends Button {
    constructor(game) {
        super();
        this.game = game;
        this.width = 50;
        this.height = 50;
        this.x = this.width * 0.25;
        this.y = this.game.height - (this.height * 2);
        this.originalX = this.x;
        this.originalY = this.y;
        this.originalWidth = this.width;
        this.originalHeight = this.height;
        this.image = document.getElementById('buttonLeft');
    }
}

export class RightButton extends Button {
    constructor(game) {
        super();
        this.game = game;
        this.width = 50;
        this.height = 50;
        this.x = this.width * 2.75;
        this.y = this.game.height - (this.height * 2);
        this.originalX = this.x;
        this.originalY = this.y;
        this.originalWidth = this.width;
        this.originalHeight = this.height;
        this.image = document.getElementById('buttonRight');
    }
}

export class UpButton extends Button {
    constructor(game) {
        super();
        this.game = game;
        this.width = 50;
        this.height = 50;
        this.x = this.width * 1.5;
        this.y = this.game.height - (this.height * 3);
        this.originalX = this.x;
        this.originalY = this.y;
        this.originalWidth = this.width;
        this.originalHeight = this.height;
        this.image = document.getElementById('buttonUp');
    }
}

export class DownButton extends Button {
    constructor(game) {
        super();
        this.game = game;
        this.width = 50;
        this.height = 50;
        this.x = this.width * 1.5;
        this.y = this.game.height - this.height;
        this.originalX = this.x;
        this.originalY = this.y;
        this.originalWidth = this.width;
        this.originalHeight = this.height;
        this.image = document.getElementById('buttonDown');
    }
}
