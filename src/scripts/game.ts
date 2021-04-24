import GameObject from './game-objects/game-object';
import Car from './game-objects/car';
import Gate from './game-objects/gate';
import Vector2 from './vector2';
import DebugPosition from './game-objects/debug-position';

class Game
{
    refreshRate : number = 5;
    gameObjects : GameObject[] = [];
    gameHtmlElement : HTMLElement;

    constructor()
    {
        this.gameHtmlElement = document.getElementById('game');
        setInterval(() => this.update(), 1000 / this.refreshRate);

        this.addObject(new DebugPosition()); //delete me before release
        this.addObject(new Car());
        this.addObject(new Gate(new Vector2(89, 3), 'i', 'o'));
        this.addObject(new Gate(new Vector2(73, 37), 'k', 'l'));
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
            setTimeout(() => this.addObject(new Car()), 2000);
        }
    }
}

export { Game };
export default Game;