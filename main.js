import {loadBuster,loadImage,loadLevel,loadBalls,createRopeFactory,loadBackground,createBallFactory,loadBonus} from "./loaders.js";
import SpriteSheet from "./SpriteSheet.js";
import Keyboard from "./Keyboard.js";
import Settings from './Settings.js'
import {setupKeyboard} from './input.js'
import {CollisionManager} from "./collision.js";
import {Vec2D} from "./Vec2D.js";
import {Ball} from "./Ball.js";
import {Bonus} from "./Bonus.js";
import './howler.core.js';
let  buster = null ;
const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");

Settings.SCREEN_HEIGHT = canvas.height ;
Settings.SCREEN_WIDTH = canvas.width;

let startSound = new Howl({
    src : ['audio/start.mp3', 'audio/start.ogg'],
    volume: 0.25,
});
let id1 = startSound.play();
let soundtrackSound = new Howl({
     src: ['audio/soundtrack.mp3', 'audio/soundtrack.ogg'],
    volume: 0.25,
 });
//let id1 = soundtrackSound.play();

let popSound = new Howl({
    src: ['audio/pop.mp3', 'audio/pop.ogg'],
    volume: 0.25,
});
let gameoverSound = new Howl({
    src: ['audio/gameover.mp3', 'audio/gameover.ogg'],
    volume: 0.25,
});
let bonusSound = new Howl({
    src: ['audio/bonus.mp3', 'audio/bonus.ogg'],
    volume: 0.25,
});
 let vidas = document.getElementById('vidas');
 let puntos = document.getElementById('puntos');
 let levelpantalla = document.getElementById('level');
 let puntosAcumulados = 0;

Promise.all([loadImage('img/spritesAzul.png'),loadLevel('1'),loadImage('img/hookRope.png'),loadImage('img/backgrounds.png'),
loadImage('img/balls20.png'),loadImage('img/balls10.png'),loadImage('img/balls5.png'),
loadLevel('2'),loadImage('img/hookChain.png'),loadImage('img/bonus.png')])
.then( ([image,levelSpec,imagerope,backgrounds,bolas20,bolas10,bolas5,newLevel,imagechain,imagebonus]) => {
//console.log('VOY A LLAMAR AL LOADBUSTER');
const hooks = [];
let level = 1;
let id2 = 0;
let drawBackground = loadBackground(backgrounds,1);
const spriteArrow = createRopeFactory(imagerope);
const spriteChain = createRopeFactory(imagechain);
const spriteBonus = loadBonus(imagebonus);
buster = loadBuster(image,levelSpec.player,spriteArrow,spriteChain);

const sprite20 = createBallFactory(bolas20,48 ,40 );
const sprite10 = createBallFactory(bolas10, 24,20 );
const sprite5 = createBallFactory(bolas5,12 ,10 );

let balls  = loadBalls(levelSpec.balls,sprite20);
let listabonus = [];
let deltaTime = 0;
let lastTime = 0;
buster.setPosition(levelSpec.player.pos[0]+20,levelSpec.player.pos[1]-50);

        function update(time) {

            var hooks = buster.hooks;
            deltaTime = time - lastTime;
            //console.log(levelSpec.player.pos[0]);
            //console.log(levelSpec.player.pos[1]);

            drawBackground(context);
            buster.draw(context);
            buster.update(deltaTime/1000);

            for (let j = 0; j < buster.hooks.length; j++) {

                buster.hooks[j].draw(context);
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
            let collisionManager = new CollisionManager(balls,buster.hooks,listabonus,buster);
            let toDeleteList = collisionManager.checkCollisions();
            let toDelete = toDeleteList[0];
            let toDelete2 = toDeleteList[1];
            let toDelete3 = toDeleteList[2];
            let toDelete4 = toDeleteList[3];
            if (toDelete4 === 0) {
                if (toDelete !== -999) {
                    popSound.play();
                    var toDeleteHook = buster.hooks[toDelete2];
                    buster.hooks.splice(toDeleteHook, 1);
                    //pelotas es la pelota que se va a quitar
                    var pelotas = balls[toDelete];
                    if (pelotas.radius > Settings.RADIUS_MIN) {
                        buster.puntos += 10000;
                        var prob = Math.random();
                        if (Math.random() <= Settings.BONUS_SPAWN_CHANCE) {

                            var num = Math.floor((Math.random() * 99) + 1);
                            if (num < 40){
                                var bonus = new Bonus(pelotas.position, 'chainhook', spriteBonus);
                            }else if (num <80){
                                var bonus = new Bonus(pelotas.position, 'invulnerable', spriteBonus);
                            }else{
                                var bonus = new Bonus(pelotas.position, 'extraLife', spriteBonus);
                            }

                            listabonus.push(bonus)
                        }
                        var radio = Math.max(pelotas.radius / 2, Settings.RADIUS_MIN);
                        var pos1 = new Vec2D(pelotas.position.x - 2 * radio, pelotas.position.y);
                        var pos2 = new Vec2D(pelotas.position.x + 2 * radio, pelotas.position.y);
                        var force1 = new Vec2D(-pelotas.force.x, pelotas.force.y);
                        var force2 = new Vec2D(pelotas.force.x, pelotas.force.y);
                        var color = pelotas.color;
                        if (radio === 10) {

                            balls[balls.length] = new Ball(radio, pos1, force1, color, sprite10);
                            balls[balls.length] = new Ball(radio, pos2, force2, color, sprite10);
                        } else {
                            buster.puntos += 10000;
                            balls[balls.length] = new Ball(radio, pos1, force1, color, sprite5);
                            balls[balls.length] = new Ball(radio, pos2, force2, color, sprite5);
                        }

                    }else{
                        buster.puntos += 40000;
                    }
                    balls.splice(toDelete, 1);

                }
                puntos.innerHTML = buster.puntos;

                if (toDelete3 !== -999) {
                    bonusSound.play();
                    var toDeleteBonus = listabonus[toDelete3];
                    if (toDeleteBonus.bonus_type === 'chainhook') {
                        buster.nextHook = 1;
                    }else if (toDeleteBonus.bonus_type === 'invulnerable'){
                        buster.shield = true;
                    }else if (toDeleteBonus.bonus_type === 'extraLife'){
                        buster.vidas += 1;
                        vidas.innerHTML = buster.vidas
                    }
                    listabonus.splice(toDelete3, 1);
                }

                for (let i = 0; i < listabonus.length; i++) {
                    listabonus[i].draw(context);
                    listabonus[i].update(deltaTime / 1000);
                }
                if (balls.length === 0) {
                    startSound.fade(1, 0, 1000, id1);
                    soundtrackSound.fade(1, 0, 1000, id2);
                    puntosAcumulados = buster.puntos;
                    //console.log('PONGO LA MUSICA');
                    soundtrackSound = new Howl({
                        src: ['audio/soundtrack.mp3', 'audio/soundtrack.ogg'],
                        volume: 0.25,
                    });
                    id2 = soundtrackSound.play();
                    listabonus = [];
                    level += 1;
                    console.log(level);
                    if (level > 3) {
                        level = 3
                    }
                    levelpantalla.innerHTML = level;
                    loadLevel(String(level)).then((newlevel) => {
                        levelSpec = newlevel;
                        balls = loadBalls(levelSpec.balls, sprite20);
                        drawBackground = loadBackground(backgrounds, level);
                        buster.reset(levelSpec.player.pos[0], levelSpec.player.pos[1],puntosAcumulados);
                    })
                }
            }else{
                if (buster.shield === true){
                    buster.shield = false;
                }else{
                    if (buster.vidas === 0) {
                        listabonus = [];
                        level = 1;
                        levelpantalla.innerHTML = level;
                        startSound.fade(1, 0, 1000, id1);
                        soundtrackSound.fade(1, 0, 1000, id2);
                        gameoverSound.play();
                        alert('Has perdido. Practica más!');
                         startSound = new Howl({
                            src : ['audio/start.mp3', 'audio/start.ogg'],
                            loop : true,
                            volume: 0.25,
                        });
                         id1 = startSound.play();

                        loadLevel(String(level)).then((newlevel) => {
                            levelSpec = newlevel;
                            balls = loadBalls(levelSpec.balls, sprite20);
                            drawBackground = loadBackground(backgrounds, level);
                            puntosAcumulados = 0 ;
                            buster.reset(levelSpec.player.pos[0], levelSpec.player.pos[1],puntosAcumulados);
                            buster.vidas = 3 ;
                            vidas.innerHTML = buster.vidas
                        })

                    }else{
                    console.log('HAS PERDIDO 1 VIDA');

                    balls  = loadBalls(levelSpec.balls,sprite20);
                    buster.reset(levelSpec.player.pos[0], levelSpec.player.pos[1],puntosAcumulados);
                    listabonus = [];
                    buster.vidas -= 1;
                        vidas.innerHTML = buster.vidas
                    }
                }
            }
            lastTime=time;
            requestAnimationFrame(update);
        }
        const input = setupKeyboard(buster);
        input.listenTo(window);
        update(0);
    });