import Vector2 from '../vector2';
import GameObject from './game-object';
const template = require('../../templates/pipe-network.pug')();

class PipeNetwork extends GameObject {
    constructor(position : Vector2) {
        super();
    
        this.contentHtmlElement.innerHTML = template;
        this.position = position;
        this.update();
    }
}

export { PipeNetwork };
export default PipeNetwork;