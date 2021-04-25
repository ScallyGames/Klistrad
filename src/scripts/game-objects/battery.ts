import Game from '../game';
import Utils from '../utils';
import Vector2 from '../vector2';
import GameObject from './game-object';
const template = require('../../templates/battery.pug')();

enum FillState 
{
    Empty,
    Low,
    Medium,
    High,
    Highest,
    Full
}

const contentTemplates = 
{
    [FillState.Empty]: require('../../templates/battery-empty.pug')() as string,
    [FillState.Low]: require('../../templates/battery-low.pug')() as string,
    [FillState.Medium]: require('../../templates/battery-med.pug')() as string,
    [FillState.High]: require('../../templates/battery-high.pug')() as string,
    [FillState.Highest]: require('../../templates/battery-highest.pug')() as string,
    [FillState.Full]: require('../../templates/battery-full.pug')() as string
}

class Battery extends GameObject {
    level : number = 8000;
    levelMax : number = 10000;
    drain : number = 20;
    gaugeElement : HTMLElement;

    static battery : Battery;

    constructor(position : Vector2) {
        super();
        if(Battery.battery == null) Battery.battery = this;
        this.contentHtmlElement.innerHTML = template;
        this.gaugeElement = this.htmlElement.getElementsByClassName('gauge')[0] as HTMLElement;
        this.gaugeElement.style.color = "#fcc203";
        this.position = position;
        this.adjustGauge();
        this.update();
    }

    update() {
        if(this.level <= 0) {
            Game.gameOver("Your Battery is dead!");
        } else if(this.level >= this.levelMax) {
            Game.addScore(2);
        } else {
            Game.addScore(1);
        }
        this.level -= Math.min(this.level, this.drain);
        this.level = Math.min(this.level, this.levelMax);
        this.adjustGauge();
        super.update();
    }

    charge(amount : number) {
        this.level += amount;
    }

    adjustGauge() {
        this.gaugeElement.innerHTML = contentTemplates[Math.min(Math.floor(this.level / this.levelMax * Utils.getMaxEnumValue(FillState))+1, Utils.getMaxEnumValue(FillState)) as FillState];
    }
}

export { Battery };
export default Battery;