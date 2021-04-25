import Fillable from '../interfaces/fillable';
import Orientation from '../orientation';
import Vector2 from '../vector2';
import GameObject from './game-object';

const template = 
{
    [Orientation.Up]: require('../../templates/conveyor-belt/conveyor-belt-up.pug')(),
    [Orientation.Down]: require('../../templates/conveyor-belt/conveyor-belt-down.pug')(),
    [Orientation.Left]: require('../../templates/conveyor-belt/conveyor-belt-left.pug')(),
    [Orientation.Right]: require('../../templates/conveyor-belt/conveyor-belt-right.pug')(),
}

class ConveyorBelt extends GameObject implements Fillable
{
    carryContentHtmlElement : HTMLElement;

    isFullAfterTick: boolean = false;
    private _isFull : boolean = null;
    get isFull() : boolean
    {
        return this._isFull;
    }
    set isFull(value : boolean)
    {
        if(value !== this._isFull)
        {
            this._isFull = value;
            if(value)
            {
                this.carryContentHtmlElement.classList.remove('hidden');
            }
            else
            {
                this.carryContentHtmlElement.classList.add('hidden');
            }
        }

    }

    target : Fillable;

    constructor(position : Vector2, target : Fillable, orientation : Orientation)
    {
        super();

        this.target = target;
        
        this.contentHtmlElement.innerHTML = template[orientation];
        this.carryContentHtmlElement = this.contentHtmlElement.getElementsByClassName('content')[0] as HTMLElement;
        
        this.isFull = false;

        this.position = position;
        this.update();
    }

    update()
    {
        if(this.isFull)
        {
            if(this.target && this.target.fill())
            {
                this.isFullAfterTick = false;
            }
        }
        super.update();
    }

    lateUpdate()
    {
        this.isFull = this.isFullAfterTick;
        super.lateUpdate();
    }
    
    fill(): boolean {
        if(this.isFull) return false;
        
        this.isFullAfterTick = true;
        return true;
    }

}

export { ConveyorBelt };
export default ConveyorBelt;