import Keyboard from "./Keyboard.js";

export function setupKeyboard(buster){
    const input = new Keyboard();

    input.addMapping('Space',keyState =>{
        console.log('Space');
    });
    input.addMapping('ArrowUp',keyState =>{
            console.log('ArrowUp');
    });
    input.addMapping('ArrowDown',keyState =>{
        console.log('ArrowDown');
    });
    input.addMapping('ArrowLeft',keyState =>{
        buster.leftDirection();
        console.log('ArrowLeft');
    });
    input.addMapping('ArrowRight',keyState =>{
        buster.rightDirection();
        console.log('ArrowRight');
    });
    return input;
}

