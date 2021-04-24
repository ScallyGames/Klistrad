import GameObject from './game-object';
const template = require('../../templates/water-pipe.pug');

class WaterPipe extends GameObject {
    content : number;

    constructor() {
        super();
        this.content = 0;

        this.htmlElement.innerHTML = template;
    }
}

export { WaterPipe };
export default WaterPipe;