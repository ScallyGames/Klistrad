import Utils from '../utils';
import Vector2 from '../vector2';

class GameObject
{
    private _position : Vector2 = new Vector2();
    get position() : Vector2
    {
        return this._position;
    };
    set position(value : Vector2)
    {
        if(this._position !== value)
        {
            this._position = value;
            this.isDirty = true;
        }
    };
    private _pivot : Vector2 = new Vector2();
    get pivot() : Vector2
    {
        return this._pivot;
    };
    set pivot(value : Vector2)
    {
        if(this._pivot !== value)
        {
            this._pivot = value;
            this.isDirty = true;
        }
    };
    private _isMarkedForDestruction : boolean = false;
    get isMarkedForDestruction() : boolean
    {
        return this._isMarkedForDestruction;
    }
    

    protected isDirty : boolean = true;
    htmlElement : HTMLElement;
    contentHtmlElement : HTMLElement;
    _zIndex : number = 0;
    get zIndex() : number
    {
        return this._zIndex;
    }
    set zIndex(value : number)
    {
        if(value !== this._zIndex)
        {
            this._zIndex = this.zIndex;
            this.htmlElement.style.zIndex = value.toString();
        }
    }

    constructor()
    {
        this.htmlElement = document.createElement('div');
        this.htmlElement.classList.add('game-object');
        this.contentHtmlElement = document.createElement('div');
        this.htmlElement.appendChild(this.contentHtmlElement);
    }

    update() : void
    {
        if(this.isDirty)
        {
            this.htmlElement.style.left = Utils.asCharWidth(this.position.x - this.pivot.x);
            this.htmlElement.style.top = Utils.asCharHeight(this.position.y - this.pivot.y);

            this.isDirty = false;
        }
    }

    destroy() 
    {
        this._isMarkedForDestruction = true;
        this.htmlElement.remove();
    }
}

export { GameObject };
export default GameObject;