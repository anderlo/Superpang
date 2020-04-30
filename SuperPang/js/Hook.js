import {Vec2D} from "./math.js";
import {Object2D} from "./math.js";
import Settings from "./Settings.js";
import SpriteSheet from "./SpriteSheet.js";

let HookType = {
    rope: 0,
    chain: 1,
};

class Hook extends Object2D {

    constructor(height, position, hook_type, ind, spriteSheet) {
        super(new Vec2D(6, height), position);
        this.hook_type = hook_type;
        this.expand = true;
        this.timer = Settings.HOOK_DURATION;
        this.sprite = spriteSheet;
        this.to_kill = false;
        this.ind = ind;


    }

    draw(ctx) {
        ctx.drawImage(this.sprite.get('punta')[1],this.position.x, this.position.y);
        for (var i = 1; i < 20; i++) {
            ctx.drawImage(this.sprite.get('cuerda')[1],this.position.x, this.position.y+(20*i));
        }

        /*
               // pintar el hook de buffer en la posición x,y de este objeto

               ctx.beginPath();
               //ctx.strokeStyle = "#111464";
               ctx.lineWidth = 0;
               ctx.arc(this.position.x + 1, this.position.y, 4, 0, 2 * Math.PI, true);
               //ctx.lineWidth = 5;
               ctx.fillStyle = "#000000";
               ctx.fill();
               //ctx.stroke();
               ctx.closePath();

               ctx.beginPath();
               ctx.rect(this.position.x, this.position.y,2,Settings.SCREEN_HEIGHT);
               ctx.fill();
               //ctx.stroke();
               ctx.closePath();

               const buffer = document.createElement('canvas');
               ctx.drawImage(image, this.position.x, this.position.y,
                   buffer.width, buffer.height,
                   0, 0, buffer.width, buffer.height,);
           */
    }

    update(time_passed) {
        // si el hook no está en expansión -> decrementa el timer en time_passed unidades.
        // Si el timer es < 0 --> to_kill = true
        if (this.expand === false) {
            this.timer -= time_passed;
        }
        if (this.timer < 0) {
            this.to_kill = true;
            console.log('ME ROMPI');

        }
        // si está en expansión y subiendo, incrementar tamaño y posición em increment unidades
        if (this.expand === true) {
            let increment = Settings.HOOK_SPEED * time_passed;
            //console.log(increment);
            this.position.y = this.position.y - increment;
        }

        // si sube hasta arriba, marcarlo para eliminar si es de tipo rope....
        // o marcarlo para que quede enganchado si es de tipo chain (reset de size 0 y position altura 0)
        if (this.position.y <= 0) {
            if (this.hook_type === 0) {
                this.to_kill = true;
                console.log('ME VOY A ROMPER');
                this.expand = false;
            } else if (this.hook_type === 1) {
                this.expand = false;
            }
        }
        if (this.to_kill === true) {
            return true;
        } else {
            return false;
        }
    }

}

export {HookType, Hook};