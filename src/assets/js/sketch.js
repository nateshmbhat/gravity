/// <reference path="p5/p5.global-mode.d.ts" />


let totalwidth = 1000,
    totalheight = 800;
let mouseDown = 0;
let canvasWidth =  2300 ; 
let canvasHeight =  1800 ; 
// let canvasWidth  = document.body.clientWidth ; 
// let canvasHeight = document.body.clientHeight ; 
let environ;

function setup() {
    createCanvas(canvasWidth, canvasWidth);
    frameRate(1000);
    fill(200, alpha = 100);
    environ = new Environment();
    environ.addForce(new createVector(0 , 10)) ; 

    for (let i = 0; i < 200 ; i++)
        environ.addBall(new Ball(random(51, 1000), random(51, 700), random(20, 60), environ));

}


function draw() {
    background(255);
    environ.update();
}

function mousePressed(){
    environ.applyForce(new createVector(0 , -100)) ; 
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
        push() ; 
        fill(255) ; 
        rect(this.boundLeft, this.boundTop, this.boundRight, this.boundBottom);
        pop() ; 
        this.forcesArray.forEach(force=>{
            this.applyForce(force) ; 
        })
        this.updateAndShowAllBalls();
    }



    addBall(ball) {
        ball.setVelocityLimit(20) ; 
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
        this.colorR =  random(255) ; this.colorG = random(255) ; this.colorB = random(255) ; 
        this.colorAlpha = 100 ; 
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
        this.handleEnvironmentBound();
        this.vel.limit(this.velocityLimit) ; 
        this.loc.add(this.vel);
        this.vel.add(p5.Vector.div(p5.Vector.mult(p5.Vector.sub(new createVector(mouseX , mouseY) , this.loc) , -1) , this.radius).mult(0.01)) ; 
        // this.vel.add(this.acc);
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
        push() ; 
        fill(this.colorR , this.colorG , this.colorB , this.colorAlpha ) ; 
        ellipse(this.loc.x, this.loc.y, this.radius * 2, this.radius * 2);
        pop() ;
    }

    applyForce(force) {
        this.acc.add(p5.Vector.div(force , this.radius));
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