import Vector2 from '../vector2';
import GameObject from './game-object';
import Fillable from '../interfaces/fillable';
import Spillage from './spillage';
import Utils from '../utils';
import Game from '../game';
import Battery from './battery';
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

class Vat extends GameObject implements Fillable {

    contentElement : HTMLElement;
    rodsElement : HTMLElement;
    containerElement : HTMLElement;
    content : number = 0;
    contentMax : number = 100;
    spillageRate : number = 2;
    spillageContainer : Spillage;
    rods : Rod[] = [];
    rodAmountMax : number = 4;
    heat : number = 0;
    overheatMax : number = 100;
    overheatIncrement : number = 1;

    fill() : boolean {
        if(this.rods.length < this.rodAmountMax) {
            this.rods.push(new Rod());
            this.adjustRods();
            return true;
        } else {
            return false;
        }
    }

    adjustRods() {
        this.rodsElement.innerHTML = new Array(this.rods.length + 1).join('◎');
    }

    getCoolantColor() : string {
        let ratio = this.heat / this.overheatMax;
        return "#" + Math.floor(ratio * 0xFF).toString(16).padStart(2, "0") + "00" + Math.floor((1 - ratio) * 0xFF).toString(16).padStart(2, "0");
    }

    constructor(position : Vector2, spillageContainer : Spillage) {
        super();
        this.spillageContainer = spillageContainer;

        this.contentHtmlElement.innerHTML = template;
        this.containerElement = this.htmlElement.getElementsByClassName('vat-container')[0] as HTMLElement;
        this.containerElement.style.fontWeight = "bold";
        this.rodsElement = this.htmlElement.getElementsByClassName('rods')[0] as HTMLElement;
        this.rodsElement.style.left = Utils.asCharWidth(this.position.x - this.pivot.x + 5);
        this.rodsElement.style.top = Utils.asCharHeight(this.position.y - this.pivot.y + 3);
        this.rodsElement.style.color = "green";
        this.contentElement = this.htmlElement.getElementsByClassName('content')[0] as HTMLElement;
        this.contentElement.innerHTML = contentTemplates[FillState.Empty];

        this.position = position;
        this.update();
    }

    update() {
        let color = this.getCoolantColor();
        this.containerElement.style.color = color;
        this.contentElement.style.color = color;

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
        if(this.rods.length > 0) {
            let toDelete : Rod[] = [];
            this.rods.forEach(element => {
                this.content -= 0.1; //magic number
                if(this.content <= 0) {
                    this.heat += this.overheatIncrement;
                }
                Battery.battery.charge(element.generate());
                if(element.lifetime >= element.lifetimeMax) {
                    toDelete.push(element);
                }
            });
            if(toDelete.length > 0) {
                this.rods = this.rods.filter(x => !toDelete.includes(x));
                this.adjustRods();
            }
        }
        if(this.heat > 0 && this.content > 0.2) {
            this.content -= 0.2; //magic number * 2
            this.heat -= 1;
        }
        if(this.heat > this.overheatMax) {
            Game.gameOver("Your Reactor overheated!");
        }
        super.update();
    }
}

class Rod {
    lifetime : number = 0;
    lifetimeMax : number = 300;
    electricityGenerated : number = 100;

    generate() : number {
        this.lifetime++;
        return this.electricityGenerated;
    }
}

export { Vat, FillState };
export default Vat;