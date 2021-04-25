import Vector2 from '../vector2';
import GameObject from './game-object';
import Spillage from './spillage';
const template = require('../../templates/vat.pug')();


enum FillState 
{
    Empty,
    Low,
    Medium,
    High,
    Full,
    Overflow
}

const contentTemplates = 
{
    [FillState.Empty]: require('../../templates/vat-content-empty.pug')() as string,
    [FillState.Low]: require('../../templates/vat-content-low.pug')() as string,
    [FillState.Medium]: require('../../templates/vat-content-med.pug')() as string,
    [FillState.High]: require('../../templates/vat-content-high.pug')() as string,
    [FillState.Full]: require('../../templates/vat-content-full.pug')() as string,
    [FillState.Overflow]: require('../../templates/vat-content-overflow.pug')() as string
}

class Vat extends GameObject {

    contentElement : HTMLElement;
    content : number = 0;
    contentMax : number = 100;
    spillageRate : number = 1;
    spillageContainer : Spillage;

    constructor(position : Vector2, spillageContainer : Spillage) {
        super();
        this.spillageContainer = spillageContainer;
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

export { Vat, FillState };
export default Vat;