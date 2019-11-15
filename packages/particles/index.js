/**
 * @todo How to constrain the particle to the screen?
 * @todo How to give an particle a live time?
 * @todo How to create a new particle after 50 frames?
 * @todo How to give the particle an on click action?
 */
let canvas = undefined;
let jim = undefined;
const agents = [];
const ageLimit = 300;

const size = 20;
let counterFrame = 0;

let lineMode = 0;
 

function setup() {
  canvas = createCanvas(500, 500);
  canvas.parent("sketch");
  jim = new Agent(random(width), random(height));
  // Agent().display(); will throw an error
}

function newAgent(x, y) {

  if(x === -1) {
    x = random(0, width);
  } 
  if(y === -1) {
    y = random(0, height);
  }

  agents.push(new Agent(x, y));
}

function draw() {
  fill(0+lineMode*40, 100);
  rect(0, 0, width, height);
  
  for(let i = 0; i < agents.length; i++) {
    let item = agents[i];
    item.update();
    item.display();

    if(item.age>ageLimit) {
      agents.splice(i, 1);
    }
  }

  counterFrame++;
  if(counterFrame >= 20) {
    counterFrame = 0;
    newAgent(-1, -1);

  }


}


function drawLine(item) {

  let item2 = item.assignedRandItem1;
  let item3 = item.assignedRandItem2;
  if(item2 === undefined) {
    item.assignedRandItem1 = random(agents);     
    item2 = item.assignedRandItem1;

  }
  if(item3 === undefined) { 
    item.assignedRandItem2 = random(agents); 
    item3 = item.assignedRandItem2;
  }
  stroke(255, Math.min(item.opacity, item2.opacity, item3.opacity)-5);
  line(item.x, item.y, item2.x, item2.y);
  line(item.x, item.y, item3.x, item3.y);
  line(item2.x, item2.y, item3.x, item3.y);


}


function mousePressed() {

  let clickEvent = 0;

  for(let i = 0; i < agents.length; i++) {
    let item = agents[i];
    if(mouseX > item.x && mouseX < item.x+size) {
      if(mouseY > item.y && mouseY < item.y+size) {
        item.line = 1;
        item.age = 0;
        clickEvent = 1;
        break;
      }
    }
  }

  if(clickEvent != 1) { newAgent(mouseX, mouseY); }
}
function mouseDragged() {
  newAgent(mouseX, mouseY);
}

function keyPressed() {
  if (key === "s" || key === "S") {
    if (canvas === undefined) {
      throw new Error("Could not find your canvas");
    }
    saveCanvas(canvas, "sketch", "png");
  }

  if (key === "l" || key === "L") {
    if(lineMode === 0) { lineMode = 1; 
    } else { lineMode = 0; }

  }
}

function Agent(x, y) {
  if (!(this instanceof Agent)) {
    throw new TypeError(
      "Agent can not be called as a function. Create an instance by calling 'new Agent(x,y)'",
    );
  }

  /**
   * If you want the fancy noise driven movement you need to add
   * these variables
   */
  // this.xoff = x;
  // this.yoff = y;
  // this.noiseRange = 2;

  this.x = x;
  this.y = y;
  this.age = 0;
  this.speed = 5;

  this.opactiy = 100;
  
  this.line = lineMode;
  console.log(lineMode);
  this.assignedRandItem1;
  this.assignedRandItem2;


  /**
   * If you want the fancy noise driven movement remove
   * this update function
   */
  this.update = function() {

    let relativeAge = this.age / ageLimit;
    
    this.speed = (1-relativeAge) * 5;
    if(this.speed < 1) { this.speed = 1; }
      
    this.x = this.x + random(-this.speed, this.speed);
    this.y = this.y + random(-this.speed, this.speed);
    this.age += 1;

    if(this.x < 0) { this.x = 0; }
    if(this.x > width) { this.x = width; }
    if(this.y < 0) { this.y = 0; }
    if(this.y > height) { this.y = height; }

    this.opacity = ageLimit - this.age;

    if(this.line === 1) { drawLine(this); }



    // constrain him to the canvas
  };

  /**
   * If you want the fancy noise driven movement you need to add
   * this update function
   */
  // this.update = function() {
  //   this.xoff += 0.01;
  //   let xn = noise(this.xoff) * this.noiseRange;
  //   this.yoff += 0.01;
  //   let yn = noise(this.yoff) * this.noiseRange;
  //   this.x = this.x + xn - this.noiseRange / 2; //random(-1, 1);
  //   this.y = this.y + yn - this.noiseRange / 2; // random(-1, 1);
  //   // constrain him to the canvas
  //   if (this.x <= 0) {
  //     this.x = 0;
  //   }
  //   if (this.x >= width) {
  //     this.x = width;
  //   }
  //   if (this.y <= 0) {
  //     this.y = 0;
  //   }
  //   if (this.y >= height) {
  //     this.y = height;
  //   }
  // };

  this.display = function() {
    stroke(255, this.opacity);
    // noStroke();
   // fill(255, this.opacity);
    ellipse(this.x, this.y, size);
  };
}
