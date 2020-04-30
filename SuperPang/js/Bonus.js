import {Object2D, Vec2D} from "./math.js";
import Settings from "./Settings.js";

export let BonusType = {
    stop_time: 'stop',
    extra_hook: 'extrahook',
    chain_hook: 'chainhook',
    break_balls_once: 'breakonce',
    break_balls_max: 'breakmax',
    invulnerability: 'invulnerable',
    shoot: 'shoot',
    life :'extraLife'
};

export class Bonus extends Object2D {

    constructor(position, bonus_type, sprite) {
        super(new Vec2D(Settings.BONUS_SIZE, Settings.BONUS_SIZE), position);
        this.bonus_type = bonus_type;
        this.force = new Vec2D(0, 0);
        this.to_kill = false;
        this.falling = true;
        this.timer = Settings.BONUS_DURATION;
        this.sprite = sprite;
        this.timeout= false ;
    }


    update(time_passed) {
        time_passed = 16/100000
        if (this.falling) {
                var nuevaFuerza = Settings.GRAVITY * time_passed;
                //console.log(nuevaFuerza)
                this.force.y = this.force.y + nuevaFuerza ;
                console.log(this.force.y);
                this.position.y = this.position.y + this.force.y;
                console.log(this.position.y);
                if (this.position.y + Settings.BONUS_SIZE >= Settings.SCREEN_HEIGHT - Settings.MARGIN){
                    this.position.y = Settings.SCREEN_HEIGHT - Settings.MARGIN - Settings.BONUS_SIZE;
                    this.falling = false;
            }
        }else{
            this.timer -= time_passed
            if (this.timer === 0) {
                this.timeout = true;
            }
        }
}

draw(ctx) {
    ctx.drawImage(this.sprite.get(this.bonus_type)[1],this.position.x, this.position.y);
}

}