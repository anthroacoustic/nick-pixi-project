import * as PIXI from 'pixi.js';
class PhysObj {
    constructor(mass) {
        this.mass = mass
        this.pos = new PIXI.Point(0, 0)
        this.vel = new PIXI.Point(0,0)
        this.acc = new PIXI.Point(0,0)
        this.chartAcc = new PIXI.Point(0,0) //records to the D3 Chart
    }
    moveRight(){
        this.pos.x = this.pos.x + 1;
    }

    updatePosition()
    {
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;
       
        // this.vel.add(this.acc)
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        //sets acceleration to 0 after it's been applied
        //this keeps forces from compounding between ticks 
        this.acc.x *=0;
        this.acc.y *=0;

        //adds friction
        //this.vel.x *= .99999
        //this.vel.y *= .99999

     
    }
    applyForce(force){
        this.acc.x += force.x / this.mass;
        this.acc.y += force.y / this.mass;
    }

    checkEdges(canvasWidth, canvasHeight) {
        if (this.pos.x > canvasWidth) {
          this.pos.x = canvasWidth;
          this.vel.x *= -1;
        } else if (this.pos.x < 0) {
          this.vel.x *= -1;
          this.pos.x = 0;
        }
        
        if (this.pos.y  > canvasHeight) {
            this.pos.y = canvasHeight;
            this.vel.y *= -1;
          } else if (this.pos.x < 0) {
            this.vel.y *= -1;
            this.pos.y = 0;
          }
        }
    }

export default PhysObj;