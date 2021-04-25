import Vector2 from '../vector2';
import InteractableGameObject from './interactable-game-object';
import Car from './car';
import InputManager, { InputManagerListener } from '../input-manager';
import Spillage from './spillage';
const template = require('../../templates/water-tank.pug')();

enum FillState { 
    Empty,
    Low,
    Medium,
    High,
    Full,
    Overflow
}

const contentTemplates = {
    [FillState.Empty]: require('../../templates/water-tank-empty.pug')() as string,
    [FillState.Low]: require('../../templates/water-tank-low.pug')() as string,
    [FillState.Medium]: require('../../templates/water-tank-med.pug')() as string,
    [FillState.High]: require('../../templates/water-tank-high.pug')() as string,
    [FillState.Full]: require('../../templates/water-tank-full.pug')() as string,
    [FillState.Overflow]: require('../../templates/water-tank-overflow.pug')() as string
}
const valveTemplates = {
    [0]: require('../../templates/water-tank-valve-closed.pug')() as string,
    [1]: require('../../templates/water-tank-valve-open.pug')() as string,
}

class WaterTank extends InteractableGameObject {
    content : number;
    contentMax : number = 500;
    key : string;
    inputManager = InputManager.getInstance();
    contentElement : HTMLElement;
    valveElement : HTMLElement;
    spillageRate : number = 5;
    spillageContainer : Spillage;

    static mutex : InteractableGameObject = null;

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

    public transfer(car : Car) : boolean {
        if(car.content > 0 && this.isOpen) {
            let fillAmount = Math.min(car.content, car.fillRate);
            car.content -= fillAmount;
            this.content += fillAmount;
        } else if(car.content <= 0) {
            return true;
        }
        return false;
    }

    constructor(position : Vector2, labelPosition: Vector2, key: string,  spillageContainer : Spillage) {
        super(key, labelPosition);
        this.spillageContainer = spillageContainer;
        this.content = 0;
        this.position = position;
        this.contentHtmlElement.innerHTML = template;
        
        this.key = key;
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

        this.contentElement = this.htmlElement.getElementsByClassName('content')[0] as HTMLElement;
        this.contentElement.innerHTML = contentTemplates[FillState.Empty];

        this.valveElement = this.htmlElement.getElementsByClassName('valve')[0] as HTMLElement;
        this.valveElement.innerHTML = valveTemplates[0];

        for(let listener of this.listeners)
        {
            this.inputManager.addListener(listener.event, listener.key, listener.callback);
        }

        this.update();
    }

    update() {
        if(this.content == 0) {
            this.contentElement.innerHTML = contentTemplates[FillState.Empty];
        } else if(this.content == this.contentMax) {
            this.contentElement.innerHTML = contentTemplates[FillState.Full];
        } else if(this.content > this.contentMax) {
            this.contentElement.innerHTML = contentTemplates[FillState.Overflow];
            this.content -= this.spillageRate;
            this.spillageContainer.transfer(this.spillageRate);
        } else {
            this.contentElement.innerHTML = contentTemplates[Math.floor(this.content / this.contentMax * 3) + 1 as FillState];
        }
        super.update();
    }
}

export { WaterTank };
export default WaterTank;