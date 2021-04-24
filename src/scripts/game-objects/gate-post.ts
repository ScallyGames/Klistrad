import Vector2 from '../vector2';
import GameObject from './game-object';
const template = require('../../templates/gate-post.pug')();

class GatePost extends GameObject {
    constructor(position : Vector2) {
        super();
    
        this.htmlElement.innerHTML = template;
        this.position = position;
        this.update();
    }
}

export { GatePost };
export default GatePost;