import Vector2 from '../vector2';
import GameObject from './game-object';

enum TunnelDirection
{
    Entry,
    Exit,
}

const template = 
{
    [TunnelDirection.Entry]: require('../../templates/conveyor-tunnel-entry.pug')(),
    [TunnelDirection.Exit]: require('../../templates/conveyor-tunnel-exit.pug')(),
};

class ConveyorTunnel extends GameObject {
    constructor(position : Vector2, direction : TunnelDirection) {
        super();
    
        this.pivot = new Vector2(1, 0);
        this.contentHtmlElement.innerHTML = template[direction];
        this.position = position;
        this.update();
    }
}

export { ConveyorTunnel, TunnelDirection };
export default ConveyorTunnel;