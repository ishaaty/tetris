let canvas = document.querySelector("canvas");

class Pixel {
    xCoordinate;
    yCoordinate;
    color;
    isAvailable;

    constructor (xCoordinate, yCoordinate, color){
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
        this.color = color || "rgb(12, 12, 71)";
        this.isAvailable = true;
    }

    changeAvailability() {
        this.isAvailable = false;
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
    color;
    height;

    constructor (startX, startY, grid, color){
        this.grid = grid;
        this.pixelList = [];
        this.color = color || "rgb(12, 12, 71)";
        this.pixelList.push(new Pixel(startX, startY, color));
    }

    colorBlock() {
        for (let i = 0; i < this.pixelList.length; i++) {
            this.grid.changeColor(this.pixelList[i].color);
            this.grid.makeOrColorGrid(this.pixelList[i].xCoordinate + 1, this.pixelList[i].yCoordinate-1, this.pixelList[i].xCoordinate + 39, this.pixelList.yCoordinate-38, 1);
        }
    }

    moveDown(){
        for (let i = 0; i < this.pixelList.length; i++) {
            this.grid.changeColor("rgb(12, 12, 71)");
            this.grid.makeOrColorGrid(this.pixelList[i].xCoordinate+1, this.pixelList[i].yCoordinate-38, this.pixelList[i].xCoordinate + 39, this.pixelList[i].yCoordinate-1, 1);
        }
        for (let i = 0; i < this.pixelList.length; i++) {
            let newY = this.pixelList[i].yCoordinate + 40;

            this.grid.changeColor(this.pixelList[i].color);
            this.grid.makeOrColorGrid(this.pixelList[i].xCoordinate + 1, this.pixelList[i].yCoordinate, this.pixelList[i].xCoordinate + 39, newY, 1);
            this.grid.changeColor("rgb(16, 16, 92)");
            this.grid.makeOrColorGrid(0, 0, canvas.width, canvas.height, 40);

            this.pixelList[i].yCoordinate = newY;
        }
        this.colorBlock();
    }

    moveRight(){ 
        this.grid.changeColor("rgb(12, 12, 71)");
        for (let i = 0; i < this.pixelList.length; i++) {
            this.pixelList[i].xCoordinate += 40;
            this.grid.makeOrColorGrid(this.pixelList[i].xCoordinate-39, this.pixelList[i].yCoordinate-38, this.pixelList[i].xCoordinate-1, this.pixelList[i].yCoordinate, 1);
        }
    }

    moveLeft(){
        this.grid.changeColor("rgb(12, 12, 71)");
        for (let i = 0; i < this.pixelList.length; i++) {
            this.grid.makeOrColorGrid(this.pixelList[i].xCoordinate+1, this.pixelList[i].yCoordinate-38, this.pixelList[i].xCoordinate+39, this.pixelList[i].yCoordinate, 1);
            this.pixelList[i].xCoordinate -= 40;
        }
    }

    slowDrop(){
        for (let i = 0; i < block.pixelList.length; i++) {
            let nextY = block.pixelList[i].yCoordinate + 40;
            if ((nextY == 800) || (gridList[nextY/40+1][block.pixelList[i].xCoordinate/40].isAvailable == false)) return 0;
        }
        this.moveDown();
        
        return 5;
    }

    quickDrop(){
        let dropping = true;
        let timesDrop = 0;

        let nextY, nextY1, nextY2, nextY3, nexts;
        nextY = block.pixelList[0].yCoordinate;
        nextY1 = block.pixelList[1].yCoordinate;
        nextY2 = block.pixelList[2].yCoordinate;
        nextY3 = block.pixelList[3].yCoordinate;

        nexts = [nextY,nextY1,nextY2,nextY3];

        while (dropping) {

            for (let i = 0; i < nexts.length; i++) {
                if ((nexts[i] == 800) || (gridList[nexts[i]/40+1][block.pixelList[i].xCoordinate/40].isAvailable == false)) {
                    dropping = false;
                }
            }

            timesDrop ++;

            for (let i = 0; i < nexts.length; i++) {
                nexts[i] += 40;
            }
        }

        for (let i = 0; i < this.pixelList.length; i++) {
            this.grid.changeColor("rgb(12, 12, 71)");
            this.grid.makeOrColorGrid(this.pixelList[i].xCoordinate+1, this.pixelList[i].yCoordinate-38, this.pixelList[i].xCoordinate + 39, this.pixelList[i].yCoordinate-1, 1);
        }
        for (let i = 0; i < this.pixelList.length; i++) {
            let newY = this.pixelList[i].yCoordinate + (timesDrop*40) - 80;
    
            this.grid.changeColor("rgb(25, 25, 135)");
            this.grid.makeOrColorGrid(0, 0, canvas.width, canvas.height, 40);
    
            this.pixelList[i].yCoordinate = newY;
        } 

        // score stuff
        return timesDrop*5;
    }

    rotate(){
        let centerX = this.pixelList[0].xCoordinate;
        let centerY = this.pixelList[0].yCoordinate;

        let farRight = 120;
        let farLeft = 120;

        for (let i = 0; i < this.pixelList.length; i++) {
            if (this.pixelList[i].xCoordinate > farRight) farRight = this.pixelList[i].xCoordinate;
            if (this.pixelList[i].xCoordinate < farLeft) farLeft = this.pixelList[i].xCoordinate;
        }

        if (block.canRotate(farRight,farLeft)) {

            this.grid.changeColor("rgb(12, 12, 71)");
            this.grid.makeOrColorGrid(this.pixelList[0].xCoordinate+1, this.pixelList[0].yCoordinate-38, this.pixelList[0].xCoordinate + 39, this.pixelList[0].yCoordinate-1, 1);

            for (let i = 1; i < this.pixelList.length; i++) {
                let distToCenterX, distToCenterY;
    
                distToCenterX = this.pixelList[i].xCoordinate - centerX;
                distToCenterY = this.pixelList[i].yCoordinate - centerY;
    
                this.grid.changeColor("rgb(12, 12, 71)");
                this.grid.makeOrColorGrid(this.pixelList[i].xCoordinate+1, this.pixelList[i].yCoordinate-38, this.pixelList[i].xCoordinate + 39, this.pixelList[i].yCoordinate-1, 1);
    
                this.pixelList[i].xCoordinate = centerX + (distToCenterY);
                this.pixelList[i].yCoordinate = centerY + (distToCenterX * -1);
            }
        }
    }
}

class Square extends Block {
    constructor (startX, startY, grid, color){
        super(startX, startY, grid, color);
        this.pixelList.push(new Pixel(startX + 40, startY, this.color));
        this.pixelList.push(new Pixel(startX, startY - 40, this.color));
        this.pixelList.push(new Pixel(startX + 40, startY - 40, this.color));
        
        this.colored = "#FEFB34";
        this.height = 40;
    }

    canRotate(farRight,farLeft) {
        return false
    }
}

class LBlock extends Block {
    constructor (startX, startY, grid, color){
        super(startX, startY, grid, color);
        this.pixelList.push(new Pixel(startX, startY + 40, this.color));
        this.pixelList.push(new Pixel(startX, startY - 40, this.color));
        this.pixelList.push(new Pixel(startX + 40, startY - 40, this.color));

        this.colored = "#FFC82E";
        this.height = 80;
    }

    canRotate(farRight,farLeft) {
        if (farRight <= 360 && farLeft >= 0) return true;
        return false;
    }
}

class JBlock extends Block {
    constructor (startX, startY, grid, color){
        super(startX, startY, grid, color);
        this.pixelList.push(new Pixel(startX, startY + 40, this.color));
        this.pixelList.push(new Pixel(startX, startY - 40, this.color));
        this.pixelList.push(new Pixel(startX - 40, startY - 40, this.color));

        this.colored = "#0341AE";
        this.height = 80;
    }

    canRotate(farRight,farLeft) {
        if (farRight <= 320 && farLeft >= 0) return true;
        return false;
    }
}

class TBlock extends Block {
    constructor (startX, startY, grid, color){
        super(startX, startY, grid, color);
        this.pixelList.push(new Pixel(startX, startY - 40, this.color));
        this.pixelList.push(new Pixel(startX - 40, startY, this.color));
        this.pixelList.push(new Pixel(startX + 40, startY, this.color));

        this.colored = "#DD0AB2";
        this.height = 40;
    }

    canRotate(farRight,farLeft) {
        if (farRight <= 360 && farLeft >= 0) return true;
        return false;
    }
}

class SBlock extends Block {
    constructor (startX, startY, grid, color){
        super(startX, startY, grid, color);
        this.pixelList.push(new Pixel(startX - 40, startY, this.color));
        this.pixelList.push(new Pixel(startX, startY - 40, this.color));
        this.pixelList.push(new Pixel(startX + 40, startY - 40, this.color));

        this.colored = "#53DA3F";
        this.height = 40;
    }

    canRotate(farRight,farLeft) {
        if (farRight <= 360 && farLeft >= 0) return true;
        return false;
    }
}

class ZBlock extends Block {
    constructor (startX, startY, grid, color){
        super(startX, startY, grid, color);
        this.pixelList.push(new Pixel(startX + 40, startY, this.color));
        this.pixelList.push(new Pixel(startX, startY - 40, this.color));
        this.pixelList.push(new Pixel(startX - 40, startY - 40, this.color));

        this.colored = "#FD3F59";
        this.height = 40;
    }

    canRotate(farRight,farLeft) {
        if (farRight <= 360 && farLeft >= 0) return true;
        return false;
    }
}

class Line extends Block {
    constructor (startX, startY, grid, color){
        super(startX, startY + 40, grid, color);
        this.pixelList.push(new Pixel(startX, startY + 80, this.color));
        this.pixelList.push(new Pixel(startX, startY, this.color));
        this.pixelList.push(new Pixel(startX, startY - 40, this.color));

        this.colored = "#01EDFA";
        this.height = 120;
    }

    canRotate(farRight,farLeft) {
        if (farRight <= 320 && farLeft >= 80) return true;
        return false;
    }
}

