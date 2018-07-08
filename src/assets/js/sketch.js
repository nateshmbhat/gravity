/// <reference path="p5/p5.global-mode.d.ts" />


let totalwidth = 1000,
    totalheight = 800;
let mouseDown = 0;
let canvasWidth = totalwidth;
let canvasHeight = totalheight;
// let canvasWidth  = document.body.clientWidth ; 
// let canvasHeight = document.body.clientHeight ; 
let environ;

function setup() {
    createCanvas(totalwidth, totalheight);
    frameRate(100);
    fill(200, alpha = 100);
    environ = new Environment();
    environ.addForce(new createVector(0 , 1)) ; 

    for (let i = 0; i < 1; i++)
        environ.addBall(new Ball(random(51, 1000), random(51, 700), random(20, 60), environ));

}


function draw() {
    background(255);
    environ.update();
}



class Environment {


    constructor() {
        this.objectsArray = [];
        this.forcesArray = [] ;
        this.boundLeft = 50;
        this.boundRight = canvasWidth - 100;
        this.boundTop = 50;
        this.boundBottom = canvasHeight - 100;
    }


    update() {
        rect(this.boundLeft, this.boundTop, this.boundRight, this.boundBottom);
        this.forcesArray.forEach(force=>{
            this.applyForce(force) ; 
        })
        this.updateAndShowAllBalls();
    }



    addBall(ball) {
        this.objectsArray.push(ball);
    }

    updateAndShowAllBalls() {
        this.objectsArray.forEach(ball => ball.updateAndShow());
    }

    showAllBalls() {
        this.objectsArray.forEach(ball => ball.show());
    }

    addForce(force) {
        this.forcesArray.push(force) ; 
    }
    applyForce(force) {
        this.objectsArray.forEach(ball => ball.applyForce(force))
    }
}



class Ball {

    constructor(x, y, radius, environment) {
        this.environment = environment;
        this.radius = radius;
        this.loc = new createVector(x, y);
        this.velocityLimit = Number.POSITIVE_INFINITY;
        this.vel = new createVector(0, 0);
        this.acc = new createVector(0, 0);
        this.dampeningFactor = 0.90;
    }

    updateAndShow() {
        this.update();
        this.show();
    }

    update() {
        console.log("Bob x , y = ", this.loc.x, this.loc.y, " Radius = ", this.radius);
        this.handleEnvironmentBound();
        this.loc.add(this.vel);
        this.vel.add(this.acc);
        this.vel.limit(this.velocityLimit);

        this.acc.mult(0);
    }


    handleEnvironmentBound() {
        if ((this.loc.x - this.radius) < this.environment.boundLeft) {
            this.vel.x = abs(this.vel.x);
            this.vel.x *= this.dampeningFactor;
        }

        if (this.loc.x - 10 > this.environment.boundRight) {
            this.vel.x = -1 * abs(this.vel.x);
            this.vel.x *= this.dampeningFactor;
        }

        if (this.loc.y - this.radius / 2 < this.environment.boundTop) {
            this.vel.y = abs(this.vel.y);
            this.vel.y *= this.dampeningFactor;
        }

        if (this.loc.y - this.radius / 2 > this.environment.boundBottom) {
            this.vel.y = -1 * abs(this.vel.y);
            this.vel.y *= this.dampeningFactor;
        }
    }

    show() {
        ellipse(this.loc.x, this.loc.y, this.radius * 2, this.radius * 2);
    }

    applyForce(force) {
        this.acc.add(force);
    }
    setVelocityLimit(lim) {
        this.velocityLimit = lim;
    }
    setAcceleration(acc) {
        this.acc = acc;
    }
    setAcceleration(x, y) {
        this.acc.x = x;
        this.acc.y = y;
    }
}