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
import Crane from './game-objects/crane';
import Centrifuge from './game-objects/centrifuge';
import Spillage from './game-objects/spillage';
import Fillable from './interfaces/fillable';
import ConveyorBelt from './game-objects/conveyor-belt';
import Orientation from './orientation';
import SwitchableConveyorBelt from './game-objects/switchable-conveyor-belt';

class Game
{
    refreshRate : number = 5;
    gameObjects : GameObject[] = [];
    gameHtmlElement : HTMLElement;
    waypointsCarOne : (Vector2 | ((car : Car)=>boolean)) [];
    waypointsCarTwo : (Vector2 | ((car : Car)=>boolean)) [];
    valves : PipeValve[] = [];
    vats : Vat[] = [];
    fuelCarArount: number = 3;
    waterCarAmount: number = 100;

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

        let spillage = new Spillage(new Vector2(9, 13));
        this.addObject(spillage);
        
        let waterTank = new WaterTank(new Vector2(73, 7), new Vector2(30, 4), 'j', spillage);
        
        let previousTargetMain : GameObject & Fillable = null;
        let previousTargetSwitch : GameObject & Fillable = null;
        
        // Top left
        for(let x = 26; x <= 34; x++)
        {
            previousTargetMain = new ConveyorBelt(new Vector2(x, 28), previousTargetMain, Orientation.Left);
            this.addObject(previousTargetMain);
        }
        // Top right
        for(let x = 44; x >= 36; x--)
        {
            previousTargetSwitch = new ConveyorBelt(new Vector2(x, 28), previousTargetSwitch, Orientation.Right);
            this.addObject(previousTargetSwitch);
        }
        // Switch top
        previousTargetMain = new SwitchableConveyorBelt(new Vector2(35, 28), new Vector2(0, -1), 'w', previousTargetMain, previousTargetSwitch, Orientation.Left, Orientation.Right);
        // Middle up
        this.addObject(previousTargetMain);
        for(let y = 29; y <= 31; y++)
        {
            previousTargetMain = new ConveyorBelt(new Vector2(35, y), previousTargetMain, Orientation.Up);
            this.addObject(previousTargetMain);
        }

        let previousTargetBottomMain : GameObject & Fillable = null;
        let previousTargetBottomSwitch : GameObject & Fillable = null;
        // Bottom left
        for(let x = 26; x <= 34; x++)
        {
            previousTargetBottomMain = new ConveyorBelt(new Vector2(x, 36), previousTargetBottomMain, Orientation.Left);
            this.addObject(previousTargetBottomMain);
        }
        // Bottom right
        for(let x = 44; x >= 36; x--)
        {
            previousTargetBottomSwitch = new ConveyorBelt(new Vector2(x, 36), previousTargetBottomSwitch, Orientation.Right);
            this.addObject(previousTargetBottomSwitch);
        }
        // Switch bottom
        previousTargetSwitch = new SwitchableConveyorBelt(new Vector2(35, 36), new Vector2(0, 1), 'x', previousTargetBottomMain, previousTargetBottomSwitch, Orientation.Left, Orientation.Right);
        // Middle down
        this.addObject(previousTargetSwitch);
        for(let y = 35; y >= 33; y--)
        {
            previousTargetSwitch = new ConveyorBelt(new Vector2(35, y), previousTargetSwitch, Orientation.Down);
            this.addObject(previousTargetSwitch);
        }

        // Switch center
        previousTargetMain = new SwitchableConveyorBelt(new Vector2(35, 32), new Vector2(-2, 0), 's', previousTargetMain, previousTargetSwitch, Orientation.Up, Orientation.Down);
        this.addObject(previousTargetMain);
        // Center to centrifuge
        for(let x = 36; x <= 78; x++)
        {
            previousTargetMain = new ConveyorBelt(new Vector2(x, 32), previousTargetMain, Orientation.Left);
            this.addObject(previousTargetMain);
        }

        const centrifuge = new Centrifuge(new Vector2(79, 30), new Vector2(4, 0), 'c', previousTargetMain);
        this.addObject(centrifuge);

        const crane = new Crane(new Vector2(86, 30), new Vector2(1, -2), 'g', 86, 101, centrifuge);
        crane.zIndex = 1;
        this.addObject(crane);

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
            new Vector2(73, 44),
            () => {
                setTimeout(() => this.addObject(new Car([...this.waypointsCarOne], this.waterCarAmount, 'water')), 2000);
                return true;
            },
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
            (car : Car)=>{
                return crane.transfer(car);
            },
            new Vector2(100, 32),
            new Vector2(116, 32),
            new Vector2(116, 7),
            new Vector2(91, 7),
            new Vector2(91, 5),
            ()=>{
                return gateTopOut.isOpen;
            },
            new Vector2(91, -6),
            () => {
                setTimeout(() => this.addObject(new Car([...this.waypointsCarTwo], this.fuelCarArount, 'fuel')), 2000);
                return true;
            },
        ];
        this.addObject(new Car([...this.waypointsCarOne], this.waterCarAmount, 'water'));
        this.addObject(new Car([...this.waypointsCarTwo], this.fuelCarArount, 'fuel'));
        
        this.valves[0] = new PipeValve(new Vector2(25, 8), new Vector2(7, 2.3), Pos.Top, 'z');
        this.valves[1] = new PipeValve(new Vector2(25, 8), new Vector2(13, 4), Pos.Mid, 'h');
        this.valves[2] = new PipeValve(new Vector2(25, 8), new Vector2(13, 9.3), Pos.Bot, 'n');
        this.valves.forEach(element => {
            this.addObject(element);
        });

        this.vats[0] = new Vat(new Vector2(11, 6), spillage);
        this.vats[1] = new Vat(new Vector2(11, 16), spillage);
        this.vats[2] = new Vat(new Vector2(46, 6), spillage);
        this.vats[3] = new Vat(new Vector2(46, 16), spillage);
        this.vats.forEach(element => {
            this.addObject(element);
        });
        
        this.addObject(new PipeNetwork(new Vector2(25, 8), new Vector2(29, 4.3), 'u', this.valves, this.vats, waterTank));
    }
    
    addObject(obj : GameObject) : void
    {
        this.gameObjects.push(obj);
        this.gameHtmlElement.appendChild(obj.htmlElement);
    }
    
    update() : void
    {
        this.gameObjects = this.gameObjects.filter(x => !x.isMarkedForDestruction);
        
        for(let gameObject of this.gameObjects)
        {
            gameObject.update();
        }

        for(let gameObject of this.gameObjects)
        {
            gameObject.lateUpdate();
        }
    }
}

export { Game };
export default Game;