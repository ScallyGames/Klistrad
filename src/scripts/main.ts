import '../styles/style.styl';
import '../styles/fonts.styl';
import Constants from './constants';
import Game from './game';



(() =>
{
    console.log("Loaded");
    const sizeTemplate = document.getElementById('size-template');
    const style = getComputedStyle(sizeTemplate);
    Constants.charHeight = Number.parseFloat(style.height);
    Constants.charWidth = Number.parseFloat(style.width);
    sizeTemplate.remove();

    let game = new Game();
})();