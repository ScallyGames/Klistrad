import InputManager, { InputManagerListener } from '../input-manager';
import Vector2 from '../vector2';
import GameObject from './game-object';

enum GateDirection
{
    Left,
    Right
}

const templateClosed = require('../../templates/gate-closed.pug')();
const templateOpen = {
    [GateDirection.Left]: require('../../templates/gate-open-left.pug')() as string,
    [GateDirection.Right]: require('../../templates/gate-open-right.pug')() as string,
};

class Gate extends GameObject
{
    static isAnyOpen = false;
    inputManager = InputManager.getInstance();

    key: string;
    orientation: GateDirection;

    _isOpen : boolean = false;
    get isOpen() : boolean
    {
        return this._isOpen;
    }
    set isOpen(value : boolean)
    {
        if(this._isOpen != value)
        {
            if(value && Gate.isAnyOpen) return;

            Gate.isAnyOpen = value;
            this._isOpen = value;
            this.isDirty = true;
        }
    }

    listeners : InputManagerListener[] = [];

    constructor(position : Vector2, key: string, orientation: GateDirection)
    {
        super();

        this.key = key;
        this.orientation = orientation;

        this.htmlElement.innerHTML = templateClosed;
        this.position = position;
        this.update();

        this.listeners.push(new InputManagerListener("keydown", key, () => { 
                this.isOpen = true;
                this.update();
        }));
        this.listeners.push(new InputManagerListener("keyup", key, () => { 
                this.isOpen = false;
                this.update();
        }));

        for(let listener of this.listeners)
        {
            this.inputManager.addListener(listener.event, listener.key, listener.callback);
        }
    }

    update()
    {
        if(this.isDirty)
        {
            if(this.isOpen)
            {
                this.htmlElement.innerHTML = templateOpen[this.orientation];
            }
            else
            {
                this.htmlElement.innerHTML = templateClosed;
            }
        }
        super.update();
    }


    destroy()
    {
        for(let listener of this.listeners)
        {
            this.inputManager.removeListener(listener.event, listener.key, listener.callback);
        }

        super.destroy();
    }
}

export { Gate, GateDirection };
export default Gate;