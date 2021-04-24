import GameObject from './game-objects/game-object';
import Car from './game-objects/car';
import Gate, { GateDirection } from './game-objects/gate';
import Vector2 from './vector2';
import DebugPosition from './game-objects/debug-position';
import GatePost from './game-objects/gate-post';
import Vat from './game-objects/vat';

class Game
{
    refreshRate : number = 5;
    gameObjects : GameObject[] = [];
    gameHtmlElement : HTMLElement;
    waypointsCarOne : (Vector2 | (()=>boolean)) [];
    waypointsCarTwo : (Vector2 | (()=>boolean)) [];

    constructor()
    {
        this.gameHtmlElement = document.getElementById('game');
        setInterval(() => this.update(), 1000 / this.refreshRate);

        this.addObject(new DebugPosition()); //delete me before release

        let gateTopIn = new Gate(new Vector2(89, 4), 'i', GateDirection.Left);
        this.addObject(gateTopIn);
        let gateTopOut = new Gate(new Vector2(92, 4), 'o', GateDirection.Right);
        this.addObject(gateTopOut);
        let gateBottomOut = new Gate(new Vector2(73, 38), 'k', GateDirection.Left);
        this.addObject(gateBottomOut);
        let gateBottomIn = new Gate(new Vector2(76, 38), 'l', GateDirection.Right);
        this.addObject(gateBottomIn);

        this.addObject(new GatePost(new Vector2(91, 4)));
        this.addObject(new GatePost(new Vector2(75, 38)));
        
        this.addObject(new Vat(new Vector2(30, 15)));


        this.waypointsCarOne = [
            new Vector2(90, -6),
            new Vector2(90, 2),
            ()=>{
                return gateTopIn.isOpen;
            },
            new Vector2(90, 6),
            new Vector2(114, 6),
            new Vector2(114, 15),
            new Vector2(100, 15),
            ()=>{
                console.log("waiting for unloading")
                return true;
            },
            new Vector2(100, 16),
            new Vector2(114, 16),
            new Vector2(114, 35),
            new Vector2(74, 35),
            new Vector2(74, 36),
            ()=>{
                return gateBottomOut.isOpen;
            },
            new Vector2(74, 44)
        ];
        this.waypointsCarTwo = [
            new Vector2(76, 45),
            new Vector2(76, 39),
            ()=>{
                return gateBottomIn.isOpen;
            },
            new Vector2(76, 36),
            new Vector2(116, 36),
            new Vector2(116, 32),
            new Vector2(100, 32),
            ()=>{
                console.log("waiting for unloading")
                return true;
            },
            new Vector2(100, 33),
            new Vector2(116, 33),
            new Vector2(116, 5),
            new Vector2(92, 5),
            ()=>{
                return gateTopOut.isOpen;
            },
            new Vector2(92, -6)
        ];
        this.addObject(new Car(this.waypointsCarOne, 100));
        this.addObject(new Car(this.waypointsCarTwo, 100));
    }

    addObject(obj : GameObject) : void
    {
        this.gameObjects.push(obj);
        this.gameHtmlElement.appendChild(obj.htmlElement);
    }

    update() : void
    {
        const objectCountBefore = this.gameObjects.length;

        this.gameObjects = this.gameObjects.filter(x => !x.isMarkedForDestruction);

        for(let gameObject of this.gameObjects)
        {
            gameObject.update();
        }

        if(objectCountBefore !== this.gameObjects.length && this.gameObjects.length === 3)
        {
            setTimeout(() => this.addObject(new Car(this.waypointsCarOne, 100)), 2000);
        }
    }
}

export { Game };
export default Game;