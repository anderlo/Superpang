import SpriteSheet from "./SpriteSheet.js";
import Player from "./Player.js";
import {Vec2D} from "./Vec2D.js";
import Settings from './Settings.js'
import {Ball} from "./Ball.js";


export function loadLevel(currentLevel){
    return fetch(`levels/${currentLevel}.json`).then(r=>r.json());
}
export function loadImage(url){
    return new Promise( resolve => {
        const image = new Image();
        image.addEventListener("load",() => {
            resolve(image);

        });
        image.src = url
    });
}
export function loadBuster(image,playerSpec){
    const spriteSheet = new SpriteSheet(image,32,32);
    spriteSheet.define('buster',1,0);
    spriteSheet.define('buster-1',2,0);
    spriteSheet.define('buster-2',3,0);
    spriteSheet.define('buster-3',4,0);
    //console.log('load buster => ' , playerSpec.pos[0] , playerSpec.pos[1]);
    const pos = new Vec2D(playerSpec.pos[0],playerSpec.pos[1]);
    //console.log((Settings.SCREEN_WIDTH/2) - 16);
    //console.log(Settings.SCREEN_HEIGHT-32);
    //const pos = new Vec2D(0,0);
    const size = new Vec2D(32,32);

    return new Player(size,pos,spriteSheet)
}
export function loadBalls(ballsSpec,spriteSheet){

    var pelotas = [];
    for (let i = 0; i < ballsSpec.length; i++) {
        var posx = ballsSpec[i].pos[0];
        var posy = ballsSpec[i].pos[1];

        var forcex = ballsSpec[i].force[0];
        var forcey = ballsSpec[i].force[1];

        var pos = new Vec2D(posx,posy);
        var force =  new Vec2D(forcex,forcey);
        //console.log(pos,force);
        pelotas[i] = new Ball(ballsSpec[i].radius,pos,force,ballsSpec[i].color,spriteSheet);
    }
    //console.log(pelotas);
    return pelotas ;
}
export function loadHookManager(hookImage, hooks){
    const spriteSheet = new SpriteSheet('hookRope.png',32,32);
    spriteSheet.define('top',0,0);
    spriteSheet.define('rope',0,1);
}
export function loadBackground(backgrounds) {
    const buffer = document.createElement('canvas');
    buffer.width = 256;
    buffer.height = 192;
// recortar super-sprite y dejarlo preparado en un buffer
    const context = buffer.getContext("2d");
    context.drawImage(backgrounds, 0, 0,
        buffer.width, buffer.height,
        0, 0, buffer.width, buffer.height,);
    return function (ctx) {
        ctx.drawImage(buffer,
            0, 0,
            buffer.width, buffer.height,
            0, 0,
            Settings.SCREEN_WIDTH, Settings.SCREEN_HEIGHT);
    }
}
export function createBallFactory(ballsImage,width,height) {
     let spriteSheet = new SpriteSheet(ballsImage, width, height);
     spriteSheet.define('red', 0, 0);
     spriteSheet.define('blue', 1, 0);
     spriteSheet.define('green', 2, 0);

     return spriteSheet ;
}
