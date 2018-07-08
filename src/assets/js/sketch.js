/// <reference path="p5/p5.global-mode.d.ts" />


let totalwidth = 1000,
    totalheight = 800;
let mouseDown = 0;
let canvasWidth = totalwidth ; 
let canvasHeight= totalheight; 
// let canvasWidth  = document.body.clientWidth ; 
// let canvasHeight = document.body.clientHeight ; 
let environ  ; 

function setup() {
    createCanvas( totalwidth, totalheight  );
    frameRate(30);
    fill(200 ,alpha = 100) ; 
    environ =  new Environment() ; 
    for(let i =0 ; i < 10 ; i++)
        environ.addBall(new Ball(random(51 , 1000 ) , random( 51, 700), 30 , environ)) ;
}

function draw() {
    background(255);
    environ.applyForce(new createVector(0 , 0.5)) ; 
    environ.updateAndShowAllBalls() ;
}



class Environment
{
    constructor(){
        this.ballsArray = [] ; 
        this.boundLeft = 50  ; 
        this.boundRight = canvasWidth - 50 ; 
        this.boundTop =  50 ;
        this.boundBottom =  canvasHeight-50 ; 
    }

    update(){
        rect(this.boundLeft, this.boundTop , this.boundRight , this.boundBottom) ; 
    }

    addBall(ball){
        this.ballsArray.push(ball) ; 
    }

    updateAndShowAllBalls(){
        this.update() ; 
        this.ballsArray.forEach(ball=>ball.updateAndShow() ) ; 
    }

    showAllBalls(){
        this.ballsArray.forEach(ball=>ball.show()) ; 
    }

    applyForce(force){this.ballsArray.forEach(ball=>ball.applyForce(force))}
}



class Ball{

    constructor(x , y,  radius  , environment){
      this.environment = environment; 
      this.radius = radius ;
      this.loc = new createVector( x ,y) ;
      this.velocityLimit = Number.POSITIVE_INFINITY ; 
      this.vel = new createVector(0 , 0) ; 
      this.acc = new createVector(0 , 0) ;
      this.dampeningFactor = 0.80 ; 
    }

    updateAndShow(){
        this.update() ; 
        this.show() ; 
    }
    
    update(){
       this.handleEnvironmentBound() ; 
       this.loc.add(this.vel) ;
       this.vel.add(this.acc) ;
       this.vel.limit(this.velocityLimit) ; 
    }


    handleEnvironmentBound(){
        if((this.loc.x ) < this.environment.boundLeft){
            this.vel.x*=-1; 
            this.vel.x*= this.dampeningFactor ; 
            this.loc.x = this.environment.boundLeft+this.radius ; 
        } 

        if(this.loc.x > this.environment.boundRight){
            this.vel.x*=-1 ; 
            this.vel.x*= this.dampeningFactor ; 
            this.loc.x = this.environment.boundRight-this.radius ; 
        } 
        
        if(this.loc.y - this.radius< this.environment.boundTop){
            this.vel.y*=-1 ; 
            this.vel.y*= this.dampeningFactor ; 
            this.loc.y = this.environment.boundTop + this.radius ; 
        }
    
        if(this.loc.y-this.radius+10 > this.environment.boundBottom) 
        {
            this.vel.y*=-1 ; 
            this.vel.y*= this.dampeningFactor ; 
            this.loc.y = this.environment.boundBottom; 
        }
    }
    
    show()
    {
       ellipse(this.loc.x , this.loc.y  , this.radius , this.radius ) ;
    }

    applyForce(force){this.acc = force ; }
    addForce(force){this.acc.add(force) ; }

    setVelocityLimit(lim){this.velocityLimit = lim ; }
    setAcceleration(acc) { this.acc = acc ;  }
    setAcceleration(x , y ) { this.acc.x= x ;this.acc.y = y ;  }
}
