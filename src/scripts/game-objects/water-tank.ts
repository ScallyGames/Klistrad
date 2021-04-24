import Vector2 from '../vector2';
import GameObject from './game-object';
import Car from './car';
import InputManager, { InputManagerListener } from '../input-manager';
import Utils from '../utils';
const template = require('../../templates/water-tank.pug')();

enum FillState { 
    Empty,
    Low,
    Medium,
    High,
    Full
}

const contentTemplates = {
    [FillState.Empty]: require('../../templates/water-tank-empty.pug')() as string,
    [FillState.Low]: require('../../templates/water-tank-low.pug')() as string,
    [FillState.Medium]: require('../../templates/water-tank-med.pug')() as string,
    [FillState.High]: require('../../templates/water-tank-high.pug')() as string,
    [FillState.Full]: require('../../templates/water-tank-full.pug')() as string,
}
const valveTemplates = {
    [0]: require('../../templates/water-tank-valve-closed.pug')() as string,
    [1]: require('../../templates/water-tank-valve-open.pug')() as string,
}

class WaterTank extends GameObject {
    content : number;
    contentMax : number = 1000;
    key : string;
    inputManager = InputManager.getInstance();
    contentElement : HTMLElement;
    valveElement : HTMLElement;

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

    constructor(position : Vector2, key: string) {
        super();
        this.content = 0;
        this.position = position;
        this.htmlElement.innerHTML = template;
        
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
        let calc = Math.floor(this.content / this.contentMax * Utils.getMaxEnumValue(FillState)) as FillState;
        this.contentElement.innerHTML = contentTemplates[calc];
        super.update();
    }
}

export { WaterTank };
export default WaterTank;