import Utils from '../utils';
import Vector2 from '../vector2';
import GameObject from './game-object';

class InteractableGameObject extends GameObject
{
    key : string;
    labelPosition : Vector2;
    labelHtmlElement : HTMLElement;

    constructor(key : string, labelPosition : Vector2)
    {
        super();
        this.key = key;
        this.labelPosition = labelPosition;
        this.labelHtmlElement = document.createElement('div');
        this.labelHtmlElement.classList.add('label');
        this.labelHtmlElement.innerText = this.key.toUpperCase();
        this.labelHtmlElement.style.left = Utils.asCharWidth(this.position.x - this.pivot.x + this.labelPosition.x);
        this.labelHtmlElement.style.top = Utils.asCharHeight(this.position.y - this.pivot.y + this.labelPosition.y);
        this.htmlElement.appendChild(this.labelHtmlElement);
    }

    blink() {
        this.toggleColor("red");
        setTimeout(() => {this.toggleColor("red")}, 300);
        setTimeout(() => {this.toggleColor("red")}, 600);
        setTimeout(() => {this.toggleColor("red")}, 900);
    }

    private toggleColor(col : string) {
        if(this.labelHtmlElement.style.color == col) {
            this.labelHtmlElement.style.color = "";
            this.labelHtmlElement.style.borderColor = "";
            this.labelHtmlElement.style.fontWeight = "normal";
        } else {
            this.labelHtmlElement.style.color = col;
            this.labelHtmlElement.style.borderColor = col;
            this.labelHtmlElement.style.fontWeight = "bold";
        }
    }
    
    update() : void
    {
        if(this.isDirty)
        {
            this.labelHtmlElement.style.left = Utils.asCharWidth(this.labelPosition.x + 0.5);
            this.labelHtmlElement.style.top = Utils.asCharHeight(this.labelPosition.y);
        }
        super.update();
    }

    destroy() : void
    {
        this.labelHtmlElement.remove();
        super.destroy();
    }
}

export { InteractableGameObject };
export default InteractableGameObject;