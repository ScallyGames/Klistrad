import Vector2 from '../vector2';
import GameObject from './game-object';
const templateUp = require('../../templates/car-up.pug')();
const templateDown = require('../../templates/car-down.pug')();
const templateLeft = require('../../templates/car-left.pug')();
const templateRight = require('../../templates/car-right.pug')();

class Car extends GameObject
{
    waypoints : Vector2[] = [
        { x: 90, y: -6 },
        { x: 90, y: 10 },
        { x: 90, y: 15 },
        { x: 100, y: 15 },
        { x: 100, y: 30 },
        { x: 74, y: 30 },
        { x: 74, y: 44 },
    ];

    eventListener = (e : KeyboardEvent) => this.handleKey(e);

    constructor()
    {
        super();

        this.htmlElement.innerHTML = templateRight;
        this.pivot = new Vector2(3, 0);
        this.position = this.waypoints[0];
        this.waypoints.shift();
        this.moveDown();
        this.update();

        document.addEventListener("keydown", this.eventListener);
    }

    handleKey(e : KeyboardEvent) 
    {
        switch (e.key)
        {
            case 'ArrowLeft':
                this.moveLeft();
                break;
            
            case 'ArrowRight':
                this.moveRight();
                break;

            case 'ArrowDown':
                this.moveDown();
                break;
            
            case 'ArrowUp':
                this.moveUp();
                break;

            case ' ':
                console.log(this.position);
                break;
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
        }
        else
        {
            this.destroy();
        }
        
        super.update();
    }

    destroy()
    {
        document.removeEventListener("keydown", this.eventListener);
        super.destroy();
    }
}

export { Car };
export default Car;