import * as PIXI from 'pixi.js';

class World {
    constructor(app) {
        this.displayContainer = new PIXI.Container();
        this.app = app;
        this.objects = [];
        this.width = app.screen.width;
        this.height = app.screen.height;

    }

    addObject(object){
        this.objects.push(object);
        this.displayContainer.addChild(object.graphics); //Add the balls graphics to the world.
    }

    update() {
        /** 
        * This update loop acts as the engine of the physics simulation.
        * Order matters: forces → position → boundaries → rendering and object specific updates
        */
        this.objects.forEach(object => {
            const gravityForce = new PIXI.Point(0, 0.09 * object.phys.mass);
            object.phys.applyForce(gravityForce);})
        this.objects.forEach(object => object.phys.updatePosition())
        this.objects.forEach(object => object.phys.checkEdges(this.width, this.height))
        this.objects.forEach(object => object.update())
    }
    
    updateBallMasses(newMass){
       this.objects.forEach(ball => {
        ball.mass = newMass;
        ball.radius = newMass*20
        ball.graphics.clear()
        ball.graphics.circle(0,0, ball.radius);
        ball.graphics.fill(0xff0000);
       }) 
    }
}

export default World;