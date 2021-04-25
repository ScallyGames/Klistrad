import Vector2 from '../vector2';
import InteractableGameObject from './interactable-game-object';
import InputManager, { InputManagerListener } from '../input-manager';
import PipeValve from './pipe-valve';
import Vat from './vat';
import WaterTank from './water-tank';
const template = require('../../templates/pipe-network.pug')();

const valveTemplates = {
    [0]: require('../../templates/pipe-network-valve-closed.pug')() as string,
    [1]: require('../../templates/pipe-network-valve-open.pug')() as string,
}

class PipeNetwork extends InteractableGameObject {
    key : string;
    valveElement : HTMLElement;
    inputManager = InputManager.getInstance();
    fillrate : number = 10;
    valves : PipeValve[] = [];
    vats : Vat[] = [];
    waterTank : WaterTank;

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

    constructor(position : Vector2, labelPosition: Vector2, key : string, valves : PipeValve[], vats : Vat[], waterTank : WaterTank) {
        super(key, labelPosition);
        this.position = position;
        this.key = key;
        this.valves = valves;
        this.vats = vats;
        this.waterTank = waterTank;
        this.listeners.push(new InputManagerListener("keydown", key, () => {
            if(WaterTank.mutex == null) {
                WaterTank.mutex = this;
                this.isOpen = true;
                this.valveElement.innerHTML = valveTemplates[1];
                this.update();
            } else if(WaterTank.mutex != this){
                WaterTank.mutex.blink();
            }
        }));
        this.listeners.push(new InputManagerListener("keyup", key, () => {
            if(this.isOpen) {
                WaterTank.mutex = null;
            }
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

    transfer(vat : Vat) {
        let actualTransfer = Math.min(this.waterTank.content, this.fillrate, vat.contentMax - vat.content);
        this.waterTank.content -= actualTransfer;
        vat.content += actualTransfer;
    }

    update() {
        if(this.isOpen) {
            if(this.valves[1].isOpen) {
                if(this.valves[2].isOpen) {
                    //bot right
                    this.transfer(this.vats[3]);
                } else {
                    //bot left
                    this.transfer(this.vats[1]);
                }
            } else {
                if(this.valves[0].isOpen) {
                    //top right
                    this.transfer(this.vats[2]);
                } else {
                    //top left
                    this.transfer(this.vats[0]);
                }
            }
        }
        super.update();
    }
}

export { PipeNetwork };
export default PipeNetwork;