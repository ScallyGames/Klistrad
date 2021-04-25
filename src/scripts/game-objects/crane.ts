import InputManager, { InputManagerListener } from '../input-manager';
import Fillable from '../interfaces/fillable';
import Vector2 from '../vector2';
import Car from './car';
import InteractableGameObject from './interactable-game-object';

const template = require('../../templates/crane/crane.pug')();

class Crane extends InteractableGameObject
{
    inputManager = InputManager.getInstance();

    cargoHtmlElement : HTMLElement;

    _isFull : boolean = false;
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
                this.cargoHtmlElement.classList.remove('hidden');
            }
            else
            {
                this.cargoHtmlElement.classList.add('hidden');
            }
        }

    }
    movementDirection : number = -1;
    minX : number;
    maxX : number;
    target : Fillable;

    listeners : InputManagerListener[] = [];

    constructor(position : Vector2, labelPosition : Vector2, key : string, minX : number, maxX : number, target : Fillable)
    {
        super(key, labelPosition);

        this.minX = minX;
        this.maxX = maxX;
        this.target = target;

        this.contentHtmlElement.innerHTML = template;
        this.cargoHtmlElement = this.contentHtmlElement.getElementsByClassName('cargo')[0] as HTMLElement;
        if(!this.isFull)
        {
            this.cargoHtmlElement.classList.add('hidden');
        }
        this.position = position;
        this.update();

        this.listeners.push(new InputManagerListener("keydown", key, () => { 
            this.movementDirection = 1;
        }));
        this.listeners.push(new InputManagerListener("keyup", key, () => { 
            this.movementDirection = -1;
        }));

        for(let listener of this.listeners)
        {
            this.inputManager.addListener(listener.event, listener.key, listener.callback);
        }
    }

    update()
    {
        if(this.movementDirection > 0)
        {
            if(this.position.x < this.maxX)
            {
                this.position = new Vector2(this.position.x + 1, this.position.y);
            }
        }
        else if(this.movementDirection < 0)
        {
            if(this.position.x > this.minX)
            {
                this.position = new Vector2(this.position.x - 1, this.position.y);
            }
            else if (this.isFull)
            {
                if(this.target.fill())
                {
                    this.isFull = false;
                }
            }
        }
        super.update();
    }
    
    transfer(car: Car): boolean {
        if(this.position.x !== this.maxX) return false;
        if(this.isFull) return false;
        car.content--;
        this.isFull = true;
        return car.content === 0;
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

export { Crane };
export default Crane;