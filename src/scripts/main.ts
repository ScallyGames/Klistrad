import '../styles/style.styl';
import '../styles/fonts.styl';
import Constants from './constants';
import Game from './game';
import InputManager from './input-manager';



(() =>
{
    console.log("Loaded");

    const sizeTemplate = document.getElementById('size-template');
    
    const floatingPointCheck = document.createElement('pre');
    sizeTemplate.append(floatingPointCheck);
    floatingPointCheck.innerHTML = "X";
    const floatingPointCheckStyle = getComputedStyle(floatingPointCheck);
    const floatingPointCheckHeight = Number.parseFloat(floatingPointCheckStyle.height);
    const supportsSubPixelLines = floatingPointCheckHeight - Math.floor(floatingPointCheckHeight) > 0.01;
    floatingPointCheck.remove();

    const style = getComputedStyle(sizeTemplate);
    const height = Number.parseFloat(style.height);
    Constants.charHeight = supportsSubPixelLines ? height : Math.floor(height);
    Constants.charWidth = Number.parseFloat(style.width);
    sizeTemplate.remove();

    const doubleTapSpeedSlider = document.getElementById('double-tap-speed') as HTMLInputElement;
    doubleTapSpeedSlider.valueAsNumber = InputManager.doublePressThreshold / 1000;

    doubleTapSpeedSlider.addEventListener('change', () => InputManager.doublePressThreshold = doubleTapSpeedSlider.valueAsNumber * 1000);

    let game = new Game();
})();