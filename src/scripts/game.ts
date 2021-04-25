import GameObject from './game-objects/game-object';
import Car from './game-objects/car';
import Gate, { GateDirection } from './game-objects/gate';
import Vector2 from './vector2';
import DebugPosition from './game-objects/debug-position';
import GatePost from './game-objects/gate-post';
import Vat from './game-objects/vat';
import WaterTank from './game-objects/water-tank';
import PipeNetwork from './game-objects/pipe-network';
import PipeValve, { Pos } from './game-objects/pipe-valve';

class Game
{
    refreshRate : number = 5;
    gameObjects : GameObject[] = [];
    gameHtmlElement : HTMLElement;
    waypointsCarOne : (Vector2 | ((car : Car)=>boolean)) [];
    waypointsCarTwo : (Vector2 | ((car : Car)=>boolean)) [];
    valves : PipeValve[] = [];
    vats : Vat[] = [];

    constructor()
    {
        this.gameHtmlElement = document.getElementById('game');
        setInterval(() => this.update(), 1000 / this.refreshRate);

        this.addObject(new DebugPosition()); //delete me before release

        let gateTopIn = new Gate(new Vector2(88, 4), new Vector2(-2, -1), 'i', GateDirection.Left);
        this.addObject(gateTopIn);
        let gateTopOut = new Gate(new Vector2(91, 4), new Vector2(3, -1), 'o', GateDirection.Right);
        this.addObject(gateTopOut);
        let gateBottomOut = new Gate(new Vector2(72, 38), new Vector2(-2, 1), 'k', GateDirection.Left);
        this.addObject(gateBottomOut);
        let gateBottomIn = new Gate(new Vector2(75, 38), new Vector2(3, 1), 'l', GateDirection.Right);
        this.addObject(gateBottomIn);

        this.addObject(new GatePost(new Vector2(90, 4)));
        this.addObject(new GatePost(new Vector2(74, 38)));
        
        let waterTank = new WaterTank(new Vector2(73, 7), 'j');
        this.addObject(waterTank);
        this.waypointsCarOne = [
            new Vector2(89, -6),
            new Vector2(89, 2),
            ()=>{
                return gateTopIn.isOpen;
            },
            new Vector2(89, 8),
            new Vector2(114, 8),
            new Vector2(114, 15),
            new Vector2(100, 15),
            (car : Car)=>{
                return waterTank.transfer(car);
            },
            new Vector2(100, 16),
            new Vector2(114, 16),
            new Vector2(114, 35),
            new Vector2(73, 35),
            new Vector2(73, 36),
            ()=>{
                return gateBottomOut.isOpen;
            },
            new Vector2(73, 44)
        ];
        this.waypointsCarTwo = [
            new Vector2(75, 45),
            new Vector2(75, 39),
            ()=>{
                return gateBottomIn.isOpen;
            },
            new Vector2(75, 36),
            new Vector2(116, 36),
            new Vector2(116, 31),
            new Vector2(100, 31),
            ()=>{
                console.log("waiting for unloading")
                return true;
            },
            new Vector2(100, 32),
            new Vector2(116, 32),
            new Vector2(116, 7),
            new Vector2(91, 7),
            new Vector2(91, 5),
            ()=>{
                return gateTopOut.isOpen;
            },
            new Vector2(91, -6)
        ];
        this.addObject(new Car([...this.waypointsCarOne], 100));
        this.addObject(new Car([...this.waypointsCarTwo], 100));
        
        this.valves[0] = new PipeValve(new Vector2(25, 8), Pos.Top, 'z');
        this.valves[1] = new PipeValve(new Vector2(25, 8), Pos.Mid, 'h');
        this.valves[2] = new PipeValve(new Vector2(25, 8), Pos.Bot, 'n');
        this.valves.forEach(element => {
            this.addObject(element);
        });
        this.vats[0] = new Vat(new Vector2(11, 6));
        this.vats[1] = new Vat(new Vector2(11, 16));
        this.vats[2] = new Vat(new Vector2(46, 6));
        this.vats[3] = new Vat(new Vector2(46, 16));
        this.vats.forEach(element => {
            this.addObject(element);
        });
        
        this.addObject(new PipeNetwork(new Vector2(25, 8), 'u', this.valves, this.vats, waterTank));
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
        
        if(objectCountBefore !== this.gameObjects.length && this.gameObjects.length === 4)
        {
            setTimeout(() => this.addObject(new Car([...this.waypointsCarOne], 100)), 2000);
        }
    }
}

export { Game };
export default Game;