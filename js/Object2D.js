// clase Object2D. Representa un objeto 2D caracterizado por un vector size
// (diagonal del rectángulo que circunscribe el objeto) y una posición
// superior izquierda x,y.

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

export { Object2D };