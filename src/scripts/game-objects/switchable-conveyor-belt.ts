import InputManager, { InputManagerListener } from '../input-manager';
import Fillable from '../interfaces/fillable';
import Orientation from '../orientation';
import Vector2 from '../vector2';
import InteractableGameObject from './interactable-game-object';


const template = 
{
    [Orientation.Up]: require('../../templates/conveyor-belt/conveyor-belt-up.pug')(),
    [Orientation.Down]: require('../../templates/conveyor-belt/conveyor-belt-down.pug')(),
    [Orientation.Left]: require('../../templates/conveyor-belt/conveyor-belt-left.pug')(),
    [Orientation.Right]: require('../../templates/conveyor-belt/conveyor-belt-right.pug')(),
}

class SwitchableConveyorBelt extends InteractableGameObject implements Fillable
{
    inputManager = InputManager.getInstance();
    listeners : InputManagerListener[] = [];
    
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

    private _orientation : Orientation;
    get orientation() : Orientation
    {
        return this._orientation;
    }
    set orientation(value : Orientation)
    {
        if(value !== this._orientation)
        {
            this._orientation = value;
            this.updateTexture();
        }
    }


    target : Fillable;

    constructor(
        position : Vector2, 
        labelPosition : Vector2, 
        key : string, 
        private targetMain : Fillable, 
        private targetSwitch : Fillable, 
        private orientationMain : Orientation, 
        private orientationSwitch : Orientation
    )
    {
        super(key, labelPosition);

        this.target = targetMain;
        this.orientation = orientationMain;
        
        this.contentHtmlElement.classList.add('switchable');

        this.updateTexture();
        
        this.isFull = false;

        this.position = position;
        this.update();

        
        this.listeners.push(new InputManagerListener("keydown", key, () => { 
            this.target = targetSwitch;
            this.orientation = orientationSwitch;
        }));
        this.listeners.push(new InputManagerListener("keyup", key, () => { 
            this.target = targetMain;
            this.orientation = orientationMain;
        }));

        for(let listener of this.listeners)
        {
            this.inputManager.addListener(listener.event, listener.key, listener.callback);
        }
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

    updateTexture()
    {
        this.contentHtmlElement.innerHTML = template[this.orientation];
        this.carryContentHtmlElement = this.contentHtmlElement.getElementsByClassName('content')[0] as HTMLElement;
        if(this.isFull)
        {
            this.carryContentHtmlElement.classList.remove('hidden');
        }
        else
        {
            this.carryContentHtmlElement.classList.add('hidden');
        }
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

    destroy()
    {
        for(let listener of this.listeners)
        {
            this.inputManager.removeListener(listener.event, listener.key, listener.callback);
        }

        super.destroy();
    }

}

export { SwitchableConveyorBelt };
export default SwitchableConveyorBelt;