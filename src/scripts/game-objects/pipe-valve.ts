import Vector2 from '../vector2';
import InteractableGameObject from './interactable-game-object';
import InputManager, { InputManagerListener } from '../input-manager';
const template = require('../../templates/pipe-valve.pug')();

enum Pos {
    Top,
    Mid,
    Bot
}

const valveTemplates : { [k : number]: { [key: number]: string} } = {
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

class PipeValve extends InteractableGameObject {
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

    constructor(position : Vector2, labelPosition: Vector2, type: Pos, key: string) {
        super(key, labelPosition);
        this.position = position;
        this.valveType = type;
        this.key = key;
        document.addEventListener('keydown', (e : KeyboardEvent) => { 
            if(e.repeat) return;
            if(e.key !== this.key) return;

            this.isOpen = !this.isOpen;
            this.valveElement.innerHTML = valveTemplates[this.valveType][(+this.isOpen)];
            this.update();
        });

        this.contentHtmlElement.innerHTML = template;
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