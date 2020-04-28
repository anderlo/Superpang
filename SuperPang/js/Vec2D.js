class Vec2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get(target, prop) {
        return this[prop] || 'MAGIC';
    }

    add(other){
        // si other es una instancia de Vec2D
        // anyadir other a this como vector
        // si no,
        // anyadir other a this como escalar
        //
        // devolver this
        //console.log('ESTOY EN EL ADD');
       // console.log('typeof ->',typeof(other));
        if (typeof other == 'number'){
            console.log('NO SOY UN VECTOR 2D',other);
            this.x = this.x*other;
            this.y = this.y*other;

        }
        else {
            console.log('SOY UN VECTOR 2D', other);
            console.log('thisx,thisy',this.x,this.y);
            this.x = this.x + other.x;
            this.y = this.y + other.y;
            console.log('NEW thisx,thisy',this.x,this.y);
        }
        /*
        if (typeof other == 'Vec2D'){
            console.log('SOY UN VECTOR 2D',other);
            this.x = this.x + other.x;
            this.y = this.y + other.y;
        }
        else{
            console.log('NO SOY UN VECTOR 2D',other);
            this.x = this.x*other;
            this.y = this.y*other;
        }
        */
    }

    _mul(other){
        // devolver un nuevo vector igual a
        // this multiplicado por el escalar other
       // console.log(other,this.x,this.y);
        const emaitza = new Vec2D(this.x * other,this.y * other);
        return emaitza
    }

    equals(other) {
        // devuelve true si this es aproximadamente igual a other (igual con una diferencia máxima de epsilon=0.1
        var emaitza = true;
        const distancia = Math.sqrt((this.x - other.x)^2+(this.y-other.y)^2);
        if (distancia > 0.1){
            emaitza = false;
        }
    }

    static approx_equal(a, b, epsilon) {
        // devuelve true si a aprox. igual a b
        // iguales salvo una diferencia absoluta
        // máxima de epsilon
        var emaitza = true;
        const distancia = Math.sqrt((a.x - b.x)^2+(a.y-b.y)^2);
        if (distancia > epsilon){
            emaitza = false;
        }
    }
}
export { Vec2D };