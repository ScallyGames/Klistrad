import Constants from './constants';

abstract class Utils
{
    public static asCharWidth(x : number) : string
    {
        return (x * Constants.charWidth) + 'px';
    }
    
    public static asCharHeight(x : number) : string
    {
        return (x * Constants.charHeight) + 'px';
    }

    public static getMaxEnumValue(x : object) : number
    {
        return Math.max(...Object.keys(x).map(x => Number.parseInt(x)).filter(x => !isNaN(x)));
    }
}

export { Utils };
export default Utils;