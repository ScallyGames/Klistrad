import Vector2 from '../vector2';
import GameObject from './game-object';
const template = require('../../templates/vat.pug')();


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
    [FillState.Empty]: require('../../templates/vat-content-empty.pug')() as string,
    [FillState.Low]: require('../../templates/vat-content-low.pug')() as string,
    [FillState.Medium]: require('../../templates/vat-content-med.pug')() as string,
    [FillState.High]: require('../../templates/vat-content-high.pug')() as string,
    [FillState.Full]: require('../../templates/vat-content-full.pug')() as string,
}

class Vat extends GameObject {

    contentElement : HTMLElement;
    content : number = 0;
    contentMax : number = 100;

    constructor(position : Vector2) {
        super();
    
        this.contentHtmlElement.innerHTML = template;

        this.contentElement = this.htmlElement.getElementsByClassName('content')[0] as HTMLElement;

        this.contentElement.innerHTML = contentTemplates[FillState.Empty];

        this.position = position;
        this.update();
    }

    update() {
        if(this.content == 0) {
            this.contentElement.innerHTML = contentTemplates[FillState.Empty];
        } else if(this.content == this.contentMax) {
            this.contentElement.innerHTML = contentTemplates[FillState.Full];
        } else {
            this.contentElement.innerHTML = contentTemplates[Math.floor(this.content / this.contentMax * 3) + 1 as FillState];
        }
        super.update();
    }
}

export { Vat, FillState };
export default Vat;