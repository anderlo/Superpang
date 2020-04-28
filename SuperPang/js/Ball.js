import {Vec2D} from './math.js';
import {Object2D} from './Object2D.js';
import Settings from './Settings.js';

class Ball extends Object2D {

    constructor(radius, position, force,color,sprite) {
        //console.log('CONTRUCTOR DATOS =>',position,force);
        super(new Vec2D(radius * 2, radius * 2), position);
        this.radius = radius;
        this.position.x = position.x;
        this.position.y = position.y;
        this.force = force;
        this.falling = this.force.y >= 0;
        this.max_height = Settings.SCREEN_HEIGHT - 150 - radius * 4;
        this.color = color;
        this.sprite = sprite ;
        this.gravedad = 0;
    }

    update(time_passed) {
        time_passed = 16/1000;
        var nuevaFuerza = new Vec2D(0, Settings.GRAVITY * time_passed);
        this.force.x = this.force.x + nuevaFuerza.x;
        this.force.y = this.force.y + nuevaFuerza.y;
        //this.force.y= Math.max(-this.force.y,-400)
        var forcemul = new Vec2D(this.force._mul(time_passed).x,(this.force._mul(time_passed).y));
        this.position.x = this.position.x + forcemul.x;
        this.position.y = this.position.y + forcemul.y;
        if (this.position.x - this.radius <= Settings.MARGIN  ||  Settings.SCREEN_WIDTH - Settings.MARGIN <= this.position.x + this.radius ) {

            this.force = new Vec2D(-this.force.x, this.force.y);

            if (this.position.x - this.radius <= Settings.MARGIN ) {
                this.position = new Vec2D(this.radius + Settings.MARGIN, this.position.y);
            }
            else {
                this.position = new Vec2D(Settings.SCREEN_WIDTH - Settings.MARGIN - this.radius , this.y);
            }
        }

        if (Settings.SCREEN_HEIGHT - Settings.MARGIN <= this.position.y + this.radius) {
            this.position = new Vec2D(this.x, Settings.SCREEN_HEIGHT - this.radius - Settings.MARGIN );
            this.force.y =  Math.min(-this.force.y,-400)

        }
        if (this.position.y - this.radius <=  Settings.MARGIN) {
            this.position = new Vec2D(this.position.x , Settings.MARGIN + this.radius);
            this.force.y= -this.force.y

        }
        if (this.color == 'green') {
            console.log(this.force.y)
        }
        this.falling = this.force.y > 0;

    /*
        var cx = this.position.x;
        var cy = this.position.y;

        var vx = this.force.x;
        var vy = this.force.y;
        var gravity = 9.8;
        var damping = 1;
        var traction = 1;
        var radius = this.radius;

        if (cx + radius >= Settings.SCREEN_WIDTH) {
            vx = -vx * damping;
            cx = Settings.SCREEN_WIDTH - radius;
        } else if (cx - radius <= 0) {
            vx = -vx * damping;
            cx = radius;
        }
        if (cy + radius >= Settings.SCREEN_HEIGHT) {
            vy = -vy * damping;
            cy =  Settings.SCREEN_HEIGHT- radius;
            // traction here
            vx *= traction;
        } else if (cy - radius <= 0) {
            vy = -vy * damping;
            cy = radius;
        }

        vy += gravity; // <--- this is it

        cx += vx;
        cy += vy;

        this.position.x = cx;
        this.position.y = cy;
    */
    }

    draw(ctx) {
/*
        ctx.beginPath();
        ctx.arc(this.position.x,this.position.y,this.radius,0,2*Math.PI,true);
        ctx.strokeStyle = "#111464";
        ctx.lineWidth = 5;
        ctx.fillStyle = "#44c1ff";
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
*/
        //console.log('BALL => ',this.sprite.get(this.color));
        ctx.drawImage(this.sprite.get(this.color)[0],this.position.x-this.radius, this.position.y-this.radius);

    }

    get pos(){
        return this.position;
    }

    get vel(){
        return this.force;
    }
}

export {Ball};