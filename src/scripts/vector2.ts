class Vector2
{
    x : number;
    y : number;
    
    constructor(x : number = null, y : number = null)
    {
        this.x = x;
        this.y = y;
    }
    
    equals(other : Vector2) : boolean
    {
        return this.x == other.x && this.y == other.y;
    }

    plus(other: Vector2): Vector2 {
        return new Vector2(
            this.x + other.x,
            this.y + other.y,
        );
    }

    times(factor: number): Vector2 {
        return new Vector2(
            this.x * factor,
            this.y * factor,
        );
    }
}

export { Vector2 };
export default Vector2;