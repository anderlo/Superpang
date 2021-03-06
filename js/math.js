class Object2D {

    constructor(size, position){
        this.size = size;
        this.position = position;
    }

    get x(){
        return this.position.x;
    }

    get y(){
        return this.position.y;
    }

    get width(){
        return this.size.x;
    }

    get height(){
        return this.size.y;
    }

}
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
        if (typeof other == 'Vec2D'){
            this.x = this.x + other.x;
            this.y = this.y + other.y;
        }
        else{
            this.x = this.x*other;
            this.y = this.y*other;
        }
    }

    _mul(other){
        // devolver un nuevo vector igual a
        // this multiplicado por el escalar other
        const emaitza = new Vec2D(this.x*other,this.y*other);
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
export { Object2D };