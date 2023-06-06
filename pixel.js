let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let currentColor = document.querySelector("#currentColor");
let clearBtn = document.querySelector("#clear");
let color = "black";
let pixelsList = [];

class Pixel {
    xCoordinate;
    yCoordinate;
    color;
    isAvailable;

    constructor (xCoordinate, yCoordinate, color){
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
        this.color = color || "white";
        this.isAvailable = false;
    }

    changeAvailability() {
        this.isAvailable = !(this.isAvailable);
    }

    changeColor(color){
        this.color = color;
    }

    fill(x = 0, y  = 0){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(x, y, 1, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }

    makeOrColorGrid(xMin, yMin, xMax, yMax, inc) {
        // making vertical lines
        for (let xUpdate = xMin; xUpdate < xMax; xUpdate += inc){
            for (let yUpdate = yMin; yUpdate < yMax; yUpdate++){
                this.fill(xUpdate, yUpdate);
            }
        }

        // making horizontal lines
        for (let yUpdate = yMin; yUpdate < yMax; yUpdate += inc){ 
            for (let xUpdate = xMin; xUpdate < xMax; xUpdate++){
                this.fill(xUpdate, yUpdate);
            }
        }
    }   
}

class Block {

    grid;
    pixelList;

    constructor (startX, startY, grid){
        this.grid = grid;
        this.pixelList = [];
        this.pixelList.push(new Pixel(startX, startY));
    }

    moveDown(){
        for (let i = 0; i < this.pixelList.length; i++) {
            let newY = this.pixelList[i].yCoordinate + 40;

            this.grid.changeColor("white");
            this.grid.makeOrColorGrid(this.pixelList[i].xCoordinate-1, this.pixelList[i].yCoordinate -1, this.pixelList[i].xCoordinate + 38, newY-1, 1);
            this.grid.changeColor("black");
            this.grid.makeOrColorGrid(this.pixelList[i].xCoordinate+1, this.pixelList[i].yCoordinate-38, this.pixelList[i].xCoordinate + 38, this.pixelList[i].yCoordinate-1, 1);
            
            this.pixelList[i].yCoordinate = newY;
        }
    }

    moveRight(){
        // if (this.pixelList[0].xCoordinate >= canvas.width || this.pixelList[this.pixelList.length-1].yCoordinate <= 40) {
        //     return;
        // }
        for (let i = 0; i < this.pixelList.length; i++) {
            let newX = this.pixelList[i].xCoordinate + 40;
            this.grid.changeColor("white");
            this.grid.makeOrColorGrid(this.pixelList[i].xCoordinate-1, this.pixelList[i].yCoordinate-1, newX-1, this.pixelList[i].yCoordinate+38, 1);
            // not erasing the old location
            this.grid.changeColor("black");
            this.grid.makeOrColorGrid(this.pixelList[i].xCoordinate+1, this.pixelList[i].yCoordinate-38, this.pixelList[i].xCoordinate + 38, this.pixelList[i].yCoordinate-1, 1);
            
            this.pixelList[i].xCoordinate = newX;
        }
    }

    moveLeft(){
        // if (block.pixelList[0].xCoordinate >= canvas.width || block.pixelList[this.pixelList.length-1].yCoordinate <= 40) {
        //     return;
        // }
        for (let i = 0; i < this.pixelList.length; i++) {
            let newX = this.pixelList[i].xCoordinate - 40;
            this.grid.changeColor("white");
            this.grid.makeOrColorGrid(this.pixelList[i].xCoordinate-1, this.pixelList[i].yCoordinate-1, newX-1, this.pixelList[i].yCoordinate+38, 1);
            this.grid.changeColor("black");
            this.grid.makeOrColorGrid(this.pixelList[i].xCoordinate+1, this.pixelList[i].yCoordinate-38, this.pixelList[i].xCoordinate + 38, this.pixelList[i].yCoordinate-1, 1);
            
            this.pixelList[i].xCoordinate = newX;
        }
    }
}

class Square extends Block {
    constructor (startX, startY, grid){
        super(startX, startY, grid);
        this.pixelList.push(new Pixel(startX + 40, startY));
        this.pixelList.push(new Pixel(startX, startY - 40));
        this.pixelList.push(new Pixel(startX + 40, startY - 40));
    }
}

class LBlock extends Block {
    constructor (startX, startY, grid){
        super(startX, startY, grid);
        this.pixelList.push(new Pixel(startX, startY - 40));
        this.pixelList.push(new Pixel(startX, startY - 80));
        this.pixelList.push(new Pixel(startX + 40, startY - 80));
    }
}

class JBlock extends Block {
    constructor (startX, startY, grid){
        super(startX, startY, grid);
        this.pixelList.push(new Pixel(startX, startY - 40));
        this.pixelList.push(new Pixel(startX, startY - 80));
        this.pixelList.push(new Pixel(startX - 40, startY - 80));
    }
}

class TBlock extends Block {
    constructor (startX, startY, grid){
        super(startX, startY, grid);
        this.pixelList.push(new Pixel(startX, startY - 40));
        this.pixelList.push(new Pixel(startX - 40, startY));
        this.pixelList.push(new Pixel(startX + 40, startY));
    }
}

class SBlock extends Block {
    constructor (startX, startY, grid){
        super(startX, startY, grid);
        this.pixelList.push(new Pixel(startX - 40, startY));
        this.pixelList.push(new Pixel(startX, startY - 40));
        this.pixelList.push(new Pixel(startX + 40, startY - 40));
    }
}

class ZBlock extends Block {
    constructor (startX, startY, grid){
        super(startX, startY, grid);
        this.pixelList.push(new Pixel(startX + 40, startY));
        this.pixelList.push(new Pixel(startX, startY - 40));
        this.pixelList.push(new Pixel(startX - 40, startY - 40));
    }
}

class Line extends Block {
    constructor (startX, startY, grid){
        super(startX, startY, grid);
        this.pixelList.push(new Pixel(startX, startY - 40));
        this.pixelList.push(new Pixel(startX, startY - 80));
        this.pixelList.push(new Pixel(startX, startY - 120));
    }
}

for(let x = 0; x <= canvas.height; x += 40){
    for (let y = 0; y <= canvas.width; y += 40){
        let pixel = new Pixel(x, y);
        pixelsList.push(pixel);
    }
}

// left on arrow input
window.addEventListener("keydown", function (e) {
    if (e.key == "ArrowLeft") {
        block.moveLeft();
    }
    if (e.key == "ArrowRight") {
        block.moveRight();
    }
});

// doing this as a temp fix, need a better way of handling what blocks are active
let block;
window.addEventListener("load", function () {
    // creating the grid
    let pixelGrid = pixelsList[0]; // contains coordinates (0,0)
    pixelGrid.makeOrColorGrid(0, 0, canvas.width, canvas.height, 40);

    let v;
    let rand = Math.floor(Math.random() * 7);
    switch(rand) {
        case 0:
            block = new Square(160, 40, pixelGrid);
            break;
        case 1:
            block = new LBlock(160, 40, pixelGrid);
            break;
        case 2:
            block = new JBlock(160, 40, pixelGrid);
            break;
        case 3:
            block = new TBlock(160, 40, pixelGrid);
            break;
        case 4:
            block = new ZBlock(160, 40, pixelGrid);
            break;
        case 5:
            block = new SBlock(160, 40, pixelGrid);
            break;
        case 6:
            block = new Line(160, 40, pixelGrid);
    }
    v = setInterval(function() {
        block.moveDown();
        // if (block.pixelList[block.pixelList.length -1].yCoordinate + 40 == canvas.height){
        for (let i = 0; i < block.pixelList.length; i++){
            // also add if block underneath is not available (use isAvailable and changeAvailability)
            if (block.pixelList[i].yCoordinate >= canvas.height){
                clearInterval(v);
                for (let i = 0; i < block.pixelList.length; i++){
                    console.log(block.pixelList[i].isAvailable);
                    block.pixelList[i].changeAvailability();
                    console.log(block.pixelList[i].isAvailable);
                }
            }
        }
            
    }, 1000);
      
});



