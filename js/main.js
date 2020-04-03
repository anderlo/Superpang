import {loadImage} from "./loaders.js";
import SpriteSheet from "./SpriteSheet.js";


const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");
//context.fillRect(0,0,50,50);

loadImage('img/spritesAzul.png')
    .then(image => {

        const pos = {
            x: 64,
            y: 64,
        };
        const sprites = new SpriteSheet(image, 32, 32);
        sprites.define('buster', 0, 0);
        let deltaTime = 0;
        let lastTime = 0;

        function update(time) {
            deltaTime = time - lastTime
            console.log(deltaTime);
            context.clearRect(0, 0, canvas.width, canvas.height);
            sprites.draw('buster', context, pos.x, pos.y);
            pos.x += 2;
            lastTime=time;
            requestAnimationFrame(update);
        }

        update(0);
    });