import Vector2 from '../vector2';
import GameObject from './game-object';
const template = require('../../templates/vat.pug')();


enum FillState 
{ 
    Low,
    Medium,
    High,
    Full
}

const contentTemplates = 
{
    [FillState.Low]: require('../../templates/vat-content-low.pug')() as string,
    [FillState.Medium]: require('../../templates/vat-content-med.pug')() as string,
    [FillState.High]: require('../../templates/vat-content-high.pug')() as string,
    [FillState.Full]: require('../../templates/vat-content-full.pug')() as string,
}

class Vat extends GameObject {

    contentElement : HTMLElement;
    currentFillState : FillState = FillState.Low;

    constructor(position : Vector2) {
        super();
    
        this.htmlElement.innerHTML = template;

        this.contentElement = this.htmlElement.getElementsByClassName('content')[0] as HTMLElement;

        this.contentElement.innerHTML = contentTemplates[this.currentFillState];

        setInterval(() => {
            if(this.currentFillState != FillState.Full)
            {
                this.currentFillState++;
                this.contentElement.innerHTML = contentTemplates[this.currentFillState];
            }
        }, 1000)



        this.position = position;
        this.update();
    }
}

export { Vat, FillState };
export default Vat;