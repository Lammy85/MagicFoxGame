class Layer {
    constructor(game, width, height, speedModifier, image) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedModifier = speedModifier;
        this.image = image;
        this.x = 0;
        this.y = 0;
        this.fps = 10;
        this.currentFrame = 0;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 0;
    }
    update(deltaTime) {

        this.maxFrame = (this.image.width / this.width) - 1;

        if (this.x < -this.width) this.x = 0;
        else this.x -= this.game.speed * this.speedModifier;

        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;

            if (this.frameX < this.maxFrame && this.maxFrame > 0) this.frameX++;
            else this.frameX = 0;
        }
        else {
            this.frameTimer += deltaTime;
        }
        this.currentFrame = this.frameX;
    }
    draw(context) {
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width,
            this.height, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width,
            this.height, this.x + this.width, this.y, this.width, this.height);
    }
}

export class Background {
    constructor(game, layer1image, layer2image, layer3image, layer4image, layer5image) {
        this.game = game;
        this.width = 1667;
        this.height = 500;
        this.layer1image = layer1image;
        this.layer2image = layer2image;
        this.layer3image = layer3image;
        this.layer4image = layer4image;
        this.layer5image = layer5image;
        this.layer1 = new Layer(this.game, this.width, this.height, 0.1, this.layer1image);
        this.layer2 = new Layer(this.game, this.width, this.height, 0.2, this.layer2image);
        this.layer3 = new Layer(this.game, this.width, this.height, 0.5, this.layer3image);
        this.layer4 = new Layer(this.game, this.width, this.height, 0.8, this.layer4image);
        this.layer5 = new Layer(this.game, this.width, this.height, 1, this.layer5image);
        this.backgroundLayers = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer5];
    }
    update(deltaTime) {
        this.backgroundLayers.forEach(layer => {
            layer.update(deltaTime);
        })
    }
    draw(context) {
        this.backgroundLayers.forEach(layer => {
            layer.draw(context);
        })
    }
}