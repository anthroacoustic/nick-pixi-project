import * as PIXI from 'pixi.js';
import PhysObj from './physObj.js';
class Ball {
    constructor(mass){
        //super();
        this.phys = new PhysObj(mass) 
        this.radius = this.phys.mass*20
        this.phys.pos.set(200,200)

        //Creates the graphics for this object.
        this.graphics = new PIXI.Graphics()
        this.graphics.circle(0,0, this.radius)
        this.graphics.fill(0xff0000)

    }
    update() {
        //this.phys.moveRight(this)
        //console.log("Ball position:", this.pos.x, this.pos.y);

        this.graphics.x = this.phys.pos.x;
        this.graphics.y = this.phys.pos.y;
    }
    

}

export default Ball;