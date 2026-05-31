export class InputHandler {
    constructor(game) {
        this.game = game;
        this.canvas = game.canvas;
        this.keys = [];
        this.activeTouches = [];
        this.touchY = '';
        this.touchX = '';
        this.touchTolerance = 10;

        // keyboard controls

        window.addEventListener('keydown', e => {
            this.setButtonVisibility(false);
            if ((e.key === 's' ||
                e.key === 'w' ||
                e.key === 'a' ||
                e.key === 'd' ||
                (e.key === 'Enter' && !this.game.startscreen)
            ) && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
                e.preventDefault();
            } //else if (e.key === 'h') this.game.debug = !this.game.debug;
            else if (e.key === 'p' && !this.game.startscreen && !this.game.levelWon && !this.game.gameWon) this.game.pause = !this.game.pause;
            else if (e.key === 'r') this.game.restartGame();
            else if (e.key === 'Enter' && this.game.startscreen) {
                this.game.startscreen = false;
            }

            //else if (e.key === 'l') {
            //    this.game.levelWon = true;
            //}

        });

        window.addEventListener('keyup', e => {
            if (e.key === 's' ||
                e.key === 'w' ||
                e.key === 'a' ||
                e.key === 'd' ||
                e.key === 'Enter') {
                this.keys.splice(this.keys.indexOf(e.key), 1);
                e.preventDefault();
            }
        });

        // touch controls

        this.canvas.addEventListener('touchstart', (e) => {
            this.setButtonVisibility(true);

            if (this.game.startscreen) this.game.startscreen = false;

            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;

            for (const touch of e.changedTouches) {

                const touchX = (touch.clientX - rect.left) * scaleX;
                const touchY = (touch.clientY - rect.top) * scaleY;

                //console.log(`Touch start at: (${touchX}, ${touchY})`);


                this.activeTouches.push({
                    id: touch.identifier,
                    x: touchX,
                    y: touchY,
                });


                this.checkButtonPress(touchX, touchY);
            }
        });
        this.canvas.addEventListener('touchmove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;

            for (const touch of e.changedTouches) {
                const touchX = (touch.clientX - rect.left) * scaleX;
                const touchY = (touch.clientY - rect.top) * scaleY;

                //console.log(`Touch move at: (${touchX}, ${touchY})`);

                const activeTouch = this.activeTouches.find((t) => t.id === touch.identifier);
                if (activeTouch) {
                    activeTouch.x = touchX;
                    activeTouch.y = touchY;

                    this.checkButtonPress(touchX, touchY);
                }
            }
        });

        this.canvas.addEventListener('touchend', (e) => {
            for (const touch of e.changedTouches) {
                //console.log(`Touch end at ID: ${touch.identifier}`);
                this.activeTouches = this.activeTouches.filter((t) => t.id !== touch.identifier);
            }

            this.resetButtonPress();
        });
    }

    resetButtonPress() {
        this.game.rollButton.pressed = false;
        this.game.upButton.pressed = false;
        this.game.downButton.pressed = false;
        this.game.leftButton.pressed = false;
        this.game.rightButton.pressed = false;

        this.keys = this.keys.filter(
            (key) => ![
                'touch roll',
                'touch up',
                'touch down',
                'touch left',
                'touch right'
            ].includes(key)
        );
    }

    checkButtonPress(touchX, touchY) {
        if (this.isTouchWithinButton(touchX, touchY, this.game.rollButton)) {
            this.game.rollButton.pressed = true;
            if (!this.keys.includes('touch roll')) this.keys.push('touch roll');
        } else if (this.isTouchWithinButton(touchX, touchY, this.game.upButton)) {
            this.game.upButton.pressed = true;
            if (!this.keys.includes('touch up')) this.keys.push('touch up');
        } else if (this.isTouchWithinButton(touchX, touchY, this.game.downButton)) {
            this.game.downButton.pressed = true;
            if (!this.keys.includes('touch down')) this.keys.push('touch down');
        } else if (this.isTouchWithinButton(touchX, touchY, this.game.leftButton)) {
            this.game.leftButton.pressed = true;
            if (!this.keys.includes('touch left')) this.keys.push('touch left');
        } else if (this.isTouchWithinButton(touchX, touchY, this.game.rightButton)) {
            this.game.rightButton.pressed = true;
            if (!this.keys.includes('touch right')) this.keys.push('touch right');
        }
    }

    isTouchWithinButton(touchX, touchY, button) {
        return (
            touchX > button.touchX - this.touchTolerance &&
            touchX < button.touchX + button.width + this.touchTolerance &&
            touchY > button.touchY - this.touchTolerance &&
            touchY < button.touchY + button.height + this.touchTolerance
        );
    }

    setButtonVisibility(visible) {
        this.game.rollButton.visible = visible;
        this.game.upButton.visible = visible;
        this.game.downButton.visible = visible;
        this.game.leftButton.visible = visible;
        this.game.rightButton.visible = visible;
    }
}