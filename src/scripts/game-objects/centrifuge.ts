import InputManager, { InputManagerListener } from '../input-manager';
import Fillable from '../interfaces/fillable';
import Utils from '../utils';
import Vector2 from '../vector2';
import InteractableGameObject from './interactable-game-object';

const templates : { [key : string] : string[] } =
{
    "11": [
        require('../../templates/centrifuge/centrifuge-full0.pug')(),
        require('../../templates/centrifuge/centrifuge-full1.pug')(),
        require('../../templates/centrifuge/centrifuge-full2.pug')(),
        require('../../templates/centrifuge/centrifuge-full3.pug')(),
    ],
    "00": [
        require('../../templates/centrifuge/centrifuge-empty0.pug')(),
        require('../../templates/centrifuge/centrifuge-empty1.pug')(),
        require('../../templates/centrifuge/centrifuge-empty2.pug')(),
        require('../../templates/centrifuge/centrifuge-empty3.pug')(),
    ],
    "01": [
        require('../../templates/centrifuge/centrifuge-half-full0.pug')(),
        require('../../templates/centrifuge/centrifuge-half-full1.pug')(),
        require('../../templates/centrifuge/centrifuge-half-full2.pug')(),
        require('../../templates/centrifuge/centrifuge-half-full3.pug')(),
        require('../../templates/centrifuge/centrifuge-half-full4.pug')(),
        require('../../templates/centrifuge/centrifuge-half-full5.pug')(),
        require('../../templates/centrifuge/centrifuge-half-full6.pug')(),
        require('../../templates/centrifuge/centrifuge-half-full7.pug')(),
    ],
}

// Rotate order by 4
templates["10"] = templates["01"]
    .map((x, i) => { 
        return { 
            val: x, 
            index: (i + 4) % 8 
        }; 
    })
    .sort((a, b) => a.index - b.index)
    .map(x => x.val);

class Centrifuge extends InteractableGameObject implements Fillable
{
    inputManager = InputManager.getInstance();

    isFull : boolean[] = [false, false];
    isOn : boolean = false;
    currentSpinStep = 0;
    target : Fillable;

    listeners : InputManagerListener[] = [];

    constructor(position : Vector2, labelPosition : Vector2, key : string, target : Fillable)
    {
        super(key, labelPosition);

        this.updateTexture();
        this.position = position;
        this.target = target;
        this.update();

        this.listeners.push(new InputManagerListener("keydown", key, () => { 
            this.isOn = true;
        }));
        this.listeners.push(new InputManagerListener("keyup", key, () => { 
            this.isOn = false;
        }));

        for(let listener of this.listeners)
        {
            this.inputManager.addListener(listener.event, listener.key, listener.callback);
        }
    }

    update()
    {
        if(this.isOn || (this.currentSpinStep % 4) !== 0)
        {
            this.currentSpinStep = (this.currentSpinStep + 1) % 8;
            this.updateTexture();
        }
        else
        {
            let side = (this.currentSpinStep / 4);
            if(this.isFull[side])
            {
                if(this.target.fill())
                {
                    this.isFull[side] = false;
                    this.updateTexture();
                }
            }
        }

        super.update();
    }
    
    private updateTexture() {
        const textureMap = templates[Utils.boolTo01String(this.isFull[0]) + Utils.boolTo01String(this.isFull[1])];
        this.contentHtmlElement.innerHTML = textureMap[this.currentSpinStep % textureMap.length];
    }

    destroy()
    {
        for(let listener of this.listeners)
        {
            this.inputManager.removeListener(listener.event, listener.key, listener.callback);
        }

        super.destroy();
    }

    fill() : boolean
    {
        if((this.currentSpinStep % 4) !== 0) return false;
        if(this.isOn) return false;

        // 1 - x so that the right array value corresponds 
        // to the right array value and right string position
        let side = 1 - (this.currentSpinStep / 4);

        if(this.isFull[side]) return false;

        this.isFull[side] = true;
        this.updateTexture();
        return true;
    }
}

export { Centrifuge };
export default Centrifuge;