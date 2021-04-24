import Vector2 from '../vector2';
import GameObject from './game-object';
const template = require('../../templates/debug-position.pug')();

class DebugPosition extends GameObject
{
    eventListener = (e : KeyboardEvent) => this.handleKey(e);

    constructor()
    {
        super();

        this.htmlElement.innerHTML = template;
        this.update();

        document.addEventListener("keydown", this.eventListener);
    }

    handleKey(e : KeyboardEvent) 
    {
        switch (e.key)
        {
            case 'ArrowLeft':
                this.position = new Vector2(this.position.x - 1, this.position.y);
                break;
            
            case 'ArrowRight':
                this.position = new Vector2(this.position.x + 1, this.position.y);
                break;

            case 'ArrowDown':
                this.position = new Vector2(this.position.x, this.position.y + 1);
                break;
            
            case 'ArrowUp':
                this.position = new Vector2(this.position.x, this.position.y - 1);
                break;

            case ' ':
                console.log(this.position);
                break;
        }
        this.update();
    }

    update() {
        super.update();
    }
}

export { DebugPosition };
export default DebugPosition;