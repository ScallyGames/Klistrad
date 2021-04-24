import Vector2 from '../vector2';
import GameObject from './game-object';
import Car from './car';
const template = require('../../templates/water-tank.pug')();

enum FillState 
{ 
    Empty,
    Low,
    Medium,
    High,
    Full
}

const contentTemplates = 
{
    [FillState.Empty]: require('../../templates/water-tank-empty.pug')() as string,
    [FillState.Low]: require('../../templates/water-tank-low.pug')() as string,
    [FillState.Medium]: require('../../templates/water-tank-med.pug')() as string,
    [FillState.High]: require('../../templates/water-tank-high.pug')() as string,
    [FillState.Full]: require('../../templates/water-tank-full.pug')() as string,
}

class WaterTank extends GameObject {
    content : number;
    contentMax : number = 1000;
    key : string;
    contentElement : HTMLElement;

    public transfer(car : Car) : boolean {
        if(car.content > 0) {
            let fillAmount = Math.min(car.content, car.fillRate);
            car.content -= fillAmount;
            this.content += fillAmount;
            return false;
        } else {
            return true;
        }
    }

    constructor(position : Vector2, key: string) {
        super();
        this.content = 0;
        this.position = position;
        this.htmlElement.innerHTML = template;
        
        this.contentElement = this.htmlElement.getElementsByClassName('content')[0] as HTMLElement;

        this.contentElement.innerHTML = contentTemplates[FillState.Empty];

        this.update();
    }

    update() {
        let calc = Math.floor(this.content / this.contentMax * 4) as FillState;
        this.contentElement.innerHTML = contentTemplates[calc];
        super.update();
    }
}

export { WaterTank };
export default WaterTank;