import { Application, Assets, Container, Sprite } from 'pixi.js';
import World from './world.js';
import Ball from './ball.js';
import velocityChart from './velocityChart.js';

//Create the Vue App
const { createApp } = Vue;
createApp({
    components: {
        velocityChart
    },

    //Reactive state for physics simulation and visualization.
    data() {
      return {
        ballMass: 1, //User controlled mass affects physics and redering
        velocityData: [], //Time series data for D3 Chart visualization
        frameCount: 0 // Animation frame counter for data collection
      }
    },

    watch: {
        ballMass(newValue) {
          
         // Reactive update: Vue ballMass change updates existing balls in physics simulation
          if (this.world) {
            this.world.updateBallMasses(newValue); 
          }
        }
      },
      methods: {

        updatevelocityData() {
          this.frameCount++;
          
          // Collect current velocity for each ball
          this.world.objects.forEach((ball, index) => {
            // Calculate velocity magnitude (like vector length in R)
            const velMagnitude = Math.sqrt(
              ball.phys.vel.x * ball.phys.vel.x + ball.phys.vel.y * ball.phys.vel.y
            );
            
            // Add data point
            this.velocityData.push({
              ball: index,           // Ball 0 or Ball 1
              velocity: velMagnitude,
              frame: this.frameCount
            });
          });
          
          // Keep only last 60 frames per ball (120 total data points)
          if (this.velocityData.length > 120) {
            this.velocityData = this.velocityData.slice(-120);
          }
        }
      },

    async mounted(){
        // Create a new application
        const app = new Application();

        // Initialize the application
        await app.init({ background: 'teal', width: 400, height: 600});

        // Append the application canvas to the document body
        document.getElementById('pixi-container').appendChild(app.canvas);

        // Create and add a container to the stage
        //const container = new Container();

        //app.stage.addChild(container);
        
        //Create and add a world to the PIXI stage
        const world = new World(app);

        //store the world variable in the vue object so it can access.
        this.world = world;

        app.stage.addChild(world.displayContainer);

        //The simulation has 2 balls for now, but could be modified to include more.
        const ball = new Ball(1);
        const ball2 = new Ball(2);
        
        world.addObject(ball);
        world.addObject(ball2)
        
        /* call the world's update function every tick
        (in turn, the world will call the update function of each object in the simulation
        this is essentially the "game loop" of the simulation.)*/
        app.ticker.add(() => {
            this.updatevelocityData();
            world.update();
            
        });
    }
}).mount('#app');

    
