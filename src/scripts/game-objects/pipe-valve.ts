import Vector2 from '../vector2';
import GameObject from './game-object';
import InputManager, { InputManagerListener } from '../input-manager';
const template = require('../../templates/pipe-valve.pug')();

enum Pos {
    Top,
    Mid,
    Bot
}

const valveTemplates = {
    [Pos.Top]: {
        [0]: require('../../templates/pipe-valve-top-left.pug')() as string,
        [1]: require('../../templates/pipe-valve-top-right.pug')() as string,
    },
    [Pos.Mid]: {
        [0]: require('../../templates/pipe-valve-mid-top.pug')() as string,
        [1]: require('../../templates/pipe-valve-mid-bot.pug')() as string,
    },
    [Pos.Bot]: {
        [0]: require('../../templates/pipe-valve-bot-left.pug')() as string,
        [1]: require('../../templates/pipe-valve-bot-right.pug')() as string,
    }
}

class PipeValve extends GameObject {
    key : string;
    inputManager = InputManager.getInstance();
    valveElement : HTMLElement;
    valveType : Pos;

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

    constructor(position : Vector2, type: Pos, key: string) {
        super();
        this.position = position;
        this.valveType = type;
        this.key = key;
        this.listeners.push(new InputManagerListener("keydown", key, () => { 
            this.isOpen = true;
            this.valveElement.innerHTML = valveTemplates[this.valveType][1];
            this.update();
        }));
        this.listeners.push(new InputManagerListener("keyup", key, () => { 
            this.isOpen = false;
            this.valveElement.innerHTML = valveTemplates[this.valveType][0];
            this.update();
        }));

        this.htmlElement.innerHTML = template;
        this.valveElement = this.htmlElement.getElementsByClassName('valve')[0] as HTMLElement;
        this.valveElement.innerHTML = valveTemplates[this.valveType][0];

        for(let listener of this.listeners)
        {
            this.inputManager.addListener(listener.event, listener.key, listener.callback);
        }

        this.update();
    }

    update() {
        super.update();
    }
}

export { PipeValve, Pos };
export default PipeValve;