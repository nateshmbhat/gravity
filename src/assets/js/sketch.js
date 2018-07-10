/// <reference path="p5/p5.global-mode.d.ts" />


let totalwidth = 1000,
    totalheight = 800;
let mouseDown = 0;
let canvasWidth =  1000 ; 
let canvasHeight =  1000 ; 
// let canvasWidth  = document.body.clientWidth ; 
// let canvasHeight = document.body.clientHeight ; 
let environ;

function setup() {
    createCanvas(canvasWidth, canvasWidth);
    frameRate(100);
    fill(200, alpha = 100);
    environ = new Environment();

    for (let i = 0; i < 2 ; i++)
        environ.addBall(new Ball(random(51, 1000), random(200 , 1000), random(20, 60), environ));

}


function draw() {
    background(255);
    environ.update();
}

function mouseDragged(){
    // environ.applyForce(new createVector(100000 , -10)) ; 
    environ.addBall(new Ball(mouseX , mouseY , random(10, 40) , environ)) ; 
}


class Environment {

    constructor() {
        this.objectsArray = new Set() ;  
        this.forcesArray = [] ;
        this.boundLeft = 50;
        this.boundRight = canvasWidth - 100;
        this.boundTop = 50;
        this.boundBottom = canvasHeight - 100;
        this.gravitationalAcceleration = new createVector(0  , 0.1)  ; 
        this.gravityEnabledFlag = false ; 
        this.G = 1 ; 
    }


    update() {
        push() ; 
        fill(255) ; 
        rect(this.boundLeft, this.boundTop, this.boundRight, this.boundBottom);
        pop() ; 
        this.forcesArray.forEach(force=>{
            this.applyForce(force) ; 
        })
        if(this.gravityEnabledFlag) this.applyGravity() ; 
        this.updateAndShowAllBalls();
    }



    addBall(ball) {
        ball.setVelocityLimit(20) ; 
        this.objectsArray.add(ball);
    }

    updateAndShowAllBalls() {
        this.objectsArray.forEach(ball => ball.updateAndShow());
    }

    showAllBalls() {
        this.objectsArray.forEach(ball => ball.show());
    }

    applyGravity(){
        this.objectsArray.forEach(ball=>ball.applyGravity()) ; 
    }


    applyGravitationalForce(){
        this.objectsArray.forEach(ball.applyGravitationalForce()) ; 
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
        this.dampeningFactor = 0.99;
        this.mutualGravityFlagEnabled = true ; 
    }

    updateAndShow() {
        this.update();
        this.show();
    }

    update() {
        this.handleEnvironmentBound();
        this.vel.limit(this.velocityLimit) ; 
        this.loc.add(this.vel);
        if(this.mutualGravityFlagEnabled) this.applyGravitationalForce() ;
        this.vel.add(this.acc);
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

    applyGravity(){
        // Only gravity of Earth not mutual
        this.acc.add(this.environment.gravitationalAcceleration) ; 
    }


    handleGravitationalCollision(object){
        let larger , smaller   ;  
        if(this.radius > object.radius){
            this.radius += object.radius/2 ; 
            larger = this ; smaller = object ; 
        }
        else{
            object.radius+=this.radius/2 ; 
            larger = object ; smaller = this ; 
        }
        
        larger.colorR = larger.colorR - (larger.colorR - smaller.colorR)/2
        larger.colorG = larger.colorG - (larger.colorG - smaller.colorG)/2
        larger.colorB = larger.colorB - (larger.colorB - smaller.colorB)/2

        this.environment.objectsArray.delete(smaller) ; 

        return ; 
    }

    applyGravitationalForce(){
       this.environment.objectsArray.forEach(object=>{
           if(object!=this){
               let dist = p5.Vector.sub(this.loc ,object.loc) ; 
                if(dist.mag() < (object.radius + this.radius))
                {
                    this.handleGravitationalCollision(object) ; 
                    return ; 
                }

               let distSquared  = dist.magSq() ; 
               dist.normalize() ; 
               dist.mult(-this.radius * object.radius * this.environment.G ) ; 
               dist.div(distSquared) ; 
               this.acc.add(dist) ; 
           }
       }) 
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