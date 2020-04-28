import {Object2D, Vec2D} from "./math.js";
import Settings from "./Settings.js";
import SpriteSheet from "./SpriteSheet.js";
import {Hook} from "./Hook.js";
//const frames = ['buster','buster-1','buster-2','buster-3'];
const frames = ['buster', 'buster-1', 'buster-2'];
export default class Player extends Object2D {

    routeFrame() {
        if (this.direction.x !== 0) {
            const frameIndex = Math.floor(this.distance / 10) % frames.length;
            const frameName = frames[frameIndex];
            return frameName;
        } else {
            return 'buster-3';
        }//return 'buster';
    }

    constructor(size, pos, spriteSheet, image2) {
        super(size, pos);
        this.force = new Vec2D(0, 0);
        this.spriteSheet = spriteSheet;
        this.direction = new Vec2D(0, 0);
        this.distance = 0;
        this.hookmanager = null;
        this.hooks = [];
        this.press = false;
        this.pressLeft = false;
        this.pressRight = false;

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
        console.log(this.pressLeft);
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
        /*
        Asume por el momento que Settings.SCREEN_HEIGHT y Settings.SCREEN_WIDTH indican el tamaño de
        la pantalla del juego. Settings tiene otras constantes definidas (échales un vistazo)
        El objeto player tiene una altura (height) y una anchura (width)
         */
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
       // console.log('BUSTER => ' ,this.spriteSheet.get(this.routeFrame())[0] )
            if (this.direction.x >= 0) {
                context.drawImage(this.spriteSheet.get(this.routeFrame())[1],this.position.x, this.position.y);
            }else if (this.direction.x < 0) {
                context.drawImage(this.spriteSheet.get(this.routeFrame())[0],this.position.x, this.position.y);
            }
    }

    setHookManager(hookManager) {
        this.hookmanager = hookManager;
    }

    romperHook(posicion) {
        this.hooks.splice(posicion, 1);
    }

    shoot() {
        if (this.press === false && Settings.HOOK_MAX > this.hooks.length) {
            var posi = new Vec2D(this.position.x + 14, this.position.y + 4);
            var hook = new Hook(posi.y + 16, posi, 0, this.hooks.length);
            this.hooks.push(hook);
            this.press = true;
        } else {
            this.press = false;
        }

        //console.log('GANCHO EN ',this.position.y + 16 ,this.position,0,);
    }

}
