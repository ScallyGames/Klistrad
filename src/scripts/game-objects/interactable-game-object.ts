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