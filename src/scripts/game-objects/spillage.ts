import Utils from '../utils';
import Vector2 from '../vector2';
import GameObject from './game-object';
const template = require('../../templates/spillage/spillage.pug')();

enum FillState { 
    Empty,
    Low,
    Medium,
    High,
    Full
}

const contentTemplates = {
    [FillState.Empty]: require('../../templates/spillage/spillage-content-empty.pug')() as string,
    [FillState.Low]: require('../../templates/spillage/spillage-content-low.pug')() as string,
    [FillState.Medium]: require('../../templates/spillage/spillage-content-med.pug')() as string,
    [FillState.High]: require('../../templates/spillage/spillage-content-high.pug')() as string,
    [FillState.Full]: require('../../templates/spillage/spillage-content-full.pug')() as string,
}

class Spillage extends GameObject {
    content : number = 0;
    contentMax : number = 50;
    contentElement : HTMLElement;

    transfer(transferRate : number) {
        this.content += transferRate;
        this.contentElement.innerHTML = contentTemplates[Math.floor(this.content / this.contentMax * Utils.getMaxEnumValue(FillState)) as FillState];
        if(this.content >= this.contentMax) {
            //Game Over
        }
    }

    constructor(position : Vector2) {
        super();
        this.contentHtmlElement.innerHTML = template;
        this.contentElement = this.htmlElement.getElementsByClassName('content')[0] as HTMLElement;
        this.contentElement.innerHTML = contentTemplates[FillState.Empty];
        this.position = position;
        this.update();
    }
}

export { Spillage };
export default Spillage;