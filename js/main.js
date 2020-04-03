import {loadBuster,loadImage,loadLevel,loadBalls,loadHookManager,loadBackground} from "./loaders.js";
import SpriteSheet from "./SpriteSheet.js";
import Keyboard from "./Keyboard.js";
import Settings from './Settings.js'
import {setupKeyboard} from './input.js'
import {CollisionManager} from "./collision.js";
import {Vec2D} from "./Vec2D.js";
import {Ball} from "./Ball.js";

const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");

Settings.SCREEN_HEIGHT = canvas.height ;
Settings.SCREEN_WIDTH = canvas.width;
Promise.all([loadImage('img/spritesAzul.png'),loadLevel('1'),loadImage('img/hookRope.png'),loadImage('img/backgrounds.png')])
    .then( ([image,levelSpec,imagerope,backgrounds]) => {
        console.log('VOY A LLAMAR AL LOADBUSTER');
        const hooks = [];
        //const hookManager = loadHookManager(hookImage, hooks);
        const drawBackground = loadBackground(backgrounds);
        const buster = loadBuster(image,levelSpec.player);
        //buster.setHookManager(hookManager);

        const balls  = loadBalls(levelSpec.balls);
        let deltaTime = 0;
        let lastTime = 0;

        function update(time) {
            //console.log("delta time",deltaTime);
            var hooks = buster.hooks;
            deltaTime = time - lastTime;
            //context.clearRect(0, 0, canvas.width, canvas.height);
            drawBackground(context);
            buster.draw(context);
            buster.update(deltaTime/1000);
            //console.log('HOOKS => ',buster.hooks);
            for (let j = 0; j < buster.hooks.length; j++) {
                // console.log(i,balls[i]);
                buster.hooks[j].draw(context,imagerope);
                var romper = buster.hooks[j].update(deltaTime/1000);
                if (romper===true){
                    buster.romperHook(j)
                }
            }
            for (let i = 0; i < balls.length; i++) {
               // console.log(i,balls[i]);
                balls[i].draw(context);
                balls[i].update(deltaTime/1000);
            }
            let collisionManager = new CollisionManager(balls,buster.hooks);
            let toDelete = collisionManager.checkCollisions();
            if (toDelete !== -999){
                buster.hooks.shift();
                console.log(balls[toDelete].radius);
                console.log('Voy a borrar la numero : ',toDelete);
                var pelotas = balls[toDelete];
                console.log(pelotas.radius,Settings.RADIUS_MIN)
                if (pelotas.radius > Settings.RADIUS_MIN){
                    console.log('VOY A AÑADIR DOS PELOTAS');
                    var radio = Math.max(pelotas.radius/2,Settings.RADIUS_MIN);
                    var pos1 = new Vec2D(pelotas.position.x - radio,pelotas.position.y - radio);
                    var pos2 = new Vec2D(pelotas.position.x + radio,pelotas.position.y - radio);
                    var force1 = new Vec2D(pelotas.force.x ,pelotas.force.y);
                    var force2 = new Vec2D(pelotas.force.x * -1,pelotas.force.y);
                    balls[balls.length] = new Ball(radio,pos1,force1);
                    balls[balls.length] = new Ball(radio,pos1,force2);
                    console.log(balls);
                }balls.splice(toDelete,1);

            }
            lastTime=time;
            requestAnimationFrame(update);
        }

        const input = setupKeyboard(buster);
        input.listenTo(window);

        update(0);
    });