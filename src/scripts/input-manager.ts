import { exception } from "console";

class InputManagerEventRegistration
{
    key : string;
    isSticky : boolean;
    pressTimeoutHandle : number = null;
    keyDownHandlers : (() => void)[] = [];
    keyUpHandlers : (() => void)[] = [];
    hasKeyUpPending: boolean = false;

    documentKeyDownHandler = (e : KeyboardEvent) => this.onKeyDown(e);
    documentKeyUpHandler = (e : KeyboardEvent) => this.onKeyUp(e)

    constructor(key : string)
    {
        this.key = key;

        document.addEventListener('keydown', this.documentKeyDownHandler);
        document.addEventListener('keyup', this.documentKeyUpHandler);
    }

    private onKeyDown(e : KeyboardEvent) 
    {
        if(e.key !== this.key) return;
        if(e.repeat) return;
        
        if(this.isSticky)
        {
            this.isSticky = false;
            this.notifyKeyUp()
        }

        if(this.pressTimeoutHandle !== null)
        {
            this.isSticky = true;
            window.clearTimeout(this.pressTimeoutHandle);
        }

        this.pressTimeoutHandle = window.setTimeout(() => { 
            this.pressTimeoutHandle = null; 
            if(!this.isSticky && this.hasKeyUpPending)
            {
                this.notifyKeyUp();
                this.hasKeyUpPending = false;
            }
        }, InputManager.doublePressThreshold);
        
        
        this.notifyKeyDown();
    }

    private onKeyUp(e : KeyboardEvent) 
    {
        if(e.key !== this.key) return;

        if(this.isSticky) return;

        if(this.pressTimeoutHandle !== null)
        {
            this.hasKeyUpPending = true;
        }
        else
        {
            this.notifyKeyUp();
        }
    }

    private notifyKeyDown() {
        for (let callback of this.keyDownHandlers) {
            callback();
        }
    }

    private notifyKeyUp() {
        for (let callback of this.keyUpHandlers) {
            callback();
        }
    }
}

class InputManagerListener
{
    constructor(public event : string, public key: string, public callback: () => void) { }
}

class InputManager
{
    public static doublePressThreshold : number = 200;
    private static instance : InputManager;
    private registrations : { [key : string] : InputManagerEventRegistration } = {};

    private constructor() { }

    public static getInstance() : InputManager
    {
        if(!InputManager.instance)
        {
            InputManager.instance = new InputManager();
        }
        return InputManager.instance;
    }

    public addListener(event : string, key : string, callback : () => void)
    {
        if(!(key in this.registrations))
        {
            this.registrations[key] = new InputManagerEventRegistration(key);
        }

        switch(event)
        {
            case 'keydown':
                this.registrations[key].keyDownHandlers.push(callback);
                break;
            case 'keyup':
                this.registrations[key].keyUpHandlers.push(callback);
                break;
            default:
                throw `Event '${event}' does not exist in InputManager.`;
        }
    }

    public removeListener(event : string, key : string, callback : () => void)
    {
        if(!(key in this.registrations)) throw `Key '${key}' is not registered`;

        switch(event)
        {
            case 'keydown':
                this.registrations[key].keyDownHandlers = this.registrations[key].keyDownHandlers.filter(x => x != callback);
                break;
            case 'keyup':
                this.registrations[key].keyUpHandlers = this.registrations[key].keyUpHandlers.filter(x => x != callback);
                break;
            default:
                throw `Event '${event}' does not exist in InputManager.`;
        }
    }
}

export { InputManager, InputManagerListener };
export default InputManager;