import {loadBuster,loadImage,loadLevel,loadBalls} from "./loaders.js";
import SpriteSheet from "./SpriteSheet.js";
import Keyboard from "./Keyboard.js";
import Settings from './Settings.js'
import {setupKeyboard} from './input.js'

const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");

Settings.SCREEN_HEIGHT = canvas.height ;
Settings.SCREEN_WIDTH = canvas.width;
Promise.all([loadImage('img/spritesAzul.png'),loadLevel('1')])
    .then( ([image,levelSpec]) => {
        //console.log('VOY A LLAMAR AL LOADBUSTER');
        const buster = loadBuster(image,levelSpec.player);
        const balls  = loadBalls(levelSpec.balls);
        let deltaTime = 0;
        let lastTime = 0;

        function update(time) {
            console.log("delta time",deltaTime);
            deltaTime = time - lastTime;
            context.clearRect(0, 0, canvas.width, canvas.height);
            buster.draw(context);
            buster.update(deltaTime/1000);
            for (let i = 0; i < balls.length; i++) {
               // console.log(i,balls[i]);
                balls[i].draw(context);
                balls[i].update(deltaTime/1000);
            }
            lastTime=time;
            requestAnimationFrame(update);
        }

        const input = setupKeyboard(buster);
        input.listenTo(window);

        update(0);
    });