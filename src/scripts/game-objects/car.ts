import Vector2 from '../vector2';
import GameObject from './game-object';
const templateUp = require('../../templates/car-up.pug')();
const templateDown = require('../../templates/car-down.pug')();
const templateLeft = require('../../templates/car-left.pug')();
const templateRight = require('../../templates/car-right.pug')();

class Car extends GameObject
{
    waypoints : (Vector2 | (()=>boolean)) [] = [
        new Vector2(90, -6),
        new Vector2(90, 2),
        ()=>{
            console.log("waiting for upper gate")
            return false;
        },
        new Vector2(90, 6),
        new Vector2(114, 6),
        new Vector2(114, 15),
        new Vector2(99, 15),
        ()=>{
            console.log("waiting for unloading")
            return false;
        },
        new Vector2(99, 16),
        new Vector2(114, 16),
        new Vector2(114, 35),
        new Vector2(74, 35),
        new Vector2(74, 36),
        ()=>{
            console.log("waiting for lower gate")
            return false;
        },
        new Vector2(74, 44)
    ];

    constructor()
    {
        super();

        this.htmlElement.innerHTML = templateRight;
        this.pivot = new Vector2(3, 0);
        if(this.waypoints[0] instanceof Vector2) {
            this.position = this.waypoints[0];
            this.waypoints.shift();
            this.moveDown();
        } else {
            this.waypoints[0]();
        }
        this.update();
    }

    private moveUp() {
        this.htmlElement.innerHTML = templateUp;
        this.pivot = new Vector2(1, 1);
        this.position = new Vector2(this.position.x, this.position.y - 1);
    }

    private moveDown() {
        this.htmlElement.innerHTML = templateDown;
        this.pivot = new Vector2(1, 1);
        this.position = new Vector2(this.position.x, this.position.y + 1);
    }

    private moveRight() {
        this.htmlElement.innerHTML = templateRight;
        this.pivot = new Vector2(3, 0);
        this.position = new Vector2(this.position.x + 1, this.position.y);
    }

    private moveLeft() {
        this.htmlElement.innerHTML = templateLeft;
        this.pivot = new Vector2(2, 0);
        this.position = new Vector2(this.position.x - 1, this.position.y);
    }

    update()
    {   
        if(this.waypoints.length > 0)
        {
            let nextWaypoint = this.waypoints[0];
            if(nextWaypoint instanceof Vector2) {
                if(this.position.x < nextWaypoint.x)
                {
                    this.moveRight();
                }
                else if(this.position.x > nextWaypoint.x)
                {
                    this.moveLeft();
                }
                else if(this.position.y < nextWaypoint.y)
                {
                    this.moveDown();
                }
                else if(this.position.y > nextWaypoint.y)
                {
                    this.moveUp();
                }
    
                if(this.position.x === nextWaypoint.x && this.position.y === nextWaypoint.y)
                {
                    this.waypoints.shift();
                }
            } else {
                if(nextWaypoint()) {

                }
            }
        }
        else
        {
            this.destroy();
        }
        
        super.update();
    }

    destroy()
    {
        super.destroy();
    }
}

export { Car };
export default Car;