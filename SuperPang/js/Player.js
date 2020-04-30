import {Object2D, Vec2D} from "./math.js";
import Settings from "./Settings.js";
import SpriteSheet from "./SpriteSheet.js";
import {Hook} from "./Hook.js";
import './howler.core.js';
//const frames = ['buster','buster-1','buster-2','buster-3'];
const frames = ['buster', 'buster-1', 'buster-2'];
export default class Player extends Object2D {
    setPosition(x,y){
        this.position.x = x ;
        this.position.y = y;
        console.log(this);
    }
    routeFrame() {
        if (this.direction.x !== 0) {
            const frameIndex = Math.floor(this.distance / 10) % frames.length;
            const frameName = frames[frameIndex];
            return frameName;
        } else {
            return 'buster-3';
        }//return 'buster';
    }
    reset(x,y,puntos){
        this.setPosition(x,y);
        this.hooks = [];
        this.nextHook = 0;
        this.shield = false;
        this.direction = new Vec2D(0, 0);
        this.puntos = puntos ;
    }
    constructor(size, pos, spriteSheet, spriteHook,spriteHook2) {
        super(size, pos);
        this.force = new Vec2D(0, 0);
        this.spriteSheet = spriteSheet;
        this.direction = new Vec2D(0, 0);
        this.distance = 0;
        this.hooksprite = spriteHook;
        this.hook2sprite = spriteHook2;
        this.hooks = [];
        this.press = false;
        this.pressLeft = false;
        this.pressRight = false;
        this.nextHook = 0;
        this.shield = false;
        this.vidas = 3;
        this.puntos = 0;
    }

    leftDirection() {
        if (this.pressRight === false) {
            if (this.pressLeft === false) {
                this.direction.x = -1;
            } else {
                this.direction.x = 0;
            }
        }else{
            if (this.pressRight === true) {
                this.direction.x = 1;
            }
        }

        if (this.pressLeft === false) {
            this.pressLeft = true

        } else if (this.pressLeft === true) {
            this.pressLeft = false;
        }
    }

    rightDirection() {
        if (this.pressLeft === false) {
            if (this.pressRight === false) {
                this.direction.x = 1;
            } else  {
                this.direction.x = 0;
            }
        }else{
            if (this.pressLeft === true) {
                this.direction.x = -1;
            }
        }


        if (this.pressRight === false) {
            this.pressRight = true
        } else if (this.pressRight === true) {
            this.pressRight = false;
        }
        console.log(this.pressLeft);
    }

    update(time) {

        if (this.direction.x !== 0) {
            this.distance += Settings.PLAYER_SPEED * time;
            //console.log(this.distance);
        } else {
            this.distance = 0;
            //console.log(this.distance);
        }

        // si buster está cayendo (está por debajo de la altura de la pantalla)
        if (this.position.y + this.size.y < Settings.SCREEN_HEIGHT) {
            // fuerza = añadir fuerza vertical de gravedad * tiempo
            // position = añadir fuerza * tiempo al eje y
            this.force.y = Settings.GRAVITY * time;
        }
        // position = añadir dirección * tiempo * velocidad del jugador al eje x
        this.force.x = Settings.PLAYER_SPEED * time * this.direction.x;
        this.position.x = this.position.x + this.force.x;
        this.position.y = this.position.y + this.force.y;
        // si buster se sale por la izquierda de la pantalla
        // position = 0,y
        if (this.position.x < Settings.MARGIN) {
            this.position.x = Settings.MARGIN;
            this.distance = 0;
        }
        // sino, si buster se sale por la derecha
        // position =  lo más a la derecha sin salirse , y
        if (this.position.x + this.size.x >= Settings.SCREEN_WIDTH - Settings.MARGIN) {
            this.position.x = Settings.SCREEN_WIDTH - 32 - Settings.MARGIN;
            this.distance = 0;
        }
        // si buster se sale por la parte inferior de la pantalla
        // position = x, lo más abajo sin salirse
        if (this.position.y + this.size.y >= Settings.SCREEN_HEIGHT - Settings.MARGIN) {
            this.position.y = Settings.SCREEN_HEIGHT - 32 - Settings.MARGIN;
        }
    }

    draw(context) {
            if (this.direction.x >= 0) {
                context.drawImage(this.spriteSheet.get(this.routeFrame())[1],this.position.x, this.position.y);
            }else if (this.direction.x < 0) {
                context.drawImage(this.spriteSheet.get(this.routeFrame())[0],this.position.x, this.position.y);
            }
            if (this.shield === true){
                context.beginPath();
                context.arc(this.position.x+16,this.position.y+16,18,0,2*Math.PI,true);
                context.strokeStyle = "#fffc2a";
                context.lineWidth = 5;
                context.stroke();
                context.closePath();
            }
    }

    setHookManager(hookManager) {
        this.hookmanager = hookManager;
    }

    romperHook(posicion) {
        this.hooks.splice(posicion, 1);
    }

    shoot() {
        var sprite = this.hooksprite;
        if (this.press === false && Settings.HOOK_MAX > this.hooks.length) {
            var shoot = new Howl({
                src: ['audio/shoot.mp3', 'audio/shoot.ogg']
            }).play();
            var posi = new Vec2D(this.position.x + 14, this.position.y + 4);

            if (this.nextHook == 1){
                sprite = this.hook2sprite;
            }
            var hook = new Hook(posi.y + 16, posi, this.nextHook, this.hooks.length,sprite);
            this.hooks.push(hook);
            this.press = true;
        } else {
            this.press = false;
        }
        this.nextHook = 0 ;
    }

}
