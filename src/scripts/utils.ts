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
}

export { Utils };
export default Utils;