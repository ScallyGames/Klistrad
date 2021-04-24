import '../styles/style.styl';
import '../styles/fonts.styl';
import Constants from './constants';
import Game from './game';
import InputManager from './input-manager';



(() =>
{
    console.log("Loaded");
    const sizeTemplate = document.getElementById('size-template');
    const style = getComputedStyle(sizeTemplate);
    Constants.charHeight = Number.parseFloat(style.height);
    Constants.charWidth = Number.parseFloat(style.width);
    sizeTemplate.remove();

    const doubleTapSpeedSlider = document.getElementById('double-tap-speed') as HTMLInputElement;
    doubleTapSpeedSlider.valueAsNumber = InputManager.doublePressThreshold / 1000;

    doubleTapSpeedSlider.addEventListener('change', () => InputManager.doublePressThreshold = doubleTapSpeedSlider.valueAsNumber * 1000);

    let game = new Game();
})();