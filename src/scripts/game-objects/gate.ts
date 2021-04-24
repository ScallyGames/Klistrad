import { timeStamp } from 'console';
import Vector2 from '../vector2';
import GameObject from './game-object';
const templateClosed = require('../../templates/gate-closed.pug')();
const templateOpenLeft = require('../../templates/gate-open-left.pug')();
const templateOpenRight = require('../../templates/gate-open-right.pug')();
const templateOpenBoth = require('../../templates/gate-open-both.pug')();

class Gate extends GameObject
{
    static isOpen = false;

    keyLeft: string;
    keyRight: string;
    _isOpenLeft : boolean = false;
    get isOpenLeft() : boolean
    {
        return this._isOpenLeft;
    }
    set isOpenLeft(value : boolean)
    {
        if(this._isOpenLeft != value)
        {
            if(value && Gate.isOpen) return;

            Gate.isOpen = value;
            this._isOpenLeft = value;
            this.isDirty = true;
        }
    }
    _isOpenRight : boolean = false;
    get isOpenRight() : boolean
    {
        return this._isOpenRight;
    }
    set isOpenRight(value : boolean)
    {
        if(this._isOpenRight != value)
        {
            if(value && Gate.isOpen) return;

            Gate.isOpen = value;
            this._isOpenRight = value;
            this.isDirty = true;
        }
    }
    eventListener = (e : KeyboardEvent) => this.handleKey(e);

    constructor(position : Vector2, keyLeft: string, keyRight : string)
    {
        super();

        this.keyLeft = keyLeft;
        this.keyRight = keyRight;

        this.htmlElement.innerHTML = templateClosed;
        this.position = position;
        this.update();

        document.addEventListener("keydown", this.eventListener);
    }

    handleKey(e : KeyboardEvent) 
    {
        switch (e.key)
        {
            case this.keyLeft:
                this.isOpenLeft = !this.isOpenLeft;
                break;
            case this.keyRight:
                this.isOpenRight = !this.isOpenRight;
                break;
        }
        this.update();
    }

    update()
    {
        if(this.isDirty)
        {
            if(this.isOpenLeft && this.isOpenRight)
            {
                this.htmlElement.innerHTML = templateOpenBoth;
            }
            else if(this.isOpenLeft)
            {
                this.htmlElement.innerHTML = templateOpenLeft;
            }
            else if(this.isOpenRight)
            {
                this.htmlElement.innerHTML = templateOpenRight;
            }
            else
            {
                this.htmlElement.innerHTML = templateClosed;
            }
        }
        super.update();
    }


    destroy()
    {
        document.removeEventListener("keydown", this.eventListener);
        super.destroy();
    }
}

export { Gate };
export default Gate;