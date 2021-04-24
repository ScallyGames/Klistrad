import Vector2 from '../vector2';
import GameObject from './game-object';
const templateUp = require('../../templates/car-up.pug')();
const templateDown = require('../../templates/car-down.pug')();
const templateLeft = require('../../templates/car-left.pug')();
const templateRight = require('../../templates/car-right.pug')();

class Car extends GameObject
{
    waypoints : (Vector2 | ((car : Car)=>boolean)) [];
    content : number;
    fillRate : number = 10;

    constructor(waypoints : (Vector2 | ((car : Car)=>boolean)) [], content : number)
    {
        super();
        this.waypoints = waypoints;
        this.content = content;

        this.contentHtmlElement.innerHTML = templateRight;
        this.pivot = new Vector2(3, 0);
        if(this.waypoints[0] instanceof Vector2) {
            this.position = this.waypoints[0];
            this.waypoints.shift();
            this.moveDown();
        } else {
            this.waypoints[0](this);
        }
        this.update();
    }

    private moveUp() {
        this.contentHtmlElement.innerHTML = templateUp;
        this.pivot = new Vector2(1, 1);
        this.position = new Vector2(this.position.x, this.position.y - 1);
    }

    private moveDown() {
        this.contentHtmlElement.innerHTML = templateDown;
        this.pivot = new Vector2(1, 1);
        this.position = new Vector2(this.position.x, this.position.y + 1);
    }

    private moveRight() {
        this.contentHtmlElement.innerHTML = templateRight;
        this.pivot = new Vector2(3, 0);
        this.position = new Vector2(this.position.x + 1, this.position.y);
    }

    private moveLeft() {
        this.contentHtmlElement.innerHTML = templateLeft;
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
                if(nextWaypoint(this)) {
                    this.waypoints.shift();
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