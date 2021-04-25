import Vector2 from '../vector2';
import GameObject from './game-object';
import InputManager, { InputManagerListener } from '../input-manager';
const template = require('../../templates/pipe-network.pug')();

const valveTemplates = {
    [0]: require('../../templates/pipe-network-valve-closed.pug')() as string,
    [1]: require('../../templates/pipe-network-valve-open.pug')() as string,
}

class PipeNetwork extends GameObject {
    key : string;
    valveElement : HTMLElement;
    inputManager = InputManager.getInstance();
    _isOpen : boolean = false;
    get isOpen() : boolean
    {
        return this._isOpen;
    }
    set isOpen(value : boolean)
    {
        if(this._isOpen != value)
        {
            this._isOpen = value;
            this.isDirty = true;
        }
    }

    listeners : InputManagerListener[] = [];

    constructor(position : Vector2, key : string) {
        super();
        this.position = position;
        this.key = key;
        this.listeners.push(new InputManagerListener("keydown", key, () => { 
            this.isOpen = true;
            this.valveElement.innerHTML = valveTemplates[1];
            this.update();
        }));
        this.listeners.push(new InputManagerListener("keyup", key, () => { 
            this.isOpen = false;
            this.valveElement.innerHTML = valveTemplates[0];
            this.update();
        }));
        for(let listener of this.listeners)
        {
            this.inputManager.addListener(listener.event, listener.key, listener.callback);
        }
        this.contentHtmlElement.innerHTML = template;
        this.valveElement = this.htmlElement.getElementsByClassName('valve')[0] as HTMLElement;
        this.valveElement.innerHTML = valveTemplates[0];
        this.update();
    }
}

export { PipeNetwork };
export default PipeNetwork;